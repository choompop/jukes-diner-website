import './globals.css'

export const metadata = {
  title: "Juke's Diner | Nashville Food Truck",
  description: "Diner-style food done right, served from a truck. Good eats all day, all night. Nashville, TN.",
  keywords: "food truck, Nashville, diner, catering, events, Juke's Diner",
  openGraph: {
    title: "Juke's Diner | Nashville Food Truck",
    description: "Diner-style food done right, served from a truck.",
    type: 'website',
    url: 'https://jukesdiner.com',
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-cream text-brand-black">
        {children}
      </body>
    </html>
  )
}
