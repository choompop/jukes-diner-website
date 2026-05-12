import Link from 'next/link';
import { Truck, Camera, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t-4 border-diner-black bg-diner-black text-white">
      <div className="checker-strip h-6 border-b-4 border-diner-black bg-white" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-diner-red text-white">
                <Truck className="h-7 w-7" />
              </span>
              <div>
                <p className="font-display text-4xl tracking-wide text-diner-cream">JUKE&apos;S DINER</p>
                <p className="text-xs font-black uppercase tracking-[0.35em] text-diner-cream">Nashville on wheels</p>
              </div>
            </div>
            <p className="max-w-xl text-base leading-7 text-gray-300">
              Retro diner energy, Nashville comfort food, and a truck built for events, late nights, neighborhoods, and hungry crowds.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href="https://www.instagram.com/jukesdiner" aria-label="Follow Juke's Diner on Instagram" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/20 p-3 text-white hover:bg-white hover:text-diner-red"><Camera aria-hidden="true" /></a>
              <p className="text-sm font-semibold text-gray-300">Updates drop on Instagram.</p>
            </div>
          </div>

          <div>
            <h2 className="mb-5 font-display text-2xl tracking-wide text-diner-cream">Cruise</h2>
            <ul className="grid gap-1 text-gray-300">
              <li><Link href="/menu" className="py-4 inline-block px-3 hover:text-white">Menu</Link></li>
              <li><Link href="/book" className="py-4 inline-block px-3 hover:text-white">Book Events</Link></li>
              <li><Link href="/find-us" className="py-4 inline-block px-3 hover:text-white">Find Us</Link></li>
              <li><Link href="/apply" className="inline-flex min-h-11 items-center px-3 py-4 hover:text-white">Jobs / Franchise</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-5 font-display text-2xl tracking-wide text-diner-cream">Contact</h2>
            <ul className="grid gap-4 text-sm text-gray-300">
              <li className="flex gap-2"><Mail className="h-5 w-5 text-diner-cream" /> contact@jukesdiner.com</li>
              <li className="flex gap-2"><Phone className="h-5 w-5 text-diner-cream" /> 443-528-9679</li>
              <li className="flex gap-2"><MapPin className="h-5 w-5 text-diner-cream" /> Nashville, TN</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-gray-300 md:flex-row md:items-center md:justify-between">
          <p>&copy; 2026 Juke&apos;s Diner. Built for burgers, bookings, and late-night cravings.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="py-4 inline-block px-3 hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="py-4 inline-block px-3 hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
