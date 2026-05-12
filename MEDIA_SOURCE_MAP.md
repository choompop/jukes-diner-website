# Juke's Diner Media Asset Source Map

**Generated:** 2026-05-08  
**Purpose:** Document where Juke's real media/assets currently live, access blockers, and safe import plan for media hub integration.

---

## Executive Summary

**Current State:** Juke's media assets are scattered across multiple locations with no centralized tracking. The media hub (`lib/media-hub.mjs`) is architected but not yet populated with real assets.

**Key Findings:**
- ✅ 12 brand/logo assets exist locally in `public/images/`
- ⚠️  No centralized media storage or cloud sync currently configured
- ⚠️  Photos Library exists locally but no programmatic access configured
- ⚠️  No Metricool, Google Drive, or social media API integrations found
- ⚠️  Media hub data file (`data/media-hub.json`) does not exist yet

**Recommendation:** Start with local-first media hub population using existing `public/images/` assets, then add phone/social media integration as next phase.

---

## Source #1: Local Project Assets

### Location
- **Path:** `/Users/lexi/projects/jukes-diner-website/public/images/`
- **Status:** ✅ Accessible, committed to git

### Asset Inventory (12 files)
| Filename | Type | Size | Last Modified | Status |
|----------|------|------|---------------|--------|
| `jukes-diner-logo.png` | Logo | 2.7 MB | Apr 2, 2026 | Brand-approved |
| `jd-monogram.png` | Logo | 2.9 MB | Apr 2, 2026 | Brand-approved |
| `logo.png` | Logo | 2.8 MB | Apr 2, 2026 | Brand-approved |
| `logo.jpg` | Logo | 71 KB | Mar 31, 2026 | Brand-approved |
| `badge.jpg` | Badge | 88 KB | Mar 31, 2026 | Brand-approved |
| `truck.png` | Photo | 3.8 MB | Apr 2, 2026 | Approved |
| `truck.jpg` | Photo | 231 KB | Mar 31, 2026 | Approved |
| `food-photo.jpg` | Photo | 8.2 MB | Apr 2, 2026 | Food proof |
| `food.png` | Photo | 6.1 MB | Apr 2, 2026 | Food proof |
| `route-615.png` | Branding | 3.2 MB | Apr 2, 2026 | Brand board |
| `route615.jpg` | Branding | 105 KB | Mar 31, 2026 | Brand board |
| `concept.png` | Design | 2.1 MB | Apr 2, 2026 | Brand board |

### Asset Types
- **Logos/Branding:** 7 files (jukes-diner-logo, jd-monogram, logo variants, badge, route-615)
- **Food Photography:** 2 files (food-photo.jpg, food.png) → suitable for `food-proof` content pillar
- **Truck Photos:** 2 files (truck.png, truck.jpg) → suitable for `catering-conversion` / `build-in-public`
- **Concept/Design:** 1 file (concept.png) → brand board reference

### Access Status
- ✅ Full read/write access
- ✅ Already in website build pipeline
- ✅ Version controlled (git)

### Blockers
- **None** — these assets are ready for immediate media hub import

### Recommended Media Hub Mapping
```javascript
// Suggested initial media hub entries for existing assets
{
  id: 'jukes-diner-logo-primary',
  title: 'Juke\'s Diner Primary Logo',
  type: 'logo',
  status: 'approved',
  storagePath: 'public/images/jukes-diner-logo.png',
  tags: ['brand-board', 'logo', 'website'],
  channels: ['website', 'instagram', 'facebook', 'linkedin'],
  owner: 'Brand lead'
}
```

---

## Source #2: macOS Photos Library (Phone Sync)

### Location
- **Path:** `/Users/lexi/Pictures/Photos Library.photoslibrary`
- **Type:** iCloud Photos sync (macOS Photos.app)
- **Status:** ⚠️ Exists but no programmatic access configured

### Asset Types (Likely)
- Phone camera captures (food prep, events, truck operations)
- Event photography (catering setups, customer lines)
- Behind-the-scenes operator content
- Raw video clips (prep routines, service moments)

### Access Status
- ⚠️ **Library exists** but Photos.app API access requires:
  - AppleScript or Photos library export scripts
  - Manual export workflow
  - OR: Third-party tools like `osxphotos` (Python package)

### Blockers
1. **No programmatic API integration** — Photos.app doesn't expose simple CLI/API access
2. **Unknown asset count** — can't inventory without access
3. **No metadata sync** — Photos tags/albums won't automatically map to media hub tags
4. **Permission requirements** — macOS privacy controls may require user approval

