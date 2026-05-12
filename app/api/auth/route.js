import { NextResponse } from 'next/server';
import { authenticateDashboardUser, applyDashboardSessionCookie, clearDashboardSessionCookie } from '@/lib/dashboard-auth.mjs';

export async function POST(request) {
  const { username, password } = await request.json();
  const user = authenticateDashboardUser(username, password);

  if (user) {
    return applyDashboardSessionCookie(NextResponse.json({ user: user.username }), user);
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}

export async function DELETE() {
  return clearDashboardSessionCookie(NextResponse.json({ ok: true }));
}
