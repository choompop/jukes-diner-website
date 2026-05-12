#!/usr/bin/env bash
# Notion to Kanban Sync Wrapper Script
#
# Safely loads environment and runs the Python sync script.
# Never exposes NOTION_API_KEY in output or logs.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SYNC_SCRIPT="$SCRIPT_DIR/notion-kanban-sync.py"

# Load environment if .env exists
# Use real home directory, not Hermes-scoped $HOME
REAL_HOME="${REAL_HOME:-$(eval echo ~$USER)}"
if [[ -f "$REAL_HOME/.hermes/.env" ]]; then
    set -a
    source "$REAL_HOME/.hermes/.env"
    set +a
fi

# Verify Python script exists
if [[ ! -f "$SYNC_SCRIPT" ]]; then
    echo "❌ Sync script not found: $SYNC_SCRIPT"
    exit 1
fi

# Make sure we're using the right Python (with hermes_tools available)
if ! python3 -c "import hermes_tools" 2>/dev/null; then
    echo "⚠️  hermes_tools not available in current Python environment"
    echo "   This script expects to run within Hermes agent context"
fi

# Run the sync script with all arguments passed through
cd "$PROJECT_ROOT"
python3 "$SYNC_SCRIPT" "$@"
