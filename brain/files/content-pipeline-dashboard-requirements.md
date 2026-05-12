# Content Pipeline Dashboard Requirements

**Version:** 1.0.0  
**Created:** 2026-05-08  
**Owner:** jukes-editor  
**Approved By:** _Pending John review_

---

## Purpose

The content pipeline dashboard consolidates content ideation, capture requests, approvals, repurposing, scheduling, brand QA, and Metricool handoff into one operational interface. This replaces scattered Notion tasks, DMs, and manual follow-up with a structured workflow that keeps John, the team, and Flo agent aligned on what content ships when.

## Context from Memory & Notion

### LSM Underdelivery
Notion tasks reveal LSM (contractor) underperformed and requires termination. Outstanding items:
- "Get final batch of content from LSM before firing"
- "Strip LSM of all platform permissions"
- "Fire LSM — send formal termination email"

**Dashboard implication:** The content pipeline must be operable without LSM dependency. Ownership assignments should clearly flag where external contractors vs. internal team vs. Flo agent handle work.

### TikTok/Franchise Story Context
The franchise brain file (`data/franchise-brain.json`) describes a **Weekly Content Calendar** item owned by Marketing Lead that "turns captured moments into a five-post plan across TikTok, Instagram, and local promos."

Inputs: Story hooks, promo windows, upcoming bookings  
Outputs: Posting schedule, asset requests, CTA list

**Dashboard implication:** Content ideas must link to capture sources (shift recaps, phone photos, customer quotes) and output to platform-specific schedules.

### Blacklight & Justin Harris Meetings
Notion tasks reference "Prep for Coffee chat w/ Tyler — Blacklight" and "Prep for Justin Harris meeting." These appear to be external partnership/vendor meetings.

**Dashboard implication:** If Blacklight or Justin Harris are connected to content production (e.g., editors, videographers, creative partners), the dashboard should support external editor assignments and asset handoff tracking.

### Brand Foundation Reference
The brand foundation document (`brain/files/brand-foundation.md`) establishes:
- Voice: Warm, useful, diner-counter charming (Flo persona)
- Quality checklist for copy review
- Dashboard design principles (clarity over charm, action-oriented, status visibility)

**Dashboard implication:** Brand QA step must reference the Copy Review Checklist and Design Review Checklist from the brand foundation.

---

## Dashboard Scope

### In Scope
1. **Content Ideas** — Capture, tag, prioritize, and route ideas.
2. **Capture Requests** — Prompt operators to log photos, videos, customer stories daily.
3. **Approvals** — John/Founder approval gate before publishing.
4. **Repurposing** — Track content variations (e.g., TikTok version → Instagram reel → LinkedIn insight).
5. **Owners & Assignments** — Clear owner per task (John, Marketing Lead, Content Editor, Catering Response Owner, Flo, External Editor).
6. **Due Dates** — Enforce weekly rhythm and publishing schedule.
7. **Brand QA** — Pre-publish quality gate using brand foundation checklist.
8. **Metricool Handoff** — Schedule approved content into Metricool for publishing.

### Out of Scope
- Posting or publishing content directly (handled by Metricool).
- Building the actual dashboard UI/UX (this doc defines requirements only).
- Creating new content strategy beyond the referenced pipeline requirements.
- Analytics/performance measurement (separate from the pipeline; handled in the social dashboard).

---

## Workflow Stages

### Stage 1: Idea Capture
**Owner:** Anyone (John, team, Flo, customers)  
**Input:** Observation, customer moment, business lesson, menu update, event recap  
**Action:** Log idea with:
- Title/hook
- Source (shift recap, customer quote, vendor story, business insight)
- Category (Raw Build-in-Public, Food Proof, Catering Conversion, Franchise Signal)
- Suggested channels (TikTok, Instagram, Facebook, LinkedIn, Website)
- Status: `idea`

**Output:** Idea record in dashboard

---

