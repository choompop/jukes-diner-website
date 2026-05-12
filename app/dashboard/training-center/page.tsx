'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  FileText,
  BookOpen,
  Wrench,
  ChevronRight,
  Search,
  CheckCircle,
  Clock,
  User
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function TrainingCenter() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'videos', label: 'Video Library' },
    { id: 'sops', label: 'SOPs' },
    { id: 'menu', label: 'Menu Guide' },
    { id: 'equipment', label: 'Equipment' }
  ];

  const resources = [
    { type: 'video', category: 'videos', title: 'The 3-Part Expo System', duration: '12:45', role: 'Operator' },
    { type: 'sop', category: 'sops', title: 'Opening Checklist', pages: '4', role: 'All' },
    { type: 'sop', category: 'sops', title: 'Food Prep Standards', pages: '12', role: 'Cook' },
    { type: 'menu', category: 'menu', title: 'Juke Burger Prep & Plating', items: '1', role: 'Cook' },
    { type: 'equipment', category: 'equipment', title: 'Fryer Maintenance & Safety', duration: '8:20', role: 'Cook' },
    { type: 'video', category: 'videos', title: 'Customer Service Standards', duration: '15:30', role: 'Cashier' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-diner-black mb-1">TRAINING CENTER</h1>
          <p className="text-gray-500 font-sans">Master the Juke&apos;s way. Training for cooks, cashiers, and operators.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search training..."
            className="pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-diner-red outline-none text-sm w-full md:w-64"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "px-6 py-2 rounded-full text-xs font-display transition-all",
              activeCategory === cat.id
                ? "bg-diner-red text-white shadow-lg scale-105"
                : "bg-white text-gray-500 hover:bg-gray-50"
            )}
          >
            {cat.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Featured Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative rounded-[2.5rem] overflow-hidden aspect-video bg-diner-black shadow-2xl group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80"
              alt="Training Video"
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-md p-8 rounded-full group-hover:scale-110 transition-transform">
                <Play className="h-12 w-12 text-white fill-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent">
              <span className="text-[10px] font-display text-diner-red uppercase tracking-widest mb-2 block">Featured Training</span>
              <h2 className="text-3xl text-white mb-2">THE 3-PART EXPO SYSTEM</h2>
              <p className="text-white/70 font-sans">Critical Path, Staging, and Batching. The secret to our speed.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-diner-teal text-white p-8 rounded-[2rem] shadow-xl">
            <h3 className="text-2xl mb-4">SOP QUICK LINKS</h3>
            <div className="space-y-4">
              {['Opening Checklist', 'Closing Checklist', 'Health & Safety'].map((sop, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all text-left">
                  <span className="text-sm font-medium">{sop}</span>
                  <FileText className="h-4 w-4 opacity-50" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="text-xl mb-4 text-diner-black">YOUR PROGRESS</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-display text-gray-400 mb-2">
                <span>COMPLETED</span>
                <span>12 / 45</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-diner-red w-[26%]" />
              </div>
              <p className="text-[10px] text-gray-400 font-sans">Keep going! You&apos;re 3 videos away from your next badge.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources
          .filter(r => activeCategory === 'all' || r.category === activeCategory)
          .map((res, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={cn(
                  "p-3 rounded-2xl",
                  res.type === 'video' ? "bg-blue-50 text-blue-500" :
                  res.type === 'sop' ? "bg-red-50 text-red-500" :
                  res.type === 'menu' ? "bg-teal-50 text-teal-500" : "bg-gray-50 text-gray-500"
                )}>
                  {res.type === 'video' ? <Play className="h-5 w-5" /> :
                   res.type === 'sop' ? <FileText className="h-5 w-5" /> :
                   res.type === 'menu' ? <BookOpen className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-display text-gray-400 uppercase tracking-widest">
                  <User className="h-3 w-3" />
                  {res.role}
                </div>
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-4 group-hover:text-diner-red transition-colors">{res.title}</h4>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono">
                  <Clock className="h-3 w-3" />
                  {res.duration || `${res.pages} Pages` || `${res.items} Item`}
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
