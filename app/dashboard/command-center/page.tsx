'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  CloudSun,
  Calendar,
  CheckSquare,
  MessageSquare,
  Bell,
  ArrowUpRight,
  Clock,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '../../../lib/utils';

export default function CommandCenter() {
  const [weather, setWeather] = useState({ temp: '--', condition: 'Loading...' });
  const [lastSync, setLastSync] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setLastSync(new Date().toLocaleTimeString());
    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // Update every 5 mins
    return () => clearInterval(interval);
  }, []);

  const fetchWeather = async () => {
    try {
      // Nashville coordinates (Juke's Diner home base)
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=36.1627&longitude=-86.7816&current_weather=true');
      const data = await res.json();
      if (data.current_weather) {
        const temp = Math.round((data.current_weather.temperature * 9/5) + 32); // Convert C to F
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

  const stats = [
    { label: "Today's Sales", value: "$1,284.50", sub: "+12% from yesterday", icon: <TrendingUp className="h-5 w-5 text-green-500" /> },
    { label: "Local Weather", value: `${weather.temp} ${weather.condition}`, sub: "Nashville, TN", icon: <CloudSun className="h-5 w-5 text-blue-500" /> },
    { label: "Active Events", value: "3", sub: "Next: Westside Park (2pm)", icon: <Calendar className="h-5 w-5 text-diner-red" /> },
    { label: "Open Tasks", value: "8", sub: "3 due by end of day", icon: <CheckSquare className="h-5 w-5 text-diner-teal" /> }
  ];

  const announcements = [
    { id: 1, author: "John", date: "2h ago", text: "New seasonal milkshake flavor 'Peach Cobbler' launching next week! Check the Training Center for the prep guide." },
    { id: 2, author: "John", date: "1d ago", text: "Reminder: All health permit renewals for Davidson County are due by the 15th." }
  ];

  const upcomingEvents = [
    { id: 1, name: "Westside Park Lunch", time: "Today, 11:00 AM - 2:00 PM", status: "Confirmed" },
    { id: 2, name: "Tech Plaza Dinner", time: "Tomorrow, 5:00 PM - 9:00 PM", status: "Confirmed" },
    { id: 3, name: "Arts District Festival", time: "Sat, 12:00 PM - 10:00 PM", status: "Deposit Paid" }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-diner-black mb-1">COMMAND CENTER</h1>
          <p className="text-gray-500 font-serif italic">Welcome back. Here&apos;s the state of the truck.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end text-[10px] font-mono text-gray-400">
            <span className="uppercase tracking-widest">Last Sync</span>
            <span className="flex items-center gap-1">
              {lastSync}
              <button
                onClick={handleSync}
                className={cn("hover:text-diner-red transition-colors", isSyncing && "animate-spin")}
              >
                <RefreshCw className="h-3 w-3" />
              </button>
            </span>
          </div>
          <Link
            href="/dashboard/brain-dump"
            className="bg-diner-red text-white px-6 py-3 rounded-xl font-display text-sm hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg"
          >
            <MessageSquare className="h-4 w-4" /> QUICK BRAIN DUMP
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">{stat.icon}</div>
              <ArrowUpRight className="h-4 w-4 text-gray-300" />
            </div>
            <p className="text-xs font-display text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-diner-black mb-1">{stat.value}</h3>
            <p className="text-[10px] text-gray-500 font-serif italic">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Events & Tasks */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Events */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="font-display text-lg">UPCOMING EVENTS</h2>
              <Link href="/dashboard/operations" className="text-xs text-diner-teal font-bold hover:underline">VIEW CALENDAR</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-diner-cream p-3 rounded-xl text-diner-red">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{event.name}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" /> {event.time}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest",
                    event.status === 'Confirmed' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  )}>
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Open Tasks */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="font-display text-lg">OPEN TASKS</h2>
              <Link href="/dashboard/operations" className="text-xs text-diner-teal font-bold hover:underline">VIEW ALL</Link>
            </div>
            <div className="p-6 space-y-4">
              {[
                { title: "Order Sysco inventory for weekend", due: "Today", priority: "High" },
                { title: "Clean fryer filters", due: "Tomorrow", priority: "Medium" },
                { title: "Update staff schedule for next week", due: "Fri", priority: "Low" }
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl group cursor-pointer hover:bg-diner-cream transition-colors">
                  <div className="h-5 w-5 rounded border-2 border-gray-300 group-hover:border-diner-red transition-colors" />
                  <div className="flex-grow">
                    <h4 className="text-sm font-medium">{task.title}</h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Due: {task.due} &bull; {task.priority} Priority</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Announcements */}
        <div className="space-y-8">
          <div className="bg-diner-black text-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
              <Bell className="h-5 w-5 text-diner-red" />
              <h2 className="font-display text-lg">ANNOUNCEMENTS</h2>
            </div>
            <div className="p-6 space-y-6">
              {announcements.map((ann) => (
                <div key={ann.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-display text-diner-red uppercase tracking-widest">From: {ann.author}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{ann.date}</span>
                  </div>
                  <p className="text-sm text-gray-300 font-serif leading-relaxed italic">&ldquo;{ann.text}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-diner-teal text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl mb-4">NEED HELP?</h3>
              <p className="text-sm font-serif italic mb-6 opacity-90">Lexi is standing by to help you with any franchise questions or operational issues.</p>
              <Link
                href="/dashboard/support"
                className="bg-white text-diner-teal px-6 py-3 rounded-xl font-display text-xs hover:bg-diner-cream transition-colors inline-block"
              >
                GET SUPPORT
              </Link>
            </div>
            <MessageSquare className="absolute -bottom-4 -right-4 h-32 w-32 text-white/10 rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