### Stage 2: Capture Request Assignment
**Owner:** Marketing Lead / Ops Lead  
**Input:** Idea approved for production  
**Action:** Convert idea into capture request:
- Assign to operator/shift lead/John
- Specify needed assets (photo, video, quote, location, data)
- Set capture deadline (e.g., "by Friday close")
- Status: `capture-requested`

**Output:** Capture task with due date and owner

---

### Stage 3: Asset Collection & Draft
**Owner:** Content Editor, Flo (drafting), or External Editor  
**Input:** Captured raw assets (photos, clips, notes)  
**Action:**
- Upload/link raw assets
- Draft caption/script
- Tag repurpose opportunities (e.g., "this clip works for TikTok + Instagram")
- Add CTA from offer library
- Status: `draft`

**Output:** Draft with assets ready for review

---

### Stage 4: Brand QA
**Owner:** jukes-editor  
**Input:** Draft content  
**Action:** Review against brand foundation checklist:
- [ ] Voice sounds like Flo (warm, clear, useful)
- [ ] Next step is explicit (CTA, follow-up action)
- [ ] No vague promises or corporate fog
- [ ] Facts are sourced (menu, pricing, availability)
- [ ] Tone matches context (public vs. internal vs. customer)
- [ ] Retro accents enhance, don't overwhelm (for visual content)

**Decision:**
- **Pass:** Move to approval queue
- **Revise:** Return to Content Editor with notes
- Status: `qa-pass` or `qa-revise`

**Output:** QA-approved draft or revision notes

---

### Stage 5: Founder Approval
**Owner:** John  
**Input:** QA-passed draft  
**Action:** Review offers, visuals, franchise talking points  
**Decision:**
- **Approve:** Move to scheduling
- **Reject:** Return with feedback or archive
- Status: `approved` or `rejected`

**Output:** Approved content ready for scheduling

---

### Stage 6: Scheduling & Repurposing
**Owner:** Marketing Lead / Content Editor  
**Input:** Approved content  
**Action:**
- Set publish date/time
- Assign to channel(s) (TikTok, Instagram, Facebook, LinkedIn)
- Create repurposed variants if needed (e.g., 60s TikTok → 30s Instagram reel)
- Status: `scheduled`

**Output:** Publishing schedule (daily/weekly view)

---

### Stage 7: Metricool Handoff
**Owner:** Content Editor / Flo automation  
**Input:** Scheduled content with publish date/time  
**Action:**
- Upload assets to Metricool
- Set platform-specific details (caption, hashtags, CTA)
- Confirm scheduled in Metricool planner
- Status: `in-metricool`

**Output:** Content live in Metricool publishing queue

**Note:** This is the final step before the social dashboard takes over for monitoring, analytics, and lead response.

---

## Data Model

### Content Item
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `title` | string | Short hook or headline |
| `category` | enum | `raw-build`, `food-proof`, `catering-conversion`, `franchise-signal` |
| `channels` | array | `tiktok`, `instagram`, `facebook`, `linkedin`, `website` |
| `status` | enum | `idea`, `capture-requested`, `draft`, `qa-pass`, `qa-revise`, `approved`, `rejected`, `scheduled`, `in-metricool`, `published` |
| `source` | string | Where the idea came from (shift recap, customer quote, business insight, etc.) |
| `owner` | string | Current assignee (John, Marketing Lead, Content Editor, jukes-editor, Flo, External Editor) |
| `created_at` | datetime | When idea was logged |
| `due_date` | datetime | When asset/draft is due |
| `publish_date` | datetime | Scheduled publish time |
| `assets` | array | Links/paths to photos, videos, clips |
| `draft_caption` | text | Caption/script text |
| `cta` | string | Call to action from offer library |
| `qa_notes` | text | Brand QA feedback |
| `approval_notes` | text | John's approval or rejection reason |
| `metricool_id` | string | Metricool post ID once scheduled |
| `repurpose_parent` | string | ID of original content if this is a variant |
| `repurpose_children` | array | IDs of variants created from this content |

