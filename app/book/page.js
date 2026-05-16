'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CalendarCheck, CheckCircle2, Loader2, Send } from 'lucide-react'

const fields = [
  ['name', 'Your name', 'text', 'John Kyburz'],
  ['contact', 'Email or phone', 'text', 'you@example.com / 615...'],
  ['eventDate', 'Event date', 'date', ''],
  ['guestCount', 'Guest count', 'number', '75'],
  ['location', 'Event location', 'text', 'Nashville, TN'],
  ['eventType', 'Event type', 'text', 'Corporate lunch, wedding, festival...'],
]

const startTimes = [
  ['08:00', '8:00 AM'],
  ['09:00', '9:00 AM'],
  ['10:00', '10:00 AM'],
  ['11:00', '11:00 AM'],
  ['12:00', '12:00 PM'],
  ['13:00', '1:00 PM'],
  ['14:00', '2:00 PM'],
  ['15:00', '3:00 PM'],
  ['16:00', '4:00 PM'],
  ['17:00', '5:00 PM'],
  ['18:00', '6:00 PM'],
  ['19:00', '7:00 PM'],
  ['20:00', '8:00 PM'],
]

const durations = [
  ['2', '2 hours'],
  ['3', '3 hours'],
  ['4', '4 hours'],
  ['5', '5 hours'],
  ['6', '6 hours'],
  ['8', '8 hours'],
]

export default function Book() {
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  async function submit(e) {
    e.preventDefault()
    const formElement = e.currentTarget
    setStatus('loading')
    setMessage('')
    const form = new FormData(formElement)
    const payload = Object.fromEntries(form.entries())
    try {
      const res = await fetch('/api/book', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Booking failed')
      setStatus('success')
      setMessage("Got it. Your booking inquiry is in, and the Juke's team will follow up with availability and next steps.")
      formElement.reset()
    } catch (err) {
      setStatus('error')
      setMessage(err.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <main className="bg-diner-cream">
      <section className="border-b-4 border-diner-black bg-diner-teal py-16 text-diner-black">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.85fr_1.15fr] lg:px-8">
          <div>
            <p className="font-black uppercase tracking-[0.25em] text-diner-black">Events + catering</p>
            <h1 className="mt-3 text-7xl md:text-9xl">BOOK THE TRUCK</h1>
            <p className="mt-5 text-xl font-bold leading-8 text-diner-black">Tell us about the event, and we will follow up with availability, menu options, and the cleanest way to feed your crowd.</p>
            <Link href="#booking-inquiry" className="retro-button mt-4 bg-diner-red text-white">Start Booking Request</Link>
            <img src="/images/truck.jpg" alt="Juke's Diner food trailer ready for events" className="mt-8 h-64 w-full rounded-[1.5rem] border-4 border-diner-black object-cover shadow-[8px_8px_0_#171717]" />
            <div className="mt-8 grid gap-3">
              {['Corporate lunches', 'Festivals and pop-ups', 'Weddings and private parties', 'Late-night food service'].map((item) => (
                <p key={item} className="flex items-center gap-3 font-bold"><CheckCircle2 className="h-5 w-5" /> {item}</p>
              ))}
            </div>
          </div>
          <form id="booking-inquiry" onSubmit={submit} className="retro-card bg-white p-6 text-diner-black md:p-8">
            <CalendarCheck className="mb-4 h-10 w-10 text-diner-red" />
            <h2 className="text-5xl">Event inquiry</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {fields.map(([name, label, type, placeholder]) => (
                <label key={name} className="grid gap-2 text-sm font-black uppercase tracking-widest">
                  {label}
                  <input name={name} required={['name','contact','eventDate','guestCount'].includes(name)} type={type} placeholder={placeholder} className="rounded-2xl border-3 border-diner-black bg-diner-cream px-4 py-3 font-sans text-base normal-case tracking-normal outline-none focus:border-diner-teal" />
                </label>
              ))}
              <label className="grid gap-2 text-sm font-black uppercase tracking-widest">
                Start time
                <select name="eventStartTime" required defaultValue="" className="rounded-2xl border-3 border-diner-black bg-diner-cream px-4 py-3 font-sans text-base normal-case tracking-normal outline-none focus:border-diner-teal">
                  <option value="" disabled>Select a time</option>
                  {startTimes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-black uppercase tracking-widest">
                How long?
                <select name="durationHours" required defaultValue="3" className="rounded-2xl border-3 border-diner-black bg-diner-cream px-4 py-3 font-sans text-base normal-case tracking-normal outline-none focus:border-diner-teal">
                  {durations.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
            </div>
            <label className="mt-4 grid gap-2 text-sm font-black uppercase tracking-widest">
              Notes
              <textarea name="notes" rows={4} placeholder="Timing, power, parking, menu needs, budget, anything helpful..." className="rounded-2xl border-3 border-diner-black bg-diner-cream px-4 py-3 font-sans text-base normal-case tracking-normal outline-none focus:border-diner-teal" />
            </label>
            <button disabled={status === 'loading'} className="retro-button mt-6 w-full bg-diner-red text-white disabled:opacity-70">
              {status === 'loading' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />} Send Booking Inquiry
            </button>
            {message && <p role={status === 'success' ? 'status' : 'alert'} aria-live={status === 'success' ? 'polite' : 'assertive'} className={`mt-4 rounded-2xl p-4 font-bold ${status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message}</p>}
            <p className="mt-4 text-center text-xs font-bold uppercase tracking-widest text-diner-black">Tell us the basics now, and we will follow up with availability, menu options, and confirmation details.</p>
          </form>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8">
        <h2 className="text-5xl text-diner-red">What happens next</h2>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-diner-black">We review the date, start time, length, location, guest count, and menu needs. If the truck is available, we will send the cleanest path to confirm the booking, lock in the details, and get your crowd fed.</p>
        <Link href="/menu" className="retro-button mt-7 bg-diner-black text-white">View the Menu</Link>
      </section>
    </main>
  )
}
