'use client'
export default function FindUs() {
  return (
    <>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 32px',background:'var(--cream)',borderBottom:'3px solid var(--red)',position:'sticky',top:0,zIndex:100}}>
        <a href="/"><img src="/images/jukes-diner-logo.png" alt="Juke's Diner" style={{height:50}} /></a>
        <div style={{display:'flex',gap:20,alignItems:'center'}}>
          <a href="/menu" style={nav}>Menu</a>
          <a href="/about" style={nav}>About</a>
          <a href="/find-us" style={navActive}>Find Us</a>
          <a href="/merch" style={nav}>Merch</a>
          <a href="/apply" style={nav}>Apply</a>
          <a href="/book" style={{textDecoration:'none',fontWeight:600,padding:'10px 24px',borderRadius:8,background:'var(--red)',color:'white',fontSize:14}}>Book Us</a>
        </div>
      </nav>
      <div style={{maxWidth:1000,margin:'0 auto',padding:'80px 24px'}}>
        <h1 style={{fontSize:56,color:'var(--red)',marginBottom:8,textAlign:'center',fontFamily:'Playfair Display,serif'}}>Where's the Truck?</h1>
        <p style={{textAlign:'center',color:'#666',marginBottom:48,maxWidth:600,margin:'0 auto 48px'}}>
          We cruise through Nashville hitting pop-ups, private events, and late-night hot spots. Check our calendar below.
        </p>
        <div style={{background:'white',borderRadius:16,padding:16,border:'2px solid #eee',marginBottom:48}}>
          <iframe 
            src="https://calendar.google.com/calendar/embed?src=wafflewheelsdiner%40gmail.com&ctz=America%2FChicago" 
            style={{border:0,width:'100%',height:500,borderRadius:8}} 
            frameBorder="0" 
          />
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:24}}>
          {[
            {name:'Event Truck',desc:'Festivals, corporate events, private parties. Book us anywhere in Nashville.',status:'Booking Now',color:'var(--red)'},
            {name:'Trailer Park',desc:'Our permanent location. Come hungry.',status:'Open',color:'var(--teal)'},
            {name:'New Locations',desc:'More spots dropping this summer. Stay tuned.',status:'Summer 2026',color:'#999'},
          ].map((loc,i) => (
            <div key={i} style={{background:'var(--cream-dark)',borderRadius:12,padding:28,border:'2px solid #eee'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                <h3 style={{fontSize:22,color:'var(--teal)',fontFamily:'Playfair Display,serif'}}>{loc.name}</h3>
                <span style={{background:loc.color,color:'white',padding:'4px 12px',borderRadius:20,fontSize:12,fontWeight:600}}>{loc.status}</span>
              </div>
              <p style={{color:'#666',lineHeight:1.6}}>{loc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
const nav = {textDecoration:'none',color:'var(--black)',fontWeight:600,fontSize:14}
const navActive = {textDecoration:'none',color:'var(--red)',fontWeight:600,fontSize:14}
