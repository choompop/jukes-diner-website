# Enriched Content Pipeline Cards

This directory contains fully enriched content intake cards that have been imported from Notion and enhanced with internal context, owner assignments, brand alignment checks, and clear next steps.

## Purpose

When content ideas are imported from Notion via the notion-kanban-sync script (or manual intake), they arrive with minimal information - typically just a title, basic status, dates, and a link back to the Notion page. This directory contains the "enriched" versions with:

- Full content details (platform, type, dates, post URL)
- Brand alignment checks (voice, visual style, category mapping)
- Content category assignment (Raw Build-in-Public, Food Proof, Catering Conversion, Franchise Signal)
- Internal owner assignments
- Clear next step with rationale
- Acceptance criteria checklists
- Source/traceability information
- Repurposing opportunities
- Internal notes and execution guidance

## Structure

Each enriched card follows this template:

1. **Header:** Content name, status, owner, priority
2. **Content Details:** Platform, type, film date, publish date, URLs
3. **Timeline Analysis:** Days until event, urgency flags, date conflicts
4. **Content Context & Purpose:** Category, Juke's-specific context, product/service details
5. **Brand Alignment:** Voice guidelines, category mapping, visual style requirements
6. **Acceptance Criteria:** Checklist from content pipeline stages
7. **Next Step:** Single concrete action with owner
8. **Source & Traceability:** Notion URL, idempotency key, import/enrich metadata
9. **Internal Notes:** Context, repurposing opportunities, related tasks, owner guidance
10. **Administrative Actions:** Recommended next steps, archive criteria

## Current Cards

### product-launch-youtube-short.md
**Status:** Idea (BLOCKED - requires concept development)  
**Owner:** TBD (requires assignment)  
**Next Step:** Unblock content definition and timeline with John  
**Key Facts:**
- YouTube short-form video
- Film date: March 11, 2025 (423 days past)
- Publish date: March 28, 2025 (406 days past)
- Critical issue: No product identified, timeline mismatch (dates are 400+ days old)
- Requires John input to clarify: what product, what timeline, what assets exist, who owns execution

## Owner Conventions

Based on content pipeline dashboard requirements and internal systems:

- **John (Founder)** - Approves all content before publishing; captures raw founder/business stories for TikTok/LinkedIn
- **Marketing Lead** - Converts ideas into capture requests; manages weekly content calendar; assigns editing/scheduling tasks
- **Content Editor** - Drafts captions/scripts; edits raw assets; creates repurposed variants; schedules into Metricool
- **jukes-editor** - Brand QA against voice and design foundation; ensures consistency and quality before approval
- **Catering Response Owner** - Ensures catering-conversion content aligns with lead qualification workflow
- **Flo Agent** - Drafts captions based on intake prompts; reminds owners of due dates; logs performance feedback
- **External Editor** - Video editing, professional photography, or specialized creative work (e.g., Blacklight, Justin Harris, LSM replacement)

## Status Definitions

Based on content pipeline workflow stages:

- **Idea:** Initial concept logged, not yet approved for production
- **Capture-Requested:** Idea approved, capture task assigned to operator/shift lead
- **Draft:** Assets collected, caption/script drafted, ready for brand QA
- **QA-Pass:** Brand QA approved, ready for founder approval
- **QA-Revise:** Brand QA returned with notes, needs revision
- **Approved:** Founder approved, ready for scheduling
- **Rejected:** Founder rejected or archived
- **Scheduled:** Publish date/time set, assigned to channel(s)
- **In-Metricool:** Uploaded to Metricool planner, awaiting publish
- **Published:** Live on platform(s)

## Content Categories

From `brain/files/content-pipeline-dashboard-requirements.md`:

- **Raw Build-in-Public:** Behind-the-scenes operator stories, founder camera captures, business lessons
- **Food Proof:** Menu showcases, catering setup, service context, customer events
- **Catering Conversion:** Lead qualification aligned content, booking intent, CTA-focused
- **Franchise Signal:** Franchise expansion stories, operator success, business model insights

## Integration Points

These enriched cards serve as the "source of truth" for:

1. **Content Pipeline Dashboard:** (Future build) Idea → Approval → Scheduling → Metricool handoff
2. **Kanban Board:** Tasks created for capture requests, editing assignments, brand QA, approvals
3. **Metricool:** Scheduled posts handed off for publishing
4. **Social Dashboard:** `/app/dashboard/social` shows post-publish analytics and performance
5. **Brand Foundation:** Voice and design QA checklist reference (`brain/files/brand-foundation.md`)
6. **Offer Library:** CTA selection and lead qualification alignment

## Weekly Content Rhythm

Aligned with `brain/files/content-pipeline-dashboard-requirements.md`:

| Day | Channel | Owner | Deliverable |
|-----|---------|-------|-------------|
| **Monday** | Website | John / Catering lead | Catering/conversion asset |
| **Tuesday** | TikTok | Founder camera capture | Raw build-in-public operator story |
| **Wednesday** | Instagram | Content editor | Food proof or catering reel |
| **Thursday** | Facebook | Community manager | Local community/event schedule |
| **Friday** | LinkedIn | John | Founder/business/franchise lesson |

## Maintenance

- **Archive past content:** Monthly cleanup of published/cancelled content
- **Update on status change:** When Notion status changes, re-enrich card
- **Link to outcomes:** If content publishes, link to post URL and analytics
- **Track repurposing:** Maintain parent/child relationships for content variants

## Brand QA Checklist

From `brain/files/brand-foundation.md`, all content must pass:

**Copy Review:**
- [ ] Voice sounds like Flo (warm, clear, useful)
- [ ] Next step is explicit (CTA, follow-up action)
- [ ] No vague promises or corporate fog
- [ ] Facts are sourced (menu, pricing, availability)
- [ ] Tone matches context (public vs. internal vs. customer)

**Design Review (for visual content):**
- [ ] Color contrast meets accessibility standards
- [ ] Typography hierarchy is clear
- [ ] Retro accents enhance, don't overwhelm
- [ ] Mobile-responsive layouts work
- [ ] Loading states and error states designed

## Repurposing Workflow

When original content is created for one platform, consider repurposing to:

| Original Platform | Repurpose To | Adaptations |
|------------------|--------------|-------------|
| **TikTok (60s)** | Instagram Reels (30-60s) | Different hashtags, aspect ratio check |
| **TikTok (60s)** | YouTube Shorts (60s) | Add title card, optimize for search |
| **Instagram Reels** | Facebook (60-90s) | Longer caption, detailed CTA |
| **YouTube Long** | TikTok/Instagram | Cut to highlights, 30-60s clips |
| **LinkedIn Post** | Website Blog | Expand to full article, add images |
| **Founder Story** | All platforms | Platform-specific framing (business on LinkedIn, customer on Instagram) |

Each repurposed variant gets its own card with `repurpose_parent` field linking to the original.

## See Also

- `/Users/lexi/projects/jukes-diner-website/brain/files/content-pipeline-dashboard-requirements.md` - Full content pipeline workflow
- `/Users/lexi/projects/jukes-diner-website/brain/files/brand-foundation.md` - Brand voice and design standards
- `/Users/lexi/projects/jukes-diner-website/brain/files/brand-voice.md` - Voice guidelines summary
- `/Users/lexi/projects/jukes-diner-website/enriched-cards/` - Event pipeline cards (similar structure)
- `/Users/lexi/projects/jukes-diner-website/app/dashboard/social/` - Social dashboard for post-publish analytics

---

**Directory Status:** ✅ Active  
**Owner:** jukes-editor  
**Next Review:** Monthly (archive published/cancelled content)
