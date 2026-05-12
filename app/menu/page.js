import Link from 'next/link'
import { MENU_ITEMS } from '@/lib/constants'

const groups = [
  ['Main Events', 'main'],
  ['Sides + Loaded Fries', 'sides'],
  ['Sweet Stuff', 'sweets'],
  ['Breakfast', 'breakfast'],
]

export default function Menu() {
  return (
    <main className="bg-diner-cream">
      <section className="border-b-4 border-diner-black bg-diner-black py-12 text-center text-white md:py-16">
        <p className="font-black uppercase tracking-[0.25em] text-diner-cream">The lineup</p>
        <h1 className="mt-3 text-7xl md:text-9xl">MENU</h1>
        <p className="mx-auto mt-5 max-w-2xl px-4 text-lg font-bold text-white">Diner classics, Nashville heat, breakfast hits, and sweet truck-window chaos. Menu may vary by event.</p>
        <Link href="/order" className="retro-button mt-6 bg-diner-cream text-diner-black">Order / Delivery Options</Link>
        <div className="mx-auto mt-8 grid max-w-5xl gap-6 px-4 md:mt-10 md:grid-cols-2">
          <img src="/images/drive/jukes_diner_menu_720.png" alt="Juke's Diner lunch and dinner menu" className="rounded-[1.5rem] border-4 border-diner-cream bg-white shadow-[8px_8px_0_#2a9d8f]" />
          <img src="/images/drive/jukes_diner_breakfast_menu_720.png" alt="Juke's Diner breakfast menu" className="hidden rounded-[1.5rem] border-4 border-diner-cream bg-white shadow-[8px_8px_0_#e9c46a] md:block" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10">
          {groups.map(([label, category]) => {
            const items = MENU_ITEMS.filter((item) => item.category === category)
            return (
              <div key={category}>
                <div className="mb-6 flex items-center gap-4">
                  <h2 className="text-5xl text-diner-red">{label}</h2>
                  <div className="h-1 flex-1 bg-diner-black" />
                </div>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <article key={item.id} className="retro-card overflow-hidden bg-white">
                      <img src={item.image} alt={item.name} className="h-44 w-full object-cover" referrerPolicy="no-referrer" />
                      <div className="p-5">
                        <div className="flex justify-between gap-4">
                          <h3 className="text-3xl">{item.name}</h3>
                          <span className="font-mono font-black text-diner-black">${item.price}</span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-diner-black">{item.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-14 text-center">
          <Link href="/order" className="retro-button bg-diner-red text-white">Order / Delivery Options</Link>
        </div>
      </section>
    </main>
  )
}
