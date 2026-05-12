#!/usr/bin/env python3
"""
Notion to Kanban Card Sync - Batch Creator

This script is designed to be executed inside the Hermes agent via execute_code.
It reads the discovery manifest and creates Kanban cards via the kanban_create tool.

Since we're inside execute_code, we can't call kanban_create directly.
Instead, this script shells out to `hermes kanban create` CLI.
"""
import json
import subprocess
import sys
from datetime import datetime


def load_manifest(filepath):
    """Load the sync manifest."""
    with open(filepath, 'r') as f:
        return json.load(f)


def create_card_via_cli(card):
    """Create a Kanban card via hermes CLI."""
    from hermes_tools import terminal, shell_quote
    
    # Build the command
    title_quoted = shell_quote(card["title"])
    body_quoted = shell_quote(card["body"])
    assignee = card["assignee"]
    priority = card["priority"]
    idempotency_key = card["idempotency_key"]
    
    cmd = f"""hermes kanban create {title_quoted} \\
        --assignee {shell_quote(assignee)} \\
        --priority {priority} \\
        --body {body_quoted} \\
        --idempotency-key {shell_quote(idempotency_key)} \\
        --json"""
    
    result = terminal(cmd, timeout=30)
    
    if result["exit_code"] == 0:
        try:
            data = json.loads(result["output"])
            return {"ok": True, "task_id": data.get("task_id"), "created": True}
        except json.JSONDecodeError:
            # May have been idempotent - check output
            if "task_id" in result["output"]:
                return {"ok": True, "idempotent": True}
            return {"ok": False, "error": "Could not parse response"}
    else:
        return {"ok": False, "error": result.get("error", "Unknown error")}


def main():
    manifest_file = "/tmp/notion-kanban-sync-manifest.json"
    
    print("="*60)
    print("Notion to Kanban Sync - Batch Execution")
    print("="*60)
    print()
    
    # Load manifest
    manifest = load_manifest(manifest_file)
    
    total_cards = manifest["total_cards"]
    batches = manifest["batches"]
    
    print(f"Total cards: {total_cards}")
    print(f"Batches: {len(batches)}")
    print()
    
    # Process batches
    stats = {
        "created": 0,
        "idempotent": 0,
        "errors": 0,
        "total": total_cards,
    }
    
    for batch in batches:
        batch_num = batch["batch_number"]
        cards = batch["cards"]
        
        print(f"Batch {batch_num}/{len(batches)}: processing {len(cards)} cards...")
        
        for i, card in enumerate(cards):
            result = create_card_via_cli(card)
            
            if result["ok"]:
                if result.get("created"):
                    stats["created"] += 1
                    print(f"  ✓ {i+1}/{len(cards)}: Created {card['title'][:50]}")
                elif result.get("idempotent"):
                    stats["idempotent"] += 1
                    print(f"  ⊘ {i+1}/{len(cards)}: Exists {card['title'][:50]}")
            else:
                stats["errors"] += 1
                print(f"  ❌ {i+1}/{len(cards)}: Error {card['title'][:50]}")
                print(f"     {result.get('error', 'Unknown')[:100]}")
        
        print()
    
    print("="*60)
    print("Sync Complete")
    print("="*60)
    print(f"Total:      {stats['total']}")
    print(f"Created:    {stats['created']}")
    print(f"Existing:   {stats['idempotent']}")
    print(f"Errors:     {stats['errors']}")
    print()
    
    # Save results
    results_file = f"/Users/lexi/projects/jukes-diner-website/logs/sync-results-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
    with open(results_file, 'w') as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "stats": stats,
        }, f, indent=2)
    
    print(f"Results saved to: {results_file}")
    print()
    print(json.dumps(stats, indent=2))
    
    return 0 if stats["errors"] == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
