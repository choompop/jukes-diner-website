export const SOCIAL_CHANNELS = [
  {
    id: 'tiktok',
    name: 'TikTok',
    role: 'Founder reality show',
    status: 'live',
    priority: 'high',
    audience: 'Entrepreneurs and operators who want to learn the systems behind running a real food business.',
    positioning: 'Raw behind-the-scenes of starting, growing, and systemizing Juke\'s Diner.',
    objective: 'Build founder trust, teach business systems, and turn the brand into a living case study.',
    contentSystem: [
      'Raw day-in-the-life clips: truck prep, vendor calls, hiring, systems, mistakes, wins.',
      'Business systems breakdowns: how bookings, food cost, training, and delegation work.',
      'Weekly founder recap: what moved the business forward and what broke.',
    ],
    nextActions: [
      'Define 5 repeatable series formats.',
      'Create capture checklist for every operating day.',
      'Build weekly editing pipeline with owner, due date, and posting cadence.',
    ],
    metrics: ['3-5 posts/week', 'Founder trust', 'Inbound franchise interest'],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    role: 'Food portfolio',
    status: 'live',
    priority: 'high',
    audience: 'Customers, event planners, and corporate catering buyers who need to trust the food visually.',
    positioning: 'A polished food and catering portfolio with retro diner personality.',
    objective: 'Make the truck look bookable, credible, delicious, and active.',
    contentSystem: [
      'Hero food photography and reels.',
      'Catering/event recap posts.',
      'Stories for locations, specials, and social proof.',
    ],
    nextActions: [
      'Clean bio around catering and booking CTA.',
      'Pin best food, catering, and brand story posts.',
      'Create highlight folders: Catering, Menu, Events, Reviews, Behind the Scenes.',
    ],
    metrics: ['Booking clicks', 'Saved posts', 'DM inquiries'],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    role: 'Community board',
    status: 'needs-cleanup',
    priority: 'medium',
    audience: 'Local community, families, boomers, neighborhood groups, and event organizers.',
    positioning: 'Friendly local diner/truck presence: events, community updates, reviews, and repeat engagement.',
    objective: 'Drive local trust and event awareness without needing trendy content.',
    contentSystem: [
      'Event announcements and location posts.',
      'Community photos and customer shoutouts.',
      'Review requests and local group cross-posts.',
    ],
    nextActions: [
      'Update page info, photos, booking links, and pinned post.',
      'Create weekly event/location schedule post template.',
      'Identify local groups where posts are allowed.',
    ],
    metrics: ['Event reach', 'Comments', 'Reviews'],
  },
  {
    id: 'website',
    name: 'Website',
    role: 'Booking engine',
    status: 'live',
    priority: 'high',
    audience: 'Corporate clients, private event hosts, and anyone deciding whether to book the truck.',
    positioning: 'Sleek retro diner site that explains the concept and converts visitors into catering leads.',
    objective: 'Make booking Juke\'s obvious, fast, and credible.',
    contentSystem: [
      'Catering landing page with packages and proof.',
      'Brand story and retro diner concept.',
      'Lead form routed into a response workflow.',
    ],
    nextActions: [
      'Clarify catering CTA above the fold.',
      'Add corporate/event proof and testimonials.',
      'Create lead routing workflow from form to owner follow-up.',
    ],
    metrics: ['Form submissions', 'Call clicks', 'Booked events'],
  },
  {
    id: 'phone',
    name: 'Phone Number',
    role: 'Lead capture line',
    status: 'needs-setup',
    priority: 'high',
    audience: 'Catering prospects who want to text or call instead of using a form.',
    positioning: 'A dedicated Juke\'s Diner catering line that captures event details and speeds up follow-up.',
    objective: 'Stop losing serious catering leads in scattered personal texts or DMs.',
    contentSystem: [
      'Google Voice / Grasshopper / YepChat comparison.',
      'SMS intake script for event date, location, headcount, budget, and service type.',
      'Missed-call and auto-reply workflow.',
    ],
    nextActions: [
      'Pick provider: Google Voice for simple, YepChat/Grasshopper for business workflow.',
      'Write catering intake script.',
      'Add phone CTA to website, Instagram, Facebook, and Google profile.',
    ],
    metrics: ['Response time', 'Qualified leads', 'Booked calls'],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    role: 'Business insight + franchise funnel',
    status: 'needs-setup',
    priority: 'medium',
    audience: 'Corporate professionals, operators, and potential franchisees who may want out of their job.',
    positioning: 'Business lessons from building a food truck system into a scalable diner franchise.',
    objective: 'Create credibility with potential franchisees, partners, and corporate catering buyers.',
    contentSystem: [
      'Founder lessons from operations and delegation.',
      'Systems posts: unit economics, hiring, training, location strategy.',
      'Franchisee narrative: how someone can leave corporate and operate a proven model.',
    ],
    nextActions: [
      'Clean company page and John\'s profile positioning.',
      'Write 10 business insight post prompts.',
      'Create soft franchise interest CTA.',
    ],
    metrics: ['Profile views', 'Qualified conversations', 'Franchise interest'],
  },
];

