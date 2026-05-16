import type { Metadata } from 'next';
import { Atkinson_Hyperlegible, Bebas_Neue, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Jukebox from './components/Jukebox';

const atkinsonHyperlegible = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-atkinson-hyperlegible',
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-bebas-neue',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: '500',
  display: 'swap',
  variable: '--font-ibm-plex-mono',
});

export const metadata: Metadata = {
  title: "Juke's Diner | Nashville Food Truck",
  description: "Diner-style food done right, served from a truck. Good eats all day, all night. Nashville, TN.",
  keywords: "food truck, Nashville, diner, catering, events, Juke's Diner",
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: "Juke's Diner | Nashville Food Truck",
    description: "Diner-style food done right, served from a truck.",
    type: 'website',
    url: 'https://jukesdiner.com',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${atkinsonHyperlegible.variable} ${bebasNeue.variable} ${ibmPlexMono.variable}`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
            <Jukebox />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
