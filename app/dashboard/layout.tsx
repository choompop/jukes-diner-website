'use client';

import { usePathname } from 'next/navigation';
import DashboardLayout from './components/DashboardLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't wrap login page with dashboard layout
  if (pathname === '/dashboard/login') {
    return <>{children}</>;
  }

  // Don't wrap old chat/history pages (they have their own layout)
  if (pathname === '/dashboard/chat' || pathname === '/dashboard/history') {
    return <>{children}</>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
