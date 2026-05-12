import { NextResponse } from 'next/server';
import { requireDashboardApiAuth } from '@/lib/dashboard-auth.mjs';
import { getAgentRoster } from '@/lib/hermes-agents.mjs';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const auth = requireDashboardApiAuth(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const roster = await getAgentRoster();
    return NextResponse.json({ roster });
  } catch (error) {
    console.error('Error fetching agent roster:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent roster' },
      { status: 500 }
    );
  }
}
