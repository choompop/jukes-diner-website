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
      router.push('/dashboard/chat');
    }
  }, []);
  return null;
}
