'use client'
export default function Apply() {
  return (
    <>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 32px',background:'var(--cream)',borderBottom:'3px solid var(--red)',position:'sticky',top:0,zIndex:100}}>
        <a href="/"><img src="/images/jukes-diner-logo.png" alt="Juke's Diner" style={{height:50}} /></a>
        <div style={{display:'flex',gap:20,alignItems:'center'}}>
          <a href="/menu" style={nav}>Menu</a>
          <a href="/about" style={nav}>About</a>
          <a href="/find-us" style={nav}>Find Us</a>
          <a href="/merch" style={nav}>Merch</a>
          <a href="/apply" style={navActive}>Apply</a>
          <a href="/book" style={{textDecoration:'none',fontWeight:600,padding:'10px 24px',borderRadius:8,background:'var(--red)',color:'white',fontSize:14}}>Book Us</a>
        </div>
      </nav>
      <div style={{background:'var(--black)',minHeight:'100vh',color:'var(--cream)'}}>
        <div style={{maxWidth:800,margin:'0 auto',padding:'80px 24px'}}>
          <h1 style={{fontSize:56,marginBottom:16,textAlign:'center',fontFamily:'Playfair Display,serif'}}>Join the Team</h1>
          <p style={{textAlign:'center',color:'#999',marginBottom:48,fontSize:18}}>
            Juke's Diner is more than a food truck. It's a rolling diner built on flavor, energy, and people who care.
          </p>
          
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:32,marginBottom:48}}>
            <div style={{background:'#1a1a2e',borderRadius:16,padding:32,border:'1px solid #333'}}>
              <h3 style={{color:'var(--teal)',fontSize:24,marginBottom:16,fontFamily:'Playfair Display,serif'}}>Work With Us</h3>
              <p style={{color:'#888',lineHeight:1.7,marginBottom:24}}>We're looking for cooks, servers, and leaders who want to grow. Flexible hours, good vibes, real experience in the food industry.</p>
              <a href="mailto:wafflewheelsdiner@gmail.com?subject=Job Application" style={{textDecoration:'none',fontWeight:600,padding:'12px 28px',borderRadius:8,background:'var(--teal)',color:'white',fontSize:15,display:'inline-block'}}>Apply Now</a>
            </div>
            <div style={{background:'#1a1a2e',borderRadius:16,padding:32,border:'1px solid var(--gold)'}}>
              <h3 style={{color:'var(--gold)',fontSize:24,marginBottom:16,fontFamily:'Playfair Display,serif'}}>Franchise With Us</h3>
              <p style={{color:'#888',lineHeight:1.7,marginBottom:24}}>Want to run your own Juke's Diner? We provide the truck, the playbook, the training, and the brand. You run it. We grow together.</p>
              <a href="mailto:wafflewheelsdiner@gmail.com?subject=Franchise Inquiry" style={{textDecoration:'none',fontWeight:600,padding:'12px 28px',borderRadius:8,background:'var(--gold)',color:'var(--black)',fontSize:15,display:'inline-block'}}>Learn More</a>
            </div>
          </div>

          <div style={{textAlign:'center',color:'#666'}}>
            <p>Questions? Email us at wafflewheelsdiner@gmail.com</p>
          </div>
        </div>
      </div>
    </>
  )
}
const nav = {textDecoration:'none',color:'var(--black)',fontWeight:600,fontSize:14}
const navActive = {textDecoration:'none',color:'var(--red)',fontWeight:600,fontSize:14}
