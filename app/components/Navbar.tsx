'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Truck, CalendarCheck } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Menu', path: '/menu' },
  { name: 'Book', path: '/book' },
  { name: 'Find Us', path: '/find-us' },
  { name: 'About', path: '/about' },
  { name: 'Merch', path: '/merch' },
  { name: 'Franchise', path: '/apply' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="sticky top-0 z-50 border-b-4 border-diner-black bg-diner-cream text-diner-black shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3 rounded-full py-2 pr-2 focus-visible:outline focus-visible:outline-4 focus-visible:outline-diner-cream">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-diner-black bg-diner-cream text-diner-red shadow-[4px_4px_0_#1a1a1a] transition-transform group-hover:-rotate-6">
              <Truck className="h-7 w-7" />
            </span>
            <span className="leading-none">
              <span className="block font-display text-3xl tracking-wide text-diner-red">JUKE&apos;S</span>
              <span className="-mt-1 block text-xs font-black uppercase tracking-[0.35em] text-diner-black">Diner</span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  'rounded-full text-sm font-medium hover:text-diner-chrome py-3 px-4 font-black uppercase tracking-[0.16em] transition-all hover:bg-diner-black focus-visible:outline focus-visible:outline-4 focus-visible:outline-diner-cream',
                  pathname === link.path ? 'bg-diner-black text-white shadow-[3px_3px_0_#d93939]' : 'text-diner-black'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/book" className="inline-flex items-center gap-2 rounded-full border-4 border-diner-black bg-diner-teal px-5 py-3 text-sm font-black uppercase tracking-widest text-diner-black shadow-[4px_4px_0_#1a1a1a] transition-transform hover:-translate-y-0.5">
              <CalendarCheck className="h-4 w-4" /> Book
            </Link>
          </div>

          <button
            type="button"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-full border-3 border-diner-black bg-white p-3 text-diner-black shadow-[3px_3px_0_#1a1a1a] lg:hidden"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t-4 border-diner-black bg-diner-cream lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2 px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'rounded-2xl border-2 border-diner-black px-4 py-4 text-base font-black uppercase tracking-widest',
                  pathname === link.path ? 'bg-diner-black text-white' : 'bg-white text-diner-black'
                )}
              >
                {link.name}
              </Link>
            ))}

          </div>
        </div>
      )}
    </nav>
  );
}
