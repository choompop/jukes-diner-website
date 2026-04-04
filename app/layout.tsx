import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: "Juke's Diner | Nashville Food Truck",
  description: "Diner-style food done right, served from a truck. Good eats all day, all night. Nashville, TN.",
  keywords: "food truck, Nashville, diner, catering, events, Juke's Diner",
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
      <body>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
