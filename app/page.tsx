import Link from 'next/link';
import { ArrowRight, CalendarCheck, MapPin, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { MENU_ITEMS } from '@/lib/constants';

const offers = [
  { title: 'Book the Truck', copy: 'Corporate lunches, festivals, late-night drops, weddings, and private parties.', href: '/book', icon: CalendarCheck },
  { title: 'Find Us Live', copy: 'See the weekly Nashville route and where the truck is popping up next.', href: '/find-us', icon: MapPin },
  { title: 'Franchise Track', copy: "Interested in working with Juke's or future franchise opportunities? Start here.", href: '/apply', icon: ShieldCheck },
];

export default function Home() {
  const featured = MENU_ITEMS.slice(0, 6);
  return (
    <main>
      <section className="relative overflow-hidden border-b-4 border-diner-black bg-diner-red text-white">
        <div className="checkerboard absolute inset-0 opacity-20" />
        <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-diner-teal/70 blur-3xl" />
        <div className="mx-auto grid min-h-[82vh] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div className="relative z-10">
            <p className="mb-5 inline-flex rounded-full border-4 border-diner-black bg-diner-cream px-5 py-2 text-sm font-black uppercase tracking-[0.25em] text-diner-black shadow-[5px_5px_0_#171717]">Nashville food truck + retro diner energy</p>
            <h1 className="neon-glow text-[5.5rem] text-white leading-[.82] sm:text-[8rem] lg:text-[10rem]">JUKE&apos;S DINER</h1>
            <p className="mt-6 max-w-2xl text-xl font-bold leading-8 text-white sm:text-2xl">Smash burgers, Nashville hot chicken, waffle wheels, loaded fries, and a truck that knows how to work a crowd.</p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href="/book" className="retro-button bg-diner-cream text-diner-black">Book the Truck <ArrowRight className="ml-2 h-5 w-5" /></Link>
              <Link href="/menu" className="retro-button bg-diner-teal text-diner-black">View Menu</Link>
            </div>
          </div>
          <div className="relative z-10">
            <div className="retro-card rotate-2 overflow-hidden bg-diner-cream p-3">
              <img src="/images/truck.jpg" alt="Juke's Diner food trailer wrapped in retro diner artwork" className="h-[420px] w-full rounded-[1.4rem] bg-diner-cream object-cover" />
            </div>
            <div className="retro-card absolute -bottom-8 left-4 max-w-xs -rotate-3 bg-white p-5">
              <p className="font-display text-4xl text-diner-red">ROLL UP. EAT GOOD.</p>
              <p className="text-sm font-bold text-diner-black">Built for lunch rushes, private parties, festivals, and late-night cravings.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-diner-cream py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {offers.map(({ title, copy, href, icon: Icon }) => (
            <Link key={title} href={href} className="retro-card group p-7 transition-transform hover:-translate-y-1">
              <Icon className="mb-5 h-10 w-10 text-diner-red" />
              <h2 className="text-4xl text-diner-black">{title}</h2>
              <p className="mt-3 leading-7 text-diner-black">{copy}</p>
              <p className="mt-5 font-black uppercase tracking-widest text-diner-black">Go</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y-4 border-diner-black bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-black uppercase tracking-[0.25em] text-diner-red">Fan favorites</p>
              <h2 className="text-6xl text-diner-black md:text-7xl">Diner food that moves</h2>
            </div>
            <Link href="/menu" className="retro-button bg-diner-red text-white">Full Menu</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <article key={item.id} className="retro-card overflow-hidden">
                <img src={item.image} alt={item.name} className="h-48 w-full object-cover" referrerPolicy="no-referrer" />
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-3xl text-diner-black">{item.name}</h3>
                    <span className="rounded-full bg-diner-teal px-3 py-1 font-mono text-sm font-bold text-diner-black">${item.price}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-diner-black">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-diner-black py-20 text-white">
        {/* PUBLIC PROOF section: food, events, and customer trust */}
        <div className="halftone absolute inset-0 opacity-40" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="font-black uppercase tracking-[0.25em] text-diner-teal">Why people book us</p>
            <h2 className="mt-3 text-6xl md:text-7xl">Diner food that shows up ready.</h2>
            <p className="mt-6 text-lg leading-8 text-white">Juke's brings the pace of a lunch counter to events, neighborhoods, festivals, and private parties. We keep the line moving, the food hot, and the setup clean so hosts can enjoy the night instead of managing dinner.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {['Fast service', 'Event-ready setup', 'Crowd-friendly menu', 'Clear booking', 'Nashville flavor', 'Clean handoff'].map((item) => (
                <div key={item} className="rounded-3xl border-2 border-white/20 bg-white/10 p-6">
                  <Sparkles className="mb-4 h-6 w-6 text-diner-teal" />
                  <p className="font-black uppercase tracking-widest">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <img src="/images/drive/griddle-prep.jpg" alt="Juke's Diner food being prepared on the griddle" className="h-64 w-full rounded-[1.5rem] border-4 border-white object-cover shadow-[8px_8px_0_#2a9d8f]" />
            <img src="/images/drive/chicken-waffles.jpg" alt="Juke's chicken and waffles ready for service" className="h-64 w-full rounded-[1.5rem] border-4 border-white object-cover shadow-[8px_8px_0_#e9c46a] sm:mt-10" />
          </div>
        </div>
      </section>

      <section className="bg-diner-teal py-20 text-center text-diner-black">
        <div className="mx-auto max-w-4xl px-4">
          <Truck className="mx-auto mb-5 h-14 w-14" />
          <h2 className="text-6xl md:text-8xl">Need the truck at your event?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-xl font-bold leading-8 text-diner-black">Tell us when, where, and how many people you are feeding. We will follow up with availability, menu fit, and next steps.</p>
          <Link href="/book" className="retro-button mt-9 bg-diner-cream text-diner-black">Start Booking</Link>
        </div>
      </section>
    </main>
  );
}
