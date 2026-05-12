'use client';

import {
  ArrowRight,
  BarChart3,
  Bot,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Megaphone,
  MessageSquareText,
  Phone,
  PlugZap,
  Radio,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import {
  CHANNEL_STATUSES,
  CONTENT_PILLARS,
  METRICOOL_VISIBILITY_LAYERS,
  SOCIAL_CHANNELS,
  getAudienceSegments,
  getDashboardStats,
  getHighPriorityNextActions,
  getMetricoolConnectionChecklist,
  getSlackAgentPlan,
  getWeeklyContentPlan,
} from '@/lib/social-dashboard.mjs';
import integrations from '@/data/dashboard-integrations.json';
import { cn } from '@/lib/utils';

const channelIcons: Record<string, React.ReactNode> = {
  tiktok: <Radio className="h-5 w-5" />,
  instagram: <Sparkles className="h-5 w-5" />,
  facebook: <Users className="h-5 w-5" />,
  website: <ExternalLink className="h-5 w-5" />,
  phone: <Phone className="h-5 w-5" />,
  linkedin: <BarChart3 className="h-5 w-5" />,
};

const statusStyles: Record<string, string> = {
  live: 'bg-green-50 text-green-700 border-green-200',
  'needs-cleanup': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'needs-setup': 'bg-red-50 text-diner-red border-red-100',
};

export default function SocialDashboard() {
  const stats = getDashboardStats();
  const audiences = getAudienceSegments();
  const weeklyPlan = getWeeklyContentPlan();
  const priorityActions = getHighPriorityNextActions();
  const metricoolChecklist = getMetricoolConnectionChecklist();
  const slackPlan = getSlackAgentPlan();

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-diner-black text-white p-8 shadow-xl">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-diner-red/30 blur-3xl" />
        <div className="absolute bottom-0 right-12 h-32 w-32 rounded-full bg-diner-teal/30 blur-2xl" />
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-2xl bg-diner-red flex items-center justify-center shadow-lg">
              <Megaphone className="h-5 w-5" />
            </div>
            <span className="font-display text-xs uppercase tracking-[0.35em] text-diner-cream/80">
              Juke&apos;s Growth Command
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl text-white mb-4">SOCIAL MEDIA DASHBOARD</h1>
          <p className="text-lg text-gray-300 font-sans max-w-3xl">
            One operating view for every external surface: founder story, food portfolio,
            community engagement, catering conversion, lead capture, and franchise signal.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={integrations.slack.growthChannel} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-diner-red px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white hover:bg-red-700">
              Open Flo in #growth <ExternalLink className="h-4 w-4" />
            </a>
            <a href={integrations.googleDrive.sheetUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-diner-black hover:bg-diner-cream">
              Content Index <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'External channels', value: stats.totalChannels, icon: <Megaphone className="h-5 w-5" /> },
          { label: 'Live today', value: stats.liveChannels, icon: <CheckCircle2 className="h-5 w-5" /> },
          { label: 'Need setup/cleanup', value: stats.needsSetup, icon: <ClipboardList className="h-5 w-5" /> },
          { label: 'Priority actions', value: stats.highPriorityActions, icon: <Target className="h-5 w-5" /> },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-2xl bg-diner-cream text-diner-red flex items-center justify-center">
                {stat.icon}
              </div>
              <span className="font-display text-3xl text-diner-black">{stat.value}</span>
            </div>
            <p className="text-xs uppercase tracking-widest font-bold text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-11 w-11 rounded-2xl bg-diner-black text-white flex items-center justify-center">
              <PlugZap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-display uppercase tracking-widest text-diner-red mb-1">Metricool integration</p>
              <h2 className="font-display text-2xl text-diner-black">VISIBILITY LAYERS</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {METRICOOL_VISIBILITY_LAYERS.map((layer) => (
              <div key={layer.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-sm text-diner-black">{layer.name}</h3>
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{layer.owner}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">Source: {layer.metricoolSource}</p>
                <p className="text-xs text-gray-700 leading-relaxed">Slack signal: {layer.slackSignal}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-diner-black text-white rounded-3xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Bot className="h-6 w-6 text-diner-teal" />
            <div>
              <p className="text-[10px] font-display uppercase tracking-widest text-diner-cream/70">Slack agent</p>
              <h2 className="font-display text-xl">{slackPlan.channel}</h2>
            </div>
          </div>
          <div className="space-y-3 mb-5">
            {slackPlan.cadence.map((cadence) => (
              <div key={cadence} className="rounded-2xl bg-white/10 border border-white/10 p-3 text-xs font-bold uppercase tracking-widest">
                {cadence}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-300 leading-relaxed mb-3">Agent listens for:</p>
          <ul className="space-y-2">
            {slackPlan.signals.slice(0, 4).map((signal) => (
              <li key={signal} className="flex gap-2 text-xs text-gray-300 leading-relaxed">
                <ArrowRight className="h-3.5 w-3.5 text-diner-teal flex-shrink-0 mt-0.5" />
                {signal}
              </li>
            ))}
          </ul>
          <a href={integrations.slack.allJukesChannel} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white hover:bg-white/20">
            Open #all-jukes-diner <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
          <div>
            <p className="text-[10px] font-display uppercase tracking-widest text-diner-red mb-2">Connection checklist</p>
            <h2 className="font-display text-2xl text-diner-black">METRICOOL → WEBSITE → SLACK</h2>
            <p className="text-gray-500 font-sans">Start with the website, then replace static cards with live Metricool data and Slack alerts.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {metricoolChecklist.map((item, index) => (
            <div key={item.status} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-diner-red text-white text-xs font-bold mb-3">
                {index + 1}
              </span>
              <h3 className="font-bold text-sm text-diner-black mb-2">{item.title}</h3>
              <p className="text-[10px] font-mono text-diner-red bg-white rounded-lg px-2 py-1 mb-3 break-words">{item.envVar}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
          <div>
            <p className="text-[10px] font-display uppercase tracking-widest text-diner-red mb-2">Weekly cadence</p>
            <h2 className="font-display text-2xl text-diner-black">CONTENT CALENDAR STARTER</h2>
            <p className="text-gray-500 font-sans">A simple Monday-Friday rhythm so the channels stop being random.</p>
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">5 posts / week</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {weeklyPlan.map((item) => (
            <div key={item.day} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-display text-sm text-diner-black">{item.day}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-diner-red">
                  {item.channel.name}
                </span>
              </div>
              <p className="text-xs font-bold text-gray-500 mb-2">Owner: {item.owner}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{item.deliverable}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl text-diner-black">CHANNEL OPERATING MAP</h2>
              <p className="text-gray-500 font-sans">What each platform is for and what has to happen next.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SOCIAL_CHANNELS.map((channel) => (
              <div key={channel.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-diner-black text-white flex items-center justify-center">
                      {channelIcons[channel.id]}
                    </div>
                    <div>
                      <h3 className="font-display text-lg leading-none text-diner-black">{channel.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">{channel.role}</p>
                    </div>
                  </div>
                  <span className={cn('text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border', statusStyles[channel.status])}>
                    {CHANNEL_STATUSES[channel.status]}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-display uppercase tracking-widest text-gray-400 mb-1">Audience</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{channel.audience}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-display uppercase tracking-widest text-gray-400 mb-1">Positioning</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{channel.positioning}</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-[10px] font-display uppercase tracking-widest text-gray-400 mb-3">Content system</p>
                    <ul className="space-y-2">
                      {channel.contentSystem.map((item) => (
                        <li key={item} className="flex gap-2 text-xs text-gray-600 leading-relaxed">
                          <ArrowRight className="h-3.5 w-3.5 text-diner-red flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] font-display uppercase tracking-widest text-gray-400 mb-3">Next actions</p>
                    <div className="space-y-2">
                      {channel.nextActions.map((action) => (
                        <label key={action} className="flex gap-3 items-start rounded-xl border border-gray-100 p-3 hover:bg-diner-cream/40 transition-colors">
                          <input type="checkbox" className="mt-0.5 accent-diner-red" />
                          <span className="text-xs font-medium text-gray-700 leading-relaxed">{action}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-diner-red text-white rounded-3xl p-7 shadow-xl">
            <div className="flex items-center gap-3 mb-5">
              <CalendarCheck className="h-6 w-6" />
              <h2 className="font-display text-xl">HIGH-PRIORITY PUNCH LIST</h2>
            </div>
            <div className="space-y-3 max-h-[34rem] overflow-y-auto pr-1">
              {priorityActions.map((item) => (
                <label key={`${item.channelId}-${item.order}`} className="flex gap-3 bg-white/10 border border-white/10 rounded-2xl p-4 text-sm leading-relaxed hover:bg-white/15 transition-colors">
                  <input type="checkbox" className="mt-1 accent-diner-black" />
                  <span>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">
                      {item.channelName} · Step {item.order}
                    </span>
                    {item.action}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <Users className="h-5 w-5 text-diner-teal" />
              <h2 className="font-display text-lg">AUDIENCE LANES</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {audiences.map((audience) => (
                <span key={audience} className="px-3 py-2 rounded-full bg-diner-cream text-xs font-bold text-diner-black">
                  {audience}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <MessageSquareText className="h-5 w-5 text-diner-red" />
              <h2 className="font-display text-lg">CONTENT PILLARS</h2>
            </div>
            <div className="space-y-4">
              {CONTENT_PILLARS.map((pillar) => (
                <div key={pillar.name} className="border border-gray-100 rounded-2xl p-4">
                  <h3 className="font-bold text-sm text-diner-black mb-2">{pillar.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{pillar.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {pillar.channels.map((channel) => (
                      <span key={channel} className="text-[10px] px-2 py-1 bg-gray-50 rounded-full text-gray-500 font-bold">
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
