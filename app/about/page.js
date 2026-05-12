import Link from 'next/link'
import { ArrowRight, CheckCircle2, Music, Truck } from 'lucide-react'

const values = ['Real diner food, not fast food', 'Clean truck, clean process', 'Personality at the window', 'A playbook operators can repeat']

export default function About() {
  return (
    <main className="bg-diner-cream">
      <section className="border-b-4 border-diner-black bg-diner-red py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
          <div>
            <p className="font-black uppercase tracking-[0.25em] text-white">Our story</p>
            <h1 className="mt-3 text-7xl text-white md:text-9xl">A DINER DREAM ON WHEELS</h1>
            <p className="mt-6 text-xl font-bold leading-8 text-white">Juke&apos;s is retro diner nostalgia rebuilt for Nashville streets, private events, and a franchise system people can actually operate.</p>
          </div>
          <div className="retro-card overflow-hidden bg-white p-3">
            <img src="/images/truck.jpg" alt="Juke's Diner trailer with retro diner artwork" className="h-[380px] w-full rounded-[1.5rem] object-cover" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-6 text-lg leading-8 text-diner-black">
          <p>Juke&apos;s Diner started as a childhood food-truck dream and turned into a Nashville buildout: burgers, cheesesteaks, chicken and waffles, hot chicken, funnel cake fries, and a rolling diner atmosphere.</p>
          <p>The name nods to the jukebox, the checkerboard floor, the chrome, and the founder initials. It should feel nostalgic without being hard to read, cheesy without being sloppy, and operationally tight behind the scenes.</p>
          <p>We&apos;re building in public: the food, the team, the content, the events, and the repeatable playbook that lets a Juke&apos;s truck show up sharp every time.</p>
          <Link href="/book" className="retro-button bg-diner-red text-white">Book an Event <ArrowRight className="ml-2 h-5 w-5" /></Link>
        </div>
        <div className="grid gap-5">
          <img src="/images/drive/fryer-action.jpg" alt="Juke's Diner food being cooked fresh" className="h-56 w-full rounded-[1.5rem] border-4 border-diner-black object-cover shadow-[8px_8px_0_#d62828]" />
          {values.map((value) => (
            <div key={value} className="retro-card flex items-center gap-4 p-5">
              <CheckCircle2 className="h-7 w-7 text-diner-teal" />
              <p className="font-black uppercase tracking-widest">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y-4 border-diner-black bg-diner-black py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {[['1950s vibe', Music], ['Food truck speed', Truck], ['Franchise playbook', CheckCircle2]].map(([title, Icon]) => (
            <div key={title} className="rounded-3xl border-2 border-white/20 bg-white/10 p-8">
              <Icon className="mb-5 h-10 w-10 text-diner-teal" />
              <h2 className="text-4xl">{title}</h2>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
