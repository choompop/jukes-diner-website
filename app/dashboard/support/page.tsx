'use client';

import {
  LifeBuoy,
  MessageSquare,
  Mail,
  Phone,
  AlertTriangle,
  ChevronRight,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function Support() {
  const faqs = [
    { q: "How do I update my truck's location on the map?", a: "Go to Operations > Calendar and update your current event. The map syncs automatically every 5 minutes." },
    { q: "What do I do if my Toast POS goes down?", a: "First, check your internet connection. If the issue persists, call Toast Support at (888) 445-0555 and notify John." },
    { q: "How do I request a new seasonal menu item?", a: "Use Lexi AI to draft your proposal, then submit it via the Menu Management 'Plan New Special' button." }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-diner-black mb-1">SUPPORT</h1>
          <p className="text-gray-500 font-sans">We've got your back. Get help from Lexi or the corporate team.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Support Options */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/dashboard/brain-dump"
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
            >
              <div className="bg-diner-red p-4 rounded-2xl inline-block text-white mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-2xl mb-2">CHAT WITH LEXI</h3>
              <p className="text-gray-500 font-sans text-sm mb-6">Context-aware AI support for all operational questions.</p>
              <div className="flex items-center gap-2 text-diner-red font-display text-xs">
                START CHAT <ChevronRight className="h-4 w-4" />
              </div>
            </Link>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all group cursor-pointer">
              <div className="bg-diner-teal p-4 rounded-2xl inline-block text-white mb-6 group-hover:scale-110 transition-transform">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-2xl mb-2">EMAIL JOHN</h3>
              <p className="text-gray-500 font-sans text-sm mb-6">Direct escalation for critical franchise issues.</p>
              <div className="flex items-center gap-2 text-diner-teal font-display text-xs">
                SEND EMAIL <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="font-display text-xl mb-8 flex items-center gap-3">
              <HelpCircle className="h-6 w-6 text-diner-red" />
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="p-6 bg-gray-50 rounded-3xl space-y-2">
                  <h4 className="font-bold text-gray-800">{faq.q}</h4>
                  <p className="text-sm text-gray-600 font-sans leading-relaxed">&ldquo;{faq.a}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="space-y-8">
          <div className="bg-diner-black text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6 text-diner-red">
                <AlertTriangle className="h-6 w-6" />
                <h2 className="font-display text-lg">EMERGENCY</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-display text-gray-500 uppercase tracking-widest mb-1">Truck Maintenance</p>
                  <p className="text-lg font-bold">(555) 019-9911</p>
                </div>
                <div>
                  <p className="text-[10px] font-display text-gray-500 uppercase tracking-widest mb-1">Health & Safety</p>
                  <p className="text-lg font-bold">(555) 019-9922</p>
                </div>
                <div>
                  <p className="text-[10px] font-display text-gray-500 uppercase tracking-widest mb-1">Police/Fire (Non-Emergency)</p>
                  <p className="text-lg font-bold">(555) 019-9900</p>
                </div>
              </div>
            </div>
            <AlertTriangle className="absolute -bottom-8 -right-8 h-48 w-48 text-white/5 -rotate-12" />
          </div>

          <div className="bg-diner-cream p-8 rounded-[2.5rem] border border-diner-chrome/50">
            <h3 className="font-display text-sm mb-4 text-diner-black">QUICK LINKS</h3>
            <div className="space-y-3">
              {['Franchise Portal', 'Toast Backoffice', 'Sysco Shop', 'Goosehead Portal'].map((link, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 bg-white rounded-xl hover:bg-white/50 transition-all text-left group">
                  <span className="text-xs font-bold text-gray-700">{link}</span>
                  <ExternalLink className="h-4 w-4 text-gray-300 group-hover:text-diner-red transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
