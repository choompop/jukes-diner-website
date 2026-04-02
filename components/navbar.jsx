'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/find-us', label: 'Find Us' },
  { href: '/merch', label: 'Merch' },
  { href: '/apply', label: 'Apply' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-red bg-cream px-4 py-3 md:px-8">
      <Link href="/">
        <img src="/images/jukes-diner-logo.png" alt="Juke's Diner" className="h-[50px]" />
      </Link>

      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="flex flex-col gap-1.5 md:hidden"
        aria-label="Toggle menu"
      >
        <span className="block h-0.5 w-6 bg-brand-black" />
        <span className="block h-0.5 w-6 bg-brand-black" />
        <span className="block h-0.5 w-6 bg-brand-black" />
      </button>

      {/* Links */}
      <div className={`${open ? 'flex' : 'hidden'} w-full flex-col items-start gap-4 md:flex md:w-auto md:flex-row md:items-center`}>
        {links.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className={`text-sm font-semibold no-underline transition-colors ${
              pathname === l.href ? 'text-red' : 'text-brand-black hover:text-red'
            }`}
          >
            {l.label}
          </Link>
        ))}
        <Link
          href="/book"
          className="inline-block rounded-lg bg-red px-6 py-2.5 text-sm font-semibold text-white no-underline transition-opacity hover:opacity-90"
        >
          Book Us
        </Link>
      </div>
    </nav>
  )
}
