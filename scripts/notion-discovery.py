#!/usr/bin/env python3
"""
Notion to Kanban Sync - Integrated Version

This version uses Hermes kanban tools directly via execute_code.
Can be run as a standalone test or integrated into Hermes automation.
"""

import os
import sys
import json
import subprocess
from datetime import datetime
from typing import Dict, List, Optional, Any

NOTION_API_VERSION = "2025-09-03"
TARGET_BOARD = "jukes-dashboard"


def check_api_key() -> Optional[str]:
    """Check for NOTION_API_KEY in environment."""
    api_key = os.environ.get("NOTION_API_KEY")
    if not api_key:
        print("❌ NOTION_API_KEY not found")
        print("\nSetup Instructions:")
        print("=" * 60)
        print("1. Create integration: https://notion.so/my-integrations")
        print("2. Copy API key (starts with 'ntn_' or 'secret_')")
        print("3. Add to ~/.hermes/.env:")
        print("   echo 'NOTION_API_KEY=ntn_your_key_here' >> ~/.hermes/.env")
        print("   chmod 600 ~/.hermes/.env")
        print("4. Share Notion pages/databases with the integration")
        print("=" * 60)
        return None
    return api_key


def curl_notion(api_key: str, method: str, endpoint: str, data: Optional[Dict] = None) -> Dict:
    """Make Notion API request."""
    url = f"https://api.notion.com/v1/{endpoint}"
    
    cmd = [
        "curl", "-s", "-X", method, url,
        "-H", f"Authorization: Bearer {api_key}",
        "-H", f"Notion-Version: {NOTION_API_VERSION}",
        "-H", "Content-Type: application/json"
    ]
    
    if data:
        cmd.extend(["-d", json.dumps(data)])
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    try:
        response = json.loads(result.stdout)
        if "object" in response and response["object"] == "error":
            print(f"⚠️  Notion API error: {response.get('message', 'Unknown error')}")
            print(f"   Status: {response.get('status', 'unknown')}")
        return response
    except json.JSONDecodeError:
        print(f"❌ Invalid JSON from API: {result.stdout[:200]}")
        return {"error": "Invalid response"}


def discover_databases(api_key: str) -> List[Dict]:
    """Search for accessible Notion databases."""
    print("🔍 Searching for Notion databases...")
    
    search_result = curl_notion(api_key, "POST", "search", {
        "filter": {"property": "object", "value": "data_source"}
    })
    
    databases = search_result.get("results", [])
    print(f"   Found {len(databases)} database(s)")
    
    for db in databases:
        title = extract_title(db.get("title", []))
        db_id = db.get("id", "unknown")
        print(f"   • {title}")
        print(f"     ID: {db_id}")
    
    return databases


def extract_title(title_array: List[Dict]) -> str:
    """Extract plain text from Notion title."""
    if not title_array:
        return "(Untitled)"
    return "".join([t.get("plain_text", "") for t in title_array])


def query_database(api_key: str, database_id: str) -> List[Dict]:
    """Query database for items."""
    print(f"\n   Querying database {database_id}...")
    
    # Try data_sources endpoint (API v2025-09-03)
    result = curl_notion(api_key, "POST", f"data_sources/{database_id}/query", {
        "page_size": 100
    })
    
    items = result.get("results", [])
    print(f"   → {len(items)} item(s) found")
    return items


def map_status(notion_status: str) -> Optional[str]:
    """Map Notion status to Kanban status."""
    status_lower = notion_status.lower()
    
    # Skip completed or in-progress items
    skip_statuses = ["in progress", "doing", "working", "done", "complete", "completed", "shipped"]
    if status_lower in skip_statuses:
        return None
    
    # Map to Kanban statuses
    if status_lower in ["to do", "todo", "backlog", "not started"]:
        return "triage"
    elif status_lower in ["ready", "specified", "assigned", "planned"]:
        return "ready"
    elif status_lower in ["blocked", "waiting", "on hold"]:
        return "blocked"
    else:
        return "triage"  # Default


