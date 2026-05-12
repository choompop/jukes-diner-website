'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Rocket,
  GraduationCap,
  Settings2,
  CalendarDays,
  UtensilsCrossed,
  BarChart3,
  Palette,
  FileText,
  LifeBuoy,
  LogOut,
  ChevronRight,
  Truck,
  Bell,
  HardDrive,
  Kanban,
  Menu,
  X,
  Globe,
  Bot,
  Brain,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Accessibility: Escape key handler to close mobile drawer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  // Accessibility: Body scroll lock when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Accessibility: Focus first interactive element when drawer opens
  useEffect(() => {
    if (mobileMenuOpen) {
      // Focus first focusable element in the drawer
      const firstLink = document.querySelector('aside.md\\:hidden a, aside.md\\:hidden button');
      if (firstLink instanceof HTMLElement) {
        // Small delay to ensure drawer animation has started
        setTimeout(() => firstLink.focus(), 100);
      }
    }
  }, [mobileMenuOpen]);

  async function handleLogout() {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
    } finally {
      localStorage.removeItem('jukes_user');
      window.location.assign('/dashboard/login');
    }
  }

  const navGroups = [
    {
      label: 'Operator Dashboard',
      items: [
        { name: 'Command Center', path: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
        { name: 'Lexi AI (Brain Dump)', path: '/dashboard/brain-dump', icon: <MessageSquare className="h-4 w-4" /> },
      ]
    },
    {
      label: 'Franchise Ops',
      items: [
        { name: 'Getting Started', path: '/dashboard/onboarding', icon: <Rocket className="h-4 w-4" /> },
        { name: 'Training Center', path: '/dashboard/training-center', icon: <GraduationCap className="h-4 w-4" /> },
        { name: 'Operations', path: '/dashboard/operations', icon: <Settings2 className="h-4 w-4" /> },
        { name: 'Bookings', path: '/dashboard/bookings', icon: <CalendarDays className="h-4 w-4" /> },
      ]
    },
    {
      label: 'Management',
      items: [
        { name: 'Menu Management', path: '/dashboard/menu-management', icon: <UtensilsCrossed className="h-4 w-4" /> },
        { name: 'Financials', path: '/dashboard/financials', icon: <BarChart3 className="h-4 w-4" /> },
        { name: 'Brand & Marketing', path: '/dashboard/marketing', icon: <Palette className="h-4 w-4" /> },
        { name: 'Notion Pipeline', path: '/dashboard/notion-pipeline', icon: <Kanban className="h-4 w-4" /> },
        { name: 'Google Drive', path: '/dashboard/drive-viewer', icon: <HardDrive className="h-4 w-4" /> },
      ]
    },
    {
      label: 'Hermes / Kanban',
      items: [
        { name: 'Workflow Board', path: '/dashboard/workflow', icon: <Kanban className="h-4 w-4" /> },
        { name: 'Agent Outputs', path: '/dashboard/outputs', icon: <FileText className="h-4 w-4" /> },
        { name: 'Franchise Brain', path: '/dashboard/franchise-brain', icon: <Brain className="h-4 w-4" /> },
        { name: 'Agent Roster', path: '/dashboard/agents', icon: <Bot className="h-4 w-4" /> },
        { name: 'Hermes Kanban', path: '/dashboard/hermes-kanban', icon: <Kanban className="h-4 w-4" /> },
      ]
    },
    {
      label: 'Legal & Compliance',
      items: [
        { name: 'Daniel Operator Tracker', path: '/dashboard/daniel-operator-tracker', icon: <Shield className="h-4 w-4" /> },
      ]
    },
    {
      label: 'Public Website',
      items: [
        { name: 'View Public Site', path: '/', icon: <Globe className="h-4 w-4" />, external: true },
      ]
    },
    {
      label: 'Support',
      items: [
        { name: 'Resources', path: '/dashboard/resources', icon: <FileText className="h-4 w-4" /> },
        { name: 'Support', path: '/dashboard/support', icon: <LifeBuoy className="h-4 w-4" /> },
      ]
    }
  ];

  // Sidebar content component (shared between mobile and desktop)
  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Truck className="h-6 w-6 text-diner-red" />
          <span className="font-display text-xl tracking-tighter">JUKE&apos;S HQ</span>
        </Link>
        <button 
          className="text-gray-300 hover:text-white transition-colors relative p-3 rounded-lg hover:bg-white/5 active:bg-white/10"
          aria-label="Dashboard sidebar notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-diner-red rounded-full" />
        </button>
      </div>

      <nav aria-label="Dashboard sidebar" className="flex-grow overflow-y-auto p-4 custom-scrollbar">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            <p className="px-4 mb-2 text-[10px] font-display text-gray-300 uppercase tracking-widest">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-4 rounded-xl transition-all group",
                    pathname === item.path
                      ? "bg-diner-red text-white shadow-lg"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium text-xs">{item.name}</span>
                  </div>
                  <ChevronRight className={cn(
                    "h-3 w-3 transition-transform",
                    pathname === item.path ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                  )} />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex items-center gap-3 px-4 py-3 mb-4">
          <div className="h-8 w-8 rounded-full bg-diner-teal flex items-center justify-center font-display text-xs shadow-inner">
            J
          </div>
          <div className="flex-grow overflow-hidden">
            <p className="text-sm font-bold truncate capitalize">Operator</p>
            <p className="text-[10px] text-gray-300 uppercase tracking-widest">admin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-widest">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      {/* Mobile Header with Hamburger Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-diner-black border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-diner-red" />
          <span className="font-display text-lg tracking-tighter text-white">JUKE&apos;S HQ</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white hover:bg-white/10 active:bg-white/20 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-diner-red focus:ring-offset-2 focus:ring-offset-diner-black"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Drawer Overlay/Backdrop */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={cn(
          "md:hidden fixed top-0 left-0 bottom-0 w-64 bg-diner-black text-white flex flex-col z-50 shadow-2xl transform transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex w-64 bg-diner-black text-white flex-col fixed h-full z-30 shadow-2xl">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-grow md:ml-64 min-h-screen pt-[60px] md:pt-0 w-full max-w-full">
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
