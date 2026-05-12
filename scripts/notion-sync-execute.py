#!/usr/bin/env python3
"""
Notion to Kanban Sync Executor

Reads discovered Notion tasks from JSON and creates Kanban cards with idempotency.
Designed to run via Hermes execute_code or as standalone script.
"""
import os
import sys
import json
from datetime import datetime
from typing import Dict, List

# When run via execute_code, hermes_tools is available
try:
    # These will be available in execute_code context
    print("✅ Running in Hermes execute_code context")
    HERMES_CONTEXT = True
except:
    print("⚠️  Running standalone (kanban_create not available)")
    HERMES_CONTEXT = False


def load_discovery_data(filepath: str) -> Dict:
    """Load discovery JSON output."""
    try:
        with open(filepath, 'r') as f:
            # The file contains both human-readable output and JSON at the end
            content = f.read()
            
        # Find the JSON object at the end
        # Look for the last occurrence of opening brace after "databases"
        json_start = content.rfind('{\n  "databases"')
        if json_start == -1:
            print("❌ Could not find JSON data in discovery output")
            return None
            
        json_str = content[json_start:]
        data = json.loads(json_str)
        return data
        
    except FileNotFoundError:
        print(f"❌ Discovery file not found: {filepath}")
        return None
    except json.JSONDecodeError as e:
        print(f"❌ Failed to parse JSON: {e}")
        return None


def create_kanban_cards_batch(cards: List[Dict], dry_run: bool = True) -> Dict:
    """
    Create Kanban cards for Notion tasks.
    
    Args:
        cards: List of card dictionaries from discovery
        dry_run: If True, don't actually create cards
        
    Returns:
        Summary dict with counts
    """
    from hermes_tools import terminal, json_parse
    
    created = 0
    skipped = 0
    errors = []
    
    print(f"\n{'='*60}")
    print(f"{'DRY RUN - ' if dry_run else ''}Creating Kanban Cards")
    print(f"{'='*60}\n")
    
    for i, card in enumerate(cards):
        title = card["title"]
        assignee = card["assignee"]
        status = card["status"]
        priority = card["priority"]
        body = card["body"]
        idempotency_key = card["idempotency_key"]
        
        # Check if card already exists via idempotency key
        check_cmd = f'hermes kanban list --json | jq -r \'.tasks[] | select(.idempotency_key == "{idempotency_key}") | .id\''
        check_result = terminal(check_cmd)
        
        if check_result["output"].strip():
            existing_id = check_result["output"].strip()
            print(f"⊘ {i+1}/{len(cards)}: SKIP (exists: {existing_id}) - {title[:60]}")
            skipped += 1
            continue
        
        if dry_run:
            print(f"✓ {i+1}/{len(cards)}: WOULD CREATE [{status}] {title[:60]}")
            created += 1
        else:
            # Actually create the card
            # Escape special chars for JSON
            safe_title = json.dumps(title)
            safe_body = json.dumps(body)
            safe_key = json.dumps(idempotency_key)
            
            create_cmd = f'''hermes kanban create {safe_title} \\
                --assignee "{assignee}" \\
                --status {status} \\
                --priority {priority} \\
                --body {safe_body} \\
                --idempotency-key {safe_key} \\
                --json'''
            
            result = terminal(create_cmd, timeout=30)
            
            if result["exit_code"] == 0:
                try:
                    created_data = json_parse(result["output"])
                    task_id = created_data.get("task_id", "unknown")
                    print(f"✓ {i+1}/{len(cards)}: CREATED {task_id} - {title[:60]}")
                    created += 1
                except:
                    print(f"⚠️  {i+1}/{len(cards)}: Created but couldn't parse ID - {title[:60]}")
                    created += 1
            else:
                error_msg = result.get("error", "Unknown error")
                print(f"❌ {i+1}/{len(cards)}: FAILED - {title[:60]}")
                print(f"   Error: {error_msg[:100]}")
                errors.append({"title": title, "error": error_msg})
    
    return {
        "total_planned": len(cards),
        "created": created,
        "skipped": skipped,
        "errors": len(errors),
        "error_details": errors[:10],  # First 10 errors
    }


def main():
    """Main execution flow."""
    import sys
    
    dry_run = "--execute" not in sys.argv
    discovery_file = "/tmp/notion-discovery.json"
    
    print("=" * 60)
    print("Notion → Kanban Sync Executor")
    print("=" * 60)
    
    if dry_run:
        print("\n⚠️  DRY RUN MODE")
        print("   Cards will NOT be created")
        print("   Run with --execute to actually create cards\n")
    else:
        print("\n🚀 EXECUTION MODE")
        print("   Cards WILL be created in Kanban\n")
    
    # Load discovery data
    print(f"📖 Loading discovery data from {discovery_file}...")
    data = load_discovery_data(discovery_file)
    
    if not data:
        print("\n❌ Failed to load discovery data")
        print("   Run: python3 scripts/notion-discovery.py > /tmp/notion-discovery.json")
        return 1
    
    planned_cards = data.get("planned_cards", [])
    summary = data.get("summary", {})
    
    print(f"✅ Loaded {len(planned_cards)} planned cards")
    print(f"\nBreakdown:")
    for status, count in summary.get("by_status", {}).items():
        print(f"  {status}: {count}")
    
    # Execute sync
    result = create_kanban_cards_batch(planned_cards, dry_run=dry_run)
    
    # Print results
    print(f"\n{'='*60}")
    print("Sync Results")
    print(f"{'='*60}")
    print(f"Total planned: {result['total_planned']}")
    print(f"Created:       {result['created']}")
    print(f"Skipped:       {result['skipped']}")
    print(f"Errors:        {result['errors']}")
    
    if result['errors'] > 0:
        print("\nFirst few errors:")
        for err in result['error_details']:
            print(f"  - {err['title'][:60]}")
            print(f"    {err['error'][:100]}")
    
    print(f"\n{'='*60}")
    
    # Save results log
    log_file = f"/Users/lexi/projects/jukes-diner-website/logs/notion-sync-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
    os.makedirs(os.path.dirname(log_file), exist_ok=True)
    
    with open(log_file, 'w') as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "dry_run": dry_run,
            "results": result,
            "summary": summary,
        }, f, indent=2)
    
    print(f"📝 Log saved to: {log_file}")
    
    return 0 if result['errors'] == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
