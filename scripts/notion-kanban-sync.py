#!/usr/bin/env python3
"""
Notion to Kanban Sync Script

Read-only sync from Notion data sources to Hermes Kanban board.
Discovers tasks in shared Notion databases and creates matching Kanban cards
using stable idempotency keys to prevent duplicates.

Security: Database Allowlist
    Configure NOTION_SYNC_DATABASES environment variable with a comma-separated
    list of database IDs to sync. Only databases in the allowlist will be processed.
    This prevents accidental syncing of private/sensitive Notion databases.
    
    Example:
        export NOTION_SYNC_DATABASES="db_id_1,db_id_2,db_id_3"
    
    Without an allowlist, all accessible databases will be synced.

Assignee Validation
    Configure NOTION_SYNC_ALLOWED_ASSIGNEES with a comma-separated list of valid
    profile names to enforce assignee validation. Invalid assignees from Notion
    will trigger a warning and use the default assignee instead.
    
    Example:
        export NOTION_SYNC_ALLOWED_ASSIGNEES="jukes-coding-agent,jukes-qa-agent"
    
    Configure NOTION_SYNC_DEFAULT_ASSIGNEE to set the fallback assignee when
    Notion doesn't specify one or provides an invalid value (default: jukes-ops-agent).
    
    Example:
        export NOTION_SYNC_DEFAULT_ASSIGNEE="jukes-ops-agent"
    
    Without configuration, uses all known Juke's Diner profiles as the allowed set.

Usage:
    python notion-kanban-sync.py --dry-run      # Discovery and preview only
    python notion-kanban-sync.py --check        # Verify setup
    python notion-kanban-sync.py --execute      # Actually create cards
"""

import os
import sys
import json
import hashlib
import re
from datetime import datetime
from typing import Dict, List, Optional, Any
import subprocess

# Constants
TARGET_BOARD = "jukes-dashboard"
NOTION_API_VERSION = "2025-09-03"
LOG_DIR = "logs"

# Input validation constants
MAX_TITLE_LENGTH = 200
PRIORITY_MIN = 0
PRIORITY_MAX = 100

# Shell metacharacters that could be used for injection
DANGEROUS_CHARS_PATTERN = re.compile(r'[;&|`$<>\n\0]')

# Default set of allowed assignees (known profiles)
DEFAULT_ALLOWED_ASSIGNEES = {
    "jukes-coding-agent",
    "jukes-editor",
    "jukes-email-agent",
    "jukes-finance-agent",
    "jukes-librarian",
    "jukes-ops-agent",
    "jukes-qa-agent",
    "jukes-research-agent",
    "jukes-social-agent",
}


class ValidationError(Exception):
    """Raised when input validation fails."""
    pass


