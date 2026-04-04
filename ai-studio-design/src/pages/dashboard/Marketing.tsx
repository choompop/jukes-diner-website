import { motion } from 'motion/react';
import { 
  Palette, 
  Image as ImageIcon, 
  Share2, 
  Calendar, 
  Download,
  ExternalLink,
  Play
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Marketing() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-diner-black mb-1">BRAND & MARKETING</h1>
          <p className="text-gray-500 font-serif italic">Everything you need to look good and grow your audience.</p>
        </div>
        <button className="bg-diner-red text-white px-6 py-3 rounded-xl font-display text-sm hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg">
          <Download className="h-4 w-4" /> DOWNLOAD BRAND KIT
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Brand Guidelines */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="font-display text-xl mb-8">BRAND GUIDELINES</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h4 className="text-[10px] font-display text-gray-400 uppercase tracking-widest">Color Palette</h4>
                <div className="flex gap-4">
                  {['bg-diner-red', 'bg-diner-cream', 'bg-diner-teal', 'bg-diner-black'].map(c => (
                    <div key={c} className={cn("h-12 w-12 rounded-xl shadow-inner", c)} />
                  ))}
                </div>
                <h4 className="text-[10px] font-display text-gray-400 uppercase tracking-widest pt-4">Typography</h4>
                <div className="space-y-2">
                  <p className="font-display text-2xl">Bungee (Display)</p>
                  <p className="font-serif italic text-lg">Playfair Display (Serif)</p>
                  <p className="font-sans font-bold">Inter (Sans-serif)</p>
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="text-[10px] font-display text-gray-400 uppercase tracking-widest">Logo Usage</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                    <span className="text-[10px] text-gray-400">PRIMARY</span>
                  </div>
                  <div className="aspect-square bg-diner-black rounded-2xl flex items-center justify-center">
                    <span className="text-[10px] text-gray-500">REVERSED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Asset Library */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-display text-xl">APPROVED ASSETS</h2>
              <button className="text-xs text-diner-teal font-bold hover:underline">VIEW ALL</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden relative group cursor-pointer">
                  <img 
                    src={`https://images.unsplash.com/photo-${1565123409695 + i}-7b5ef63a2efb?auto=format&fit=crop&w=400&q=80`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Download className="h-6 w-6 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Calendar */}
        <div className="space-y-8">
          <div className="bg-diner-teal text-white p-8 rounded-3xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Share2 className="h-6 w-6" />
              <h2 className="font-display text-lg">TIKTOK PIPELINE</h2>
            </div>
            <div className="space-y-4">
              {[
                { title: "Behind the Scenes: Secret Sauce", date: "Apr 8", status: "Drafting" },
                { title: "Customer Reaction: Juke Burger", date: "Apr 10", status: "Filming" },
                { title: "Truck Prep Routine", date: "Apr 12", status: "Scheduled" }
              ].map((post, i) => (
                <div key={i} className="p-4 bg-white/10 rounded-xl border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold leading-tight">{post.title}</h4>
                    <span className="text-[8px] font-display bg-white/20 px-2 py-0.5 rounded-full">{post.status}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] opacity-60">
                    <Calendar className="h-3 w-3" /> {post.date}
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 bg-white text-diner-teal rounded-xl font-display text-xs hover:bg-diner-cream transition-colors">
              OPEN IN NOTION
            </button>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-display text-lg mb-4">SOCIAL TEMPLATES</h3>
            <div className="space-y-3">
              {['Instagram Story (Menu)', 'Facebook Event Cover', 'Twitter Announcement'].map((t, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-diner-cream transition-all text-left group">
                  <span className="text-sm font-medium text-gray-700">{t}</span>
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
