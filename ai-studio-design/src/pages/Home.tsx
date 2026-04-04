import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { MENU_ITEMS, TESTIMONIALS } from '../constants';
import { Star, ArrowRight, Truck, Clock, MapPin } from 'lucide-react';

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center bg-diner-black">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&w=1920&q=80"
            alt="Retro Diner Food Truck"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-diner-black via-transparent to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl text-white mb-4 tracking-tighter neon-glow">
              JUKE'S DINER
            </h1>
            <p className="text-xl md:text-2xl text-diner-cream font-serif italic mb-8">
              Classic Vibes. Modern Bites. On Wheels.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/menu"
                className="bg-diner-red text-white px-8 py-4 rounded-full font-display text-lg hover:scale-105 transition-transform shadow-xl"
              >
                VIEW MENU
              </Link>
              <Link
                to="/find-us"
                className="bg-diner-teal text-white px-8 py-4 rounded-full font-display text-lg hover:scale-105 transition-transform shadow-xl"
              >
                FIND THE TRUCK
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-20 checkerboard" />
      </section>

      {/* Brand Story */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1550966842-2849a2208869?auto=format&fit=crop&w=800&q=80"
                alt="Diner Interior"
                className="rounded-2xl shadow-2xl relative z-10"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -top-6 -left-6 w-full h-full border-4 border-diner-red rounded-2xl z-0" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl text-diner-red mb-6">OUR STORY</h2>
              <p className="text-lg text-gray-600 mb-6 font-serif leading-relaxed">
                Juke's Diner started with a simple dream: to bring the magic of the 1950s American diner to every street corner. We believe in smashed patties, hand-spun shakes, and service with a smile.
              </p>
              <p className="text-lg text-gray-600 mb-8 font-serif leading-relaxed">
                What began as a single vintage truck has grown into a nationwide franchise, but our heart remains in the kitchen, flipping burgers and making memories.
              </p>
              <Link to="/about" className="text-diner-teal font-display flex items-center gap-2 hover:gap-4 transition-all">
                LEARN MORE ABOUT US <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Menu Highlights */}
      <section className="py-24 bg-diner-cream relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-10 checkerboard" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl text-diner-black mb-4">FAN FAVORITES</h2>
            <p className="text-diner-red font-serif italic text-xl">The hits you can't miss</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {MENU_ITEMS.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-3xl overflow-hidden group"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-diner-red font-display">${item.price}</span>
                    <Link to="/menu" className="text-diner-teal text-xs font-bold uppercase tracking-widest hover:underline">
                      Order Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-10 checkerboard" />
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-diner-red text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-4xl mb-6">WHAT THE FOLKS ARE SAYING</h2>
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-diner-teal text-diner-teal" />
                ))}
              </div>
              <p className="text-white/80 font-serif italic text-lg">
                "Real food, real people, real fast. Juke's is the highlight of my lunch break every single Tuesday."
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              {TESTIMONIALS.map((t) => (
                <div key={t.id} className="bg-white/10 p-8 rounded-3xl border border-white/20">
                  <p className="text-lg mb-6 font-serif italic">"{t.text}"</p>
                  <p className="font-display text-diner-chrome">- {t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-diner-teal text-white text-center relative">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-5xl mb-8">WANT TO JOIN THE JUKE'S FAMILY?</h2>
          <p className="text-xl mb-12 font-serif opacity-90">
            We're looking for passionate entrepreneurs to bring Juke's Diner to their city. Learn about our franchise opportunities today.
          </p>
          <Link
            to="/apply"
            className="bg-white text-diner-teal px-12 py-5 rounded-full font-display text-xl hover:bg-diner-cream transition-colors shadow-2xl inline-block"
          >
            FRANCHISE INFO
          </Link>
        </div>
      </section>
    </div>
  );
}
