'use client'

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { CheckerboardRed, CheckerboardTeal } from '@/components/checkerboard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden bg-red text-cream">
        <div className="mx-auto grid min-h-[80vh] max-w-[1200px] items-center gap-10 px-6 py-16 md:grid-cols-2 md:px-8 md:py-16">
          <div className="relative z-10">
            <img src="/images/jd-monogram.png" alt="JD" className="mb-4 w-20 rounded-lg" />
            <h1 className="mb-4 text-[clamp(36px,5vw,58px)] leading-[1.1]">
              Nashville&apos;s Retro<br/>Diner on Wheels
            </h1>
            <p className="mb-8 max-w-[450px] text-lg opacity-90">
              A 1950s food truck with jukebox vibes serving comfort food and late night bites. Good eats, all day, all night.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/book" className="inline-block rounded-lg bg-cream px-7 py-3.5 text-base font-semibold text-red no-underline transition-opacity hover:opacity-90">
                Book Us For Your Event
              </Link>
              <Link href="/menu" className="inline-block rounded-lg border-2 border-cream bg-transparent px-7 py-3.5 text-base font-semibold text-cream no-underline transition-opacity hover:opacity-90">
                See the Menu
              </Link>
            </div>
          </div>
          <div className="text-center">
            <img src="/images/truck.png" alt="Juke's Diner Truck" className="w-full max-w-[500px] rounded-2xl" />
          </div>
        </div>
      </div>

      <CheckerboardTeal />

      {/* Menu Section */}
      <div className="bg-brand-black">
        <section className="mx-auto max-w-[1200px] px-6 py-20 text-cream">
          <h2 className="mb-2 text-center text-5xl">Our Eats</h2>
          <p className="mb-12 text-center text-gray-500">Diner classics, done our way. All handheld. All delicious.</p>

          <div className="grid items-start gap-8 md:grid-cols-[1fr_1fr]">
            <div className="overflow-hidden rounded-2xl">
              <img src="/images/food.png" alt="Juke's Diner Food" className="block w-full" />
            </div>
            <div>
              <MenuCategory title="Savory" items={['Diner Burger', 'Philly Cheesesteak', 'Buffalo Chicken Wrap', 'Nashville Hot Chicken Sandwich', 'Chicken Tenders', 'Loaded Fries']} />
              <MenuCategory title="Sweet" items={['Chicken & Waffles', 'Funnel Cake Fries', 'French Toast Sticks', 'Churros', 'Fried Oreos']} />
              <MenuCategory title="Drinks" items={['Lemonade', 'Sweet Tea', 'Cold Brew', 'Milkshakes']} />
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">Menu varies by location and event. Prices available on-site.</p>
          <div className="mt-8 text-center">
            <Link href="/order" className="inline-block rounded-lg bg-red px-10 py-4 text-lg font-semibold text-white no-underline transition-opacity hover:opacity-90">
              Order on DoorDash
            </Link>
          </div>
        </section>
      </div>

      <CheckerboardRed className="h-2" />

      {/* About */}
      <section className="mx-auto max-w-[1200px] px-6 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <img src="/images/route-615.png" alt="Route 615" className="mb-4 w-20" />
            <h2 className="mb-4 text-[40px] text-red">Born on the Back Roads</h2>
            <p className="mb-4 text-[17px] leading-relaxed text-gray-600">
              Juke&apos;s Diner started as a childhood dream at age 12 and came to life in 2025. We serve retro diner-inspired comfort food, from Nashville Hot Chicken Sandwiches to Funnel Cake Fries.
            </p>
            <p className="mb-4 text-[17px] leading-relaxed text-gray-600">
              We&apos;re not just a food truck. We&apos;re building a franchise. A brand. A movement. From late-night Broadway runs to corporate catering, we bring the diner to you.
            </p>
            <p className="text-[17px] leading-relaxed text-gray-600">
              Follow the journey on TikTok as we build this thing from the ground up.
            </p>
          </div>
          <div className="rounded-2xl bg-teal p-10 text-cream">
            <h3 className="mb-6 text-center text-[28px]">Our Promise</h3>
            <div className="grid gap-4">
              {[
                { icon: '🍔', text: 'Real diner food. Not fast food.' },
                { icon: '⚡', text: 'Fast. Most orders under 5 minutes.' },
                { icon: '🧼', text: 'Cleanest truck in Nashville.' },
                { icon: '🎵', text: 'A vibe. Music, personality, good times.' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[28px]">{item.icon}</span>
                  <span className="text-base">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Find Us */}
      <div className="bg-cream-dark">
        <section className="mx-auto max-w-[1200px] px-6 py-20">
          <h2 className="mb-2 text-center text-5xl text-red">Where&apos;s the Truck?</h2>
          <p className="mx-auto mb-8 max-w-[600px] text-center text-gray-500">
            We cruise through Nashville hitting pop-ups, private events, and late-night hot spots. Check our calendar to see where we&apos;re rolling.
          </p>

          <div className="mb-8 rounded-2xl border-2 border-gray-200 bg-white p-8 text-center">
            <p className="mb-4 text-sm text-gray-400">Google Calendar integration coming soon</p>
            <iframe
              src="https://calendar.google.com/calendar/embed?src=wafflewheelsdiner%40gmail.com&ctz=America%2FChicago"
              className="h-[400px] w-full rounded-lg border-0"
              frameBorder="0"
              scrolling="no"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: 'Event Truck', desc: 'Festivals, corporate events, private parties. Book us anywhere in Nashville.', status: 'Booking Now', color: 'bg-red' },
              { name: 'Trailer Park', desc: 'Our permanent location. Come hungry.', status: 'Open', color: 'bg-teal' },
              { name: 'New Locations', desc: 'More spots dropping this summer. Stay tuned.', status: 'Summer 2026', color: 'bg-gray-400' },
            ].map((loc, i) => (
              <div key={i} className="rounded-xl border-2 border-gray-200 bg-white p-7">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-[22px] text-teal">{loc.name}</h3>
                  <span className={`${loc.color} rounded-full px-3 py-1 text-xs font-semibold text-white`}>{loc.status}</span>
                </div>
                <p className="leading-relaxed text-gray-500">{loc.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Book CTA */}
      <div className="bg-teal px-6 py-20 text-center text-cream">
        <h2 className="mb-4 text-[clamp(32px,5vw,52px)]">Make Your Next Event Sizzle</h2>
        <p className="mx-auto mb-8 max-w-[500px] text-lg opacity-90">
          Birthday, wedding, block party, corporate event. We roll up, feed everyone, and make it unforgettable.
        </p>
        <a href="mailto:wafflewheelsdiner@gmail.com" className="inline-block rounded-lg bg-cream px-10 py-4 text-lg font-semibold text-teal no-underline transition-opacity hover:opacity-90">
          Book Your Event
        </a>
        <p className="mt-4 text-sm opacity-70">wafflewheelsdiner@gmail.com</p>
      </div>

      {/* Merch */}
      <section className="mx-auto max-w-[1200px] px-6 py-20 text-center">
        <h2 className="mb-2 text-5xl text-red">Merch</h2>
        <p className="mb-8 text-gray-500">Rep the diner. Shirts, hats, stickers coming soon.</p>
        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-cream-dark p-16">
          <p className="text-lg text-gray-400">Printful store coming soon</p>
        </div>
      </section>

      {/* Apply */}
      <div className="bg-brand-black">
        <section className="mx-auto max-w-[800px] px-6 py-20 text-center text-cream">
          <h2 className="mb-2 text-5xl">Work With Us</h2>
          <p className="mb-4 text-lg text-gray-400">Love food, hustle, and good vibes?</p>
          <p className="mb-8 leading-relaxed text-gray-500">
            Juke&apos;s Diner is more than a food truck. It&apos;s a rolling diner built on flavor, energy, and people who care. We&apos;re looking for cooks, operators, and leaders who want to grow with us.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:wafflewheelsdiner@gmail.com?subject=Job Application" className="inline-block rounded-lg bg-teal px-8 py-3.5 text-base font-semibold text-white no-underline transition-opacity hover:opacity-90">
              Apply to Work
            </a>
            <a href="mailto:wafflewheelsdiner@gmail.com?subject=Franchise Inquiry" className="inline-block rounded-lg border-2 border-gold bg-transparent px-8 py-3.5 text-base font-semibold text-gold no-underline transition-opacity hover:opacity-90">
              Franchise Opportunities
            </a>
          </div>
        </section>
      </div>

      {/* Social */}
      <section className="mx-auto max-w-[1200px] px-6 py-20 text-center">
        <h2 className="mb-2 text-4xl text-red">Follow the Journey</h2>
        <p className="mb-6 text-gray-500">
          We&apos;re documenting everything. The wins, the fails, the real story of building a food truck franchise.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { name: 'TikTok', url: 'https://tiktok.com/@jukesdiner' },
            { name: 'Instagram', url: 'https://instagram.com/jukesdiner' },
            { name: 'Facebook', url: 'https://facebook.com/jukesdiner' },
          ].map((s, i) => (
            <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="inline-block rounded-lg bg-brand-black px-6 py-2.5 text-[15px] font-semibold text-cream no-underline transition-opacity hover:opacity-90">
              {s.name}
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}

function MenuCategory({ title, items }) {
  return (
    <div className="mb-8">
      <h3 className="mb-4 border-b-2 border-gold pb-2 text-[22px] text-gold">{title}</h3>
      {items.map((item, i) => (
        <div key={i} className="border-b border-gray-700 py-2.5 text-base">{item}</div>
      ))}
    </div>
  )
}