def extract_properties(item: Dict) -> Dict[str, Any]:
    """Extract relevant properties from Notion item."""
    properties = item.get("properties", {})
    extracted = {}
    
    # Title
    for key, value in properties.items():
        if value.get("type") == "title":
            extracted["title"] = extract_title(value.get("title", []))
            break
    
    # Status
    for key, value in properties.items():
        if key.lower() in ["status", "state", "stage"]:
            if value.get("type") == "select" and value.get("select"):
                extracted["notion_status"] = value["select"].get("name", "")
    
    # Assignee
    for key, value in properties.items():
        if key.lower() == "assignee":
            if value.get("type") == "select" and value.get("select"):
                extracted["assignee"] = value["select"].get("name")
    
    # Priority
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
                extracted["priority"] = priority_map.get(priority_str, 50)
            elif value.get("type") == "number":
                extracted["priority"] = value.get("number", 50)
    
    return extracted


def plan_cards(api_key: str, databases: List[Dict]) -> List[Dict]:
    """Plan Kanban cards from Notion databases."""
    planned = []
    
    for db in databases:
        db_id = db.get("id")
        db_title = extract_title(db.get("title", []))
        
        print(f"\n📋 Processing: {db_title}")
        
        items = query_database(api_key, db_id)
        
        for item in items:
            props = extract_properties(item)
            
            if "title" not in props:
                continue
            
            # Map status
            kanban_status = "triage"
            if "notion_status" in props:
                mapped = map_status(props["notion_status"])
                if mapped is None:
                    print(f"   ⊘ Skipping: {props['title']} (status: {props['notion_status']})")
                    continue
                kanban_status = mapped
            
            # Build card
            page_id = item.get("id", "unknown")
            page_url = item.get("url", f"https://notion.so/{page_id.replace('-', '')}")
            
            card = {
                "title": props["title"],
                "body": f"**Source:** Notion database '{db_title}'\n\n[View in Notion]({page_url})",
                "assignee": props.get("assignee", "jukes-ops-agent"),
                "status": kanban_status,
                "priority": props.get("priority", 50),
                "idempotency_key": f"notion:{db_id}:{page_id}",
                "source_url": page_url,
                "database_name": db_title,
            }
            
            planned.append(card)
            print(f"   ✓ [{card['status']}] {card['title']}")
            print(f"     Priority: {card['priority']}, Assignee: {card['assignee']}")
    
    return planned


def main():
    print("=" * 60)
    print("Notion to Kanban Sync - Discovery Phase")
    print("=" * 60)
    print()
    
    # Check API key
    api_key = check_api_key()
    if not api_key:
        return {"error": "NOTION_API_KEY not configured"}
    
    print(f"✓ API key found (prefix: {api_key[:10]}...)\n")
    
    # Discover databases
    databases = discover_databases(api_key)
    
    if not databases:
        print("\n⚠️  No databases found")
        print("   Make sure you've shared Notion databases with your integration")
        print("   Go to Notion → Database → ... → Connect to → [Your Integration]")
        return {
            "databases": [],
            "planned_cards": [],
            "message": "No accessible databases found"
        }
    
    # Plan cards
    planned = plan_cards(api_key, databases)
    
    print("\n" + "=" * 60)
    print(f"Summary: {len(planned)} card(s) ready to sync")
    print("=" * 60)
    
    # Print summary
    status_counts = {}
    for card in planned:
        status_counts[card["status"]] = status_counts.get(card["status"], 0) + 1
    
    print("\nBy status:")
    for status, count in sorted(status_counts.items()):
        print(f"  {status}: {count}")
    
    return {
        "databases": [
            {"id": db["id"], "title": extract_title(db.get("title", []))}
            for db in databases
        ],
        "planned_cards": planned,
        "summary": {
            "total": len(planned),
            "by_status": status_counts
        }
    }


if __name__ == "__main__":
    result = main()
    print("\n" + json.dumps(result, indent=2))
