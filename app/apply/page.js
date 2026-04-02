'use client'

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function Apply() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-brand-black text-cream">
        <div className="mx-auto max-w-[800px] px-6 py-20">
          <h1 className="mb-4 text-center text-[56px]">Join the Team</h1>
          <p className="mb-12 text-center text-lg text-gray-400">
            Juke&apos;s Diner is more than a food truck. It&apos;s a rolling diner built on flavor, energy, and people who care.
          </p>

          <div className="mb-12 grid gap-8 md:grid-cols-2">
            {/* Work With Us */}
            <div className="rounded-2xl border border-gray-700 bg-[#1a1a2e] p-8">
              <h3 className="mb-4 text-2xl text-teal">Work With Us</h3>
              <p className="mb-6 leading-relaxed text-gray-500">
                We&apos;re looking for cooks, servers, and leaders who want to grow. Flexible hours, good vibes, real experience in the food industry.
              </p>
              <a
                href="mailto:wafflewheelsdiner@gmail.com?subject=Job Application"
                className="inline-block rounded-lg bg-teal px-7 py-3 text-[15px] font-semibold text-white no-underline transition-opacity hover:opacity-90"
              >
                Apply Now
              </a>
            </div>

            {/* Franchise */}
            <div className="rounded-2xl border border-gold bg-[#1a1a2e] p-8">
              <h3 className="mb-4 text-2xl text-gold">Franchise With Us</h3>
              <p className="mb-6 leading-relaxed text-gray-500">
                Want to run your own Juke&apos;s Diner? We provide the truck, the playbook, the training, and the brand. You run it. We grow together.
              </p>
              <a
                href="mailto:wafflewheelsdiner@gmail.com?subject=Franchise Inquiry"
                className="inline-block rounded-lg bg-gold px-7 py-3 text-[15px] font-semibold text-brand-black no-underline transition-opacity hover:opacity-90"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="text-center text-gray-600">
            <p>Questions? Email us at wafflewheelsdiner@gmail.com</p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