export const CONTENT_PILLARS = [
  {
    name: 'Raw Build-in-Public',
    channels: ['TikTok', 'LinkedIn'],
    description: 'Show the real decisions, mistakes, systems, and progress behind building Juke\'s.',
  },
  {
    name: 'Food Proof',
    channels: ['Instagram', 'Facebook', 'Website'],
    description: 'Make the product craveable and credible for customers and corporate buyers.',
  },
  {
    name: 'Catering Conversion',
    channels: ['Website', 'Phone Number', 'Instagram', 'Facebook'],
    description: 'Move interested people into a fast, structured booking conversation.',
  },
  {
    name: 'Franchise Signal',
    channels: ['LinkedIn', 'TikTok', 'Website'],
    description: 'Teach the business model so future operators can see the opportunity.',
  },
];

export const WEEKLY_CONTENT_PLAN = [
  {
    day: 'Monday',
    channelId: 'website',
    owner: 'John / catering lead owner',
    deliverable: 'Publish or refresh one catering conversion asset: offer, proof, FAQ, or booking CTA.',
  },
  {
    day: 'Tuesday',
    channelId: 'tiktok',
    owner: 'Founder camera capture',
    deliverable: 'Record one raw build-in-public clip about the operating system behind the diner.',
  },
  {
    day: 'Wednesday',
    channelId: 'instagram',
    owner: 'Content editor',
    deliverable: 'Post one food or catering proof reel with a clear book-catering CTA.',
  },
  {
    day: 'Thursday',
    channelId: 'facebook',
    owner: 'Community manager',
    deliverable: 'Share the weekly location/event schedule and cross-post where allowed.',
  },
  {
    day: 'Friday',
    channelId: 'linkedin',
    owner: 'John',
    deliverable: 'Post one business lesson from building a scalable food-truck system.',
  },
];

export const METRICOOL_VISIBILITY_LAYERS = [
  {
    id: 'publishing',
    name: 'Publishing Queue',
    metricoolSource: 'Metricool planner / scheduled posts',
    owner: 'Content editor',
    slackSignal: 'Tomorrow\'s scheduled posts, missing channels, and approval blockers.',
  },
  {
    id: 'analytics',
    name: 'Channel Analytics',
    metricoolSource: 'Metricool social analytics',
    owner: 'Growth lead',
    slackSignal: 'Top posts, weakest channels, follower movement, and engagement swings.',
  },
  {
    id: 'inbox',
    name: 'Inbox + Lead Signals',
    metricoolSource: 'Metricool inbox / messages / comments',
    owner: 'Catering response owner',
    slackSignal: 'Questions, booking intent, unanswered comments, and urgent DMs.',
  },
  {
    id: 'competitors',
    name: 'Competitor Watch',
    metricoolSource: 'Metricool competitor tracking',
    owner: 'John',
    slackSignal: 'Local food truck posts, event plays, offers, and content formats worth copying.',
  },
  {
    id: 'website',
    name: 'Website Conversion',
    metricoolSource: 'Metricool web analytics or GA4 import',
    owner: 'Website owner',
    slackSignal: 'Traffic, booking CTA clicks, catering form starts, and source/channel attribution.',
  },
];

