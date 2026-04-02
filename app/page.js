'use client'

export default function Home() {
  return (
    <>
      {/* Nav */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 32px', background: 'var(--cream)', borderBottom: '3px solid var(--red)',
        position: 'sticky', top: 0, zIndex: 100, flexWrap: 'wrap', gap: 12
      }}>
        <img src="/images/jukes-diner-logo.png" alt="Juke's Diner" style={{ height: 50 }} />
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="#menu" style={navLink}>Menu</a>
          <a href="#about" style={navLink}>About</a>
          <a href="#find-us" style={navLink}>Find Us</a>
          <a href="#merch" style={navLink}>Merch</a>
          <a href="#apply" style={navLink}>Apply</a>
          <a href="#book" style={{...btn, background:'var(--red)', color:'white'}}>Book Us</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        background: 'var(--red)', color: 'var(--cream)', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '80vh',
          maxWidth: 1200, margin: '0 auto', alignItems: 'center', gap: 40, padding: '60px 32px'
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <img src="/images/jd-monogram.png" alt="JD" style={{ width: 80, marginBottom: 16, borderRadius: 8 }} />
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 58px)', lineHeight: 1.1, marginBottom: 16 }}>
              Nashville's Retro<br/>Diner on Wheels
            </h1>
            <p style={{ fontSize: 18, opacity: 0.9, marginBottom: 32, maxWidth: 450 }}>
              A 1950s food truck with jukebox vibes serving comfort food and late night bites. Good eats, all day, all night.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="#book" style={{...btn, background:'var(--cream)', color:'var(--red)', fontSize:16, padding:'14px 28px'}}>Book Us For Your Event</a>
              <a href="#menu" style={{...btn, background:'transparent', color:'var(--cream)', border:'2px solid var(--cream)', fontSize:16, padding:'14px 28px'}}>See the Menu</a>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <img src="/images/truck.png" alt="Juke's Diner Truck" style={{ width: '100%', maxWidth: 500, borderRadius: 16 }} />
          </div>
        </div>
      </div>

      {/* Checkerboard */}
      <div className="checkerboard-teal" style={{ height: 12 }} />

      {/* Menu */}
      <div style={{ background: 'var(--black)' }}>
        <section id="menu" style={{ color: 'var(--cream)', padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 48, textAlign: 'center', marginBottom: 8 }}>Our Eats</h2>
          <p style={{ textAlign: 'center', color: '#999', marginBottom: 48 }}>Diner classics, done our way. All handheld. All delicious.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, alignItems: 'start' }}>
            {/* Food image */}
            <div style={{ borderRadius: 16, overflow: 'hidden' }}>
              <img src="/images/food.png" alt="Juke's Diner Food" style={{ width: '100%', display: 'block' }} />
            </div>
            
            {/* Menu items */}
            <div>
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ color: 'var(--gold)', fontSize: 22, marginBottom: 16, borderBottom: '2px solid var(--gold)', paddingBottom: 8 }}>Savory</h3>
                {['Diner Burger', 'Philly Cheesesteak', 'Buffalo Chicken Wrap', 'Nashville Hot Chicken Sandwich', 'Chicken Tenders', 'Loaded Fries'].map((item, i) => (
                  <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #333', fontSize: 16 }}>{item}</div>
                ))}
              </div>
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ color: 'var(--gold)', fontSize: 22, marginBottom: 16, borderBottom: '2px solid var(--gold)', paddingBottom: 8 }}>Sweet</h3>
                {['Chicken & Waffles', 'Funnel Cake Fries', 'French Toast Sticks', 'Churros', 'Fried Oreos'].map((item, i) => (
                  <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #333', fontSize: 16 }}>{item}</div>
                ))}
              </div>
              <div>
                <h3 style={{ color: 'var(--gold)', fontSize: 22, marginBottom: 16, borderBottom: '2px solid var(--gold)', paddingBottom: 8 }}>Drinks</h3>
                {['Lemonade', 'Sweet Tea', 'Cold Brew', 'Milkshakes'].map((item, i) => (
                  <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #333', fontSize: 16 }}>{item}</div>
                ))}
              </div>
            </div>
          </div>
          <p style={{ textAlign: 'center', color: '#666', marginTop: 32, fontSize: 14 }}>Menu varies by location and event. Prices available on-site.</p>
          
          {/* DoorDash Order Button */}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <a href="#" style={{...btn, background:'var(--red)', color:'white', fontSize:18, padding:'16px 40px'}}>Order on DoorDash</a>
          </div>
        </section>
      </div>

      <div className="checkerboard" style={{ height: 8 }} />

      {/* About */}
      <section id="about" style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center' }}>
          <div>
            <img src="/images/route-615.png" alt="Route 615" style={{ width: 80, marginBottom: 16 }} />
            <h2 style={{ fontSize: 40, color: 'var(--red)', marginBottom: 16 }}>Born on the Back Roads</h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: '#444', marginBottom: 16 }}>
              Juke's Diner started as a childhood dream at age 12 and came to life in 2025. We serve retro diner-inspired comfort food, from Nashville Hot Chicken Sandwiches to Funnel Cake Fries.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: '#444', marginBottom: 16 }}>
              We're not just a food truck. We're building a franchise. A brand. A movement. From late-night Broadway runs to corporate catering, we bring the diner to you.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: '#444' }}>
              Follow the journey on TikTok as we build this thing from the ground up.
            </p>
          </div>
          <div style={{ background: 'var(--teal)', borderRadius: 16, padding: 40, color: 'var(--cream)' }}>
            <h3 style={{ fontSize: 28, marginBottom: 24, textAlign: 'center' }}>Our Promise</h3>
            <div style={{ display: 'grid', gap: 16 }}>
              {[
                { icon: '\u{1F354}', text: 'Real diner food. Not fast food.' },
                { icon: '\u{26A1}', text: 'Fast. Most orders under 5 minutes.' },
                { icon: '\u{1F9FC}', text: 'Cleanest truck in Nashville.' },
                { icon: '\u{1F3B5}', text: 'A vibe. Music, personality, good times.' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 28 }}>{item.icon}</span>
                  <span style={{ fontSize: 16 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Find Us */}
      <div style={{ background: 'var(--cream-dark)' }}>
        <section id="find-us" style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 48, textAlign: 'center', color: 'var(--red)', marginBottom: 8 }}>Where's the Truck?</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
            We cruise through Nashville hitting pop-ups, private events, and late-night hot spots. Check our calendar to see where we're rolling.
          </p>
          
          {/* Google Calendar Embed Placeholder */}
          <div style={{ 
            background: 'white', borderRadius: 16, padding: 32, textAlign: 'center',
            border: '2px solid #eee', marginBottom: 32
          }}>
            <p style={{ color: '#999', fontSize: 14, marginBottom: 16 }}>Google Calendar integration coming soon</p>
            <iframe 
              src="https://calendar.google.com/calendar/embed?src=wafflewheelsdiner%40gmail.com&ctz=America%2FChicago" 
              style={{ border: 0, width: '100%', height: 400, borderRadius: 8 }} 
              frameBorder="0" 
              scrolling="no"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { name: 'Event Truck', desc: 'Festivals, corporate events, private parties. Book us anywhere in Nashville.', status: 'Booking Now', color: 'var(--red)' },
              { name: 'Trailer Park', desc: 'Our permanent location. Come hungry.', status: 'Open', color: 'var(--teal)' },
              { name: 'New Locations', desc: 'More spots dropping this summer. Stay tuned.', status: 'Summer 2026', color: '#999' },
            ].map((loc, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 12, padding: 28, border: '2px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 22, color: 'var(--teal)' }}>{loc.name}</h3>
                  <span style={{ background: loc.color, color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{loc.status}</span>
                </div>
                <p style={{ color: '#666', lineHeight: 1.6 }}>{loc.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Book / CTA */}
      <div id="book" style={{ background: 'var(--teal)', color: 'var(--cream)', textAlign: 'center', padding: '80px 24px' }}>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', marginBottom: 16 }}>Make Your Next Event Sizzle</h2>
        <p style={{ fontSize: 18, opacity: 0.9, maxWidth: 500, margin: '0 auto 32px' }}>
          Birthday, wedding, block party, corporate event. We roll up, feed everyone, and make it unforgettable.
        </p>
        <a href="mailto:wafflewheelsdiner@gmail.com" style={{
          ...btn, background: 'var(--cream)', color: 'var(--teal)',
          fontSize: 18, padding: '16px 40px'
        }}>
          Book Your Event
        </a>
        <p style={{ marginTop: 16, fontSize: 14, opacity: 0.7 }}>wafflewheelsdiner@gmail.com</p>
      </div>

      {/* Merch */}
      <section id="merch" style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 48, color: 'var(--red)', marginBottom: 8 }}>Merch</h2>
        <p style={{ color: '#666', marginBottom: 32 }}>Rep the diner. Shirts, hats, stickers coming soon.</p>
        <div style={{ 
          background: 'var(--cream-dark)', borderRadius: 16, padding: 60,
          border: '2px dashed #ddd'
        }}>
          <p style={{ fontSize: 18, color: '#999' }}>Printful store coming soon</p>
        </div>
      </section>

      {/* Apply */}
      <div style={{ background: 'var(--black)' }}>
        <section id="apply" style={{ padding: '80px 24px', maxWidth: 800, margin: '0 auto', color: 'var(--cream)', textAlign: 'center' }}>
          <h2 style={{ fontSize: 48, marginBottom: 8 }}>Work With Us</h2>
          <p style={{ color: '#999', marginBottom: 16, fontSize: 18 }}>
            Love food, hustle, and good vibes?
          </p>
          <p style={{ color: '#888', marginBottom: 32, lineHeight: 1.7 }}>
            Juke's Diner is more than a food truck. It's a rolling diner built on flavor, energy, and people who care. We're looking for cooks, operators, and leaders who want to grow with us.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:wafflewheelsdiner@gmail.com?subject=Job Application" style={{
              ...btn, background: 'var(--teal)', color: 'white', fontSize: 16, padding: '14px 32px'
            }}>
              Apply to Work
            </a>
            <a href="mailto:wafflewheelsdiner@gmail.com?subject=Franchise Inquiry" style={{
              ...btn, background: 'transparent', color: 'var(--gold)', border: '2px solid var(--gold)', fontSize: 16, padding: '14px 32px'
            }}>
              Franchise Opportunities
            </a>
          </div>
        </section>
      </div>

      {/* Social / TikTok */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 36, color: 'var(--red)', marginBottom: 8 }}>Follow the Journey</h2>
        <p style={{ color: '#666', marginBottom: 24 }}>
          We're documenting everything. The wins, the fails, the real story of building a food truck franchise.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { name: 'TikTok', url: 'https://tiktok.com/@jukesdiner' },
            { name: 'Instagram', url: 'https://instagram.com/jukesdiner' },
            { name: 'Facebook', url: 'https://facebook.com/jukesdiner' },
          ].map((s, i) => (
            <a key={i} href={s.url} target="_blank" style={socialBtn}>{s.name}</a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'var(--black)', color: '#888', textAlign: 'center', padding: '32px 24px', fontSize: 14
      }}>
        <img src="/images/logo.png" alt="Juke's Diner" style={{ width: 60, marginBottom: 12, opacity: 0.8 }} />
        <p>Juke's Diner. Nashville, TN. All day. All night.</p>
        <p style={{ marginTop: 4 }}>Route 615</p>
        <p style={{ marginTop: 12, fontSize: 12, color: '#555' }}>&copy; 2026 Juke's Diner LLC. All rights reserved.</p>
      </footer>
    </>
  )
}

const navLink = { textDecoration: 'none', color: 'var(--black)', fontWeight: 600, fontSize: 14 }
const btn = { textDecoration: 'none', fontWeight: 600, padding: '10px 24px', borderRadius: 8, display: 'inline-block', cursor: 'pointer', border: 'none', fontSize: 15, transition: 'opacity 0.2s' }
const socialBtn = { textDecoration: 'none', fontWeight: 600, padding: '10px 24px', borderRadius: 8, background: 'var(--black)', color: 'var(--cream)', fontSize: 15 }
