# Franchise Application Public Site — Backlog

**Created:** 2026-05-08  
**Owner:** jukes-research-agent  
**Purpose:** Actionable backlog for building a public franchise lead-capture and application site supporting the TikTok → website application → Nashville training → nationwide trucks vision.

**Status:** Planning phase — no implementation yet  
**Scope:** Public-facing franchise site only (internal dashboard remains separate)

---

## Vision Summary

**Funnel:** TikTok content → Public website lead capture → Franchise application → Nashville training → Nationwide truck rollout

**Goal:** Attract, qualify, and convert aspiring operators via a public site that explains the franchise model, captures applications, and routes qualified leads into the training/onboarding pipeline.

---

## Content Requirements

### BACKLOG-CONTENT-001: Franchise Overview Page
**Priority:** High  
**Type:** Content  
**Description:** Create clear, compelling franchise overview content explaining the Juke's Diner franchise model and operator opportunity.

**Acceptance Criteria:**
- [ ] Explains the franchise model (truck provided, playbook, training, brand support)
- [ ] Defines what operators provide (operational commitment, execution, local presence)
- [ ] Outlines operator benefits (ownership without full startup costs, proven systems, brand recognition)
- [ ] Uses plain-spoken, operator-focused language (no agency jargon)
- [ ] Includes high-level financial expectations (investment range, revenue potential) — John approval required for numbers
- [ ] Sets realistic expectations (hard work, food service experience preferred)
- [ ] Tone matches brand voice: warm, useful, diner-counter charm

**Dependencies:** None  
**Blocker Risk:** Medium (requires John approval on financial details)

---

### BACKLOG-CONTENT-002: Training and Onboarding Content
**Priority:** High  
**Type:** Content  
**Description:** Document the Nashville training program and onboarding path for approved franchise operators.

**Acceptance Criteria:**
- [ ] Describes Nashville training location and format
- [ ] Outlines training duration and curriculum (food prep, service, systems, dashboard usage)
- [ ] Explains onboarding milestones (training completion → truck assignment → market launch)
- [ ] Includes what operators learn (menu execution, catering workflow, event service, dashboard operations)
- [ ] Sets expectations for housing/travel during training (operator responsibility or support provided)
- [ ] Mentions quality standards and certification requirements

**Dependencies:** BACKLOG-CONTENT-001  
**Blocker Risk:** High (John must define training program details before this can be written)

---

### BACKLOG-CONTENT-003: Nationwide Truck Rollout Vision
**Priority:** Medium  
**Type:** Content  
**Description:** Communicate the nationwide expansion vision to attract operators who want to be part of a growing brand.

**Acceptance Criteria:**
- [ ] Explains the nationwide rollout strategy (operators in key markets)
- [ ] Names target markets or regions (if defined) or explains market selection criteria
- [ ] Describes operator support during expansion (shared learning, network effects)
- [ ] Balances ambition with realism (growth plan, not vaporware)
- [ ] Includes operator success stories (future: add testimonials as first operators launch)

**Dependencies:** BACKLOG-CONTENT-001, BACKLOG-CONTENT-002  
**Blocker Risk:** Medium (expansion strategy must be defined)

---

### BACKLOG-CONTENT-004: Operator FAQs
**Priority:** Medium  
**Type:** Content  
**Description:** Answer common franchise applicant questions to reduce email volume and qualify leads.

**Acceptance Criteria:**
- [ ] Covers financial questions (investment required, revenue share, fee structure)
- [ ] Covers operational questions (hours, truck maintenance, menu flexibility)
- [ ] Covers support questions (training, marketing, dashboard tools, ongoing help)
- [ ] Covers territory questions (exclusivity, market assignment)
- [ ] Covers legal/contract questions (agreement terms, IP ownership, exit terms)
- [ ] Each answer is specific, sourced, and approved by John (no placeholder text)

**Dependencies:** BACKLOG-CONTENT-001, BACKLOG-CONTENT-002  
**Blocker Risk:** High (requires detailed franchise model definition)

---

### BACKLOG-CONTENT-005: Success Metrics and Proof Points
**Priority:** Low  
**Type:** Content  
**Description:** Build credibility via proof points (Nashville operation metrics, event success, catering revenue).

**Acceptance Criteria:**
- [ ] Includes Nashville truck performance metrics (events served, revenue growth, customer satisfaction)
- [ ] Includes operator-facing proof (systemization, dashboard tools, scalability)
- [ ] Uses real data (no invented metrics)
- [ ] Avoids overpromising (show proof without guaranteeing operator outcomes)

