# Quick Start: Notion → Kanban Sync Setup

## 📋 What This Does

Automatically pulls tasks from your Notion databases into the `jukes-dashboard` Kanban board.

**Safe:** Read-only, dry-run first, no secrets exposed.

---

## ⚡ Setup (5 minutes)

### 1. Create Notion Integration

Visit: https://notion.so/my-integrations

- Click "New integration"
- Name: "Hermes Kanban Sync"
- **Copy the API key** (starts with `ntn_` or `secret_`)

### 2. Store API Key Securely

```bash
echo "NOTION_API_KEY=ntn_paste_your_actual_key_here" >> ~/.hermes/.env
chmod 600 ~/.hermes/.env
```

**IMPORTANT:** Replace `ntn_paste_your_actual_key_here` with your real key!

### 3. Share Notion Databases

For each database containing tasks:

1. Open the database in Notion
2. Click "..." (three dots)
3. Select "Connect to"
4. Choose "Hermes Kanban Sync"

### 4. Configure Database Filter (Recommended)

Run a dry-run first to see all databases, then filter to only task databases:

```bash
# First discovery - see all databases
cd /Users/lexi/projects/jukes-diner-website
python3 scripts/notion-kanban-sync.py --dry-run

# Copy database IDs from output, then add to ~/.hermes/.env
echo "NOTION_SYNC_DATABASES=db_id_1,db_id_2" >> ~/.hermes/.env
```

**Why filter?** Prevents logs, journals, and workout trackers from syncing as tasks.

---

## 🧪 Test It

```bash
cd /Users/lexi/projects/jukes-diner-website
python3 scripts/notion-discovery.py
```

You should see:
- ✓ API key found
- List of accessible databases
- Planned Kanban cards (by status)

**This is read-only — no cards created yet!**

---

## ✅ Next Steps

1. **Review** the discovery output
2. **Verify** the status mappings look correct
3. **Approve** the first sync (tell Hermes to execute)
4. **Monitor** for duplicates
5. **Optionally** enable recurring sync

---

## 📚 Full Documentation

- **Quick Start:** `README-notion-sync.md`
- **Complete Guide:** `docs/notion-kanban-sync.md`
- **Dashboard Tracking:** `docs/notion-sync-dashboard.md`
- **Implementation Details:** `docs/IMPLEMENTATION-SUMMARY.md`

---

## 🆘 Troubleshooting

**"NOTION_API_KEY not found"**
→ Check `~/.hermes/.env` exists and contains the key

**"No databases found"**
→ Make sure databases are shared with the integration in Notion

**"Duplicate cards created"**
→ Check the idempotency key logic in logs/

---

## 🔒 Security

✅ API key only in `~/.hermes/.env` (never in chat/Kanban)  
✅ Read-only access to Notion  
✅ Dry-run first (review before creating cards)  
✅ No secrets in logs or dashboard  

---

## Status Mapping

```
Notion → Kanban
─────────────────────────────
To Do      → triage  (needs spec)
Ready      → ready   (awaiting dispatch)
Blocked    → blocked (needs resolution)
In Progress → (skip)
Done       → (skip)
```

---

**Target Board:** jukes-dashboard
