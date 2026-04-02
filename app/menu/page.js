'use client'

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import Link from 'next/link'

export default function Menu() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-brand-black">
        <div className="mx-auto max-w-[1000px] px-6 py-20 text-cream">
          <h1 className="mb-2 text-center text-[56px]">Our Eats</h1>
          <p className="mb-12 text-center text-gray-400">Diner classics, done our way. All handheld. All delicious.</p>

          <div className="grid gap-12 md:grid-cols-2">
            <div className="space-y-8">
              <img src="/images/food.png" alt="Food" className="w-full rounded-2xl" />
              <img src="/images/food-photo.jpg" alt="Food" className="w-full rounded-2xl" />
            </div>
            <div>
              <MenuSection title="Savory" items={['Diner Burger', 'Philly Cheesesteak', 'Buffalo Chicken Wrap', 'Nashville Hot Chicken Sandwich', 'Chicken Tenders', 'Loaded Fries']} />
              <MenuSection title="Sweet" items={['Chicken & Waffles', 'Funnel Cake Fries', 'French Toast Sticks', 'Churros', 'Fried Oreos']} />
              <MenuSection title="Drinks" items={['Lemonade', 'Sweet Tea', 'Cold Brew', 'Milkshakes']} />
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/order" className="inline-block rounded-lg bg-red px-10 py-4 text-lg font-semibold text-white no-underline transition-opacity hover:opacity-90">
              Order on DoorDash
            </Link>
          </div>
          <p className="mt-6 text-center text-sm text-gray-600">Menu varies by location and event. Prices available on-site.</p>
        </div>
      </div>

      <Footer />
    </>
  )
}

function MenuSection({ title, items }) {
  return (
    <div className="mb-8">
      <h3 className="mb-4 border-b-2 border-gold pb-2 text-[22px] text-gold">{title}</h3>
      {items.map((item, i) => (
        <div key={i} className="border-b border-gray-700 py-3 text-base">{item}</div>
      ))}
    </div>
  )
}