**Dependencies:** BACKLOG-CONTENT-001  
**Blocker Risk:** Low (can pull from existing dashboard data)

---

## Lead Capture and Application Form

### BACKLOG-FORM-001: Franchise Interest Lead Capture Form
**Priority:** High  
**Type:** Feature  
**Description:** Simple lead capture form for initial franchise interest (low-commitment, high-funnel).

**Acceptance Criteria:**
- [ ] Fields: Name, Email, Phone, City/State, Current occupation, Food service experience (yes/no dropdown)
- [ ] Single "Submit Interest" CTA
- [ ] Confirmation message: "Thanks! We'll follow up within 48 hours."
- [ ] Data routed to dashboard (franchise-brain or new franchise leads table)
- [ ] Email notification sent to John on submission
- [ ] Form validation (required fields, email format, phone format)
- [ ] Mobile-friendly layout
- [ ] Uses brand colors and typography

**Dependencies:** None  
**Blocker Risk:** Low

---

### BACKLOG-FORM-002: Full Franchise Application Form
**Priority:** High  
**Type:** Feature  
**Description:** Detailed application form for qualified leads ready to formally apply.

**Acceptance Criteria:**
- [ ] **Personal Info:** Name, Email, Phone, Address (City, State, ZIP)
- [ ] **Experience:** Food service background (years, roles), Management experience (yes/no + details), Entrepreneurial experience (yes/no + details)
- [ ] **Financial Readiness:** Investment capital available (range selector or open text), Current employment status, Credit score range (optional)
- [ ] **Market Interest:** Preferred operating city/region, Backup markets (optional), Market launch timeline (ASAP / 3-6 months / 6-12 months)
- [ ] **Motivations:** "Why do you want to run a Juke's Diner?" (open text, 200-500 words)
- [ ] **Availability:** "Can you commit to Nashville training for [X weeks]?" (yes/no + availability dates)
- [ ] **References:** 2 professional references (name, relationship, contact)
- [ ] **Legal:** "I understand this is an application, not a contract" (checkbox), "I agree to a background check if approved" (checkbox)
- [ ] Submit button: "Submit Application"
- [ ] Confirmation message + next steps ("We'll review and contact you within 5 business days")
- [ ] Data saved to dashboard franchise applications table
- [ ] Email notification to John with full application summary
- [ ] Form validation and error messaging
- [ ] Mobile-optimized layout

