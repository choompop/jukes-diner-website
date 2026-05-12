'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckSquare,
  Package,
  Users,
  Plus,
  Filter,
  Clock,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function Operations() {
  const [activeTab, setActiveTab] = useState('calendar');

  const tabs = [
    { id: 'calendar', label: 'Events Calendar', icon: <Calendar className="h-4 w-4" /> },
    { id: 'tasks', label: 'Task Board', icon: <CheckSquare className="h-4 w-4" /> },
    { id: 'inventory', label: 'Inventory', icon: <Package className="h-4 w-4" /> },
    { id: 'staff', label: 'Staff Schedule', icon: <Users className="h-4 w-4" /> }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-diner-black mb-1">OPERATIONS</h1>
          <p className="text-gray-500 font-sans">Keep the wheels turning. Manage events, tasks, and inventory.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white text-gray-500 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
            <Filter className="h-4 w-4" /> FILTER
          </button>
          <button className="bg-diner-red text-white px-6 py-3 rounded-xl font-display text-sm hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg">
            <Plus className="h-4 w-4" /> NEW {activeTab.toUpperCase()}
          </button>
        </div>
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
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-diner-red" />
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl">APRIL 2026</h3>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-50 rounded-lg">←</button>
                  <button className="p-2 hover:bg-gray-50 rounded-lg">→</button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center mb-4">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                  <div key={d} className="text-[10px] font-display text-gray-400">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {[...Array(30)].map((_, i) => (
                  <div key={i} className={cn(
                    "aspect-square rounded-xl border border-gray-50 p-2 flex flex-col justify-between hover:bg-diner-cream transition-colors cursor-pointer",
                    i + 1 === 4 ? "bg-diner-red/5 border-diner-red/20" : ""
                  )}>
                    <span className={cn(
                      "text-xs font-mono",
                      i + 1 === 4 ? "text-diner-red font-bold" : "text-gray-400"
                    )}>{i + 1}</span>
                    {i + 1 === 4 && <div className="w-full h-1 bg-diner-red rounded-full" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="font-display text-lg">EVENT DETAILS</h3>
              {[
                { name: "Westside Park Lunch", status: "Confirmed", time: "11:00 AM" },
                { name: "Tech Plaza Dinner", status: "Confirmed", time: "5:00 PM" }
              ].map((ev, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm">{ev.name}</h4>
                    <span className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full uppercase tracking-widest">{ev.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-4 w-4" /> {ev.time}
                  </div>
                  <button className="w-full py-3 bg-gray-50 rounded-xl text-xs font-display hover:bg-diner-cream transition-colors">
                    VIEW DETAILS
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <h3 className="text-2xl">INVENTORY TRACKER</h3>
              <button className="bg-diner-teal text-white px-6 py-2 rounded-xl font-display text-xs hover:bg-teal-700 transition-colors">
                ORDER FROM SYSCO
              </button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-display text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <th className="px-8 py-4">Item Name</th>
                  <th className="px-8 py-4">Stock</th>
                  <th className="px-8 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="font-sans">
                {[
                  { name: "Beef Patties (80/20)", stock: "45 lbs", status: "Critical" },
                  { name: "Brioche Buns", stock: "120 units", status: "Low" },
                  { name: "Secret Sauce Base", stock: "5 gal", status: "Healthy" }
                ].map((item, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-4 font-bold text-gray-700">{item.name}</td>
                    <td className="px-8 py-4 text-sm font-mono">{item.stock}</td>
                    <td className="px-8 py-4">
                      <span className={cn(
                        "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest",
                        item.status === 'Critical' ? "bg-red-100 text-red-700" :
                        item.status === 'Low' ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                      )}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(activeTab === 'tasks' || activeTab === 'staff') && (
          <div className="h-full flex flex-col items-center justify-center text-center py-24 opacity-30">
            <AlertCircle className="h-16 w-16 mb-4" />
            <h3 className="text-2xl font-display">SYNCING WITH NOTION...</h3>
          </div>
        )}
      </div>
    </div>
  );
}
