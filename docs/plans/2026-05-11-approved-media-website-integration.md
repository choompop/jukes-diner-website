# Approved Media Website Integration Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task after John approves the asset slate. This plan is a build plan only; do not publish, deploy, email, share, delete, move, or expose any Drive/media files without explicit approval.

**Goal:** Integrate curated, approved Drive/media-hub assets into the public Juke's Diner site by slot, while preserving privacy, consent, performance, accessibility, and booking conversion.

**Architecture:** Treat Kanban + the media hub as the approval source of truth, then promote only approved website-safe derivatives into a small website gallery/data structure. Public pages read stable local JSON/typed data that references optimized derivatives under `public/images/website/` or mock placeholder assets until John approves real assets.

**Tech Stack:** Next.js App Router, React server components, node:test, local JSON manifests, existing media hub data in `data/media-hub.json`, existing placement rules in `data/website-content-placement-map.json`, and public assets under `public/images/`.

---

## Source inputs and current constraints

- Kanban source task: `t_fa51bcd1`.
- Parent placement map task: `t_ae49cd0b`.
  - Files in this repo: `data/website-content-placement-map.json`, `docs/website-media-placement-map.md`, `app/dashboard/marketing/page.tsx`, `tests/website-content-placement-map.test.mjs`.
  - The map defines 9 curated slots and explicitly says this is not a Drive dump.
- Parent Drive tagging dry-run task: `t_9fca4643`.
  - Artifacts in dashboard repo: `/Users/lexi/Projects/jukes-dashboard/ops/drive-tagging-dry-run/drive_tagging_manifest.json`, `.csv`, and `drive_tagging_review_queue.md`.
  - Dry-run count summary: 1,497 inventory rows; 1,480 require human review; 1,068 are restricted/do-not-publish; 922 duplicate candidates.
  - Most UGC requires rights_review_required and consent_review_required, so Drive inventory must not be directly promoted to the public site.
- Current website-approved local baseline:
  - `data/media-hub.json` has 12 existing public assets already used by the site and marked `status: approved`.
  - `ASSET_IMPORT_LOG.md` documents that those files stayed in `public/images/` and no file moves occurred.
- Public website files likely touched during implementation:
  - `app/page.tsx`
  - `app/menu/page.js`
  - `app/book/page.js`
  - `app/find-us/page.js`
  - `app/about/page.js` if/when staff/story assets are approved
  - `lib/constants.js`
  - new `data/website-gallery.json`
  - new `lib/website-gallery.mjs`
  - new tests under `tests/`

## Non-negotiable guardrails

- Use only assets marked approved, website-approved, brand-safe, and public-safe/public-ok in the media hub or assets that John explicitly approved in Kanban.
- If a real asset does not yet have approval metadata, use a clearly labeled mock placeholder or copy-only fallback; do not infer approval from a filename, folder, or Drive location.
- Do not publish, deploy, share, move, delete, rename, or expose Google Drive originals.
- Never auto-sync raw Drive folders to the website.
- Never auto-sync social accounts, captions, comments, or embeds into the site.
- Do not publish private docs, customer/vendor PII, invoices, contracts, payment details, private addresses, Slack/email screenshots, license plates, minors, or identifiable faces without documented approval and consent.
- Public pages must show curated assets by conversion slot, not a giant gallery.
- Every promoted asset must retain a content-board link back to its content/approval record and Kanban task provenance.

## Gallery and data structure

Create `data/website-gallery.json` as the public website placement manifest. It should be intentionally smaller than `data/media-hub.json`: only approved website placements, not the entire media inventory.

Planned top-level shape:

```json
{
  "version": 1,
  "updatedAt": "2026-05-11",
  "sourceOfTruth": "Hermes Kanban + media hub approval status",
  "slots": [
    {
      "slotId": "hero",
      "pageTargets": ["/", "/book"],
      "maxItems": 1,
      "items": [
        {
          "assetId": "mock-hero-truck-placeholder",
          "mediaHubAssetId": null,
          "title": "Mock hero truck placeholder",
          "status": "mock-placeholder",
          "websiteApprovedAt": null,
          "approvedBy": null,
          "consentStatus": "not-applicable-placeholder",
          "rightsStatus": "not-applicable-placeholder",
          "altText": "Illustrated Juke's Diner truck placeholder for the homepage hero.",
          "caption": "Book the truck for events, catering, and late-night food service.",
          "originalSource": "mock-placeholder",
          "optimizedSrc": "/images/jd-monogram.png",
          "width": 1200,
          "height": 900,
          "format": "png",
          "slotId": "hero",
          "tags": ["mock-placeholder", "hero", "booking-cta"],
          "kanbanTaskId": "t_fa51bcd1",
          "contentCardId": "content-board:website-hero-placeholder",
          "notes": "Replace only after John approves a real hero asset."
        }
      ]
    }
  ]
}
```