**Dependencies:** BACKLOG-CONTENT-001, BACKLOG-CONTENT-004 (FAQ must explain what's required)  
**Blocker Risk:** Medium (field definitions must be approved by John)

---

### BACKLOG-FORM-003: Routing and Notification Logic
**Priority:** High  
**Type:** Feature  
**Description:** Backend logic to route franchise applications and trigger follow-ups.

**Acceptance Criteria:**
- [ ] Interest form submissions saved to `franchise_leads` table (or similar)
- [ ] Application form submissions saved to `franchise_applications` table
- [ ] Email notification sent to John on each submission (subject: "New Franchise [Interest/Application]: [Name]")
- [ ] Optional: Slack notification to #franchise-brain channel (if configured)
- [ ] Auto-reply email to applicant confirming receipt
- [ ] Dashboard view shows new submissions in franchise-brain area

**Dependencies:** BACKLOG-FORM-001, BACKLOG-FORM-002  
**Blocker Risk:** Low (uses existing dashboard notification patterns)

---

## SEO and Discoverability

### BACKLOG-SEO-001: Keyword Research for Franchise Terms
**Priority:** Medium  
**Type:** Research  
**Description:** Research high-intent franchise and food truck operator keywords to optimize for search.

**Acceptance Criteria:**
- [ ] Identify target keywords (e.g., "food truck franchise," "diner franchise opportunities," "Nashville food truck training")
- [ ] Analyze search volume and competition for top 10-15 keywords
- [ ] Prioritize keywords by intent (information-seeking vs. application-ready)
- [ ] Document keyword targets in SEO strategy doc
- [ ] Recommend primary keyword per page (overview, training, application)

**Dependencies:** BACKLOG-CONTENT-001, BACKLOG-CONTENT-002  
**Blocker Risk:** Low

---

### BACKLOG-SEO-002: On-Page SEO Implementation
**Priority:** Medium  
**Type:** Feature  
**Description:** Optimize franchise pages for search engines.

**Acceptance Criteria:**
- [ ] Meta titles and descriptions for each franchise page
- [ ] Heading hierarchy (H1, H2, H3) includes target keywords naturally
- [ ] Image alt text describes content and includes relevant keywords where appropriate
- [ ] Internal linking between franchise pages (overview → training → application)
- [ ] Schema.org markup for Organization and FAQPage (if FAQ page built)
- [ ] Clean URL structure (/franchise, /franchise/training, /franchise/apply)

**Dependencies:** BACKLOG-SEO-001, BACKLOG-CONTENT-001  
**Blocker Risk:** Low

---

### BACKLOG-SEO-003: Content Marketing and Backlink Strategy
**Priority:** Low  
**Type:** Strategy  
**Description:** Build domain authority and inbound links via content marketing.

**Acceptance Criteria:**
- [ ] Identify 5-10 target publications or communities (food truck forums, franchise blogs, local Nashville business media)
- [ ] Create outreach plan for guest posts or features
- [ ] Produce 1-2 thought leadership pieces (e.g., "How to Evaluate a Food Truck Franchise," "Behind the Scenes: Training Franchise Operators")
- [ ] Publish content on Juke's blog or Medium with backlinks to franchise pages
- [ ] Track backlink acquisition and referral traffic

**Dependencies:** BACKLOG-CONTENT-001, BACKLOG-SEO-001  
**Blocker Risk:** Low

---

### BACKLOG-SEO-004: Local SEO for Nashville Training Location
**Priority:** Low  
**Type:** Feature  
**Description:** Optimize for local search to attract Nashville-area applicants and build credibility.

**Acceptance Criteria:**
- [ ] Google Business Profile for Juke's Diner (if not already claimed)
- [ ] NAP (Name, Address, Phone) consistency across web properties
- [ ] Local content (Nashville training, Kitchen 7 mention if appropriate)
- [ ] Local backlinks (Nashville food scene blogs, business directories)

**Dependencies:** BACKLOG-CONTENT-002  
**Blocker Risk:** Low

---

## Design and UX

### BACKLOG-DESIGN-001: Franchise Page Layout and Visual Hierarchy
**Priority:** High  
**Type:** Design  
**Description:** Design clean, compelling layout for franchise pages using Juke's brand system.

**Acceptance Criteria:**
- [ ] Hero section: bold headline ("Own a Juke's Diner"), subheadline (value prop), CTA ("Apply Now" or "Learn More")
- [ ] Content sections: Overview, Training, Support, Success Stories (future), FAQ
- [ ] CTAs placed strategically (hero, after overview, after training, bottom of page)
- [ ] Uses brand colors (diner red for primary CTA, teal for secondary, cream backgrounds)
- [ ] Typography: Bungee headings, Inter body, clean hierarchy
- [ ] Scannable layout (short paragraphs, bullet lists, section breaks)
- [ ] Mobile-first responsive design

**Dependencies:** BACKLOG-CONTENT-001  
**Blocker Risk:** Low

---

### BACKLOG-DESIGN-002: Application Form UX Design
**Priority:** High  
**Type:** Design  
**Description:** Design intuitive, trustworthy application form UX.

**Acceptance Criteria:**
- [ ] Multi-step form or single long form with clear sections
- [ ] Progress indicator if multi-step
- [ ] Clear labels and placeholders for each field
- [ ] Inline validation (real-time error messages)
- [ ] Success state on submission (confirmation message, email sent notification)
- [ ] Accessible form controls (keyboard navigation, screen reader labels)
- [ ] Mobile-optimized (large tap targets, appropriate input types)

**Dependencies:** BACKLOG-FORM-002  
**Blocker Risk:** Low

---

### BACKLOG-DESIGN-003: Trust and Credibility Elements
**Priority:** Medium  
**Type:** Design  
**Description:** Add visual trust signals to increase application conversion.

**Acceptance Criteria:**
- [ ] Operator testimonials section (future: collect first operator stories)
- [ ] Photos: Nashville training setup, truck fleet, John at work (operator-real, not stock photos)
- [ ] "What We Provide" vs "What You Provide" comparison table or visual
- [ ] Security/privacy statement on application form ("Your info is secure and won't be shared")
- [ ] Logo and branding consistency throughout

**Dependencies:** BACKLOG-CONTENT-005, BACKLOG-DESIGN-001  
**Blocker Risk:** Medium (requires photo assets)

---

## Technical Implementation

### BACKLOG-TECH-001: Wix vs Custom Code Decision
**Priority:** High  
**Type:** Decision  
**Description:** Choose platform for franchise public site implementation.

**Options:**
1. **Wix:** Faster launch, easier for non-technical updates, limited customization
2. **Custom Code (Next.js):** Full control, integrates with existing dashboard, requires dev maintenance

**Decision Criteria:**
- [ ] Timeline urgency (how soon does this need to launch?)
- [ ] Customization needs (complex forms, dashboard integration, custom logic)
- [ ] Maintenance resources (who will update content and handle bugs?)
- [ ] SEO requirements (both platforms support SEO, but custom code offers more control)
- [ ] Cost (Wix subscription vs dev time)

**Recommended Approach:** Start with Wix for fast MVP, migrate to custom code later if integration/customization becomes critical.

**Dependencies:** None (blocks all implementation work)  
**Blocker Risk:** High (John must decide)

---

### BACKLOG-TECH-002: Form Submission Backend
**Priority:** High  
**Type:** Feature  
**Description:** Build backend to handle franchise form submissions.

**Acceptance Criteria:**
- [ ] API endpoint to receive form data (interest and application)
- [ ] Data validation and sanitization
- [ ] Save to database (franchise_leads, franchise_applications tables)
- [ ] Send email notification to John
- [ ] Send auto-reply confirmation to applicant
- [ ] Error handling and logging
- [ ] Rate limiting to prevent spam

**Dependencies:** BACKLOG-TECH-001 (platform decision)  
**Blocker Risk:** Medium

---

### BACKLOG-TECH-003: Dashboard Integration for Application Review
**Priority:** Medium  
**Type:** Feature  
**Description:** Add dashboard view for reviewing and managing franchise applications.

**Acceptance Criteria:**
- [ ] New dashboard route: `/dashboard/franchise-applications`
- [ ] Table view: Name, Email, Phone, Market Interest, Status (New, Reviewing, Approved, Declined)
- [ ] Detail view: Full application data, notes field, status change actions
- [ ] Filter/sort by status, submission date, market
- [ ] Export applications to CSV for offline review
- [ ] Log status changes and notes for auditing

**Dependencies:** BACKLOG-TECH-002  
**Blocker Risk:** Low

---

### BACKLOG-TECH-004: CRM/Email Follow-Up Automation (Optional)
**Priority:** Low  
**Type:** Feature  
**Description:** Automate follow-up emails for applicants in different stages.

**Acceptance Criteria:**
- [ ] Auto-reply on submission: "Application received, review in 5 business days"
- [ ] 5-day follow-up if no status change: "Still reviewing, thanks for patience"
- [ ] Approved: "Congratulations! Next steps: [training scheduling]"
- [ ] Declined: "Thank you for your interest. We're not moving forward at this time."
- [ ] Optional: Drip campaign for interest leads (nurture into applications)

**Dependencies:** BACKLOG-TECH-003  
**Blocker Risk:** Low

---

## Marketing and Funnel

### BACKLOG-MARKETING-001: TikTok to Website Funnel
**Priority:** High  
**Type:** Strategy  
**Description:** Define TikTok content strategy to drive traffic to franchise application page.

**Acceptance Criteria:**
- [ ] Identify franchise-signal content themes (behind-the-scenes, build-in-public, operator stories)
- [ ] Create 5-10 TikTok video concepts (e.g., "Day in the life of a food truck operator," "What I wish I knew before starting")
- [ ] Include clear CTA in TikTok bio and video captions ("Want to run your own? Link in bio")
- [ ] Track TikTok → website traffic via UTM parameters
- [ ] Optimize landing page for TikTok traffic (fast load, mobile-first, clear CTA)

**Dependencies:** BACKLOG-CONTENT-001, BACKLOG-DESIGN-001  
**Blocker Risk:** Medium (requires TikTok content production resources)

---

### BACKLOG-MARKETING-002: Paid Ads Strategy (Google, Meta)
**Priority:** Low  
**Type:** Strategy  
**Description:** Paid acquisition strategy for franchise applicants.

**Acceptance Criteria:**
- [ ] Define target audience (age, location, interests, search intent)
- [ ] Identify ad platforms (Google Search, Facebook/Instagram, LinkedIn)
- [ ] Create 3-5 ad creatives per platform
- [ ] Define budget and test spend ($500-$1000 initial test)
- [ ] Set conversion tracking (form submissions, application completions)
- [ ] Define success metrics (cost per lead, cost per application)

**Dependencies:** BACKLOG-CONTENT-001, BACKLOG-SEO-001  
**Blocker Risk:** Medium (requires ad spend budget approval)

---

### BACKLOG-MARKETING-003: Referral and Network Effects
**Priority:** Low  
**Type:** Strategy  
**Description:** Encourage franchise applicants to refer other operators.

**Acceptance Criteria:**
- [ ] Create referral incentive (e.g., "Refer an operator, get [benefit]")
- [ ] Add referral field to application form ("How did you hear about us?")
- [ ] Track referral sources
- [ ] Build operator community (future: Slack, forum, or regular calls for launched operators)

**Dependencies:** BACKLOG-FORM-002  
**Blocker Risk:** Low

---

## Analytics and Optimization

### BACKLOG-ANALYTICS-001: Conversion Funnel Tracking
**Priority:** Medium  
**Type:** Feature  
**Description:** Track user journey from landing to application submission.

**Acceptance Criteria:**
- [ ] Google Analytics 4 (or alternative) tracking installed
- [ ] Track page views (overview, training, FAQ, application)
- [ ] Track form interactions (start form, field completions, submit)
- [ ] Track conversions (interest form, application form)
- [ ] Track drop-off points (where users abandon form)
- [ ] Set up conversion goals in analytics platform

**Dependencies:** BACKLOG-TECH-001 (platform decision affects implementation)  
**Blocker Risk:** Low

---

### BACKLOG-ANALYTICS-002: A/B Testing Plan
**Priority:** Low  
**Type:** Strategy  
**Description:** Test variations to optimize conversion rate.

**Acceptance Criteria:**
- [ ] Identify 3-5 hypotheses to test (e.g., CTA text, headline, form length)
- [ ] Set up A/B testing tool (Google Optimize, Optimizely, or built-in)
- [ ] Run tests with statistical significance (min 100 conversions per variant)
- [ ] Document winning variations and implement site-wide

**Dependencies:** BACKLOG-ANALYTICS-001  
**Blocker Risk:** Low

---

## Legal and Compliance

### BACKLOG-LEGAL-001: Franchise Disclosure Document (FDD) Requirements Research
**Priority:** High  
**Type:** Research  
**Description:** Determine if Juke's franchise model requires FDD under FTC Franchise Rule.

**Acceptance Criteria:**
- [ ] Research FTC Franchise Rule applicability (trademark license, prescribed operating method, franchise fee)
- [ ] Document whether Juke's model meets FDD threshold
- [ ] If yes: Outline FDD creation requirements and timeline
- [ ] If no: Document exemptions and alternative legal docs needed (operator agreement, licensing terms)
- [ ] Recommend legal counsel consultation

**Dependencies:** None  
**Blocker Risk:** High (legal requirement that could block public launch)

**NOTE:** This is a critical research task. If FDD is required, the franchise site cannot publicly solicit applications until the FDD is filed and delivered to applicants. John must consult franchise attorney.

---

### BACKLOG-LEGAL-002: Privacy Policy and Terms of Service
**Priority:** Medium  
**Type:** Feature  
**Description:** Add legal pages required for franchise site.

**Acceptance Criteria:**
- [ ] Privacy policy (data collection, usage, storage, applicant rights)
- [ ] Terms of service (application terms, non-binding language, arbitration clauses if applicable)
- [ ] Linked from footer and application form
- [ ] Compliant with GDPR (if accepting international applicants) or CCPA (California)

**Dependencies:** BACKLOG-TECH-001  
**Blocker Risk:** Medium (requires legal review)

---

### BACKLOG-LEGAL-003: Application Disclaimers
**Priority:** Medium  
**Type:** Content  
**Description:** Add clear disclaimers to application form to manage expectations and legal risk.

**Acceptance Criteria:**
- [ ] "This is an application, not a contract or guarantee of approval"
- [ ] "We reserve the right to reject applications for any reason"
- [ ] "Financial estimates are not guarantees of operator earnings"
- [ ] "Background check and credit check required for approved applicants"
- [ ] "By submitting, you agree to our [Privacy Policy] and [Terms of Service]"

**Dependencies:** BACKLOG-FORM-002  
**Blocker Risk:** Low

---

## Launch Readiness

### BACKLOG-LAUNCH-001: Pre-Launch Checklist
**Priority:** High  
**Type:** Process  
**Description:** Ensure franchise site is ready for public traffic.

**Acceptance Criteria:**
- [ ] All content approved by John
- [ ] Legal pages (privacy, terms) reviewed by counsel
- [ ] Forms tested (submission, validation, email notifications)
- [ ] Mobile responsiveness verified on iOS and Android
- [ ] SEO basics implemented (meta tags, sitemap, robots.txt)
- [ ] Analytics tracking verified
- [ ] Dashboard integration tested (lead routing, notifications)
- [ ] Backup plan if form fails (fallback email address clearly visible)
- [ ] Social media profiles updated to link to franchise page
- [ ] TikTok bio updated with franchise site link

**Dependencies:** All prior tasks  
**Blocker Risk:** High (launch gate)

---

### BACKLOG-LAUNCH-002: Soft Launch and Feedback Loop
**Priority:** High  
**Type:** Process  
**Description:** Launch to small audience first, collect feedback, iterate before full public launch.

**Acceptance Criteria:**
- [ ] Share with 5-10 trusted contacts in food/franchise industry
- [ ] Collect feedback on clarity, trust, application friction
- [ ] Identify top 3 issues or questions raised
- [ ] Fix critical issues before full launch
- [ ] Document feedback for future iterations

**Dependencies:** BACKLOG-LAUNCH-001  
**Blocker Risk:** Low

---

### BACKLOG-LAUNCH-003: Full Public Launch Plan
**Priority:** High  
**Type:** Strategy  
**Description:** Coordinate launch announcement and traffic drivers.

**Acceptance Criteria:**
- [ ] Announce on Juke's social media (Instagram, Facebook, TikTok)
- [ ] Email announcement to existing email list (if applicable)
- [ ] Update public website footer to include "Franchise Opportunities" link
- [ ] Post in relevant communities (food truck forums, Nashville business groups)
- [ ] Consider local press outreach (Nashville Business Journal, food blogs)
- [ ] Monitor first 48 hours for bugs, broken links, form issues

**Dependencies:** BACKLOG-LAUNCH-002  
**Blocker Risk:** Low

---

## Summary and Next Steps

### Backlog Prioritization (High-Priority First)

**Must-Have for MVP:**
1. BACKLOG-TECH-001 — Platform decision (Wix vs custom)
2. BACKLOG-LEGAL-001 — FDD requirements research (legal blocker)
3. BACKLOG-CONTENT-001 — Franchise overview content
4. BACKLOG-CONTENT-002 — Training and onboarding content
5. BACKLOG-FORM-001 — Interest lead capture form
6. BACKLOG-FORM-002 — Full application form
7. BACKLOG-FORM-003 — Routing and notification logic
8. BACKLOG-DESIGN-001 — Page layout and visual hierarchy
9. BACKLOG-LAUNCH-001 — Pre-launch checklist

**Nice-to-Have for MVP:**
- BACKLOG-CONTENT-004 — FAQs
- BACKLOG-SEO-001 — Keyword research
- BACKLOG-SEO-002 — On-page SEO
- BACKLOG-MARKETING-001 — TikTok funnel strategy

**Post-MVP Enhancements:**
- BACKLOG-TECH-003 — Dashboard application review
- BACKLOG-ANALYTICS-001 — Conversion tracking
- BACKLOG-MARKETING-002 — Paid ads
- BACKLOG-CONTENT-005 — Success metrics and proof points

### Critical Blockers Requiring John's Input

1. **BACKLOG-TECH-001:** Wix vs custom code decision
2. **BACKLOG-LEGAL-001:** FDD requirements (franchise attorney consult required)
3. **BACKLOG-CONTENT-002:** Training program details (location, duration, curriculum)
4. **BACKLOG-CONTENT-004:** Financial details for FAQ (investment, fees, revenue share)
5. **BACKLOG-FORM-002:** Application field definitions and approval criteria

### Recommended First Steps

1. ✅ Schedule decision meeting with John: Platform (Wix vs custom) and FDD legal consult
2. ✅ Start BACKLOG-LEGAL-001 research (FDD requirements) — can run in parallel
3. ✅ Draft BACKLOG-CONTENT-001 (franchise overview) for John review
4. ✅ After platform decision, begin design mockups (BACKLOG-DESIGN-001)
5. ✅ Build forms and routing (BACKLOG-FORM-001, 002, 003) once content/design approved

---

## Document Maintenance

**Owner:** jukes-research-agent  
**Review Cadence:** Update as backlog items are completed or priorities shift  
**Handoff:** This backlog can be imported into dashboard Kanban, Notion, or other project management tool for execution tracking.

**Status:** ✅ Complete — Ready for John's review and prioritization

---

**End of Backlog**
