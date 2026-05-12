import { NextResponse } from 'next/server';

import { requireDashboardApiAuth } from '@/lib/dashboard-auth.mjs';
import { createDefaultStripeConnectModel } from '@/lib/stripe-connect.mjs';

export async function GET(request) {
  const auth = requireDashboardApiAuth(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  return NextResponse.json(createDefaultStripeConnectModel());
}
