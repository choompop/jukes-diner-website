#!/usr/bin/env python3
"""
Integration test for assignee validation.
Tests the full flow without requiring Notion API access.
"""

import os
import sys
import importlib.util

# Import the sync class
spec = importlib.util.spec_from_file_location(
    "notion_kanban_sync",
    os.path.join(os.path.dirname(__file__), "notion-kanban-sync.py")
)
notion_kanban_sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(notion_kanban_sync)
NotionKanbanSync = notion_kanban_sync.NotionKanbanSync


def test_default_configuration():
    """Test that default configuration loads correctly."""
    print("Testing default configuration...")
    sync = NotionKanbanSync(dry_run=True)
    
    # Should have default assignees
    assert len(sync.allowed_assignees) > 0, "Should have default assignees"
    assert "jukes-coding-agent" in sync.allowed_assignees, "Should include jukes-coding-agent"
    assert "jukes-ops-agent" in sync.allowed_assignees, "Should include jukes-ops-agent"
    
    # Default assignee should be jukes-ops-agent
    assert sync.default_assignee == "jukes-ops-agent", f"Default should be jukes-ops-agent, got {sync.default_assignee}"
    
    print("✅ Default configuration OK")


def test_validation_flow():
    """Test the validation flow with various inputs."""
    print("\nTesting validation flow...")
    sync = NotionKanbanSync(dry_run=True)
    
    # Valid assignee should pass through
    result = sync._validate_assignee("jukes-coding-agent")
    assert result == "jukes-coding-agent", f"Valid assignee should pass, got {result}"
    print("  ✅ Valid assignee passes through")
    
    # Invalid assignee should use default
    result = sync._validate_assignee("invalid-agent")
    assert result == sync.default_assignee, f"Invalid assignee should use default, got {result}"
    print("  ✅ Invalid assignee uses default")
    
    # None should use default
    result = sync._validate_assignee(None)
    assert result == sync.default_assignee, f"None should use default, got {result}"
    print("  ✅ None uses default")
    
    # Empty string should use default
    result = sync._validate_assignee("")
    assert result == sync.default_assignee, f"Empty string should use default, got {result}"
    print("  ✅ Empty string uses default")
    
    print("✅ Validation flow OK")


def test_map_notion_to_kanban_integration():
    """Test that map_notion_to_kanban uses validation."""
    print("\nTesting map_notion_to_kanban integration...")
    sync = NotionKanbanSync(dry_run=True)
    
    # Test with valid assignee
    notion_item = {
        "id": "test-page-123",
        "url": "https://notion.so/test",
        "properties": {
            "Name": {
                "type": "title",
                "title": [{"plain_text": "Test Task"}]
            },
            "Assignee": {
                "type": "select",
                "select": {"name": "jukes-coding-agent"}
            }
        }
    }
    
    database_info = {
        "id": "test-db-456",
        "title": [{"plain_text": "Test Database"}]
    }
    
    card = sync.map_notion_to_kanban(notion_item, database_info)
    assert card is not None, "Card should be created"
    assert card['assignee'] == "jukes-coding-agent", f"Should use valid assignee, got {card['assignee']}"
    print("  ✅ Valid assignee preserved")
    
    # Test with invalid assignee
    notion_item['properties']['Assignee']['select']['name'] = "invalid-agent"
    card = sync.map_notion_to_kanban(notion_item, database_info)
    assert card is not None, "Card should be created"
    assert card['assignee'] == sync.default_assignee, f"Should use default assignee, got {card['assignee']}"
    print("  ✅ Invalid assignee replaced with default")
    
    # Test with no assignee
    del notion_item['properties']['Assignee']
    card = sync.map_notion_to_kanban(notion_item, database_info)
    assert card is not None, "Card should be created"
    assert card['assignee'] == sync.default_assignee, f"Should use default assignee, got {card['assignee']}"
    print("  ✅ Missing assignee uses default")
    
    print("✅ map_notion_to_kanban integration OK")


def test_environment_configuration():
    """Test environment variable configuration."""
    print("\nTesting environment configuration...")
    
    # Test custom default assignee
    os.environ['NOTION_SYNC_DEFAULT_ASSIGNEE'] = 'jukes-qa-agent'
    sync = NotionKanbanSync(dry_run=True)
    assert sync.default_assignee == "jukes-qa-agent", f"Should use env default, got {sync.default_assignee}"
    print("  ✅ Custom default assignee from env")
    
    # Test custom allowed assignees
    os.environ['NOTION_SYNC_ALLOWED_ASSIGNEES'] = 'jukes-coding-agent,jukes-qa-agent'
    sync = NotionKanbanSync(dry_run=True)
    assert len(sync.allowed_assignees) == 2, f"Should have 2 allowed, got {len(sync.allowed_assignees)}"
    assert "jukes-coding-agent" in sync.allowed_assignees
    assert "jukes-qa-agent" in sync.allowed_assignees
    print("  ✅ Custom allowed assignees from env")
    
    # Clean up
    del os.environ['NOTION_SYNC_DEFAULT_ASSIGNEE']
    del os.environ['NOTION_SYNC_ALLOWED_ASSIGNEES']
    
    print("✅ Environment configuration OK")


def main():
    """Run all integration tests."""
    print("=" * 60)
    print("Assignee Validation Integration Tests")
    print("=" * 60)
    
    try:
        test_default_configuration()
        test_validation_flow()
        test_map_notion_to_kanban_integration()
        test_environment_configuration()
        
        print("\n" + "=" * 60)
        print("✅ All integration tests passed!")
        print("=" * 60)
        return 0
    except AssertionError as e:
        print(f"\n❌ Test failed: {e}")
        return 1
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
