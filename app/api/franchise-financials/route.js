import { NextResponse } from 'next/server';

import { requireDashboardApiAuth } from '@/lib/dashboard-auth.mjs';

import {
  readFinancialManagement,
  getFinancialManagementStats,
  getFinancialScorecard,
  getFinancialVisibilitySections,
  getFinancialObligationSummary,
  getFinancialDocumentReadiness,
  getFinancialActionQueue,
  getFinancialUnits,
  getConsolidatedWeeklyCashflow,
  getStripeAccountReadiness,
} from '@/lib/franchise-financials.mjs';
import {
  buildStripeWeeklyCashflowViews,
} from '@/lib/stripe-cashflow.mjs';

export async function GET(request) {
  const auth = requireDashboardApiAuth(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const financials = await readFinancialManagement();
    return NextResponse.json({
      financials,
      stats: getFinancialManagementStats(financials),
      scorecard: getFinancialScorecard(financials),
      visibilitySections: getFinancialVisibilitySections(financials),
      obligations: getFinancialObligationSummary(financials),
      documents: getFinancialDocumentReadiness(financials),
      actionQueue: getFinancialActionQueue(financials),
      units: getFinancialUnits(financials),
      consolidatedWeeklyCashflow: getConsolidatedWeeklyCashflow(financials),
      stripeReadiness: getStripeAccountReadiness(financials),
      stripeCashflow: buildStripeWeeklyCashflowViews(financials, { env: process.env }),
    });
  } catch (error) {
    console.error('Franchise financials API error:', error);
    return NextResponse.json({ error: 'Failed to load franchise financials' }, { status: 500 });
  }
}
