import { LOCATIONS } from '../constants';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';
import { motion } from 'motion/react';

export default function FindUs() {
  return (
    <div className="bg-diner-cream min-h-screen">
      {/* Header */}
      <section className="py-24 bg-diner-black text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-6xl mb-4 tracking-tighter neon-glow">WHERE'S THE TRUCK?</h1>
          <p className="text-xl font-serif italic opacity-90">Real-time locations and weekly schedules.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* List of Locations */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-3xl mb-8">CURRENT STOPS</h2>
            {LOCATIONS.map((loc, i) => (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 rounded-3xl hover:border-diner-red transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-diner-red p-3 rounded-2xl text-white">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-1 group-hover:text-diner-red transition-colors">{loc.name}</h3>
                    <p className="text-gray-500 font-serif text-sm mb-4">{loc.address}</p>
                    <div className="flex items-center gap-2 text-xs text-diner-teal font-bold uppercase tracking-widest">
                      <Clock className="h-4 w-4" />
                      {loc.hours}
                    </div>
                  </div>
                </div>
                <button className="w-full mt-6 flex items-center justify-center gap-2 bg-diner-chrome text-diner-black py-3 rounded-xl font-display text-xs hover:bg-diner-teal hover:text-white transition-all">
                  <Navigation className="h-4 w-4" /> GET DIRECTIONS
                </button>
              </motion.div>
            ))}

            <div className="bg-diner-teal text-white p-8 rounded-3xl text-center">
              <h3 className="text-2xl mb-4">WANT US AT YOUR EVENT?</h3>
              <p className="font-serif italic mb-6 opacity-90">We do weddings, corporate parties, and block parties.</p>
              <button className="bg-white text-diner-teal px-8 py-3 rounded-full font-display text-sm hover:bg-diner-cream transition-colors">
                BOOK NOW
              </button>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="lg:col-span-2">
            <div className="bg-gray-200 rounded-3xl h-[600px] relative overflow-hidden shadow-inner border-4 border-white">
              <div className="absolute inset-0 flex items-center justify-center text-center p-12">
                <div>
                  <MapPin className="h-16 w-16 text-diner-red mx-auto mb-4 animate-bounce" />
                  <h3 className="text-3xl text-gray-500 mb-4">INTERACTIVE MAP</h3>
                  <p className="text-gray-400 font-serif italic max-w-md">
                    (Integration with Google Maps API would go here. For now, imagine a beautiful retro-styled map showing our trucks in real-time.)
                  </p>
                </div>
              </div>
              {/* Decorative Map Elements */}
              <div className="absolute top-10 left-10 w-32 h-32 bg-diner-teal/10 rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-20 w-48 h-48 bg-diner-red/10 rounded-full blur-3xl" />
            </div>

            {/* Weekly Schedule Table */}
            <div className="mt-12 glass-card p-8 rounded-3xl overflow-hidden">
              <h2 className="text-3xl mb-8">WEEKLY ROUTE</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="py-4 font-display text-diner-red">DAY</th>
                      <th className="py-4 font-display text-diner-red">LOCATION</th>
                      <th className="py-4 font-display text-diner-red">TIME</th>
                    </tr>
                  </thead>
                  <tbody className="font-serif">
                    {[
                      { day: "Monday", loc: "Tech Plaza", time: "11am - 3pm" },
                      { day: "Tuesday", loc: "Arts District", time: "5pm - 10pm" },
                      { day: "Wednesday", loc: "Waterfront", time: "11am - 3pm" },
                      { day: "Thursday", loc: "University Square", time: "11am - 8pm" },
                      { day: "Friday", loc: "Night Market", time: "6pm - 12am" }
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-diner-cream transition-colors">
                        <td className="py-4 font-bold">{row.day}</td>
                        <td className="py-4 text-gray-600">{row.loc}</td>
                        <td className="py-4 text-diner-teal font-mono">{row.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
