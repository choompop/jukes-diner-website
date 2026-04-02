'use client'
export default function Order() {
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
      <div style={{maxWidth:700,margin:'0 auto',padding:'80px 24px',textAlign:'center'}}>
        <h1 style={{fontSize:56,color:'var(--red)',marginBottom:16,fontFamily:'Playfair Display,serif'}}>Order Online</h1>
        <p style={{color:'#666',marginBottom:48,fontSize:18}}>Get Juke's Diner delivered to your door.</p>
        <div style={{background:'var(--cream-dark)',borderRadius:16,padding:60,border:'2px dashed #ddd'}}>
          <p style={{fontSize:20,color:'#999',marginBottom:16}}>DoorDash integration coming soon</p>
          <p style={{fontSize:14,color:'#bbb'}}>In the meantime, find us on DoorDash by searching "Waffle Wheels" or "Juke's Diner"</p>
        </div>
      </div>
    </>
  )
}
const nav = {textDecoration:'none',color:'var(--black)',fontWeight:600,fontSize:14}
