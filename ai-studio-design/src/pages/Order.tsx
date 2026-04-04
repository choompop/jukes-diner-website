import { motion } from 'motion/react';
import { ShoppingCart, CreditCard, Clock, ShieldCheck } from 'lucide-react';

export default function Order() {
  return (
    <div className="bg-diner-cream min-h-screen">
      {/* Header */}
      <section className="py-24 bg-diner-black text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-6xl mb-4 tracking-tighter neon-glow">SKIP THE LINE</h1>
          <p className="text-xl font-serif italic opacity-90">Order ahead and pick up at the truck.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white p-16 rounded-[3rem] shadow-2xl border-8 border-diner-cream relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-diner-red text-white p-6 rounded-full shadow-xl">
              <ShoppingCart className="h-10 w-10" />
            </div>

            <h2 className="text-4xl mb-8 mt-4">ONLINE ORDERING</h2>
            <p className="text-lg text-gray-600 font-serif mb-12 leading-relaxed">
              We're currently integrating our online ordering system with Toast and Square to provide you with the smoothest experience possible.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="space-y-2">
                <div className="bg-diner-cream p-4 rounded-2xl inline-block text-diner-teal">
                  <Clock className="h-6 w-6" />
                </div>
                <h4 className="font-display text-sm">REAL-TIME ETA</h4>
              </div>
              <div className="space-y-2">
                <div className="bg-diner-cream p-4 rounded-2xl inline-block text-diner-teal">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h4 className="font-display text-sm">SECURE PAY</h4>
              </div>
              <div className="space-y-2">
                <div className="bg-diner-cream p-4 rounded-2xl inline-block text-diner-teal">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h4 className="font-display text-sm">LOYALTY POINTS</h4>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-diner-teal text-white px-10 py-4 rounded-full font-display text-lg hover:bg-teal-700 transition-all shadow-lg">
                ORDER VIA TOAST
              </button>
              <button className="bg-diner-black text-white px-10 py-4 rounded-full font-display text-lg hover:bg-gray-800 transition-all shadow-lg">
                ORDER VIA SQUARE
              </button>
            </div>
          </div>

          <p className="mt-12 text-gray-400 font-serif italic">
            * Online ordering is available during truck operating hours only. Please check our schedule before ordering.
          </p>
        </div>
      </div>
    </div>
  );
}