Planned schema fields for each item:

- `assetId`: public website placement id, stable across page code.
- `mediaHubAssetId`: source media-hub asset id when real; null for mock placeholder.
- `title`: internal operator title.
- `status`: `website-approved`, `approved`, or `mock-placeholder`; reject anything else for public rendering.
- `websiteApprovedAt`: ISO date/time when John or brand lead approved public placement.
- `approvedBy`: `john`, `brand-lead`, or `mock-placeholder`/null while waiting.
- `consentStatus`: `cleared`, `not-required`, `faces-obscured`, or placeholder state.
- `rightsStatus`: `owned`, `licensed`, `platform-embed-ok`, `mock-placeholder`, or `needs-review`.
- `altText`: human-written alt text; never filename-only.
- `caption`: optional customer-facing caption that supports booking, food proof, or trust.
- `originalSource`: Drive file id, media hub source, social URL, or placeholder label; do not expose this on public pages if sensitive.
- `optimizedSrc`: local public derivative path or existing approved public image path.
- `width`, `height`, `format`: required for image sizing and performance planning.
- `slotId`: one of the placement map slots.
- `tags`: must include the slot's required tags before real public use.
- `kanbanTaskId`: source Kanban approval/build task id.
- `contentCardId`: content-board record id or content-card file slug for traceability.
- `notes`: internal-only explanation for placeholders or replacement criteria.

Add `lib/website-gallery.mjs` with helpers:

- `readWebsiteGallery()` reads `data/website-gallery.json`.
- `getWebsiteSlot(gallery, slotId)` returns one slot by id.
- `getWebsiteSlotItems(gallery, slotId)` returns approved or mock-placeholder items only.
- `validateWebsiteGallery(gallery, placementMap)` enforces allowed statuses, required fields, slot ids, approval metadata, and no raw Drive/private paths in `optimizedSrc`.

## Slot-by-slot integration rows

| Slot id | First public page target | Real asset requirement before launch | Initial safe fallback | Implementation note |
|---|---|---|---|---|
| `hero` | `/`, `/book` | One horizontal truck/event/food hero with `approved`, `website-approved`, `brand-safe`, `public-safe`, `hero`, `truck`, `booking-cta`; explicit John approval. | `jd-monogram.png` or a purpose-built mock placeholder. | Replace homepage logo card only after the hero asset is approved; keep booking CTA visible above fold. |
| `menu-highlights` | `/`, `/menu` | 4-6 food images mapped to actual menu items with item names, prices, and availability confirmed. | Existing `food.png` / `food-photo.jpg` only because they are already in public use; otherwise mock food placeholder. | Preserve `alt={item.name}` until richer `altText` exists per item. |
| `catering-private-events` | `/book`, `/` | Event setup/tray/service proof with cleared venue/client/faces and `catering-conversion` tags. | Copy-only proof block, no identifiable people. | Add near booking CTA, not below low-conversion gallery clutter. |
| `truck` | `/find-us`, `/book`, `/` | Clean truck exterior/service-window shot with license plates and private addresses removed/obscured. | Existing `truck.jpg` or `truck.png` only if still brand-approved; otherwise no image. | Use as trust proof next to route or event copy. |
| `staff-story` | `/about`, `/apply` | Founder/team/operator image with permission and no confidential dashboards/SOPs visible. | Copy-only story card. | Do not publish internal system screenshots. |
| `dining-room-social-proof` | `/`, `/book`, `/find-us` | Customer/event proof with consent, review source permission, and no minors/faces without clearance. | Anonymous quote cards or operational stats only. | Use near booking form to reduce buyer hesitation. |
| `instagram-tiktok-embeds-gallery` | `/social`, `/`, `/book` | 6-9 approved embeds/static thumbnails with `embed-ok`, performance review, and brand-safe comments/captions. | Static links to official social profiles or no block. | Never show an endless third-party feed. |
| `press-reviews` | `/`, `/book`, `/about` | Accurate reusable quote/source URL with permission to quote and no altered meaning. | Generic trust copy until a verified quote exists. | Keep source URL internally in `contentCardId`/metadata; public page can show source name only when allowed. |
| `seasonal-campaigns` | `/`, `/menu`, `/book`, `/find-us` | Date-bounded campaign asset with confirmed menu/pricing/event details and removal date. | No block unless active campaign exists. | Add expiry tests so stale campaigns are not left live. |

## Optimization strategy

