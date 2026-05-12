import Link from 'next/link'
import { BriefcaseBusiness, Store, Users } from 'lucide-react'

export default function Apply() {
  return (
    <main className="bg-diner-cream">
      <section className="border-b-4 border-diner-black bg-diner-teal py-12 text-center text-diner-black md:py-20">
        <p className="font-black uppercase tracking-[0.25em] text-diner-black">Jobs + franchise</p>
        <h1 className="mt-3 text-7xl md:text-9xl">GROW WITH JUKE&apos;S</h1>
        <p className="mx-auto mt-5 max-w-3xl px-4 text-lg font-bold leading-8 text-diner-black">Work the truck, join the event crew, or ask about future franchise opportunities as Juke&apos;s grows.</p>
        <Link href="mailto:contact@jukesdiner.com?subject=Juke%27s%20Franchise%20Inquiry" className="retro-button mt-6 bg-diner-black text-white">Ask about franchise</Link>
        <div className="mx-auto mt-8 grid max-w-5xl gap-6 px-4 md:mt-10 md:grid-cols-2">
          <img src="/images/truck.jpg" alt="Juke's Diner trailer concept for operators" className="h-48 w-full rounded-[1.5rem] border-4 border-diner-black object-cover shadow-[8px_8px_0_#171717] md:h-64" />
          <img src="/images/drive/truck-window-prep.jpg" alt="Juke's Diner food prep inside the truck workflow" className="hidden h-64 w-full rounded-[1.5rem] border-4 border-diner-black object-cover shadow-[8px_8px_0_#d62828] md:block" />
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        {[
          ['Work with us', 'Cooks, window staff, operators, content help, and event crew.', BriefcaseBusiness, 'mailto:contact@jukesdiner.com?subject=Juke%27s%20Job%20Application', 'Apply by email'],
          ['Franchise path', "Brand, training, menu standards, event playbooks, and the practical details of running a Juke's truck.", Store, 'mailto:contact@jukesdiner.com?subject=Juke%27s%20Franchise%20Inquiry', 'Ask about franchise'],
          ['Book the truck', "Want to meet Juke's as a customer first? Bring the truck to an event and see how it runs.", Users, '/book', 'Book the truck'],
        ].map(([title, copy, Icon, href, cta]) => (
          <article key={title} className="retro-card p-8">
            <Icon className="mb-5 h-10 w-10 text-diner-red" />
            <h2 className="text-5xl">{title}</h2>
            <p className="mt-4 leading-7 text-diner-black">{copy}</p>
            <Link href={href} className="retro-button mt-6 bg-diner-black text-white">{cta}</Link>
          </article>
        ))}
      </section>
    </main>
  )
}
