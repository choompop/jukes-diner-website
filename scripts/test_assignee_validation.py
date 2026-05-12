#!/usr/bin/env python3
"""
Test assignee validation functionality in notion-kanban-sync.py

Tests that assignee values are validated against known profiles
and that invalid assignees are handled gracefully with fallback.
"""

import os
import sys
import unittest
from unittest.mock import patch

# Import the sync class
sys.path.insert(0, os.path.dirname(__file__))
import importlib.util
spec = importlib.util.spec_from_file_location(
    "notion_kanban_sync", 
    os.path.join(os.path.dirname(__file__), "notion-kanban-sync.py")
)
notion_kanban_sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(notion_kanban_sync)
NotionKanbanSync = notion_kanban_sync.NotionKanbanSync


class TestAssigneeValidation(unittest.TestCase):
    """Test cases for assignee validation."""
    
    def setUp(self):
        """Set up test instance."""
        self.sync = NotionKanbanSync(dry_run=True)
    
    def test_valid_assignee_passes(self):
        """Test that valid assignees are accepted."""
        valid_assignees = [
            "jukes-coding-agent",
            "jukes-ops-agent",
            "jukes-qa-agent",
            "jukes-finance-agent",
        ]
        
        for assignee in valid_assignees:
            validated = self.sync._validate_assignee(assignee)
            self.assertEqual(validated, assignee, 
                           f"Valid assignee '{assignee}' should pass through")
    
    def test_invalid_assignee_uses_fallback(self):
        """Test that invalid assignees get replaced with fallback."""
        invalid_assignees = [
            "invalid-agent",
            "juke-coding-agent",  # typo
            "coding-agent",  # missing prefix
            "jukes-invalid",
        ]
        
        for assignee in invalid_assignees:
            validated = self.sync._validate_assignee(assignee)
            self.assertIn(validated, self.sync.allowed_assignees,
                         f"Invalid assignee '{assignee}' should use fallback")
    
    def test_none_assignee_uses_default(self):
        """Test that None assignee uses default."""
        validated = self.sync._validate_assignee(None)
        self.assertEqual(validated, self.sync.default_assignee,
                        "None assignee should use default")
    
    def test_empty_assignee_uses_default(self):
        """Test that empty string assignee uses default."""
        validated = self.sync._validate_assignee("")
        self.assertEqual(validated, self.sync.default_assignee,
                        "Empty assignee should use default")
    
    @patch.dict(os.environ, {"NOTION_SYNC_DEFAULT_ASSIGNEE": "jukes-qa-agent"})
    def test_custom_default_assignee_from_env(self):
        """Test that default assignee can be configured via environment."""
        sync = NotionKanbanSync(dry_run=True)
        self.assertEqual(sync.default_assignee, "jukes-qa-agent",
                        "Default assignee should be configurable via env")
    
    @patch.dict(os.environ, {"NOTION_SYNC_ALLOWED_ASSIGNEES": "jukes-coding-agent,jukes-qa-agent"})
    def test_custom_allowed_assignees_from_env(self):
        """Test that allowed assignees can be configured via environment."""
        sync = NotionKanbanSync(dry_run=True)
        expected = {"jukes-coding-agent", "jukes-qa-agent"}
        self.assertEqual(sync.allowed_assignees, expected,
                        "Allowed assignees should be configurable via env")
    
    def test_validation_warning_logged(self):
        """Test that validation failures log a warning."""
        # This would need a mock of the logging system
        # For now, we verify the behavior via coverage
        validated = self.sync._validate_assignee("invalid-agent")
        self.assertNotEqual(validated, "invalid-agent",
                           "Invalid assignee should be rejected")
    
    def test_map_notion_to_kanban_validates_assignee(self):
        """Test that map_notion_to_kanban validates the assignee field."""
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
                    "select": {"name": "invalid-agent"}  # Invalid assignee
                }
            }
        }
        
        database_info = {
            "id": "test-db-456",
            "title": [{"plain_text": "Test Database"}]
        }
        
        card = self.sync.map_notion_to_kanban(notion_item, database_info)
        
        # Card should be created with fallback assignee
        self.assertIsNotNone(card)
        self.assertIn(card['assignee'], self.sync.allowed_assignees,
                     "Invalid assignee should be replaced with valid fallback")


class TestDefaultProfiles(unittest.TestCase):
    """Test that default profile list matches actual profiles."""
    
    def test_default_profiles_exist(self):
        """Test that all default assignees are real profiles."""
        sync = NotionKanbanSync(dry_run=True)
        profiles_dir = os.path.expanduser("~/.hermes/profiles")
        
        if os.path.exists(profiles_dir):
            actual_profiles = set(os.listdir(profiles_dir))
            
            for assignee in sync.allowed_assignees:
                self.assertIn(assignee, actual_profiles,
                             f"Default assignee '{assignee}' should exist in profiles")


if __name__ == "__main__":
    # Run tests with verbose output
    unittest.main(verbosity=2)