- Store original Drive/media-hub files privately; create web derivatives only after approval.
- Derivative path convention: `public/images/website/{slotId}/{assetId}.{webp|jpg|png}`.
- Do not put raw Drive file ids, private folder names, private customer names, or sensitive source paths in public URLs.
- Preferred image widths:
  - hero: 1600w and 960w variants; crop 16:9 or 4:3 depending layout.
  - card/gallery: 800w and 480w variants; fixed aspect ratio.
  - thumbnail/social: 640w max.
- Use `next/image` when converting the public pages to optimized image rendering, but do not block this plan on a full image-component migration if current `<img>` tests need incremental updates.
- Target per-image derivative size:
  - hero under 300 KB where possible.
  - cards under 180 KB.
  - thumbnails under 100 KB.
- Provide width/height or CSS aspect-ratio to prevent layout shift.
- Keep gallery blocks small: hero max 1, menu max 6, social gallery max 9, seasonal max active campaign only.
- Add a build/test gate that rejects public `optimizedSrc` values containing `/My Drive/`, `drive.google.com`, raw `media/jukes-diner/raw`, `operator-uploads`, or `needs-review`.

## Alt text policy

- Every real item needs manually reviewed `altText` before public rendering.
- Good alt text describes the visible subject and business purpose: "Juke's Diner food truck serving guests at a Nashville private event."
- Avoid filename-only, keyword stuffing, fake claims, or details not visible in the image.
- If the image is decorative and duplicated by nearby text, mark it decorative in the component with empty alt only after an accessibility review.
- Menu item images can use item names as a minimum fallback, but the target state is specific alt text per approved asset.
- Social/UGC images need neutral, consent-safe alt text; do not identify people by name unless explicitly approved.

## Consent checks

Before any real asset can move from media hub/Drive into `data/website-gallery.json` as `status: website-approved`, verify:

1. Rights/source: owned by Juke's, licensed, or platform embed terms allow reuse.
2. People: faces cleared, faces obscured, or not identifiable.
3. Minors: no minors unless guardian permission is documented; default is no minors.
4. Location/privacy: no private addresses, license plates, customer homes, contract details, or permit-sensitive info visible.
5. Brand safety: no messy prep, unsafe operations, clutter that undermines trust, or off-brand context.
6. Accuracy: food/menu item, availability, campaign dates, and event claims are true.
7. Approval: John or brand lead explicitly approved website placement for that slot, not just general storage.
8. Provenance: `kanbanTaskId` and `contentCardId` recorded.

## Content-board links

Use content-board links to make each public asset traceable. Until a dedicated content-board table/API exists, store the reference as a stable string in `contentCardId` and document the source in the related Kanban card/comment.

Recommended link patterns:

- Kanban approval/build task: `kanban:t_fa51bcd1`.
- Placement map source: `kanban:t_ae49cd0b`.
- Drive tagging dry-run source: `kanban:t_9fca4643`.
- Website slot content card: `content-board:website-slot:{slotId}:{assetId}`.
- Existing markdown content card when relevant: `content-cards/{slug}.md`.
- Media hub source asset: `media-hub:{mediaHubAssetId}`.

Minimum implementation rule: public page code should not need content-board links, but every record in `data/website-gallery.json` must carry `kanbanTaskId` and `contentCardId` for review/audit.

## Implementation tasks

### Task 1: Add gallery manifest tests

**Objective:** Lock the public-site asset safety contract before adding any page rendering.

**Files:**
- Create/modify: `tests/website-gallery.test.mjs`
- Read: `data/website-content-placement-map.json`
- Read: future `data/website-gallery.json`

**Step 1: Write failing tests**

Add tests that require:

- all gallery `slotId` values exist in `data/website-content-placement-map.json`.
- every item has `assetId`, `slotId`, `status`, `altText`, `optimizedSrc`, `kanbanTaskId`, and `contentCardId`.
- allowed statuses are only `website-approved`, `approved`, or `mock-placeholder`.
- real items need `websiteApprovedAt`, `approvedBy`, `consentStatus`, and `rightsStatus`.
- public `optimizedSrc` must start with `/images/` and must not contain Drive/raw/private paths.

Run: `node --test tests/website-gallery.test.mjs`
Expected: FAIL because `data/website-gallery.json` and helpers do not exist yet.

**Step 2: Commit after red if desired**

```bash
git add tests/website-gallery.test.mjs
git commit -m "test: define website gallery approval contract"
```

### Task 2: Create the minimal placeholder gallery manifest

**Objective:** Create safe placeholder records that satisfy the schema without publishing unapproved Drive media.

