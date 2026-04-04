import { motion } from 'motion/react';
import { ShoppingBag, Star, ArrowRight } from 'lucide-react';

export default function Merch() {
  const products = [
    { id: 1, name: "Classic Juke Tee", price: 24.99, img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80" },
    { id: 2, name: "Retro Diner Cap", price: 19.99, img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=400&q=80" },
    { id: 3, name: "Trucker Hoodie", price: 44.99, img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=400&q=80" },
    { id: 4, name: "Vintage Mug", price: 14.99, img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=400&q=80" }
  ];

  return (
    <div className="bg-diner-cream min-h-screen pb-24">
      {/* Header */}
      <section className="py-24 bg-diner-red text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 checkerboard opacity-10" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h1 className="text-6xl mb-4 tracking-tighter">THE JUKE SHOP</h1>
          <p className="text-xl font-serif italic opacity-90">Wear the vibe. Live the nostalgia.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl">LATEST DROPS</h2>
          <div className="flex items-center gap-2 text-diner-red font-display text-sm">
            <ShoppingBag className="h-5 w-5" />
            <span>0 ITEMS</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-3xl overflow-hidden group"
            >
              <div className="h-64 overflow-hidden relative">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-diner-red">
                  NEW
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl mb-2">{p.name}</h3>
                <p className="text-diner-red font-display mb-6">${p.price}</p>
                <button className="w-full bg-diner-black text-white py-3 rounded-xl font-display text-xs hover:bg-diner-teal transition-colors flex items-center justify-center gap-2">
                  ADD TO CART
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Printful Placeholder */}
        <div className="mt-24 bg-white p-12 rounded-3xl border-4 border-dashed border-gray-200 text-center">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-6" />
          <h3 className="text-3xl text-gray-400 mb-4">PRINTFUL INTEGRATION</h3>
          <p className="text-gray-400 font-serif italic max-w-2xl mx-auto mb-8">
            This shop is ready to be connected to your Printful account. All fulfillment, shipping, and inventory will be handled automatically once integrated.
          </p>
          <div className="flex justify-center gap-4">
            <div className="h-2 w-24 bg-gray-100 rounded-full" />
            <div className="h-2 w-24 bg-gray-100 rounded-full" />
            <div className="h-2 w-24 bg-gray-100 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
