import Link from 'next/link'
import { ExternalLink, ShoppingBag, Truck } from 'lucide-react'

export default function Order() {
  return (
    <main className="bg-diner-cream">
      <section className="border-b-4 border-diner-black bg-diner-black py-20 text-center text-white">
        <ShoppingBag className="mx-auto mb-4 h-14 w-14 text-diner-teal" />
        <h1 className="text-7xl md:text-9xl">ORDER</h1>
        <p className="mx-auto mt-5 max-w-2xl px-4 text-lg font-bold text-white">Ordering options are rolling out. For now, check delivery availability or book the truck for groups and events.</p>
        <a href="#ordering-options" className="retro-button mt-6 inline-flex bg-diner-teal text-diner-black">See ordering options</a>
        <div className="mx-auto mt-8 grid max-w-5xl gap-6 px-4 md:grid-cols-3">
          <img src="/images/drive/burger-hero.jpg" alt="Juke's Diner burger" className="h-56 w-full rounded-[1.5rem] border-4 border-white object-cover shadow-[8px_8px_0_#d62828]" />
          <img src="/images/drive/loaded-fries.jpg" alt="Juke's loaded fries" className="h-56 w-full rounded-[1.5rem] border-4 border-white object-cover shadow-[8px_8px_0_#2a9d8f]" />
          <img src="/images/drive/funnel-cake-fries.jpg" alt="Juke's sweet funnel cake fries" className="h-56 w-full rounded-[1.5rem] border-4 border-white object-cover shadow-[8px_8px_0_#e9c46a]" />
        </div>
      </section>
      <section id="ordering-options" className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="retro-card p-8">
          <ExternalLink className="mb-4 h-10 w-10 text-diner-red" />
          <h2 className="text-5xl">Delivery</h2>
          <p id="doordash-search-instructions" className="mt-4 leading-7 text-diner-black">Delivery links change by stop and service area. If Juke&apos;s is live near you, search DoorDash for Juke&apos;s Diner in the DoorDash app or website; otherwise check our public stops or book the truck for a group.</p>
          <a href="#doordash-search-instructions" className="retro-button mt-6 bg-diner-red text-white">Check DoorDash availability</a>
        </div>
        <div className="retro-card p-8">
          <Truck className="mb-4 h-10 w-10 text-diner-teal" />
          <h2 className="text-5xl">Events</h2>
          <p className="mt-4 leading-7 text-diner-black">Ordering for a group, office, school, or private event? Submit a booking inquiry instead of guessing.</p>
          <Link href="/book" className="retro-button mt-6 bg-diner-teal text-diner-black">Book Catering</Link>
        </div>
        <div className="retro-card p-8">
          <Truck className="mb-4 h-10 w-10 text-diner-red" />
          <h2 className="text-5xl">Find the truck</h2>
          <p className="mt-4 leading-7 text-diner-black">Want to order in person? Check the latest public stops and special events.</p>
          <Link href="/find-us" className="retro-button mt-6 bg-diner-black text-white">Find Us</Link>
        </div>
      </section>
    </main>
  )
}
