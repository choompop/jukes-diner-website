'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    const user = localStorage.getItem('jukes_user');
    if (!user) {
      router.push('/dashboard/login');
    } else {
      router.push('/dashboard/command-center');
    }
  }, []);
  return (
    <div className="sr-only" aria-live="polite">
      <h1>Juke&apos;s Diner Dashboard</h1>
      <p>Redirecting to your dashboard.</p>
    </div>
  );
}
