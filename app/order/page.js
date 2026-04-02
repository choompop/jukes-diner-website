'use client'

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function Order() {
  return (
    <>
      <Navbar />

      <div className="mx-auto max-w-[700px] px-6 py-20 text-center">
        <h1 className="mb-4 text-[56px] text-red">Order Online</h1>
        <p className="mb-12 text-lg text-gray-500">Get Juke&apos;s Diner delivered to your door.</p>

        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-cream-dark p-16">
          <p className="mb-4 text-xl text-gray-400">DoorDash integration coming soon</p>
          <p className="text-sm text-gray-300">In the meantime, find us on DoorDash by searching &quot;Waffle Wheels&quot; or &quot;Juke&apos;s Diner&quot;</p>
        </div>
      </div>

      <Footer />
    </>
  )
}