### Recommended Next Steps
**Option A: Manual Export Workflow (Quick Start)**
1. Create Albums in Photos.app for each content pillar:
   - "Juke's - Food Proof"
   - "Juke's - Build in Public"
   - "Juke's - Catering Conversion"
   - "Juke's - Franchise Signal"
2. John manually drags relevant photos into albums
3. Export albums → `media/jukes-diner/raw/` or `operator-uploads/`
4. Agent batch-imports with tags based on folder structure

**Option B: Automated Sync (Better Long-Term)**
1. Install `osxphotos` Python package: `pip install osxphotos`
2. Create export script that:
   - Reads Photos library albums/keywords
   - Exports to media hub storage paths
   - Auto-generates media hub JSON entries
   - Respects existing media hub tags/status

**Approval Required:** John needs to choose approach before proceeding

---

## Source #3: Google Drive

### Location
- **Expected:** Google Drive account (unknown folder structure)
- **Status:** ❌ Not found / not mounted

### Investigation Results
- No Google Drive desktop sync detected (`~/Library/CloudStorage/` is empty)
- No `gws` (Google Workspace CLI) or `gdrive` CLI tools installed
- No environment variables for Google Drive API credentials
- No references to Drive in project config files

### Blockers
1. **Unknown if assets exist in Drive** — needs manual check by John
2. **No credentials configured** — would need Google Cloud API key + OAuth setup
3. **No CLI tools installed** — would need `gws` or custom Google Drive API integration

### Recommended Next Steps
1. **Manual Discovery:** John checks Google Drive for Juke's Diner folders
2. **If assets exist:**
   - Document folder structure and asset count
   - Choose sync method:
     - **A:** Install Google Drive Desktop app (auto-sync to `~/Google Drive/`)
     - **B:** Install `gws` CLI tool (load `google-workspace` skill for API-based access)
     - **C:** Manual download → import to media hub
3. **If no Drive assets:** Mark this source as N/A

**Decision Required:** Does John have Juke's Diner media in Google Drive?

---

## Source #4: Notion Pages/Databases

### Location
- **Notion API:** Configured for kanban sync (`NOTION_API_KEY` exists in environment)
- **Status:** ✅ API access working, ⚠️ media references unknown

### Investigation Results
- Notion kanban sync scripts exist (`scripts/notion-kanban-sync.py`)
- API integration functional (used for task sync)
- No known Notion databases specifically for media/assets

### Asset Types (Potential)
- Embedded images in Notion pages (brand docs, meeting notes, planning pages)
- File attachments in Notion databases
- Links to external media (Instagram, Metricool, YouTube)

### Access Status
- ✅ Notion API key configured
- ⚠️ Would need to:
  - Identify which Notion pages/databases contain media
  - Extract embedded images via API
  - Download file attachments
  - Parse external media links

### Blockers
1. **Unknown which Notion pages have media** — needs discovery pass
2. **Embedded images use Notion CDN URLs** — would need to download and re-host locally
3. **No bulk export configured** — Notion API is page-by-page

### Recommended Next Steps
1. **Discovery:** Search Notion workspace for pages with:
   - File/image attachments
   - References to Instagram/Facebook/social posts
   - Brand guidelines or media planning docs
2. **If media found:**
   - Document source pages
   - Create import script to download Notion-hosted images
   - Extract external links for reference tracking
