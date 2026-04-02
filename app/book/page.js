'use client'
export default function Book() {
  return (
    <>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 32px',background:'var(--cream)',borderBottom:'3px solid var(--red)',position:'sticky',top:0,zIndex:100}}>
        <a href="/"><img src="/images/jukes-diner-logo.png" alt="Juke's Diner" style={{height:50}} /></a>
        <div style={{display:'flex',gap:20,alignItems:'center'}}>
          <a href="/menu" style={nav}>Menu</a>
          <a href="/about" style={nav}>About</a>
          <a href="/find-us" style={nav}>Find Us</a>
          <a href="/merch" style={nav}>Merch</a>
          <a href="/apply" style={nav}>Apply</a>
          <a href="/book" style={{textDecoration:'none',fontWeight:600,padding:'10px 24px',borderRadius:8,background:'var(--red)',color:'white',fontSize:14}}>Book Us</a>
        </div>
      </nav>
      <div style={{background:'var(--teal)',minHeight:'100vh',color:'var(--cream)'}}>
        <div style={{maxWidth:700,margin:'0 auto',padding:'80px 24px',textAlign:'center'}}>
          <h1 style={{fontSize:56,marginBottom:16,fontFamily:'Playfair Display,serif'}}>Book Juke's Diner</h1>
          <p style={{fontSize:20,opacity:0.9,marginBottom:48}}>Corporate events, weddings, festivals, block parties, late night spots. We roll up, feed everyone, and make it unforgettable.</p>
          <div style={{background:'rgba(255,255,255,0.1)',borderRadius:16,padding:40,marginBottom:32}}>
            <h3 style={{fontSize:24,marginBottom:24,fontFamily:'Playfair Display,serif'}}>What We Offer</h3>
            <div style={{display:'grid',gap:16,textAlign:'left',maxWidth:400,margin:'0 auto'}}>
              {['Full service food truck at your event','Custom menu options available','Setup and cleanup included','Flexible pricing based on headcount','Invoice or credit card payment','Available Nashville-wide'].map((item,i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:12}}>
                  <span style={{color:'var(--gold)',fontWeight:700}}>+</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <a href="mailto:wafflewheelsdiner@gmail.com?subject=Event Booking Inquiry" style={{textDecoration:'none',fontWeight:600,padding:'16px 48px',borderRadius:8,background:'var(--cream)',color:'var(--teal)',fontSize:18,display:'inline-block'}}>
            Get in Touch
          </a>
          <p style={{marginTop:16,opacity:0.7,fontSize:14}}>wafflewheelsdiner@gmail.com</p>
        </div>
      </div>
    </>
  )
}
const nav = {textDecoration:'none',color:'var(--black)',fontWeight:600,fontSize:14}
