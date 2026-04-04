import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Truck, User } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Menu', path: '/menu' },
    { name: 'Order', path: '/order' },
    { name: 'Book', path: '/book' },
    { name: 'Find Us', path: '/find-us' },
    { name: 'Merch', path: '/merch' },
    { name: 'Franchise', path: '/apply' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-diner-red text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2 group">
            <Truck className="h-8 w-8 group-hover:rotate-12 transition-transform" />
            <span className="font-display text-2xl tracking-tighter neon-glow">JUKE'S DINER</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium hover:text-diner-chrome transition-colors uppercase tracking-widest",
                  location.pathname === link.path ? "text-diner-chrome underline underline-offset-4" : "text-white"
                )}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <Link to="/dashboard" className="flex items-center space-x-1 bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition-colors">
                <User className="h-4 w-4" />
                <span className="text-xs uppercase font-bold">Dashboard</span>
              </Link>
            ) : (
              <Link to="/dashboard" className="text-xs uppercase font-bold border border-white/30 px-3 py-1 rounded-full hover:bg-white/10 transition-colors">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-white hover:bg-diner-teal focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-diner-red border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium uppercase tracking-widest",
                  location.pathname === link.path ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-bold text-diner-chrome"
            >
              {user ? 'Dashboard' : 'Login'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
