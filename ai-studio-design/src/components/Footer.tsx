import { Link } from 'react-router-dom';
import { Truck, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-diner-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Truck className="h-8 w-8 text-diner-red" />
              <span className="font-display text-2xl tracking-tighter">JUKE'S DINER</span>
            </div>
            <p className="text-gray-400 max-w-md mb-6">
              Serving up nostalgia and the best burgers on four wheels. Join the Juke's family and experience the classic diner vibe wherever we roll.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-diner-red transition-colors"><Instagram /></a>
              <a href="#" className="hover:text-diner-red transition-colors"><Twitter /></a>
              <a href="#" className="hover:text-diner-red transition-colors"><Facebook /></a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg mb-6 text-diner-red">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/menu" className="hover:text-white transition-colors">Menu</Link></li>
              <li><Link to="/find-us" className="hover:text-white transition-colors">Find Us</Link></li>
              <li><Link to="/book" className="hover:text-white transition-colors">Book Events</Link></li>
              <li><Link to="/apply" className="hover:text-white transition-colors">Franchise</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg mb-6 text-diner-red">Contact</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>contact@jukesdiner.com</li>
              <li>443-528-9679</li>
              <li>1600 Callis Rd</li>
              <li>Lebanon, TN 37090</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2026 Juke's Diner Franchise. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
