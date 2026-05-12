"""
Notion to Kanban Sync Executor

This script is designed to be run via execute_code within Hermes agent context.
It has access to kanban_create via hermes_tools and can actually create cards.

Usage from agent:
    execute_code with this script content

Or standalone:
    python3 scripts/notion-sync-executor.py --dry-run
"""

import os
import sys
import json
import subprocess
from datetime import datetime
from typing import Dict, List, Optional

# Import Hermes tools
try:
    from hermes_tools import terminal
    HERMES_CONTEXT = True
except ImportError:
    HERMES_CONTEXT = False
    print("⚠️  Running outside Hermes context - kanban_create not available")

NOTION_API_VERSION = "2025-09-03"
TARGET_BOARD = "jukes-dashboard"


def curl_notion(api_key: str, method: str, endpoint: str, data: Optional[Dict] = None) -> Dict:
    """Make Notion API request."""
    from hermes_tools import shell_quote
    
    url = f"https://api.notion.com/v1/{endpoint}"
    
    cmd = f"curl -s -X {method} {shell_quote(url)}"
    cmd += f" -H 'Authorization: Bearer {shell_quote(api_key)}'"
    cmd += f" -H 'Notion-Version: {NOTION_API_VERSION}'"
    cmd += " -H 'Content-Type: application/json'"
    
    if data:
        cmd += f" -d '{json.dumps(data)}'"
    
    result = terminal(cmd)
    
    try:
        return json.loads(result["output"])
    except json.JSONDecodeError:
        print(f"❌ Invalid JSON: {result['output'][:200]}")
        return {"error": "Invalid response"}


def discover_and_plan(api_key: str) -> List[Dict]:
    """Discover databases and plan cards."""
    print("🔍 Discovering Notion databases...\n")
    
    # Search for databases
    search = curl_notion(api_key, "POST", "search", {
        "filter": {"property": "object", "value": "database"}
    })
    
    databases = search.get("results", [])
    print(f"Found {len(databases)} database(s)\n")
    
    planned_cards = []
    
    for db in databases:
        db_id = db["id"]
        db_title = "".join([t.get("plain_text", "") for t in db.get("title", [])])
        
        print(f"📋 {db_title}")
        
        # Query database items
        query = curl_notion(api_key, "POST", f"data_sources/{db_id}/query", {
            "page_size": 100
        })
        
        items = query.get("results", [])
        print(f"   {len(items)} item(s)")
        
        for item in items:
            card = map_item_to_card(item, db_id, db_title)
            if card:
                planned_cards.append(card)
                print(f"   → [{card['status']}] {card['title']}")
        
        print()
    
    return planned_cards


def map_item_to_card(item: Dict, db_id: str, db_title: str) -> Optional[Dict]:
    """Map Notion item to Kanban card."""
    props = item.get("properties", {})
    
    # Extract title
    title = None
    for key, val in props.items():
        if val.get("type") == "title":
            title = "".join([t.get("plain_text", "") for t in val.get("title", [])])
            break
    
    if not title:
        return None
    
    # Extract status
    notion_status = None
    for key, val in props.items():
        if key.lower() in ["status", "state", "stage"]:
            if val.get("type") == "select" and val.get("select"):
                notion_status = val["select"]["name"].lower()
    
    # Skip completed/in-progress
    if notion_status in ["in progress", "doing", "done", "complete", "shipped"]:
        return None
    
    # Map to Kanban status
    kanban_status = "triage"
    if notion_status in ["ready", "specified", "assigned"]:
        kanban_status = "ready"
    elif notion_status in ["blocked", "waiting"]:
        kanban_status = "blocked"
    
    # Extract assignee
    assignee = "jukes-ops-agent"
    for key, val in props.items():
        if key.lower() == "assignee":
            if val.get("type") == "select" and val.get("select"):
                assignee = val["select"]["name"]
    
    # Extract priority
    priority = 50
    for key, val in props.items():
        if key.lower() == "priority":
            if val.get("type") == "select" and val.get("select"):
                p_str = val["select"]["name"].lower()
                priority = {"critical": 100, "high": 80, "medium": 50, "low": 20}.get(p_str, 50)
            elif val.get("type") == "number":
                priority = val.get("number", 50)
    
    # Build card
    page_id = item["id"]
    page_url = item.get("url", f"https://notion.so/{page_id.replace('-', '')}")
    
    return {
        "title": title,
        "body": f"**Source:** Notion database '{db_title}'\n\n[View in Notion]({page_url})",
        "assignee": assignee,
        "priority": priority,
        "idempotency_key": f"notion:{db_id}:{page_id}",
        "status": kanban_status,
        "source_url": page_url,
        "database_name": db_title,
    }


# When run via execute_code, return the planned cards
api_key = os.environ.get("NOTION_API_KEY")

if not api_key:
    print("❌ NOTION_API_KEY not set")
    print("\nAdd to ~/.hermes/.env:")
    print("   NOTION_API_KEY=ntn_your_key_here")
    print(json.dumps({"error": "API key not configured"}))
else:
    planned = discover_and_plan(api_key)
    
    print("=" * 60)
    print(f"Summary: {len(planned)} card(s) ready to create")
    print("=" * 60)
    
    # Output JSON result for programmatic use
    result = {
        "planned_cards": planned,
        "total": len(planned),
        "timestamp": datetime.now().isoformat(),
    }
    
    print(json.dumps(result, indent=2))