export const METRICOOL_CONNECTION_CHECKLIST = [
  {
    title: 'Add Metricool credentials',
    status: 'needs-key',
    envVar: 'METRICOOL_API_KEY / METRICOOL_USER_ID / METRICOOL_BRAND_ID',
    detail: 'Store credentials in environment variables, never in source control or chat logs.',
  },
  {
    title: 'Map Juke\'s profiles',
    status: 'needs-profile-map',
    envVar: 'METRICOOL_PROFILE_MAP',
    detail: 'Map TikTok, Instagram, Facebook, LinkedIn, and website sources to dashboard channel IDs.',
  },
  {
    title: 'Create dashboard API route',
    status: 'needs-api-route',
    envVar: 'NEXT_PUBLIC_SOCIAL_DATA_MODE=metricool',
    detail: 'Normalize Metricool analytics, planner, inbox, and website stats into the dashboard schema.',
  },
  {
    title: 'Wire Slack notifications',
    status: 'needs-slack-webhook',
    envVar: 'SLACK_WEBHOOK_URL / SLACK_BOT_TOKEN',
    detail: 'Send digest and urgent lead alerts into the team channel where operators already work.',
  },
];

export const SLACK_AGENT_PLAN = {
  channel: '#jukes-growth',
  cadence: ['daily morning digest', 'real-time lead alerts', 'weekly executive recap'],
  signals: [
    'New catering lead or booking-intent DM/comment',
    'No posts scheduled for a high-priority channel',
    'Website booking CTA drops or traffic spikes',
    'A post outperforms baseline and should be reused',
    'Competitor format or event opportunity appears',
  ],
  agentJobs: [
    {
      name: 'Morning growth digest',
      trigger: 'Every weekday morning',
      output: 'One Slack summary of scheduled posts, top metrics, open leads, and today\'s bottleneck.',
    },
    {
      name: 'Lead alert responder',
      trigger: 'Metricool inbox event or form submission',
      output: 'Slack alert with lead details, suggested reply, owner, and response SLA.',
    },
    {
      name: 'Weekly executive recap',
      trigger: 'Friday afternoon',
      output: 'What grew, what stalled, which channel deserves attention next week.',
    },
  ],
};

export const CHANNEL_STATUSES = {
  live: 'Live',
  'needs-cleanup': 'Needs cleanup',
  'needs-setup': 'Needs setup',
};

export function getChannelById(id) {
  return SOCIAL_CHANNELS.find((channel) => channel.id === id);
}

export function getAudienceSegments() {
  return [
    'Entrepreneur/operators',
    'Food truck customers',
    'Corporate catering clients',
    'Local community',
    'Potential franchisees',
  ];
}

export function getDashboardStats() {
  return {
    totalChannels: SOCIAL_CHANNELS.length,
    liveChannels: SOCIAL_CHANNELS.filter((channel) => channel.status === 'live').length,
    needsSetup: SOCIAL_CHANNELS.filter((channel) => channel.status !== 'live').length,
    highPriorityActions: getHighPriorityNextActions().length,
  };
}

export function getWeeklyContentPlan() {
  return WEEKLY_CONTENT_PLAN.map((item) => ({
    ...item,
    channel: getChannelById(item.channelId),
  }));
}

export function getHighPriorityNextActions() {
  return SOCIAL_CHANNELS
    .filter((channel) => channel.priority === 'high')
    .flatMap((channel) =>
      channel.nextActions.map((action, index) => ({
        channelId: channel.id,
        channelName: channel.name,
        priority: channel.priority,
        order: index + 1,
        action,
      })),
    );
}

export function getMetricoolConnectionChecklist() {
  return METRICOOL_CONNECTION_CHECKLIST;
}

export function getSlackAgentPlan() {
  return SLACK_AGENT_PLAN;
}
