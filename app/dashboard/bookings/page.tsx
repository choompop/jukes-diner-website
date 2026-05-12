'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Inbox,
  FileText,
  Calculator,
  Calendar,
  Mail,
  ChevronRight,
  Plus,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { StatusBadge } from '../../../components/StatusBadge';
import integrations from '@/data/dashboard-integrations.json';

export default function Bookings() {
  const [activeTab, setActiveTab] = useState('inbox');

  const tabs = [
    { id: 'inbox', label: 'Booking Inbox', icon: <Inbox className="h-4 w-4" /> },
    { id: 'contracts', label: 'Contracts & COIs', icon: <FileText className="h-4 w-4" /> },
    { id: 'calculator', label: 'Pricing Calc', icon: <Calculator className="h-4 w-4" /> },
    { id: 'calendar', label: 'Google Calendar', icon: <Calendar className="h-4 w-4" /> }
  ];

  const sampleBookings = integrations.googleCalendar.sampleEvents.map((event, index) => ({
    from: event,
    type: index === 0 ? 'Market / public event' : index === 2 ? 'Corporate lunch' : 'Calendar event',
    date: index < 2 ? 'This week' : 'Upcoming',
    status: index === 0 ? 'Confirmed' : 'Calendar',
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-diner-black mb-1">BOOKINGS</h1>
          <p className="text-gray-500 font-sans">Manage event leads, Google Calendar holds, contracts, and quotes.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={integrations.googleCalendar.url} target="_blank" rel="noreferrer" className="border border-diner-teal text-diner-teal px-6 py-3 rounded-xl font-display text-sm hover:bg-diner-teal/5 transition-colors flex items-center gap-2">
            <ExternalLink className="h-4 w-4" /> OPEN CALENDAR
          </a>
          <a href="/book" className="bg-diner-red text-white px-6 py-3 rounded-xl font-display text-sm hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg">
            <Plus className="h-4 w-4" /> NEW INQUIRY
          </a>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
          <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-700" />
          <p className="font-display text-lg text-emerald-900">Calendar read verified</p>
          <p className="mt-2 text-sm text-emerald-800/80">Hermes can read booking@jukesdiner.com. The dashboard links operators directly to it.</p>
        </div>
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-display uppercase tracking-[0.25em] text-gray-400">Safe workflow</p>
          <p className="mt-2 font-display text-lg text-diner-black">Calendar hold links</p>
          <p className="mt-2 text-sm text-gray-500">Booking inquiries generate one-click Google Calendar hold links instead of writing events automatically.</p>
        </div>
        <div className="rounded-3xl border border-yellow-100 bg-yellow-50 p-5">
          <AlertCircle className="mb-3 h-5 w-5 text-yellow-700" />
          <p className="font-display text-lg text-yellow-900">Slack alert approval needed</p>
          <p className="mt-2 text-sm text-yellow-800/80">Set the approved webhook/channel before the public form sends internal alerts.</p>
        </div>
      </section>

      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-8 py-4 text-sm font-display transition-all relative whitespace-nowrap",
              activeTab === tab.id ? "text-diner-red" : "text-gray-400 hover:text-gray-600"
            )}
          >
            {tab.icon}
            {tab.label.toUpperCase()}
            {activeTab === tab.id && (
              <motion.div layoutId="activeTabBookings" className="absolute bottom-0 left-0 right-0 h-1 bg-diner-red" />
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'inbox' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-50 p-5">
              <p className="text-[10px] font-display uppercase tracking-[0.25em] text-gray-400">Calendar-backed operating view</p>
              <h2 className="mt-1 font-display text-xl text-diner-black">Upcoming verified booking signals</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {sampleBookings.map((msg) => (
                <a key={msg.from} href={integrations.googleCalendar.url} target="_blank" rel="noreferrer" className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="bg-diner-cream p-3 rounded-xl text-diner-red">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{msg.from}</h4>
                      <p className="text-xs text-gray-500 font-sans">{msg.type} • {msg.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge variant={msg.status === 'Confirmed' ? 'success' : 'neutral'}>
                      {msg.status}
                    </StatusBadge>
                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-2xl mb-8 text-center">PRICING CALCULATOR</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-display text-gray-500 uppercase tracking-widest mb-2">Guest Count</label>
                <input type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-diner-red outline-none" placeholder="e.g. 100" />
              </div>
              <div>
                <label className="block text-xs font-display text-gray-500 uppercase tracking-widest mb-2">Duration (Hours)</label>
                <input type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-diner-red outline-none" placeholder="e.g. 3" />
              </div>
              <div>
                <label className="block text-xs font-display text-gray-500 uppercase tracking-widest mb-2">Menu Tier</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-diner-red outline-none bg-white">
                  <option>Standard (Burger + Fries)</option>
                  <option>Premium (Burger + Fries + Shake)</option>
                  <option>Custom Selection</option>
                </select>
              </div>
              <div className="pt-8 border-t border-gray-50 text-center">
                <p className="text-sm text-gray-400 font-display uppercase tracking-widest mb-2">Suggested Quote</p>
                <h2 className="text-5xl text-diner-black font-bold">$1,850.00</h2>
                <p className="text-xs text-gray-400 font-sans mt-2">* Draft only. Final quote should account for staffing, travel, menu, minimums, and owner approval.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="grid gap-4 md:grid-cols-2">
            <a href={integrations.googleDrive.url} target="_blank" rel="noreferrer" className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm hover:border-diner-teal">
              <FileText className="mb-4 h-7 w-7 text-diner-teal" />
              <h3 className="font-display text-xl text-diner-black">Contracts, COIs, and docs</h3>
              <p className="mt-2 text-sm text-gray-500">Open the Drive folder while agents finish the direct dashboard document bridge.</p>
            </a>
            <a href={integrations.slack.growthChannel} target="_blank" rel="noreferrer" className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm hover:border-diner-red">
              <Mail className="mb-4 h-7 w-7 text-diner-red" />
              <h3 className="font-display text-xl text-diner-black">Ask Flo for booking handoff</h3>
              <p className="mt-2 text-sm text-gray-500">Use Slack #growth for internal booking questions and follow-up ownership.</p>
            </a>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <Calendar className="mb-4 h-10 w-10 text-diner-teal" />
            <h3 className="text-2xl font-display text-diner-black">GOOGLE CALENDAR IS LINKED</h3>
            <p className="mt-3 max-w-2xl text-sm text-gray-500">Use this calendar for the live booking schedule. Public booking submissions include hold links; automatic event writes stay off until the exact write rules are approved.</p>
            <a href={integrations.googleCalendar.url} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-diner-teal px-5 py-3 font-display text-sm text-white hover:bg-teal-700">
              Open booking@jukesdiner.com <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
