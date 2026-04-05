'use client';

import { motion } from 'motion/react';
import {
  FileText,
  Users,
  ShieldCheck,
  Briefcase,
  Download,
  ExternalLink,
  Search,
  BookOpen
} from 'lucide-react';

export default function Resources() {
  const resourceGroups = [
    {
      title: "Legal & Agreements",
      icon: <ShieldCheck className="h-6 w-6 text-diner-red" />,
      items: [
        { name: "Franchise Agreement Template", type: "PDF", size: "2.4 MB" },
        { name: "Employment Agreement", type: "DOCX", size: "1.1 MB" },
        { name: "Non-Disclosure Agreement (NDA)", type: "PDF", size: "850 KB" },
        { name: "Insurance Requirements Guide", type: "PDF", size: "1.5 MB" }
      ]
    },
    {
      title: "Vendor Contacts",
      icon: <Briefcase className="h-6 w-6 text-diner-teal" />,
      items: [
        { name: "Sysco (Food & Supplies)", contact: "Mark Stevens", phone: "(555) 012-3456" },
        { name: "Toast (POS Support)", contact: "Help Desk", phone: "(888) 445-0555" },
        { name: "Goosehead (Insurance)", contact: "Sarah Miller", phone: "(555) 019-8877" },
        { name: "Lavender Moon (Coffee)", contact: "Alex Rivera", phone: "(555) 014-2233" }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-diner-black mb-1">DOCUMENTS & RESOURCES</h1>
          <p className="text-gray-500 font-serif italic">Everything you need to run your business legally and efficiently.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            className="pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-diner-red outline-none text-sm w-full md:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {resourceGroups.map((group, i) => (
          <div key={i} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center gap-3 bg-gray-50/30">
              {group.icon}
              <h2 className="font-display text-lg">{group.title.toUpperCase()}</h2>
            </div>
            <div className="p-2">
              {group.items.map((item: any, j: number) => (
                <div key={j} className="flex items-center justify-between p-4 rounded-2xl hover:bg-diner-cream transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                      {group.title.includes('Legal') ? <FileText className="h-4 w-4 text-gray-400" /> : <Users className="h-4 w-4 text-gray-400" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-700">{item.name}</h4>
                      <p className="text-[10px] text-gray-400 font-mono uppercase">
                        {item.type ? `${item.type} • ${item.size}` : `${item.contact} • ${item.phone}`}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-300 hover:text-diner-red transition-colors">
                    {item.type ? <Download className="h-5 w-5" /> : <ExternalLink className="h-5 w-5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-diner-black text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-grow space-y-6">
            <h2 className="text-4xl">LEGAL COUNSEL</h2>
            <p className="text-gray-400 font-serif italic text-lg leading-relaxed">
              While we provide templates, we strongly recommend having your own legal counsel review all agreements. Need a referral?
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 px-6 py-3 rounded-xl border border-white/10">
                <p className="text-xs font-display text-diner-red mb-1">Franchise Law</p>
                <p className="text-sm font-bold">Miller & Associates</p>
              </div>
              <div className="bg-white/10 px-6 py-3 rounded-xl border border-white/10">
                <p className="text-xs font-display text-diner-red mb-1">Employment Law</p>
                <p className="text-sm font-bold">The Henderson Group</p>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <BookOpen className="h-32 w-32 text-white/5 -rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
