import { NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';

export async function POST(request) {
  const { username, password } = await request.json();
  const user = authenticate(username, password);

  if (user) {
    return NextResponse.json({ user });
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