### Capture Request
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `content_id` | string | Parent content item |
| `assigned_to` | string | Operator, shift lead, or John |
| `asset_type` | enum | `photo`, `video`, `quote`, `location`, `data` |
| `instructions` | text | What to capture and why |
| `due_date` | datetime | Capture deadline |
| `status` | enum | `requested`, `captured`, `missed` |
| `delivered_assets` | array | Links/paths once captured |

---

## Roles & Ownership

| Role | Responsibilities |
|------|------------------|
| **Founder (John)** | Approves all content before publishing; captures raw founder/business stories for TikTok/LinkedIn |
| **Marketing Lead** | Converts ideas into capture requests; manages weekly content calendar; assigns editing/scheduling tasks |
| **Content Editor** | Drafts captions/scripts; edits raw assets; creates repurposed variants; schedules into Metricool |
| **jukes-editor** | Brand QA against voice and design foundation; ensures consistency and quality before approval |
| **Catering Response Owner** | Ensures catering-conversion content aligns with lead qualification workflow |
| **Flo Agent** | Drafts captions based on intake prompts; reminds owners of due dates; logs performance feedback |
| **External Editor (if applicable)** | Video editing, professional photography, or specialized creative work (e.g., Blacklight, Justin Harris) |

**Note:** Current team structure has placeholders. Replace role names as real operators are assigned.

---

## Weekly Rhythm

Aligned with the existing content calendar (`brain/files/content-calendar.md`):

| Day | Channel | Owner | Deliverable |
|-----|---------|-------|-------------|
| **Monday** | Website | John / Catering lead | Catering/conversion asset |
| **Tuesday** | TikTok | Founder camera capture | Raw build-in-public operator story |
| **Wednesday** | Instagram | Content editor | Food proof or catering reel |
| **Thursday** | Facebook | Community manager | Local community/event schedule |
| **Friday** | LinkedIn | John | Founder/business/franchise lesson |

**Dashboard requirement:** Weekly view showing what's scheduled, what's missing, and what's blocked.

---

## Flo Intake Prompts

From `content-calendar.md`, Flo should ask:
1. **What happened?** — Capture the story/moment
2. **Why does it matter to customers/operators?** — Frame the value
3. **Is there a photo/video?** — Asset check
4. **What CTA should be attached?** — Offer library reference

**Dashboard requirement:** Intake form template for Flo to log new ideas with these fields pre-populated.

---

## Integration Points

### 1. Metricool
**Purpose:** Publish approved content to social channels  
**Connection:** See `METRICOOL_CONNECTION_CHECKLIST` from `lib/social-dashboard.mjs`
- Metricool API key, user ID, brand ID
- Profile map for TikTok, Instagram, Facebook, LinkedIn, Website
- Dashboard API route to normalize Metricool data
- Slack webhook for notifications

**Dashboard handoff:** Once content is `approved` and `scheduled`, Flo or Content Editor uploads to Metricool planner with:
- Platform-specific caption/hashtags
- Publish date/time
- Assets (photo/video files)

**Status update:** Once confirmed in Metricool, mark content as `in-metricool`.

### 2. Offer Library
**Purpose:** Ensure CTAs are pre-approved and aligned with lead qualification  
**Reference:** `brain/files/offer-library.md`

Approved CTAs:
- "Book Juke's for your next event."
- "Ask us about catering trays."
- "Tell us your date, headcount, and location."

**Dashboard requirement:** Dropdown or autocomplete for CTA selection during drafting.

### 3. Brand Foundation
**Purpose:** QA checklist reference  
**Reference:** `brain/files/brand-foundation.md`

Copy Review Checklist (from brand foundation):
- [ ] Voice sounds like Flo (warm, clear, useful)
- [ ] Next step is explicit (CTA, follow-up action)
- [ ] No vague promises or corporate fog
- [ ] Facts are sourced (menu, pricing, availability)
- [ ] Tone matches context (public vs. internal vs. customer)

Design Review Checklist (for visual content):
- [ ] Color contrast meets accessibility standards
- [ ] Typography hierarchy is clear
- [ ] Retro accents enhance, don't overwhelm
- [ ] Mobile-responsive layouts work
- [ ] Loading states and error states designed

