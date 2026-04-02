'use client'

export default function Home() {
  return (
    <>
      {/* Nav */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 32px', background: 'var(--cream)', borderBottom: '3px solid var(--red)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <img src="/images/logo.jpg" alt="Juke's Diner" style={{ height: 60, borderRadius: 8 }} />
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="#menu" style={navLink}>Menu</a>
          <a href="#about" style={navLink}>About</a>
          <a href="#locations" style={navLink}>Locations</a>
          <a href="#book" style={{ ...btn, background: 'var(--red)', color: 'white' }}>Book Us</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        background: 'var(--red)', color: 'var(--cream)', textAlign: 'center',
        padding: '100px 24px 80px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          opacity: 0.05, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)'
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
          <img src="/images/badge.jpg" alt="Juke's Diner" style={{ width: 180, borderRadius: 16, marginBottom: 24 }} />
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', lineHeight: 1.1, marginBottom: 16 }}>
            Diner Food Done Right.<br/>Served From a Truck.
          </h1>
          <p style={{ fontSize: 20, opacity: 0.9, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
            Good eats all day, all night. Nashville's favorite food truck experience.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#book" style={{ ...btn, background: 'var(--cream)', color: 'var(--red)', fontSize: 18, padding: '14px 32px' }}>
              Book Us For Your Event
            </a>
            <a href="#menu" style={{ ...btn, background: 'transparent', color: 'var(--cream)', border: '2px solid var(--cream)', fontSize: 18, padding: '14px 32px' }}>
              See the Menu
            </a>
          </div>
        </div>
      </div>

      {/* Checkerboard divider */}
      <div className="checkerboard-teal" style={{ height: 12 }} />

      {/* About */}
      <section id="about">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center' }}>
          <div>
            <img src="/images/route615.jpg" alt="Route 615" style={{ width: 80, marginBottom: 16, borderRadius: 8 }} />
            <h2 style={{ fontSize: 40, color: 'var(--red)', marginBottom: 16 }}>The Story</h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: '#444', marginBottom: 16 }}>
              Juke's Diner started as an idea scribbled on a napkin by a kid who loved food trucks.
              Years later, it became Nashville's go-to for real diner food served fast, fresh, and with personality.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: '#444', marginBottom: 16 }}>
              We're not just a food truck. We're building a franchise. A brand. A movement.
              From late-night Broadway runs to corporate catering, we bring the diner to you.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: '#444' }}>
              Follow the journey on TikTok as we build this thing from the ground up.
            </p>
          </div>
          <div style={{ background: 'var(--teal)', borderRadius: 16, padding: 40, color: 'var(--cream)', textAlign: 'center' }}>
            <h3 style={{ fontSize: 28, marginBottom: 24 }}>Our Promise</h3>
            <div style={{ display: 'grid', gap: 16 }}>
              {[
                { icon: '🍔', text: 'Real diner food. Not fast food.' },
                { icon: '⚡', text: 'Fast. Most orders under 5 minutes.' },
                { icon: '🧼', text: 'Cleanest truck in Nashville.' },
                { icon: '🎵', text: 'A vibe. Music, personality, good times.' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
                  <span style={{ fontSize: 28 }}>{item.icon}</span>
                  <span style={{ fontSize: 16 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <div style={{ background: 'var(--black)' }}>
        <div className="checkerboard" style={{ height: 8 }} />
        <section id="menu" style={{ color: 'var(--cream)' }}>
          <h2 style={{ fontSize: 48, textAlign: 'center', marginBottom: 8 }}>The Menu</h2>
          <p style={{ textAlign: 'center', color: '#999', marginBottom: 48, fontSize: 16 }}>
            Diner classics, done our way. All handheld. All delicious.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { category: 'Savory', items: ['Diner Burger', 'Philly Cheesesteak', 'Buffalo Chicken Wrap', 'Chicken Tenders', 'Loaded Fries'] },
              { category: 'Sweet', items: ['Chicken & Waffles', 'Funnel Cake Fries', 'French Toast Sticks', 'Churros', 'Fried Oreos'] },
              { category: 'Drinks', items: ['Lemonade', 'Sweet Tea', 'Cold Brew', 'Milkshakes'] },
            ].map((section, i) => (
              <div key={i} style={{ background: '#222', borderRadius: 12, padding: 24, border: '1px solid #333' }}>
                <h3 style={{ color: 'var(--gold)', fontSize: 22, marginBottom: 16, borderBottom: '2px solid var(--gold)', paddingBottom: 8 }}>
                  {section.category}
                </h3>
                {section.items.map((item, j) => (
                  <div key={j} style={{ padding: '8px 0', borderBottom: '1px solid #333', fontSize: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: '#666', marginTop: 24, fontSize: 14 }}>
            Menu varies by location and event. Prices available on-site.
          </p>
        </section>
        <div className="checkerboard" style={{ height: 8 }} />
      </div>

      {/* Locations */}
      <section id="locations">
        <h2 style={{ fontSize: 48, textAlign: 'center', color: 'var(--red)', marginBottom: 8 }}>Find Us</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: 48 }}>
          Multiple locations across Nashville. Follow us on social media for daily updates.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {[
            { name: 'Event Truck', desc: 'Festivals, corporate events, private parties. Book us anywhere in Nashville.', status: 'Booking Now' },
            { name: 'Trailer Park', desc: 'Our permanent location. Come by for lunch and dinner.', status: 'Open' },
            { name: 'Coming Soon', desc: 'New locations dropping this summer. Stay tuned.', status: '2026' },
          ].map((loc, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: 12, padding: 28,
              border: '2px solid #eee', transition: 'border-color 0.2s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 22, color: 'var(--teal)' }}>{loc.name}</h3>
                <span style={{
                  background: i === 0 ? 'var(--red)' : i === 1 ? 'var(--teal)' : '#999',
                  color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600
                }}>{loc.status}</span>
              </div>
              <p style={{ color: '#666', lineHeight: 1.6 }}>{loc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Book / CTA */}
      <div id="book" style={{ background: 'var(--teal)', color: 'var(--cream)', textAlign: 'center', padding: '80px 24px' }}>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', marginBottom: 16 }}>Bring Juke's to You</h2>
        <p style={{ fontSize: 18, opacity: 0.9, maxWidth: 500, margin: '0 auto 32px' }}>
          Corporate events, weddings, festivals, block parties. We roll up, feed everyone, and make it easy.
        </p>
        <a href="mailto:info@jukesdiner.com" style={{
          ...btn, background: 'var(--cream)', color: 'var(--teal)',
          fontSize: 18, padding: '16px 40px', display: 'inline-block'
        }}>
          Get in Touch
        </a>
        <p style={{ marginTop: 16, fontSize: 14, opacity: 0.7 }}>
          info@jukesdiner.com
        </p>
      </div>

      {/* Social / TikTok */}
      <section style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 36, color: 'var(--red)', marginBottom: 8 }}>Follow the Journey</h2>
        <p style={{ color: '#666', marginBottom: 24 }}>
          We're documenting everything. The wins, the fails, the real story of building a food truck franchise.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://tiktok.com/@jukesdiner" target="_blank" style={{ ...socialBtn }}>TikTok</a>
          <a href="https://instagram.com/jukesdiner" target="_blank" style={{ ...socialBtn }}>Instagram</a>
          <a href="https://facebook.com/jukesdiner" target="_blank" style={{ ...socialBtn }}>Facebook</a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'var(--black)', color: '#888', textAlign: 'center',
        padding: '32px 24px', fontSize: 14
      }}>
        <img src="/images/badge.jpg" alt="Juke's Diner" style={{ width: 60, borderRadius: 8, marginBottom: 12, opacity: 0.8 }} />
        <p>Juke's Diner. Nashville, TN. All day. All night.</p>
        <p style={{ marginTop: 4 }}>Route 615</p>
      </footer>
    </>
  )
}

const navLink = {
  textDecoration: 'none', color: 'var(--black)',
  fontWeight: 600, fontSize: 15
}

const btn = {
  textDecoration: 'none', fontWeight: 600,
  padding: '10px 24px', borderRadius: 8,
  display: 'inline-block', cursor: 'pointer',
  border: 'none', fontSize: 15,
  transition: 'opacity 0.2s',
}

const socialBtn = {
  textDecoration: 'none', fontWeight: 600,
  padding: '10px 24px', borderRadius: 8,
  background: 'var(--black)', color: 'var(--cream)',
  fontSize: 15,
}
