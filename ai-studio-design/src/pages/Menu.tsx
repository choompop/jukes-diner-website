import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MENU_ITEMS } from '../constants';
import { cn } from '../lib/utils';
import { Coffee, Utensils, Pizza, Cookie, Beer } from 'lucide-react';

export default function Menu() {
  const [activeTab, setActiveTab] = useState<'breakfast' | 'main' | 'sides' | 'drinks' | 'sweets'>('main');

  const filteredItems = MENU_ITEMS.filter(item => item.category === activeTab);

  const tabs = [
    { id: 'breakfast', label: 'Breakfast', icon: <Coffee className="h-4 w-4" /> },
    { id: 'main', label: 'Main Menu', icon: <Utensils className="h-4 w-4" /> },
    { id: 'sides', label: 'Sides', icon: <Pizza className="h-4 w-4" /> },
    { id: 'sweets', label: 'Sweets', icon: <Cookie className="h-4 w-4" /> },
    { id: 'drinks', label: 'Drinks', icon: <Beer className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-diner-cream pb-24">
      {/* Header */}
      <section className="py-24 bg-diner-teal text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 checkerboard opacity-10" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h1 className="text-6xl mb-4 tracking-tighter">THE BLUEPLATE SPECIAL</h1>
          <p className="text-xl font-serif italic opacity-90">Everything's better when it's served from a truck.</p>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="flex flex-wrap justify-center gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-8 py-4 rounded-full font-display text-sm transition-all shadow-lg",
                activeTab === tab.id 
                  ? "bg-diner-red text-white scale-105" 
                  : "bg-white text-diner-black hover:bg-diner-chrome"
              )}
            >
              {tab.icon}
              {tab.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div key={item.id} className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row gap-6 hover:shadow-2xl transition-shadow">
                  <div className="w-full sm:w-40 h-40 flex-shrink-0 overflow-hidden rounded-2xl border-4 border-diner-cream">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl text-diner-black">{item.name}</h3>
                        <span className="text-diner-red font-display text-xl">${item.price}</span>
                      </div>
                      <p className="text-gray-600 font-serif leading-relaxed">{item.description}</p>
                    </div>
                    <button className="mt-4 bg-diner-teal text-white px-6 py-2 rounded-full font-display text-xs hover:bg-teal-700 transition-colors self-start">
                      ADD TO ORDER
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-24 text-center">
                <p className="text-2xl text-gray-400 font-serif italic">Check back soon for more {activeTab} options!</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Note */}
      <div className="max-w-4xl mx-auto px-4 mt-24 text-center">
        <div className="p-8 border-2 border-dashed border-diner-red rounded-3xl">
          <p className="text-lg text-diner-red font-serif italic">
            * Consuming raw or undercooked meats, poultry, seafood, shellfish, or eggs may increase your risk of foodborne illness. But man, it tastes good.
          </p>
        </div>
      </div>
    </div>
  );
}
