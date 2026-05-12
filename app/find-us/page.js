import Link from 'next/link'
import { CalendarDays, MapPin, Truck } from 'lucide-react'

const stops = [
  { name: 'Private events', status: 'Booking now', body: 'Bring the truck to offices, weddings, festivals, neighborhoods, and late-night parties.' },
  { name: 'Weekly pop-ups', status: 'Schedule updated here', body: 'Check the calendar for public stops, special drops, and local events.' },
  { name: 'Nashville area', status: 'More dates soon', body: "We are adding more public stops as the route grows. Follow Juke's for the latest." },
]

export default function FindUs() {
  return (
    <main className="bg-diner-cream">
      <section className="border-b-4 border-diner-black bg-diner-red py-12 text-center text-white md:py-16">
        <MapPin className="mx-auto mb-4 h-12 w-12" />
        <h1 className="text-7xl text-white md:text-9xl">FIND US</h1>
        <p className="mx-auto mt-5 max-w-2xl px-4 text-lg font-bold text-white">Find the next public stop, check upcoming events, or book the truck for your own crowd.</p>
        <Link href="/book" className="retro-button mt-6 bg-diner-cream text-diner-black">Ask about a date</Link>
        <img src="/images/truck.jpg" alt="Juke's Diner trailer on the road for pop-ups and events" className="mx-auto mt-8 h-56 max-w-4xl rounded-[1.5rem] border-4 border-white object-cover shadow-[8px_8px_0_#171717] md:mt-10 md:h-72" />
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="retro-card mb-10 bg-white p-8 text-center">
          <h2 className="text-5xl text-diner-red">Schedule coming together</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-diner-black">We are updating the public calendar now. For current stops or event availability, email contact@jukesdiner.com or send a booking inquiry.</p>
          <Link href="/book" className="retro-button mt-6 bg-diner-red text-white">Ask about a date</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {stops.map((stop) => (
            <article key={stop.name} className="retro-card p-7">
              <Truck className="mb-4 h-9 w-9 text-diner-teal" />
              <h2 className="text-4xl text-diner-red">{stop.name}</h2>
              <p className="mt-2 inline-block rounded-full bg-diner-black px-3 py-1 text-xs font-black uppercase tracking-widest text-white">{stop.status}</p>
              <p className="mt-4 leading-7 text-diner-black">{stop.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 rounded-[2rem] border-4 border-diner-black bg-diner-teal p-8 text-center text-diner-black shadow-[8px_8px_0_#171717]">
          <CalendarDays className="mx-auto mb-4 h-10 w-10" />
          <h2 className="text-5xl">Want Juke&apos;s at your spot?</h2>
          <Link href="/book" className="retro-button mt-6 bg-diner-cream text-diner-black">Book the Truck</Link>
        </div>
      </section>
    </main>
  )
}
