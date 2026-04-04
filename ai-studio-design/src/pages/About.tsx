import { motion } from 'motion/react';
import { Truck, Users, Heart, Star, Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';

export default function About() {
  const values = [
    { icon: <Heart className="h-8 w-8" />, title: "Food with Soul", text: "We believe in community, fair wages, second chances, and feeding people like they matter." },
    { icon: <Users className="h-8 w-8" />, title: "Community First", text: "We partner with shelters and aim to franchise a better future for everyone." },
    { icon: <Star className="h-8 w-8" />, title: "Real Mission", text: "Building a new kind of franchise where operators actually own their business." },
    { icon: <Truck className="h-8 w-8" />, title: "Always Rolling", text: "Nashville hot chicken, waffles, and late-night melts served out of a window with a smile." }
  ];

  return (
    <div className="bg-diner-cream">
      {/* Hero */}
      <section className="py-32 bg-diner-black text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 checkerboard opacity-10" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl mb-6 tracking-tighter neon-glow"
          >
            BORN ON THE BACK ROADS
          </motion.h1>
          <p className="text-2xl font-serif italic opacity-90">A tribute to the golden age of diners.</p>
        </div>
      </section>

      {/* The Story - Part 1 */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-5xl text-diner-black leading-tight">BORN ON THE BACK ROADS</h2>
            <div className="space-y-6 text-xl text-gray-600 font-serif leading-relaxed">
              <p>
                Juke's Diner started the way most good things do — with a kid who couldn't sit still and a dream that wouldn't shut up.
              </p>
              <p>
                At 12, John Kyburz told anyone who'd listen he was going to own a restaurant. Not a fancy one. A real one. The kind with checkered floors and a jukebox in the corner and food that makes you close your eyes when you take the first bite.
              </p>
              <p>
                In 2025, that dream rolled out of a commissary kitchen on four wheels. What started as a food truck became something bigger.
              </p>
              <p>
                We're not trying to reinvent the wheel. We're trying to put it back on the road. Juke's Diner is a love letter to the American diner — the place where everybody knew your name, the coffee was always hot, and nobody rushed you out the door. We took that feeling and made it mobile.
              </p>
              <p className="font-bold text-diner-red">
                Nashville Hot Chicken Sandwiches. Chicken and Waffles. Funnel Cake Fries. Diner classics done our way, served out of a window with a smile and a soundtrack.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
              alt="Diner Interior"
              className="rounded-[3rem] shadow-2xl relative z-10 border-8 border-white"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-6 -right-6 w-full h-full border-4 border-diner-red rounded-[3rem] z-0" />
          </motion.div>
        </div>

        {/* Waffle Wheels Heritage */}
        <div className="bg-diner-black text-white p-16 rounded-[4rem] shadow-2xl mb-32 relative overflow-hidden">
          <div className="absolute inset-0 checkerboard opacity-5" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h2 className="text-4xl mb-8 uppercase tracking-widest font-display">From Waffle Wheels to Juke's</h2>
            <p className="text-xl font-serif italic leading-relaxed opacity-80">
              "We’re not just serving food—we’re serving a feeling. Waffle Wheels was where nostalgic comfort met street-side grit. Think hot chicken, sweet waffles made from scratch, and all the things your grandma wouldn’t let you eat before noon."
            </p>
            <div className="mt-12 flex justify-center gap-8">
               <div className="h-1 w-24 bg-diner-red rounded-full" />
               <div className="h-1 w-24 bg-diner-teal rounded-full" />
            </div>
          </div>
        </div>

        {/* The Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <img
              src="https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&w=800&q=80"
              alt="Diner Food"
              className="rounded-[3rem] shadow-2xl border-8 border-white"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8 order-1 lg:order-2"
          >
            <h2 className="text-5xl text-diner-black leading-tight">FIXING THE FRANCHISE MODEL.</h2>
            <div className="space-y-6 text-xl text-gray-600 font-serif leading-relaxed">
              <p>
                We believe the future of small business looks a lot like the past — personal, local, built by people who give a damn. The franchise model broke that. We want to fix it.
              </p>
              <p>
                Juke's Diner is building a new kind of franchise. One where operators actually own their business. Where the playbook is open, the training is real, and the goal isn't to extract value — it's to create it.
              </p>
              <p>
                We use modern tools — AI, automation, systems — so our operators can focus on what matters: the food, the people, and the experience.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-[2.5rem] text-center shadow-sm border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="text-diner-red mb-6 flex justify-center p-4 bg-diner-cream rounded-2xl inline-block">{v.icon}</div>
              <h3 className="text-xl mb-4 font-bold">{v.title}</h3>
              <p className="text-gray-500 font-serif text-sm leading-relaxed italic">"{v.text}"</p>
            </motion.div>
          ))}
        </div>

        {/* Where we're going */}
        <div className="text-center max-w-4xl mx-auto mb-32">
          <h2 className="text-5xl mb-8">WHERE WE'RE GOING.</h2>
          <p className="text-xl text-gray-600 font-serif leading-relaxed mb-8">
            Right now we're rolling through Nashville. Events, trailer parks, late nights on Broadway. By summer we'll be in multiple locations. By next year, we want Juke's Diners in cities across the country — each one locally owned, locally operated, and unmistakably Juke's.
          </p>
          <p className="text-lg text-diner-red font-display mb-12">
            FOLLOW THE JOURNEY. WE'RE DOCUMENTING EVERYTHING. THE WINS, THE FAILS, THE REAL COST OF BUILDING SOMETHING FROM SCRATCH. NO FILTERS. NO FLUFF. JUST THE TRUTH ABOUT WHAT IT TAKES.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            <button className="bg-diner-red text-white px-10 py-4 rounded-full font-display text-sm hover:bg-red-700 transition-all shadow-lg">
              JOIN THE TEAM
            </button>
            <button className="bg-diner-teal text-white px-10 py-4 rounded-full font-display text-sm hover:bg-teal-700 transition-all shadow-lg">
              FRANCHISE INFO
            </button>
          </div>
          <div className="pt-12 border-t border-gray-200">
            <p className="text-3xl font-display text-diner-black tracking-tighter">
              THIS IS JUKE'S DINER. ALL DAY. ALL NIGHT. ROUTE 615.
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-white p-10 rounded-[3rem] border border-gray-100 text-center space-y-4">
              <Phone className="h-10 w-10 text-diner-red mx-auto" />
              <h4 className="font-display text-sm">CALL US</h4>
              <p className="text-xl font-bold">443-528-9679</p>
           </div>
           <div className="bg-white p-10 rounded-[3rem] border border-gray-100 text-center space-y-4">
              <Mail className="h-10 w-10 text-diner-teal mx-auto" />
              <h4 className="font-display text-sm">EMAIL US</h4>
              <p className="text-lg font-bold">contact@jukesdiner.com</p>
           </div>
           <div className="bg-white p-10 rounded-[3rem] border border-gray-100 text-center space-y-4">
              <MapPin className="h-10 w-10 text-diner-black mx-auto" />
              <h4 className="font-display text-sm">MAIN LOCATION</h4>
              <p className="text-sm font-bold">1600 Callis Rd, Lebanon, TN 37090</p>
           </div>
        </div>
      </section>

      {/* Socials Footer */}
      <section className="py-24 bg-diner-black text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-3xl mb-12">FOLLOW THE JOURNEY</h3>
          <div className="flex justify-center gap-12">
            <a href="#" className="hover:text-diner-red transition-colors flex flex-col items-center gap-2">
              <Instagram className="h-8 w-8" />
              <span className="text-[10px] font-display">INSTAGRAM</span>
            </a>
            <a href="#" className="hover:text-diner-red transition-colors flex flex-col items-center gap-2">
              <Facebook className="h-8 w-8" />
              <span className="text-[10px] font-display">FACEBOOK</span>
            </a>
            <a href="#" className="hover:text-diner-red transition-colors flex flex-col items-center gap-2">
              <Truck className="h-8 w-8" />
              <span className="text-[10px] font-display">TIKTOK</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
