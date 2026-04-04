import { motion } from 'motion/react';
import { Calendar, Users, Camera, Send } from 'lucide-react';

export default function Book() {
  return (
    <div className="bg-diner-cream min-h-screen pb-24">
      {/* Header */}
      <section className="py-24 bg-diner-teal text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 checkerboard opacity-10" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h1 className="text-6xl mb-4 tracking-tighter">BOOK THE TRUCK</h1>
          <p className="text-xl font-serif italic opacity-90">Make your next event legendary.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-10 rounded-3xl"
          >
            <h2 className="text-3xl mb-8">RESERVE YOUR DATE</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-display text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-diner-teal outline-none" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-display text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-diner-teal outline-none" placeholder="john@example.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-display text-gray-500 uppercase tracking-widest mb-2">Event Type</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-diner-teal outline-none bg-white">
                    <option>Wedding</option>
                    <option>Corporate Party</option>
                    <option>Birthday</option>
                    <option>Block Party</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-display text-gray-500 uppercase tracking-widest mb-2">Guest Count</label>
                  <input type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-diner-teal outline-none" placeholder="50+" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-display text-gray-500 uppercase tracking-widest mb-2">Event Date</label>
                <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-diner-teal outline-none" />
              </div>

              <div>
                <label className="block text-xs font-display text-gray-500 uppercase tracking-widest mb-2">Message / Special Requests</label>
                <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-diner-teal outline-none h-32" placeholder="Tell us about your event..."></textarea>
              </div>

              <button className="w-full bg-diner-teal text-white py-4 rounded-xl font-display text-lg hover:bg-teal-700 transition-colors shadow-lg flex items-center justify-center gap-2">
                <Send className="h-5 w-5" /> SEND INQUIRY
              </button>
            </form>
          </motion.div>

          {/* Info & Gallery */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl mb-8">WHY JUKE'S?</h2>
              <div className="space-y-6">
                {[
                  { icon: <Calendar className="h-6 w-6" />, title: "Flexible Scheduling", text: "We work around your timeline to ensure the food is hot and ready when you are." },
                  { icon: <Users className="h-6 w-6" />, title: "High Capacity", text: "Our trucks are built for speed. We can serve up to 200 guests per hour." },
                  { icon: <Camera className="h-6 w-6" />, title: "Photo Ready", text: "Our vintage-style trucks provide a perfect backdrop for your event photos." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="bg-diner-red/10 p-3 rounded-2xl text-diner-red h-fit">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl mb-1">{item.title}</h3>
                      <p className="text-gray-600 font-serif text-sm leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl mb-8">PAST EVENTS</h2>
              <div className="grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80" alt="Wedding" className="rounded-2xl h-40 w-full object-cover shadow-lg" referrerPolicy="no-referrer" />
                <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&q=80" alt="Party" className="rounded-2xl h-40 w-full object-cover shadow-lg" referrerPolicy="no-referrer" />
                <img src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=400&q=80" alt="Festival" className="rounded-2xl h-40 w-full object-cover shadow-lg" referrerPolicy="no-referrer" />
                <img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=80" alt="Corporate" className="rounded-2xl h-40 w-full object-cover shadow-lg" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
