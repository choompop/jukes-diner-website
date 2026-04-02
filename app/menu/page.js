'use client'
export default function Menu() {
  return (
    <>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 32px',background:'var(--cream)',borderBottom:'3px solid var(--red)',position:'sticky',top:0,zIndex:100}}>
        <a href="/"><img src="/images/jukes-diner-logo.png" alt="Juke's Diner" style={{height:50}} /></a>
        <div style={{display:'flex',gap:20,alignItems:'center'}}>
          <a href="/menu" style={navActive}>Menu</a>
          <a href="/about" style={nav}>About</a>
          <a href="/find-us" style={nav}>Find Us</a>
          <a href="/merch" style={nav}>Merch</a>
          <a href="/apply" style={nav}>Apply</a>
          <a href="/book" style={{textDecoration:'none',fontWeight:600,padding:'10px 24px',borderRadius:8,background:'var(--red)',color:'white',fontSize:14}}>Book Us</a>
        </div>
      </nav>
      <div style={{background:'var(--black)',minHeight:'100vh'}}>
        <div style={{maxWidth:1000,margin:'0 auto',padding:'80px 24px',color:'var(--cream)'}}>
          <h1 style={{fontSize:56,textAlign:'center',marginBottom:8,fontFamily:'Playfair Display,serif'}}>Our Eats</h1>
          <p style={{textAlign:'center',color:'#999',marginBottom:48}}>Diner classics, done our way. All handheld. All delicious.</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:48}}>
            <div>
              <img src="/images/food.png" alt="Food" style={{width:'100%',borderRadius:16,marginBottom:32}} />
              <img src="/images/food-photo.jpg" alt="Food" style={{width:'100%',borderRadius:16}} />
            </div>
            <div>
              <Section title="Savory" items={['Diner Burger','Philly Cheesesteak','Buffalo Chicken Wrap','Nashville Hot Chicken Sandwich','Chicken Tenders','Loaded Fries']} />
              <Section title="Sweet" items={['Chicken & Waffles','Funnel Cake Fries','French Toast Sticks','Churros','Fried Oreos']} />
              <Section title="Drinks" items={['Lemonade','Sweet Tea','Cold Brew','Milkshakes']} />
            </div>
          </div>
          <div style={{textAlign:'center',marginTop:48}}>
            <a href="/order" style={{textDecoration:'none',fontWeight:600,padding:'16px 40px',borderRadius:8,background:'var(--red)',color:'white',fontSize:18,display:'inline-block'}}>Order on DoorDash</a>
          </div>
          <p style={{textAlign:'center',color:'#666',marginTop:24,fontSize:14}}>Menu varies by location and event. Prices available on-site.</p>
        </div>
      </div>
    </>
  )
}

function Section({title, items}) {
  return (
    <div style={{marginBottom:32}}>
      <h3 style={{color:'#D4A843',fontSize:22,marginBottom:16,borderBottom:'2px solid #D4A843',paddingBottom:8,fontFamily:'Playfair Display,serif'}}>{title}</h3>
      {items.map((item,i) => <div key={i} style={{padding:'12px 0',borderBottom:'1px solid #333',fontSize:16}}>{item}</div>)}
    </div>
  )
}

const nav = {textDecoration:'none',color:'var(--black)',fontWeight:600,fontSize:14}
const navActive = {textDecoration:'none',color:'var(--red)',fontWeight:600,fontSize:14}
