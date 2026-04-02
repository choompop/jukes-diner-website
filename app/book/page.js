'use client'

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function Book() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-teal text-cream">
        <div className="mx-auto max-w-[700px] px-6 py-20 text-center">
          <h1 className="mb-4 text-[56px]">Book Juke&apos;s Diner</h1>
          <p className="mb-12 text-xl opacity-90">
            Corporate events, weddings, festivals, block parties, late night spots. We roll up, feed everyone, and make it unforgettable.
          </p>

          <div className="mb-8 rounded-2xl bg-white/10 p-10">
            <h3 className="mb-6 text-2xl">What We Offer</h3>
            <div className="mx-auto grid max-w-[400px] gap-4 text-left">
              {[
                'Full service food truck at your event',
                'Custom menu options available',
                'Setup and cleanup included',
                'Flexible pricing based on headcount',
                'Invoice or credit card payment',
                'Available Nashville-wide',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="font-bold text-gold">+</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <a
            href="mailto:wafflewheelsdiner@gmail.com?subject=Event Booking Inquiry"
            className="inline-block rounded-lg bg-cream px-12 py-4 text-lg font-semibold text-teal no-underline transition-opacity hover:opacity-90"
          >
            Get in Touch
          </a>
          <p className="mt-4 text-sm opacity-70">wafflewheelsdiner@gmail.com</p>
        </div>
      </div>

      <Footer />
    </>
  )
}