class NotionKanbanSync:
    def __init__(self, dry_run: bool = True):
        self.dry_run = dry_run
        self.api_key = os.environ.get("NOTION_API_KEY")
        self.discovered_databases = []
        self.planned_cards = []
        
        # Database filtering via allowlist
        sync_databases_env = os.environ.get("NOTION_SYNC_DATABASES", "")
        self.allowed_databases = set()
        if sync_databases_env:
            self.allowed_databases = {db.strip() for db in sync_databases_env.split(",") if db.strip()}
            print(f"🔒 Database allowlist enabled: {len(self.allowed_databases)} database(s) configured")
        
        # Assignee validation configuration
        allowed_assignees_env = os.environ.get("NOTION_SYNC_ALLOWED_ASSIGNEES", "")
        if allowed_assignees_env:
            self.allowed_assignees = {a.strip() for a in allowed_assignees_env.split(",") if a.strip()}
            print(f"🔒 Assignee allowlist enabled: {len(self.allowed_assignees)} profile(s) configured")
        else:
            self.allowed_assignees = DEFAULT_ALLOWED_ASSIGNEES.copy()
        
        # Default assignee configuration
        self.default_assignee = os.environ.get("NOTION_SYNC_DEFAULT_ASSIGNEE", "jukes-ops-agent")
        
        # Validate that default assignee is in allowed list
        if self.default_assignee not in self.allowed_assignees:
            print(f"⚠️  Warning: Default assignee '{self.default_assignee}' not in allowed list")
            print(f"   Using '{next(iter(self.allowed_assignees))}' as fallback")
            self.default_assignee = next(iter(self.allowed_assignees))
        
    def check_setup(self) -> bool:
        """Verify Notion API key is configured."""
        if not self.api_key:
            print("❌ NOTION_API_KEY not found in environment")
            print("\nSetup required:")
            print("1. Create integration at https://notion.so/my-integrations")
            print("2. Copy the API key (starts with 'ntn_' or 'secret_')")
            print("3. Add to ~/.hermes/.env:")
            print("   echo 'NOTION_API_KEY=ntn_your_key_here' >> ~/.hermes/.env")
            print("   chmod 600 ~/.hermes/.env")
            print("4. Share Notion pages/databases with your integration")
            return False
        
        print("✅ NOTION_API_KEY found")
        return True
    
    def _validate_assignee(self, assignee: Optional[str]) -> str:
        """
        Validate assignee against allowed profiles.
        
        Returns the assignee if valid, otherwise returns default assignee
        and logs a warning.
        """
        # Handle None or empty string
        if not assignee:
            return self.default_assignee
        
        # Check if assignee is in allowed list
        if assignee in self.allowed_assignees:
            return assignee
        
        # Invalid assignee - log warning and use default
        print(f"⚠️  Warning: Invalid assignee '{assignee}' not in allowed profiles")
        print(f"   Using default assignee '{self.default_assignee}' instead")
        return self.default_assignee
    
    def _validate_card_input(self, title: str, assignee: str, priority: int) -> None:
        """
        Validate card inputs before passing to subprocess.
        
        Raises ValidationError if any input is invalid.
        This is a security measure to prevent command injection via Notion API data.
        
        Args:
            title: Card title from Notion
            assignee: Profile name from Notion
            priority: Priority value from Notion
            
        Raises:
            ValidationError: If any validation check fails
        """
        # Validate title
        if not title or not title.strip():
            raise ValidationError("Title cannot be empty")
        
        if len(title) > MAX_TITLE_LENGTH:
            raise ValidationError(
                f"Title exceeds maximum length of {MAX_TITLE_LENGTH} characters: {len(title)}"
            )
        
        # Check for shell metacharacters that could enable injection
        if DANGEROUS_CHARS_PATTERN.search(title):
            raise ValidationError(
                f"Title contains dangerous characters (shell metacharacters): {title[:50]}"
            )
        
        # Validate assignee
        if not assignee or not assignee.strip():
            raise ValidationError("Assignee cannot be empty")
        
        if assignee not in self.allowed_assignees:
            raise ValidationError(
                f"Assignee '{assignee}' not in allowed profiles: {sorted(self.allowed_assignees)}"
            )
        
        # Validate priority
        if not isinstance(priority, int):
            raise ValidationError(
                f"Priority must be an integer, got {type(priority).__name__}: {priority}"
            )
        
        if priority < PRIORITY_MIN or priority > PRIORITY_MAX:
            raise ValidationError(
                f"Priority must be between {PRIORITY_MIN} and {PRIORITY_MAX}, got {priority}"
            )
    
    def _curl_notion(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Dict:
        """Make Notion API request via curl."""
        url = f"https://api.notion.com/v1/{endpoint}"
        
        cmd = [
            "curl", "-s", "-X", method, url,
            "-H", f"Authorization: Bearer {self.api_key}",
            "-H", f"Notion-Version: {NOTION_API_VERSION}",
            "-H", "Content-Type: application/json"
        ]
        
        if data:
            cmd.extend(["-d", json.dumps(data)])
        
        result = subprocess.run(cmd, capture_output=True, text=True, check=False)
        
        try:
            return json.loads(result.stdout)
        except json.JSONDecodeError:
            print(f"❌ Failed to parse Notion API response: {result.stdout}")
            return {"error": "Invalid JSON response"}
    
    def discover_databases(self) -> List[Dict]:
        """Search for accessible Notion databases/data sources."""
        print("\n🔍 Discovering accessible Notion databases...")
        
        # Search for databases (using data_source for API 2025-09-03+)
        search_result = self._curl_notion("POST", "search", {
            "filter": {"property": "object", "value": "data_source"}
        })
        
        if "results" not in search_result:
            print(f"⚠️  Search failed: {search_result.get('message', 'Unknown error')}")
            return []
        
        databases = search_result.get("results", [])
        print(f"   Found {len(databases)} accessible database(s)")
        
        # Filter databases if allowlist is configured
        filtered_databases = []
        for db in databases:
            db_id = db.get("id", "unknown")
            title = self._extract_title(db.get("title", []))
            
            # Apply allowlist filter
            if self.allowed_databases and db_id not in self.allowed_databases:
                print(f"   ⊘ {title} (id: {db_id}) - SKIPPED (not in allowlist)")
                continue
            
            print(f"   ✓ {title} (id: {db_id})")
            
            # Get database details to see properties
            db_details = self._curl_notion("GET", f"databases/{db_id}")
            db["_details"] = db_details
            filtered_databases.append(db)
        
        if self.allowed_databases:
            print(f"\n   Filtered: {len(filtered_databases)}/{len(databases)} database(s) match allowlist")
        
        self.discovered_databases = filtered_databases
        return filtered_databases
    
    def _extract_title(self, title_array: List[Dict]) -> str:
        """Extract plain text from Notion title array."""
        if not title_array:
            return "(Untitled)"
        return "".join([t.get("plain_text", "") for t in title_array])
    
    def _extract_rich_text(self, rich_text_array: List[Dict]) -> str:
        """Extract plain text from Notion rich text array."""
        if not rich_text_array:
            return ""
        return "".join([t.get("plain_text", "") for t in rich_text_array])
    
    def query_database_tasks(self, database_id: str) -> List[Dict]:
        """Query a database for task-like items."""
        # Use data_sources endpoint for querying
        result = self._curl_notion("POST", f"data_sources/{database_id}/query", {
            "page_size": 100
        })
        
        if "results" not in result:
            print(f"   ⚠️  Query failed for {database_id}: {result.get('message', 'Unknown')}")
            return []
        
        return result.get("results", [])
    
    def map_notion_to_kanban(self, notion_item: Dict, database_info: Dict) -> Optional[Dict]:
        """Map a Notion item to a Kanban card structure."""
        properties = notion_item.get("properties", {})
        
        # Extract title
        title = None
        for key, value in properties.items():
            if value.get("type") == "title":
                title = self._extract_title(value.get("title", []))
                break
        
        if not title:
            return None  # Skip items without titles
        
        # Extract status
        status_mapping = {
            "to do": "triage",
            "todo": "triage",
            "backlog": "triage",
            "ready": "ready",
            "specified": "ready",
            "assigned": "ready",
            "blocked": "blocked",
            "waiting": "blocked",
        }
        
        kanban_status = "triage"  # Default
        for key, value in properties.items():
            if key.lower() in ["status", "state", "stage"]:
                if value.get("type") == "select" and value.get("select"):
                    notion_status = value["select"].get("name", "").lower()
                    kanban_status = status_mapping.get(notion_status, "triage")
                    
                    # Skip items in progress or done
                    if notion_status in ["in progress", "doing", "working", "done", "complete", "shipped"]:
                        return None
        
        # Extract assignee
        assignee = None
        for key, value in properties.items():
            if key.lower() == "assignee":
                if value.get("type") == "select" and value.get("select"):
                    assignee = value["select"].get("name")
        
        # Validate assignee
        validated_assignee = self._validate_assignee(assignee)
        
        # Extract priority
        priority = 50  # Default medium priority
        for key, value in properties.items():
            if key.lower() == "priority":
                if value.get("type") == "select" and value.get("select"):
                    priority_str = value["select"].get("name", "").lower()
                    priority_map = {
                        "critical": 100,
                        "high": 80,
                        "medium": 50,
                        "low": 20,
                    }
                    priority = priority_map.get(priority_str, 50)
                elif value.get("type") == "number":
                    priority = value.get("number", 50)
        
        # Build idempotency key
        database_id = database_info.get("id", "unknown")
        page_id = notion_item.get("id", "unknown")
        idempotency_key = f"notion:{database_id}:{page_id}"
        
        # Get page URL
        page_url = notion_item.get("url", f"https://notion.so/{page_id.replace('-', '')}")
        
        # Extract body from page content (would need separate API call)
        # For now, use a placeholder referencing the Notion page
        db_title = self._extract_title(database_info.get("title", []))
        body = f"**Source:** Notion database '{db_title}'\n**Page:** {page_url}\n\n(Content synced from Notion)"
        
        return {
            "title": title,
            "body": body,
            "assignee": validated_assignee,
            "status": kanban_status,
            "priority": priority,
            "idempotency_key": idempotency_key,
            "source_url": page_url,
            "source_database": db_title,
        }
    
    def plan_sync(self) -> List[Dict]:
        """Plan which Kanban cards would be created."""
        print("\n📋 Planning Kanban cards from Notion items...")
        
        planned = []
        
        for db in self.discovered_databases:
            db_id = db.get("id")
            db_title = self._extract_title(db.get("title", []))
            
            print(f"\n   Database: {db_title}")
            
            # Query items
            items = self.query_database_tasks(db_id)
            print(f"   Found {len(items)} item(s)")
            
            # Map to Kanban cards
            for item in items:
                card = self.map_notion_to_kanban(item, db)
                if card:
                    planned.append(card)
                    print(f"      → [{card['status']}] {card['title']}")
        
        self.planned_cards = planned
        print(f"\n   Total cards planned: {len(planned)}")
        return planned
    
    def execute_sync(self) -> List[str]:
        """Actually create Kanban cards via hermes CLI."""
        if self.dry_run:
            print("\n⚠️  Dry run mode — no cards will be created")
            return []
        
        print("\n🚀 Creating Kanban cards...")
        created_ids = []
        
        for card in self.planned_cards:
            print(f"   Creating: {card['title']}")
            print(f"      Status: {card['status']}")
            print(f"      Assignee: {card['assignee']}")
            print(f"      Priority: {card['priority']}")
            print(f"      Idempotency key: {card['idempotency_key']}")
            print(f"      Source: {card['source_url']}")
            
            try:
                # Validate inputs before passing to subprocess
                # This prevents command injection if Notion API is compromised
                self._validate_card_input(
                    title=card['title'],
                    assignee=card['assignee'],
                    priority=card['priority']
                )
                
                # Create the kanban card via hermes CLI
                # Note: Board context is determined by HERMES environment, not --board flag
                create_result = subprocess.run([
                    "hermes", "kanban", "create",
                    card['title'],
                    "--body", card['body'],
                    "--assignee", card['assignee'],
                    "--priority", str(card['priority']),
                    "--idempotency-key", card['idempotency_key'],
                    "--json"
                ], capture_output=True, text=True, check=False)
                
                if create_result.returncode != 0:
                    print(f"      ❌ Failed to create card: {create_result.stderr}")
                    continue
                
                task_data = json.loads(create_result.stdout)
                task_id = task_data.get('task_id') or task_data.get('id')
                created_ids.append(task_id)
                print(f"      ✅ Created: {task_id}")
                
                # Add source attribution comment
                comment_body = f"Source: {card['source_url']}\nDatabase: {card['source_database']}"
                comment_result = subprocess.run([
                    "hermes", "kanban", "comment",
                    task_id,
                    comment_body
                ], capture_output=True, text=True, check=False)
                
                if comment_result.returncode != 0:
                    print(f"      ⚠️  Warning: Failed to add source comment: {comment_result.stderr}")
                
            except ValidationError as e:
                print(f"      ❌ Validation failed: {e}")
                print(f"         Skipping card to prevent potential security issue")
            except json.JSONDecodeError as e:
                print(f"      ❌ Failed to parse task creation response: {e}")
            except Exception as e:
                print(f"      ❌ Unexpected error creating card: {e}")
        
        return created_ids
    
    def generate_report(self) -> str:
        """Generate sync report."""
        report = []
        report.append("=" * 60)
        report.append("Notion to Kanban Sync Report")
        report.append("=" * 60)
        report.append(f"Timestamp: {datetime.now().isoformat()}")
        report.append(f"Target board: {TARGET_BOARD}")
        report.append(f"Mode: {'DRY RUN' if self.dry_run else 'EXECUTE'}")
        
        # Report filtering configuration
        if self.allowed_databases:
            report.append(f"Database filter: ALLOWLIST ({len(self.allowed_databases)} database(s))")
            for db_id in sorted(self.allowed_databases):
                report.append(f"  - {db_id}")
        else:
            report.append("Database filter: NONE (syncing all accessible databases)")
        
        report.append("")
        
        report.append("Discovered Databases:")
        for db in self.discovered_databases:
            title = self._extract_title(db.get("title", []))
            db_id = db.get("id", "unknown")
            report.append(f"  - {title} ({db_id})")
        report.append("")
        
        report.append(f"Planned Cards: {len(self.planned_cards)}")
        for card in self.planned_cards:
            report.append(f"  - [{card['status']}] {card['title']}")
            report.append(f"    Assignee: {card['assignee']}, Priority: {card['priority']}")
            report.append(f"    Key: {card['idempotency_key']}")
        report.append("")
        
        report.append("=" * 60)
        return "\n".join(report)


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Notion to Kanban sync")
    parser.add_argument("--check", action="store_true", help="Check setup only")
    parser.add_argument("--dry-run", action="store_true", help="Discovery and preview only")
    parser.add_argument("--execute", action="store_true", help="Actually create cards")
    
    args = parser.parse_args()
    
    # Default to dry-run if no mode specified
    if not (args.check or args.dry_run or args.execute):
        args.dry_run = True
    
    sync = NotionKanbanSync(dry_run=not args.execute)
    
    # Check setup
    if not sync.check_setup():
        sys.exit(1)
    
    if args.check:
        print("✅ Setup verification complete")
        sys.exit(0)
    
    # Discover databases
    sync.discover_databases()
    
    if not sync.discovered_databases:
        print("\n⚠️  No accessible databases found")
        print("   Make sure you've shared Notion pages/databases with your integration")
        sys.exit(0)
    
    # Plan sync
    sync.plan_sync()
    
    # Generate report
    report = sync.generate_report()
    print("\n" + report)
    
    # Save report
    os.makedirs(LOG_DIR, exist_ok=True)
    log_file = os.path.join(LOG_DIR, f"notion-sync-{datetime.now().strftime('%Y%m%d-%H%M%S')}.log")
    with open(log_file, "w") as f:
        f.write(report)
    print(f"\nReport saved to: {log_file}")
    
    # Execute if requested
    if args.execute:
        created = sync.execute_sync()
        print(f"\n✅ Created {len(created)} Kanban card(s)")
    elif args.dry_run:
        print("\n💡 Run with --execute to actually create cards")


if __name__ == "__main__":
    main()
