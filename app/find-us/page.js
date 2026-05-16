import Link from 'next/link'
import { CalendarDays, MapPin, Truck } from 'lucide-react'

const stops = [
  { name: 'Private events', status: 'Booking now', body: 'Bring the truck to offices, weddings, festivals, neighborhoods, and late-night parties.' },
  { name: 'Public pop-ups', status: 'No public stops yet', body: 'There are no confirmed public stops to publish right now. When dates are locked, this page will list the route before guests travel.' },
  { name: 'Nashville area', status: 'Route building', body: "Juke's is building the Nashville route carefully so every public stop is confirmed before it appears here." },
]

export default function FindUs() {
  return (
    <main className="bg-diner-cream">
      <section className="border-b-4 border-diner-black bg-diner-red py-12 text-center text-white md:py-16">
        <MapPin className="mx-auto mb-4 h-12 w-12" />
        <h1 className="text-7xl text-white md:text-9xl">FIND US</h1>
        <p className="mx-auto mt-5 max-w-2xl px-4 text-lg font-bold text-white">Public pop-up stops are not posted yet. Book the truck for your own crowd, or check back here when confirmed Nashville dates go live.</p>
        <Link href="/book" className="retro-button mt-6 bg-diner-cream text-diner-black">Ask about a date</Link>
        <img src="/images/truck.jpg" alt="Juke's Diner trailer on the road for pop-ups and events" className="mx-auto mt-8 h-56 max-w-4xl rounded-[1.5rem] border-4 border-white object-cover shadow-[8px_8px_0_#171717] md:mt-10 md:h-72" />
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="retro-card mb-10 bg-white p-6 text-center sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#087879]">Launch-safe schedule status</p>
          <h2 className="mt-3 text-5xl text-diner-red">No public stops posted yet</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-diner-black">Juke&apos;s does not have public pop-up stops on the board yet. There is no live map or calendar until public dates are confirmed, so nobody has to chase a location that is not ready.</p>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-bold uppercase tracking-widest text-diner-black">Need the truck at your office, wedding, festival, or late-night party? Send the date and we will follow up on availability.</p>
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
