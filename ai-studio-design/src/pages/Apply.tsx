import { motion } from 'motion/react';
import { DollarSign, PieChart, TrendingUp, Users, CheckCircle } from 'lucide-react';

export default function Apply() {
  return (
    <div className="bg-diner-cream min-h-screen pb-24">
      {/* Hero */}
      <section className="py-24 bg-diner-red text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 checkerboard opacity-10" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h1 className="text-6xl mb-4 tracking-tighter">OWN A JUKE'S</h1>
          <p className="text-xl font-serif italic opacity-90">The most exciting franchise opportunity on wheels.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {[
            { icon: <DollarSign />, label: "Low Startup", value: "$75k - $120k" },
            { icon: <TrendingUp />, label: "Avg. Revenue", value: "$450k/yr" },
            { icon: <PieChart />, label: "Royalty Fee", value: "5%" },
            { icon: <Users />, label: "Active Units", value: "42" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-3xl text-center"
            >
              <div className="text-diner-red mb-4 flex justify-center">{stat.icon}</div>
              <p className="text-gray-500 font-display text-xs uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-display text-diner-black">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Why Franchise */}
          <div className="space-y-12">
            <h2 className="text-4xl mb-8">WHY FRANCHISE WITH US?</h2>
            <div className="space-y-8">
              {[
                { title: "Proven Business Model", text: "We've spent years perfecting our operations, menu, and branding so you don't have to." },
                { title: "Full Training & Support", text: "From truck build-out to marketing strategies, we're with you every step of the way." },
                { title: "Exclusive Territories", text: "Own your city. We ensure our franchisees have the space they need to thrive." },
                { title: "National Brand Recognition", text: "Benefit from our growing social media presence and national press coverage." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-diner-teal flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl mb-2">{item.title}</h3>
                    <p className="text-gray-600 font-serif leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-diner-cream"
          >
            <h2 className="text-3xl mb-8 text-center">APPLY NOW</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-display text-gray-500 uppercase tracking-widest mb-2">First Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-diner-red outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-display text-gray-500 uppercase tracking-widest mb-2">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-diner-red outline-none" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-display text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-diner-red outline-none" required />
              </div>

              <div>
                <label className="block text-xs font-display text-gray-500 uppercase tracking-widest mb-2">Target Market / City</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-diner-red outline-none" placeholder="e.g. Austin, TX" required />
              </div>

              <div>
                <label className="block text-xs font-display text-gray-500 uppercase tracking-widest mb-2">Liquid Capital Available</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-diner-red outline-none bg-white">
                  <option>$50k - $100k</option>
                  <option>$100k - $250k</option>
                  <option>$250k+</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-display text-gray-500 uppercase tracking-widest mb-2">Professional Background</label>
                <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-diner-red outline-none h-32" placeholder="Tell us about your experience..."></textarea>
              </div>

              <button className="w-full bg-diner-red text-white py-4 rounded-xl font-display text-lg hover:bg-red-700 transition-colors shadow-lg">
                SUBMIT APPLICATION
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
