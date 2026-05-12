import Link from 'next/link'
import { Shirt, Sticker, Timer } from 'lucide-react'

export default function Merch() {
  return (
    <main className="bg-diner-cream">
      <section className="border-b-4 border-diner-black bg-diner-red py-12 text-center text-white md:py-20">
        <img src="/images/jd-monogram.png" alt="Juke's Diner monogram" className="mx-auto mb-5 h-24 w-24 rounded-full border-4 border-diner-black bg-diner-cream p-3 shadow-[6px_6px_0_#171717]" />
        <h1 className="text-7xl text-white md:text-9xl">MERCH</h1>
        <p className="mx-auto mt-5 max-w-2xl px-4 text-lg font-bold text-white">Juke's merch is on the way. Shirts, stickers, and truck-night gear are coming after the first public drop.</p>
        <Link href="https://www.instagram.com/jukesdiner" className="retro-button mt-6 bg-diner-cream text-diner-black">Follow on Instagram</Link>
        <div className="mx-auto mt-8 grid max-w-4xl gap-6 px-4 md:mt-10 md:grid-cols-2">
          <img src="/images/truck.jpg" alt="Juke's Diner trailer branding for future merch" className="h-48 w-full rounded-[1.5rem] border-4 border-white object-cover shadow-[8px_8px_0_#171717] md:h-64" />
          <img src="/images/drive/handheld-bite.jpg" alt="Handheld Juke's Diner food for merch drop energy" className="hidden h-64 w-full rounded-[1.5rem] border-4 border-white object-cover shadow-[8px_8px_0_#2a9d8f] md:block" />
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        {[
          ['Tees + hoodies', Shirt], ['Stickers + decals', Sticker], ['First drop soon', Timer]
        ].map(([title, Icon]) => (
          <div key={title} className="retro-card p-8 text-center">
            <Icon className="mx-auto mb-5 h-12 w-12 text-diner-teal" />
            <h2 className="text-5xl text-diner-red">{title}</h2>
          </div>
        ))}
      </section>
      <section className="mx-auto max-w-3xl px-4 pb-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-5xl text-diner-red">Want first dibs?</h2>
        <p className="mt-4 leading-7 text-diner-black">Follow Juke's on Instagram and TikTok for the first merch drop, pop-up dates, and limited run designs.</p>
        <Link href="https://www.instagram.com/jukesdiner" className="retro-button mt-6 bg-diner-black text-white">Follow on Instagram</Link>
      </section>
    </main>
  )
}
