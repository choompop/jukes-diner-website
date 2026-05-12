'use client';

import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  CheckCircle,
  Calendar,
  AlertTriangle,
  Image as ImageIcon,
  Video,
  DollarSign,
  BookOpen,
  AlertCircle,
  Clock,
  ArrowUpRight,
  RefreshCw,
  CloudSun,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudFog,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '../../../lib/utils';
import {
  COMMAND_CENTER_SECTIONS,
  getTodaysPriorities,
  getBookingsAndLeads,
  getOpenOpsIssues,
  getMediaApprovals,
  getFinancialPulse,
  getSOPShortcuts,
  getBlockersNeedingJohn,
  getOperatorDashboardStats,
} from '../../../lib/command-center.mjs';
import { CARD_PATTERNS } from '../../../lib/design-system';
import { StatusBadge } from '../../../components/StatusBadge';
import { MetricCard } from '../../../components/MetricCard';
import { getWeatherIconConfig } from '../../../lib/weather-icons.mjs';

const ICON_MAP = {
  CheckCircle,
  Calendar,
  AlertTriangle,
  Image: ImageIcon,
  DollarSign,
  BookOpen,
  AlertCircle,
};

// Map weather icon names to icon components
const WEATHER_ICON_MAP = {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudFog,
};

// Helper to get the appropriate weather icon component
function getWeatherIconComponent(condition) {
  const config = getWeatherIconConfig(condition);
  const IconComponent = WEATHER_ICON_MAP[config.icon] || Cloud;
  return { IconComponent, color: config.color };
}