**Files:**
- Create: `data/website-gallery.json`
- Create/modify: `lib/website-gallery.mjs`
- Test: `tests/website-gallery.test.mjs`

**Step 1: Implement minimal data**

Create one safe placeholder/fallback per slot, using only already-public assets like `/images/jd-monogram.png`, `/images/food.png`, `/images/truck.jpg`, or copy-only placeholder semantics.

**Step 2: Implement validation helpers**

`lib/website-gallery.mjs` should load and validate the manifest, returning no raw inventory.

**Step 3: Run tests**

Run: `node --test tests/website-gallery.test.mjs tests/website-content-placement-map.test.mjs tests/menu-image-assets.test.mjs`
Expected: PASS.

**Step 4: Commit**

```bash
git add data/website-gallery.json lib/website-gallery.mjs tests/website-gallery.test.mjs
git commit -m "feat: add approval-gated website gallery manifest"
```

### Task 3: Wire homepage/menu/book slots without changing launch safety

**Objective:** Make public pages consume the curated gallery layer while keeping current safe copy and fallbacks.

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/menu/page.js`
- Modify: `app/book/page.js`
- Modify/add tests: `tests/public-website.test.mjs`, `tests/menu-image-assets.test.mjs`, `tests/website-gallery.test.mjs`

**Step 1: Write failing page tests**

Assert homepage and menu render only approved or mock placeholder gallery assets and keep Book the Truck CTAs visible.

**Step 2: Implement minimal reads**

Use gallery helpers to read slot records server-side. Keep current visual layout unless a real approved asset exists.

**Step 3: Run tests**

Run: `node --test tests/public-website.test.mjs tests/menu-image-assets.test.mjs tests/website-gallery.test.mjs`
Expected: PASS.

**Step 4: Commit**

```bash
git add app/page.tsx app/menu/page.js app/book/page.js tests/public-website.test.mjs tests/menu-image-assets.test.mjs tests/website-gallery.test.mjs
git commit -m "feat: read approved website gallery slots on public pages"
```

### Task 4: Add optimization and privacy regression tests

**Objective:** Prevent future workers from accidentally exposing raw Drive/private media or oversized gallery dumps.

**Files:**
- Create/modify: `tests/website-gallery-privacy.test.mjs`
- Create/modify: `tests/website-gallery-performance.test.mjs`

**Step 1: Write tests**

Assert:

- no `optimizedSrc` contains `drive.google.com`, `/My Drive/`, `raw`, `operator-uploads`, `needs-review`, `private`, `invoice`, `contract`, or `slack`.
- each slot stays under its planned max item count.
- every image item has `width` and `height`.
- every seasonal item has `startDate`/`endDate` or is not rendered.

**Step 2: Run tests**

Run: `node --test tests/website-gallery-privacy.test.mjs tests/website-gallery-performance.test.mjs`
Expected: FAIL until helper/data rules are added.

**Step 3: Implement rules**

Add validation in `lib/website-gallery.mjs` and manifest metadata where needed.

**Step 4: Run tests again**

Expected: PASS.

### Task 5: Browser QA before any deployment request

**Objective:** Verify the public pages work locally and stay launch-safe.

**Files:**
- No deployment files.
- Optional QA note: `docs/qa/website-approved-media-gallery-qa.md`

**Step 1: Build**

Run: `npm run build`
Expected: PASS. Existing unrelated warnings must be documented if present.

**Step 2: Local browser QA**

Run: `npm run dev` on an available local port.

Check:

- `/` hero, menu highlights, booking CTA, and proof section.
- `/menu` image grid and alt behavior.
- `/book` event/catering copy and no unapproved event images.
- `/find-us` truck/route fallback if touched.
- no console errors.
- no network requests to raw Drive assets.

**Step 3: Do not deploy**

Stop at verified local QA. Create/complete Kanban handoff requesting John approval for real asset replacement and publication.

## Verification commands for implementer

Use targeted tests first:

```bash
node --test tests/website-asset-integration-plan.test.mjs
node --test tests/website-content-placement-map.test.mjs tests/menu-image-assets.test.mjs
```

Then run broader checks:

```bash
npm test
npm run build
```

Browser QA should be local only. Do not publish externally or deploy `dashboard.jukesdiner.com` / public website changes without explicit John approval.

## John approval needed before real asset swap

Before replacing placeholders with real Drive/media assets, John or the brand lead must approve:

- final hero asset,
- final menu highlight images,
- any people/customer/event images,
- any third-party embeds or quotes,
- any seasonal campaign art and removal date,
- whether a public gallery should exist at all or stay as small per-page proof slots.

Until then, the implementation should use approved existing public assets or mock placeholder records only.
