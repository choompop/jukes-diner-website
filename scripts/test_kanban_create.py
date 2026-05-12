#!/usr/bin/env python3
"""
Test script to verify kanban_create implementation in notion-kanban-sync.py
Creates a single test card to verify the CLI integration works.
"""

import subprocess
import json
import sys

def test_kanban_create():
    """Test creating a single kanban card via hermes CLI."""
    print("Testing kanban card creation...")
    
    # Create a test card
    test_title = "Test Card - notion-kanban-sync verification"
    test_body = "This is a test card created to verify the kanban_create implementation."
    test_assignee = "jukes-coding-agent"
    test_priority = "50"
    test_idempotency_key = "test:notion-sync:verification-" + str(hash("test"))
    
    try:
        result = subprocess.run([
            "hermes", "kanban", "create",
            test_title,
            "--body", test_body,
            "--assignee", test_assignee,
            "--priority", test_priority,
            "--idempotency-key", test_idempotency_key,
            "--json"
        ], capture_output=True, text=True, check=False)
        
        if result.returncode != 0:
            print(f"❌ Failed to create card: {result.stderr}")
            return False
        
        task_data = json.loads(result.stdout)
        task_id = task_data.get('task_id') or task_data.get('id')
        print(f"✅ Created card: {task_id}")
        
        # Test adding a comment
        comment_result = subprocess.run([
            "hermes", "kanban", "comment",
            task_id,
            "Test comment - verifying source attribution"
        ], capture_output=True, text=True, check=False)
        
        if comment_result.returncode != 0:
            print(f"⚠️  Warning: Failed to add comment: {comment_result.stderr}")
        else:
            print(f"✅ Added source comment")
        
        # Test idempotency - create same card again
        print("\nTesting idempotency...")
        result2 = subprocess.run([
            "hermes", "kanban", "create",
            test_title,
            "--body", test_body,
            "--assignee", test_assignee,
            "--priority", test_priority,
            "--idempotency-key", test_idempotency_key,
            "--json"
        ], capture_output=True, text=True, check=False)
        
        if result2.returncode == 0:
            task_data2 = json.loads(result2.stdout)
            task_id2 = task_data2.get('task_id') or task_data2.get('id')
            if task_id == task_id2:
                print(f"✅ Idempotency works - same task_id returned: {task_id2}")
            else:
                print(f"⚠️  Different task_id returned: {task_id2} vs {task_id}")
        
        return True
        
    except json.JSONDecodeError as e:
        print(f"❌ Failed to parse response: {e}")
        print(f"Output: {result.stdout}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    success = test_kanban_create()
    sys.exit(0 if success else 1)
