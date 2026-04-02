'use client'

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function Merch() {
  return (
    <>
      <Navbar />

      <div className="mx-auto max-w-[900px] px-6 py-20 text-center">
        <h1 className="mb-4 text-[56px] text-red">Merch</h1>
        <p className="mb-12 text-lg text-gray-500">Rep the diner. Look good doing it.</p>

        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-cream-dark p-20">
          <img src="/images/jd-monogram.png" alt="JD" className="mx-auto mb-6 w-[100px] opacity-60" />
          <p className="text-xl text-gray-400">Printful store coming soon</p>
          <p className="mt-2 text-sm text-gray-300">Shirts, hats, stickers, and more</p>
        </div>
      </div>

      <Footer />
    </>
  )
}