**Dashboard requirement:** QA stage shows checklist; jukes-editor can mark items and add notes.

### 4. Social Dashboard
**Purpose:** Monitor performance after publishing  
**Reference:** `app/dashboard/social/page.tsx`, `lib/social-dashboard.mjs`

**Separation of concerns:**
- **Content Pipeline Dashboard** (this doc) = idea → approval → scheduling → Metricool handoff
- **Social Dashboard** (existing) = analytics, lead response, channel health, Slack alerts

**Cross-reference:** Social dashboard pulls from Metricool analytics to show which content performed best. That feedback informs future ideas in the content pipeline.

---

## Open Questions

### 1. Blacklight / Justin Harris Role Clarity
**Question:** Are Blacklight or Justin Harris tied to content production (editing, videography, creative services)?  
**Impact:** If yes, the dashboard should support external editor assignments, asset upload/download, and approval workflows for contractor-delivered content.  
**Action:** John to clarify their roles and whether they're part of the content pipeline.

### 2. LSM Transition Plan
**Question:** What content did LSM deliver, and what's the handoff plan for their final batch?  
**Impact:** May need a migration/import step to bring LSM-created content into the dashboard before termination.  
**Action:** John to confirm LSM deliverables and schedule final content retrieval.

### 3. Flo Automation Depth
**Question:** Should Flo auto-draft captions based on capture data, or just prompt operators to draft manually?  
**Impact:** If Flo auto-drafts, need API access to idea/asset data and caption generation logic.  
**Action:** Define Flo's role in drafting vs. reminding vs. scheduling.

### 4. Repurposing Workflow Detail
**Question:** Should repurposing be automatic (e.g., "create Instagram variant for every TikTok post") or manual (editor decides per item)?  
**Impact:** Automatic = more rules/logic; manual = more flexibility but more work.  
**Action:** John to specify repurpose strategy (automatic templates vs. case-by-case).

### 5. Dashboard Location
**Question:** Should this live at `dashboard.jukesdiner.com/content` (alongside existing cash flow and social dashboards), or as a separate Notion database, or other tool?  
**Impact:** Tech stack and integration complexity.  
**Action:** John to confirm platform preference (custom build vs. Notion vs. Airtable vs. other).

---

## Success Criteria

### Operational
- [ ] No content ships without passing brand QA and founder approval.
- [ ] Weekly rhythm is visible: what's scheduled, what's missing, who's blocked.
- [ ] Capture requests are assigned with due dates and tracked to completion.
- [ ] Repurposed content is linked to original so usage is trackable.
- [ ] External editors (if applicable) have clear handoff/upload paths.

### Quality
- [ ] All published content matches brand foundation voice and design standards.
- [ ] CTAs are sourced from offer library and align with lead qualification.
- [ ] No vague, corporate, or off-brand copy ships.

### Efficiency
- [ ] John spends <10 minutes/day on approval queue (not hunting for content in DMs/Notion).
- [ ] Marketing Lead can see full week's plan at a glance.
- [ ] Flo can auto-remind owners when deadlines approach.
- [ ] Metricool handoff is one-click or automated.

---

## Next Steps (Out of Scope for This Doc)

1. **Dashboard Design** — Translate these requirements into wireframes/mockups.
2. **Tech Stack Decision** — Choose platform (custom Next.js build, Notion, Airtable, other).
3. **Flo Integration** — Define API endpoints or automation scripts for Flo to interact with the dashboard.
4. **Metricool API Setup** — Implement handoff workflow from dashboard to Metricool planner.
5. **Pilot Test** — Run one week's content through the pipeline to validate workflow.

---

## Revision History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-05-08 | 1.0.0 | Initial requirements from memory and Notion context | jukes-editor |

---

**Document Status:** ✅ Ready for John review  
**Approval Required:** John (Founder)  
**Next Review:** After initial feedback and open questions answered
