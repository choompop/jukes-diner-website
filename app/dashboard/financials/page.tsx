'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Download,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function Financials() {
  const stats = [
    { label: "Weekly Sales", value: "$8,420.00", trend: "+8%", up: true },
    { label: "Food Cost %", value: "28.4%", trend: "-2%", up: true },
    { label: "Labor Cost %", value: "18.2%", trend: "+1%", up: false },
    { label: "Avg. Profitability", value: "32%", trend: "+5%", up: true }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-diner-black mb-1">FINANCIALS</h1>
          <p className="text-gray-500 font-serif italic">Operator view: Track your performance and profitability.</p>
        </div>
        <button className="bg-white text-gray-500 px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
          <Download className="h-4 w-4" /> EXPORT REPORT
        </button>
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
            <p className="text-xs font-display text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-diner-black mb-2">{stat.value}</h3>
            <div className={cn(
              "flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest",
              stat.up ? "text-green-500" : "text-red-500"
            )}>
              {stat.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {stat.trend} VS LAST WEEK
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-display text-lg">SALES OVERVIEW</h3>
            <div className="flex gap-2">
              {['7D', '30D', '90D'].map(t => (
                <button key={t} className="px-3 py-1 rounded-lg text-[10px] font-display border border-gray-100 hover:bg-gray-50">{t}</button>
              ))}
            </div>
          </div>
          <div className="flex-grow flex items-end gap-2 px-4">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="flex-grow bg-diner-red/10 rounded-t-lg relative group cursor-pointer" style={{ height: `${h}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-diner-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  ${h * 20}
                </div>
                <div className="absolute inset-0 bg-diner-red opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-4 text-[10px] font-mono text-gray-400">
            <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
          <h3 className="font-display text-lg">COST BREAKDOWN</h3>
          <div className="space-y-6">
            {[
              { label: "Food Cost", value: "28%", color: "bg-diner-red" },
              { label: "Labor Cost", value: "18%", color: "bg-diner-teal" },
              { label: "Operational", value: "12%", color: "bg-diner-black" },
              { label: "Profit Margin", value: "42%", color: "bg-green-500" }
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={cn("h-full", item.color)} style={{ width: item.value }} />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-gray-50">
            <p className="text-[10px] text-gray-400 font-serif italic leading-relaxed">
              * This view is limited to your franchise unit&apos;s performance. Corporate financials are not visible here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
