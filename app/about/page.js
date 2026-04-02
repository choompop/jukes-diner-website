'use client'

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function About() {
  return (
    <>
      <Navbar />

      <div className="mx-auto max-w-[900px] px-6 py-20">
        <img src="/images/route-615.png" alt="Route 615" className="mb-6 w-[100px]" />
        <h1 className="mb-6 text-[56px] text-red">Our Story</h1>

        <div className="space-y-5 text-lg leading-relaxed text-gray-600">
          <p>Juke&apos;s Diner started as a childhood dream. At 12 years old, the founder watched a food truck owner at a festival and thought: I want to do that. 14 years later, he did.</p>
          <p>Born in Nashville in 2025, Juke&apos;s Diner serves retro diner-inspired comfort food from a rolling kitchen. Burgers, cheesesteaks, chicken and waffles, funnel cake fries. Real food, served fast, with personality.</p>
          <p>What started as a single food truck is growing into a franchise. Multiple locations across Nashville, with plans to expand nationally. Every operator gets the playbook, the training, and the brand. They run it. We scale it.</p>
          <p>The name comes from two things: the jukebox (a centerpiece of our retro diner vibe) and our founder&apos;s initials. The checkerboard, the chrome, the music. It&apos;s a 1950s diner experience on wheels.</p>
          <p>We&apos;re documenting the entire journey on TikTok. The wins, the fails, the real story of building a food truck franchise from scratch. Follow along.</p>
        </div>

        <div className="mt-12 rounded-2xl bg-teal p-10 text-cream">
          <h3 className="mb-6 text-center text-[28px]">Our Promise</h3>
          <div className="grid gap-4 sm:grid-cols-2">
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

      <Footer />
    </>
  )
}
