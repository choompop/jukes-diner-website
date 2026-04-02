'use client'

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function FindUs() {
  return (
    <>
      <Navbar />

      <div className="mx-auto max-w-[1000px] px-6 py-20">
        <h1 className="mb-2 text-center text-[56px] text-red">Where&apos;s the Truck?</h1>
        <p className="mx-auto mb-12 max-w-[600px] text-center text-gray-500">
          We cruise through Nashville hitting pop-ups, private events, and late-night hot spots. Check our calendar below.
        </p>

        <div className="mb-12 rounded-2xl border-2 border-gray-200 bg-white p-4">
          <iframe
            src="https://calendar.google.com/calendar/embed?src=wafflewheelsdiner%40gmail.com&ctz=America%2FChicago"
            className="h-[500px] w-full rounded-lg border-0"
            frameBorder="0"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { name: 'Event Truck', desc: 'Festivals, corporate events, private parties. Book us anywhere in Nashville.', status: 'Booking Now', color: 'bg-red' },
            { name: 'Trailer Park', desc: 'Our permanent location. Come hungry.', status: 'Open', color: 'bg-teal' },
            { name: 'New Locations', desc: 'More spots dropping this summer. Stay tuned.', status: 'Summer 2026', color: 'bg-gray-400' },
          ].map((loc, i) => (
            <div key={i} className="rounded-xl border-2 border-gray-200 bg-cream-dark p-7">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[22px] text-teal">{loc.name}</h3>
                <span className={`${loc.color} rounded-full px-3 py-1 text-xs font-semibold text-white`}>{loc.status}</span>
              </div>
              <p className="leading-relaxed text-gray-500">{loc.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  )
}