export default function CommandCenter() {
  const shouldReduceMotion = useReducedMotion();
  const [weather, setWeather] = useState({ temp: '--', condition: 'Loading...' });
  const [lastSync, setLastSync] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const priorities = getTodaysPriorities();
  const bookingsLeads = getBookingsAndLeads();
  const opsIssues = getOpenOpsIssues();
  const mediaApprovals = getMediaApprovals();
  const financialPulse = getFinancialPulse();
  const sopShortcuts = getSOPShortcuts();
  const blockers = getBlockersNeedingJohn();
  const stats = getOperatorDashboardStats();

  useEffect(() => {
    setLastSync(new Date().toLocaleTimeString());
    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // Update every 5 mins
    return () => clearInterval(interval);
  }, []);

  const fetchWeather = async () => {
    try {
      // Nashville coordinates (Juke's Diner home base)
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=36.1627&longitude=-86.7816&current_weather=true'
      );
      const data = await res.json();
      if (data.current_weather) {
        const temp = Math.round((data.current_weather.temperature * 9) / 5 + 32);
        const code = data.current_weather.weathercode;
        let condition = 'Clear';
        if (code > 0 && code < 4) condition = 'Partly Cloudy';
        if (code >= 4 && code < 50) condition = 'Foggy';
        if (code >= 50 && code < 70) condition = 'Rainy';
        if (code >= 70) condition = 'Snowy';

        setWeather({ temp: `${temp}°F`, condition });
      }
    } catch (err) {
      console.error('Weather fetch failed:', err);
      setWeather({ temp: '72°F', condition: 'Sunny' }); // Fallback
    }
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date().toLocaleTimeString());
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-diner-black mb-1">OPERATOR COMMAND CENTER</h1>
          <p className="text-gray-500 font-sans">
            Everything you need to know in the next 30 seconds.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end text-[10px] font-mono text-gray-400">
            <span className="uppercase tracking-widest">Last Sync</span>
            <span className="flex items-center gap-1">
              {lastSync}
              <button
                onClick={handleSync}
                className={cn(
                  'p-2.5 hover:text-diner-red hover:bg-red-50 rounded-lg transition-all active:bg-red-100',
                  isSyncing && 'animate-spin'
                )}
                aria-label="Refresh dashboard data"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid - Progressive responsive: 1→2→4 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        <MetricCard
          label="Urgent Tasks"
          value={stats.urgentTasks}
          color="red"
          icon={<AlertTriangle className="h-5 w-5" />}
          trend={{
            direction: stats.urgentTasks > 2 ? 'up' : 'neutral',
            value: stats.urgentTasks > 2 ? '+1' : '—',
            label: 'vs yesterday',
          }}
          linkTo="/dashboard/command-center#priorities"
          ariaLabel="View today's urgent tasks and priorities"
          delay={0}
        />
        <MetricCard
          label="Today Bookings"
          value={stats.todayBookings}
          color="teal"
          icon={<Calendar className="h-5 w-5" />}
          trend={{
            direction: stats.todayBookings > 3 ? 'up' : 'down',
            value: stats.todayBookings > 3 ? '+2' : '-1',
            label: 'vs yesterday',
          }}
          linkTo="/dashboard/bookings"
          ariaLabel="Go to today's bookings and leads"
          delay={0.1}
        />
        <MetricCard
          label="Open Issues"
          value={stats.openIssues}
          color="orange"
          icon={<AlertCircle className="h-5 w-5" />}
          trend={{
            direction: 'neutral',
            value: '—',
            label: 'vs last week',
          }}
          linkTo="/dashboard/command-center#issues"
          ariaLabel="View open operations issues"
          delay={0.2}
        />
        <MetricCard
          label="Media Approvals"
          value={stats.pendingApprovals}
          color="purple"
          icon={<ImageIcon className="h-5 w-5" />}
          trend={{
            direction: 'neutral',
            value: '—',
            label: 'pending review',
          }}
          linkTo="/dashboard/command-center#media"
          ariaLabel="View pending media approvals"
          delay={0.3}
        />
        <MetricCard
          label="Nashville, TN"
          value={weather.temp}
          color={getWeatherIconComponent(weather.condition).color}
          icon={weather.condition === 'Loading...'
            ? <CloudSun className="h-5 w-5" />
            : (() => {
              const { IconComponent } = getWeatherIconComponent(weather.condition);
              return <IconComponent className="h-5 w-5" />;
            })()
          }
          delay={0.4}
          className="md:col-span-2 lg:col-span-1"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Priorities & Bookings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Priorities */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-diner-red" />
                <h2 className="font-display text-lg">TODAY'S PRIORITIES</h2>
              </div>
              <span className="text-xs text-gray-400">{priorities.length} tasks</span>
            </div>
            <div className={CARD_PATTERNS.LIST_WITH_DIVIDERS.container}>
              {priorities.slice(0, 4).map((task, idx) => (
                <motion.div
                  key={task.id}
                  data-testid={`priority-item-${idx}`}
                  initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { delay: idx * 0.05 }}
                  className={CARD_PATTERNS.LIST_WITH_DIVIDERS.item}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-grow">
                      <h4 className="text-sm font-medium mb-1">{task.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.estimatedMinutes} min
                        </span>
                        <span>Owner: {task.owner}</span>
                      </div>
                    </div>
                    <StatusBadge variant={task.priority as 'urgent' | 'high' | 'medium' | 'low'}>
                      {task.priority}
                    </StatusBadge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bookings & Leads */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-diner-teal" />
                <h2 className="font-display text-lg">BOOKINGS & LEADS</h2>
              </div>
              <Link
                href="/dashboard/bookings"
                className="text-xs text-diner-teal font-bold hover:underline"
              >
                VIEW ALL
              </Link>
            </div>
            <div className={CARD_PATTERNS.LIST_WITH_DIVIDERS.container}>
              {bookingsLeads.map((item, idx) => (
                <motion.div
                  key={item.id}
                  data-testid={`booking-item-${idx}`}
                  initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { delay: idx * 0.05 }}
                  className={cn(CARD_PATTERNS.LIST_WITH_DIVIDERS.item, 'p-5')}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-grow space-y-3">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium">{item.name}</h4>
                        <StatusBadge variant={item.type === 'booking' ? 'booking' : 'lead'} size="sm">
                          {item.type}
                        </StatusBadge>
                      </div>
                      <p className="text-xs text-gray-600">{item.nextAction}</p>
                      <div className="flex items-center gap-3 text-xs mt-2">
                        <span className="font-bold text-lg text-diner-red">{item.value}</span>
                        <span className="text-gray-500">{item.contactName}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Open Ops Issues */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <h2 className="font-display text-lg">OPEN OPS ISSUES</h2>
              </div>
              <span className="text-xs text-gray-400">{opsIssues.length} open</span>
            </div>
            <div className={CARD_PATTERNS.LIST_WITH_DIVIDERS.container}>
              {opsIssues.map((issue, idx) => (
                <motion.div
                  key={issue.id}
                  data-testid={`issue-item-${idx}`}
                  initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { delay: idx * 0.05 }}
                  className={CARD_PATTERNS.LIST_WITH_DIVIDERS.item}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-grow">
                      <h4 className="text-sm font-medium mb-1">{issue.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{issue.impact}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>→ {issue.assignedTo}</span>
                      </div>
                    </div>
                    <StatusBadge variant={issue.severity as 'high' | 'medium' | 'low'} size="sm">
                      {issue.severity}
                    </StatusBadge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Approvals, Financial, SOPs, Blockers */}
        <div className="space-y-6">
          {/* Media Approvals */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-5 w-5 text-purple-600" />
                <h2 className="font-display text-sm">MEDIA APPROVALS</h2>
              </div>
            </div>
            <div className={CARD_PATTERNS.COMPACT_LIST.container}>
              {mediaApprovals.map((item, idx) => {
                // Media-type-specific icons
                const MediaIcon = item.type === 'video' ? Video : ImageIcon;
                const iconBgColor = item.type === 'video' 
                  ? 'bg-pink-100' 
                  : 'bg-purple-100';
                const iconColor = item.type === 'video' 
                  ? 'text-pink-600' 
                  : 'text-purple-600';

                return (
                  <motion.div
                    key={item.id}
                    data-testid={`approval-item-${idx}`}
                    initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={shouldReduceMotion ? { duration: 0 } : { delay: idx * 0.05 }}
                    className={CARD_PATTERNS.COMPACT_LIST.item}
                  >
                    <div className="flex gap-3">
                      {/* Media Type Icon */}
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        iconBgColor,
                        iconColor
                      )}>
                        <MediaIcon className="h-5 w-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-grow min-w-0">
                        <h4 className="text-xs font-medium mb-1.5">{item.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <StatusBadge variant={item.type === 'video' ? 'video' : 'image'} size="md">
                            {item.type}
                          </StatusBadge>
                          <span>by {item.submittedBy}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Financial Pulse */}
          <div className="bg-diner-teal text-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center gap-3">
              <DollarSign className="h-5 w-5" />
              <h2 className="font-display text-sm">FINANCIAL PULSE</h2>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <div className="text-xs opacity-80 mb-1">Today's Sales</div>
                <div className="text-2xl font-bold">{financialPulse.todaySales}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                <div>
                  <div className="text-[10px] opacity-80 mb-1">Week</div>
                  <div className="text-sm font-bold">{financialPulse.weekToDate}</div>
                </div>
                <div>
                  <div className="text-[10px] opacity-80 mb-1">Month</div>
                  <div className="text-sm font-bold">{financialPulse.monthToDate}</div>
                </div>
              </div>
              {financialPulse.lowInventoryAlert && (
                <div className="mt-3 p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                  <p className="text-[10px] font-medium">⚠️ {financialPulse.lowInventoryAlert}</p>
                </div>
              )}
            </div>
          </div>

          {/* SOP Shortcuts */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h2 className="font-display text-sm">SOP SHORTCUTS</h2>
            </div>
            <div className="p-4 space-y-2">
              {sopShortcuts.slice(0, 4).map((sop, idx) => (
                <Link
                  key={sop.id}
                  href={sop.path}
                  className="block p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium group-hover:text-diner-teal transition-colors">
                      {sop.title}
                    </span>
                    <ArrowUpRight className="h-3 w-3 text-gray-400 group-hover:text-diner-teal transition-colors" />
                  </div>
                  <StatusBadge variant={sop.category === 'emergency' ? 'emergency' : 'daily-ops'} size="sm">
                    {sop.category}
                  </StatusBadge>
                </Link>
              ))}
            </div>
          </div>

          {/* Blockers Needing John */}
          {blockers.length > 0 && (
            <div className="bg-diner-red text-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-5 border-b border-white/10 flex items-center gap-3">
                <AlertCircle className="h-5 w-5" />
                <h2 className="font-display text-sm">BLOCKERS NEEDING JOHN</h2>
              </div>
            <div className="p-4 space-y-3">
              {blockers.map((blocker, idx) => (
                <div key={blocker.id} className="p-3 bg-white/10 rounded-xl">
                    <h4 className="text-xs font-medium mb-2">{blocker.title}</h4>
                    <p className="text-[10px] opacity-90 mb-2">{blocker.context}</p>
                    <div className="text-[9px] opacity-70">
                      Requested by {blocker.requestedBy}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation to other dashboard areas */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <h3 className="font-display text-sm mb-4 text-gray-600">QUICK LINKS</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            href="/dashboard/franchise-brain"
            className="px-3 py-4 bg-white rounded-xl hover:shadow-md transition-shadow text-center"
          >
            <div className="text-xs font-medium text-gray-800">Franchise Brain</div>
          </Link>
          <Link
            href="/dashboard/marketing"
            className="px-3 py-4 bg-white rounded-xl hover:shadow-md transition-shadow text-center"
          >
            <div className="text-xs font-medium text-gray-800">Marketing Hub</div>
          </Link>
          <Link
            href="/dashboard/hermes-kanban"
            className="px-3 py-4 bg-white rounded-xl hover:shadow-md transition-shadow text-center"
          >
            <div className="text-xs font-medium text-gray-800">Hermes Kanban</div>
          </Link>
          <Link
            href="/dashboard/agents"
            className="px-3 py-4 bg-white rounded-xl hover:shadow-md transition-shadow text-center"
          >
            <div className="text-xs font-medium text-gray-800">Agent Roster</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