3. **Link parsing:** Create media hub entries that reference external posts (don't duplicate hosted content)

**Approval Required:** Should we scan Notion for media references?

---

## Source #5: Social Media Platforms (Instagram, Facebook, TikTok)

### Location
- **Instagram:** Unknown account (@jukesdiner?)
- **Facebook:** Unknown page/account
- **TikTok:** Unknown account
- **Status:** ❌ No API access configured

### Investigation Results
- No social media API credentials found in environment
- No CLI tools installed (no `instaloader`, `facebook-sdk`, etc.)
- References to "social" in agent roster point to future `jukes-social-agent` (not yet implemented)
- Content calendar exists (`brain/files/content-calendar.md`) but references future workflow, not current assets

### Asset Types (Likely)
- Posted photos/videos (food, events, behind-the-scenes)
- Stories/reels (vertical video content)
- Customer-generated content (tagged posts, reviews)

### Access Status
- ❌ **No API credentials configured**
- ⚠️ **Manual download only** — would require:
  - Account login credentials
  - Third-party scraping tools (e.g., `instaloader` for Instagram)
  - OR: Official API apps (requires developer account setup)

### Blockers
1. **Unknown account handles** — need John to provide
2. **No API access** — would need:
   - Instagram Graph API (requires Facebook Developer account)
   - Facebook Graph API (same requirement)
   - TikTok API (separate developer account)
3. **Rate limits and privacy restrictions** — APIs have strict usage caps
4. **Download vs. reference decision** — should we:
   - Download and re-host all social media assets?
   - OR: Just track references/links in media hub?

### Recommended Next Steps
1. **Account Discovery:** John provides social media account handles
2. **Manual Audit:** John reviews posted content and identifies:
   - Which posts have reusable assets
   - Which assets need to be saved locally
3. **Download Strategy:**
   - **Option A:** Manual download (John saves posts to Photos/Drive)
   - **Option B:** Tool-based scraping (`instaloader` for Instagram backups)
   - **Option C:** API integration (long-term, requires dev accounts)

**Approval Required:** Which social accounts exist, and should we archive posted content?

---

## Source #6: Metricool

### Location
- **Metricool Account:** Unknown if configured
- **Status:** ❌ No integration found

### Investigation Results
- No Metricool API credentials in environment
- No Metricool references in project code or scripts
- Metricool mentioned in task body but no existing integration detected

### Metricool Capabilities (If Account Exists)
- Social media post scheduling and analytics
- Media library (uploaded images/videos)
- Cross-platform content calendar
- Analytics on posted content performance

### Access Status
- ❌ **Unknown if Juke's has Metricool account**
- ⚠️ If account exists:
  - Would need API key (Metricool provides REST API)
  - Could bulk-download media library
  - Could import post metadata/performance data

### Blockers
1. **Unknown if account exists** — needs John confirmation
2. **No API credentials** — would need Metricool login + API key generation
3. **No CLI tools** — would need custom curl-based scripts or API client

### Recommended Next Steps
1. **Confirm account existence:** Does Juke's Diner have a Metricool account?
2. **If yes:**
   - Get API credentials
   - Document media library contents
   - Create import script for Metricool → media hub sync
3. **If no:** Mark source as N/A

**Decision Required:** Does Metricool account exist?

---

## Source #7: Obsidian Vault

### Location
- **Vault Path:** Multiple vault references found via `mdfind`
  - `/Users/lexi/Documents/obsidian-vault` (empty/inaccessible)
  - `/Users/lexi/Documents/Obsidian Vault` (existence unconfirmed)
- **Status:** ⚠️ Vault locations found but no accessible media

### Investigation Results
- Obsidian sync scripts exist (`~/scripts/sync-to-obsidian.sh`)
- Obsidian integration docs exist in project (`brain/OBSIDIAN_KANBAN_INTEGRATION.md`)
- No media/attachments folders detected in vault search

### Asset Types (Potential)
- Markdown-embedded images
- Attachments in notes (PDFs, photos, videos)
- Links to external media sources

### Access Status
- ⚠️ Vault exists but appears empty or permission-restricted
- Would need to:
  - Confirm actual vault location
  - Check `.obsidian/` config for attachments folder
  - Search vault for image references

### Blockers
1. **Vault location unclear** — multiple paths found, none accessible
2. **Unknown attachment structure** — Obsidian vaults can store attachments in various patterns
3. **Permission issues** — macOS privacy controls may block vault access

### Recommended Next Steps
1. **Locate active vault:** Check Obsidian.app settings for current vault path
2. **Search for attachments:**
   ```bash
   find /path/to/vault -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.mp4" \)
   ```
3. **If media found:** Import to media hub with reference to source note

**Manual Check Required:** John to confirm Obsidian vault location and check for media attachments

---

## Source #8: Local Folders (Unstructured)

### Location
- **Home Directory:** `/Users/lexi/`
- **Status:** ⚠️ Not systematically searched

### Potential Locations
- `~/Downloads/` — recent media downloads
- `~/Desktop/` — temporary working files
- `~/Documents/` — project folders, drafts
- `~/Movies/` — video editing outputs
- `~/Pictures/` (outside Photos Library) — exported media

### Blockers
1. **Privacy boundaries** — scanning entire home directory intrusive without approval
2. **Unknown naming conventions** — hard to identify Juke's-specific media
3. **Mixed personal/business content** — risk of importing wrong files

### Recommended Next Steps
1. **Targeted search only** — with John's approval, search for:
   - Recent (last 6 months) image/video files in `~/Downloads/`
   - Folders with "juke" or "diner" in name
2. **Manual review required** — John should identify relevant files before import

**Approval Required:** Should we search home directory for Juke's media?

---

## Access Blockers Summary

| Source | Status | Primary Blocker | Resolution Path |
|--------|--------|-----------------|-----------------|
| **Local project assets** | ✅ Ready | None | Import immediately |
| **Photos Library** | ⚠️ Blocked | No API access | Install `osxphotos` OR manual export |
| **Google Drive** | ❌ Unknown | Unknown if assets exist | John to confirm + provide credentials |
| **Notion** | ⚠️ Partial | Unknown media locations | Discovery scan needed |
| **Social Media** | ❌ Blocked | No credentials + unknown accounts | John provides handles + API keys |
| **Metricool** | ❌ Unknown | Unknown if account exists | John to confirm |
| **Obsidian** | ⚠️ Blocked | Vault location unclear | John to provide path |
| **Local folders** | ⚠️ Blocked | Privacy approval needed | John to approve search scope |

---

## Safe Import Plan

### Phase 1: Immediate (Zero-Blocker Assets)

**Goal:** Populate media hub with existing approved assets in `public/images/`

**Steps:**
1. ✅ Create `data/media-hub.json` from default schema
2. ✅ Map 12 existing `public/images/` files to media hub entries:
   - Logos → `approved-assets` category, `brand-board` tags
   - Food photos → `approved-assets`, `food-proof` tags
   - Truck photos → `approved-assets`, `catering-conversion` + `build-in-public` tags
3. ✅ Set all existing assets to `status: 'approved'` (already in production use)
4. ✅ Preserve original paths (no file moves required)
5. ✅ Generate initial media hub stats (12 approved assets)

**No Risk:** All assets already in git, no moves/deletes/edits required.

**Output:** Working media hub with baseline brand assets searchable and tagged.

---

### Phase 2: Photos Library Integration (Operator Capture)

**Goal:** Import phone camera captures (food, events, operations) to media hub

**Prerequisite Decision:**
- [ ] John chooses: Manual export OR automated sync (`osxphotos`)

**Option A: Manual Export (Faster Setup)**
1. John creates Albums in Photos.app:
   - "Juke's - Food Proof"
   - "Juke's - Catering Conversion"
   - "Juke's - Build in Public"
   - "Juke's - Franchise Signal"
2. John drags relevant photos into albums (10-20 photos per album to start)
3. Export Albums → `media/jukes-diner/raw/` (preserves metadata)
4. Agent creates media hub entries:
   - `status: 'needs-tags'` (imported but not yet reviewed)
   - `owner: 'Operator'` (phone captures)
   - Initial tags based on folder structure
5. John reviews via media hub UI, approves/rejects

**Option B: Automated Sync (Better Long-Term)**
1. Install `osxphotos`: `pip install osxphotos`
2. Create export script:
   ```bash
   osxphotos export media/jukes-diner/raw/ \
     --album "Juke's - Food Proof" \
     --keyword-template "{keyword}" \
     --directory "{album}"
   ```
3. Run weekly via cron or manual trigger
4. Agent auto-generates media hub entries from exports
5. John reviews and promotes to `approved-assets`

**No Risk:** All actions are copy-based (no modifications to Photos Library).

**Output:** 40-100 additional assets in media hub (raw captures ready for tagging/approval).

---

### Phase 3: Cloud/Social Integration (If Assets Exist)

**Goal:** Import assets from Drive/Notion/Social if they exist and are accessible

**Prerequisites:**
- [ ] John confirms which sources have Juke's media
- [ ] John provides credentials for confirmed sources

**Safe Import Pattern (Apply to All Sources):**
1. **Discovery First:** List/search remote source for Juke's media (read-only)
2. **Manual Review:** John reviews list, marks items to import
3. **Download to Local:** Copy assets to `media/jukes-diner/operator-uploads/` or `raw/`
4. **Generate Metadata:** Create media hub entries with:
   - `status: 'needs-approval'` (not yet reviewed)
   - Original source URL in metadata (for reference/auditing)
   - Initial tags based on source context (e.g., Instagram posts → `instagram` tag)
5. **No Modifications:** Never delete, edit, or re-post originals

**Per-Source Notes:**

**Google Drive (If Exists):**
- Install Google Drive Desktop OR `gws` CLI tool
- Search for "Juke's Diner" folders
- Download to `operator-uploads/`
- Track Drive file IDs in media hub metadata

**Notion (If Media Found):**
- Run discovery query for pages with attachments
- Download Notion-hosted images
- Extract external links → create "reference" entries (no download)
- Tag with source page title

**Social Media (If Accounts Exist):**
- Get account handles from John
- Download posted content via:
  - Instagram: `instaloader --login=USERNAME --fast-update --no-videos PROFILE`
  - Facebook: Manual export OR Graph API
  - TikTok: Manual download (no good CLI tools)
- Import downloads to `raw/` with `status: 'needs-tags'`
- Store post URLs in metadata for reference

**Metricool (If Account Exists):**
- Get API credentials
- List media library via API
- Download assets not already in media hub
- Import post metadata (dates, platforms, performance)

**No Risk:** All cloud/social operations are read-only downloads. Originals remain untouched.

**Output:** Comprehensive media hub with assets from all confirmed sources.

---

## Media Hub Storage Structure (Proposed)

```
media/jukes-diner/
├── raw/                          # Phone captures, unprocessed uploads
│   ├── 2026-05-08-burger-prep.jpg
│   ├── event-line-vertical.mp4
│   └── ...
├── operator-uploads/             # Field uploads needing triage
│   ├── catering-table-spread.jpg
│   ├── trailer-park-night-sign.jpg
│   └── ...
├── approved/                     # Polished, reusable assets
│   ├── hero-burger-closeup.jpg
│   ├── loaded-fries-tray.jpg
│   └── ...
└── brand-board/                  # Visual references, palette, typography
    ├── palette-reference.png
    ├── typography-examples.pdf
    └── ...
```

**Migration from `public/images/`:**
- **Option A:** Leave existing assets in `public/images/`, reference them in media hub (no moves)
- **Option B:** Copy to `media/jukes-diner/approved/`, update website references (preserves originals)

**Recommendation:** Option A for now (zero-risk). Move to Option B when media hub UI is fully built.

---

## Implementation Checklist

### Immediate (No Approvals Required)
- [ ] Create `data/media-hub.json` with default schema
- [ ] Import 12 existing `public/images/` assets to media hub
- [ ] Verify media hub stats show 12 approved assets
- [ ] Document import in git commit

### Pending John's Decisions
- [ ] **Photos Library:** Manual export OR `osxphotos` automation?
- [ ] **Google Drive:** Do Juke's media assets exist in Drive?
- [ ] **Social Media:** What are the account handles? Download posts?
- [ ] **Metricool:** Does account exist? Get API credentials?
- [ ] **Obsidian:** Confirm vault path, check for attachments
- [ ] **Local folders:** Approve search of Downloads/Desktop/Documents?

### Recommended Next Card (After This Task)
**Title:** "Populate media hub with Phase 1 assets (public/images)"  
**Assignee:** `jukes-ops-agent`  
**Body:** Create `data/media-hub.json`, import 12 approved brand/food/truck assets from `public/images/`, generate stats, verify tests pass.

---

## Appendices

### A. Media Hub Schema Reference

See: `/Users/lexi/projects/jukes-diner-website/lib/media-hub.mjs`

**Key Fields:**
- `id` — Unique slug (e.g., `hero-burger-closeup`)
- `title` — Human-readable name
- `type` — `photo`, `video`, `logo`, `image`
- `status` — `approved`, `needs-approval`, `needs-tags`
- `storagePath` — Relative path from project root
- `tags` — Array (e.g., `['food-proof', 'burger', 'menu']`)
- `channels` — Where asset can be used (e.g., `['website', 'instagram']`)
- `owner` — Who uploaded/owns the asset

### B. Content Pillars (From Media Hub Schema)

1. **food-proof** — Make the product craveable and instantly bookable
2. **build-in-public** — Show John building systems and a franchise-able model
3. **catering-conversion** — Turn event/social proof into catering leads
4. **franchise-signal** — Teach the business model and attract future operators

### C. Brand Voice Rules (From Media Hub Schema)

- Retro diner energy without becoming costume-y or fake nostalgic
- Operator-real: show the work, the systems, the prep, and the service moments
- Food first: make burgers, fries, catering trays, and events feel craveable and bookable
- Use plain-spoken confidence; avoid agency jargon and generic influencer language

---

**End of Media Source Map**
