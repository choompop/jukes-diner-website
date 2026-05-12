# Media Hub Import Plan — Quick Reference

**Status:** Phase 1 ready to execute (12 assets, zero blockers)  
**Blockers:** Phases 2-3 require John's decisions on source access

---

## Phase 1: Import Existing Assets ✅ READY

**Assets:** 12 files in `public/images/`  
**Risk:** None (read-only references, no file moves)  
**Next Steps:**
1. Create `data/media-hub.json`
2. Generate media hub entries for existing assets
3. Run tests to verify

**Suggested Next Card:**
```
Title: Populate media hub with Phase 1 assets (public/images)
Assignee: jukes-ops-agent
Body: Create data/media-hub.json, import 12 approved brand assets, verify tests pass
```

---

## Phase 2: Photos Library (Operator Captures) ⏸️ AWAITING DECISION

**Question for John:** Manual export OR automated sync?

**Option A: Manual Export (Faster)**
- John creates Albums in Photos.app by content pillar
- Exports albums to `media/jukes-diner/raw/`
- Agent imports with `needs-tags` status

**Option B: Automated (`osxphotos`)**
- Install `osxphotos` Python package
- Create export script (reads Albums → exports → generates media hub entries)
- Run weekly via cron

**Decision Required:** Which approach?

---

## Phase 3: Cloud/Social Sources ⏸️ AWAITING CONFIRMATION

**Questions for John:**

| Source | Question | If Yes, Need |
|--------|----------|--------------|
| Google Drive | Do Juke's media assets exist in Drive? | Folder path OR install Drive Desktop |
| Instagram/Facebook/TikTok | What are the account handles? | Handles + decision on post archiving |
| Metricool | Does account exist? | Login credentials OR API key |
| Notion | Should we scan for embedded media? | Confirmation only (API already configured) |
| Obsidian | Does vault have media attachments? | Vault path |

**Safe Import Pattern (All Sources):**
1. Discovery (read-only list)
2. John reviews and marks items to import
3. Download to `operator-uploads/` or `raw/`
4. Generate media hub entries (`needs-approval` status)
5. Never modify originals

---

## Decision Map

```
START
  │
  ├─> Phase 1: Import public/images/        ✅ Execute now
  │
  ├─> Phase 2: Photos Library
  │     ├─> Manual export?                  ⏸️ John decides
  │     └─> osxphotos automation?           ⏸️ John decides
  │
  └─> Phase 3: Cloud/Social
        ├─> Google Drive exists?            ❓ John confirms
        ├─> Social accounts (handles?)      ❓ John provides
        ├─> Metricool account?              ❓ John confirms
        ├─> Notion scan approved?           ❓ John decides
        └─> Obsidian vault path?            ❓ John provides
```

---

## Access Blockers (Quick Reference)

| Source | Blocker | Resolution |
|--------|---------|------------|
| ✅ Local assets | None | Import now |
| ⚠️  Photos Library | No API access | Install osxphotos OR manual |
| ❌ Google Drive | Unknown if exists | John confirms |
| ⚠️  Notion | Unknown media locations | Discovery scan |
| ❌ Social Media | No credentials | John provides handles + keys |
| ❌ Metricool | Unknown if exists | John confirms |
| ⚠️  Obsidian | Vault location unclear | John provides path |
| ⚠️  Local folders | Privacy approval | John approves search |

---

**Full Details:** See `MEDIA_SOURCE_MAP.md`
