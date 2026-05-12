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
  Plus
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { StatusBadge } from '../../../components/StatusBadge';

export default function Bookings() {
  const [activeTab, setActiveTab] = useState('inbox');

  const tabs = [
    { id: 'inbox', label: 'Booking Inbox', icon: <Inbox className="h-4 w-4" /> },
    { id: 'contracts', label: 'Contracts & COIs', icon: <FileText className="h-4 w-4" /> },
    { id: 'calculator', label: 'Pricing Calc', icon: <Calculator className="h-4 w-4" /> },
    { id: 'calendar', label: 'Google Calendar', icon: <Calendar className="h-4 w-4" /> }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-diner-black mb-1">BOOKINGS</h1>
          <p className="text-gray-500 font-sans">Manage your event pipeline and incoming requests.</p>
        </div>
        <button className="bg-diner-red text-white px-6 py-3 rounded-xl font-display text-sm hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg">
          <Plus className="h-4 w-4" /> NEW BOOKING
        </button>
      </div>

      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-8 py-4 text-sm font-display transition-all relative",
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
            <div className="divide-y divide-gray-50">
              {[
                { from: "Sarah Jenkins", type: "Wedding", date: "June 12, 2026", status: "New" },
                { from: "TechCorp Inc.", type: "Corporate", date: "May 5, 2026", status: "Replied" },
                { from: "Mike Ross", type: "Birthday", date: "April 28, 2026", status: "New" }
              ].map((msg, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="bg-diner-cream p-3 rounded-xl text-diner-red">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{msg.from}</h4>
                      <p className="text-xs text-gray-500 font-sans">{msg.type} Inquiry • {msg.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge variant={msg.status === 'New' ? 'error' : 'neutral'}>
                      {msg.status}
                    </StatusBadge>
                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
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
                <p className="text-xs text-gray-400 font-sans mt-2">* Includes service fee and travel within 20 miles.</p>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'contracts' || activeTab === 'calendar') && (
          <div className="h-full flex flex-col items-center justify-center text-center py-24 opacity-30">
            <Calendar className="h-16 w-16 mb-4" />
            <h3 className="text-2xl font-display">INTEGRATING...</h3>
          </div>
        )}
      </div>
    </div>
  );
}
