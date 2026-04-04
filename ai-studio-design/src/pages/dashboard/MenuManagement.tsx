import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Utensils, 
  Sparkles, 
  DollarSign, 
  Camera, 
  ChevronRight,
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { MENU_ITEMS } from '../../constants';

export default function MenuManagement() {
  const [activeTab, setActiveTab] = useState<'breakfast' | 'main' | 'sides' | 'drinks' | 'sweets'>('main');

  const categories = [
    { id: 'breakfast', label: 'BREAKFAST' },
    { id: 'main', label: 'MAIN MENU' },
    { id: 'sides', label: 'SIDES' },
    { id: 'sweets', label: 'SWEETS' },
    { id: 'drinks', label: 'DRINKS' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-diner-black mb-1">MENU MANAGEMENT</h1>
          <p className="text-gray-500 font-serif italic">Control your offerings, pricing, and food costs.</p>
        </div>
        <button className="bg-diner-red text-white px-6 py-3 rounded-xl font-display text-sm hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg">
          <Plus className="h-4 w-4" /> ADD ITEM
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id as any)}
            className={cn(
              "px-8 py-3 rounded-full font-display text-xs transition-all",
              activeTab === cat.id ? "bg-diner-teal text-white shadow-lg" : "bg-white text-gray-500 hover:bg-gray-50"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {MENU_ITEMS.filter(item => item.category === activeTab).map((item) => (
          <motion.div
            key={item.id}
            layout
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex gap-6 group"
          >
            <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-grow space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <p className="text-xs text-gray-400 font-serif italic">{item.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-300 hover:text-diner-teal transition-colors"><Edit2 className="h-4 w-4" /></button>
                  <button className="p-2 text-gray-300 hover:text-diner-red transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-[10px] font-display text-gray-400 uppercase tracking-widest mb-1">Price</p>
                  <p className="text-sm font-bold text-diner-red">${item.price}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-[10px] font-display text-gray-400 uppercase tracking-widest mb-1">Food Cost</p>
                  <p className="text-sm font-bold text-diner-teal">28%</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-diner-black text-white p-12 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <Sparkles className="h-12 w-12 text-diner-red mx-auto mb-6" />
          <h2 className="text-3xl mb-4">SEASONAL SPECIALS</h2>
          <p className="text-gray-400 font-serif italic max-w-xl mx-auto mb-8">
            Planning a new limited-time offer? Lexi can help you calculate food costs and suggest pricing based on current market trends.
          </p>
          <button className="bg-diner-red text-white px-10 py-4 rounded-full font-display text-sm hover:bg-red-700 transition-colors">
            PLAN NEW SPECIAL
          </button>
        </div>
        <Utensils className="absolute -bottom-8 -left-8 h-48 w-48 text-white/5 -rotate-12" />
      </div>
    </div>
  );
}
