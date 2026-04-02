'use client'
export default function About() {
  return (
    <>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 32px',background:'var(--cream)',borderBottom:'3px solid var(--red)',position:'sticky',top:0,zIndex:100}}>
        <a href="/"><img src="/images/jukes-diner-logo.png" alt="Juke's Diner" style={{height:50}} /></a>
        <div style={{display:'flex',gap:20,alignItems:'center'}}>
          <a href="/menu" style={nav}>Menu</a>
          <a href="/about" style={navActive}>About</a>
          <a href="/find-us" style={nav}>Find Us</a>
          <a href="/merch" style={nav}>Merch</a>
          <a href="/apply" style={nav}>Apply</a>
          <a href="/book" style={{textDecoration:'none',fontWeight:600,padding:'10px 24px',borderRadius:8,background:'var(--red)',color:'white',fontSize:14}}>Book Us</a>
        </div>
      </nav>
      <div style={{maxWidth:900,margin:'0 auto',padding:'80px 24px'}}>
        <img src="/images/route-615.png" alt="Route 615" style={{width:100,marginBottom:24}} />
        <h1 style={{fontSize:56,color:'var(--red)',marginBottom:24,fontFamily:'Playfair Display,serif'}}>Our Story</h1>
        <div style={{fontSize:18,lineHeight:1.8,color:'#444'}}>
          <p style={{marginBottom:20}}>Juke's Diner started as a childhood dream. At 12 years old, the founder watched a food truck owner at a festival and thought: I want to do that. 14 years later, he did.</p>
          <p style={{marginBottom:20}}>Born in Nashville in 2025, Juke's Diner serves retro diner-inspired comfort food from a rolling kitchen. Burgers, cheesesteaks, chicken and waffles, funnel cake fries. Real food, served fast, with personality.</p>
          <p style={{marginBottom:20}}>What started as a single food truck is growing into a franchise. Multiple locations across Nashville, with plans to expand nationally. Every operator gets the playbook, the training, and the brand. They run it. We scale it.</p>
          <p style={{marginBottom:20}}>The name comes from two things: the jukebox (a centerpiece of our retro diner vibe) and our founder's initials. The checkerboard, the chrome, the music. It's a 1950s diner experience on wheels.</p>
          <p>We're documenting the entire journey on TikTok. The wins, the fails, the real story of building a food truck franchise from scratch. Follow along.</p>
        </div>
        <div style={{background:'var(--teal)',borderRadius:16,padding:40,color:'var(--cream)',marginTop:48}}>
          <h3 style={{fontSize:28,marginBottom:24,textAlign:'center',fontFamily:'Playfair Display,serif'}}>Our Promise</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            {[
              {icon:'\u{1F354}',text:'Real diner food. Not fast food.'},
              {icon:'\u{26A1}',text:'Fast. Most orders under 5 minutes.'},
              {icon:'\u{1F9FC}',text:'Cleanest truck in Nashville.'},
              {icon:'\u{1F3B5}',text:'A vibe. Music, personality, good times.'},
            ].map((item,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:12}}>
                <span style={{fontSize:28}}>{item.icon}</span>
                <span style={{fontSize:16}}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
const nav = {textDecoration:'none',color:'var(--black)',fontWeight:600,fontSize:14}
const navActive = {textDecoration:'none',color:'var(--red)',fontWeight:600,fontSize:14}
