import { NextResponse } from 'next/server';
import { requireDashboardApiAuth } from '@/lib/dashboard-auth.mjs';
import {
  getAllOutputs,
  getOutputTypes,
  getOutputStatuses,
  filterOutputs,
} from '../../../lib/agent-outputs-api.js';

export async function GET(request) {
  const auth = requireDashboardApiAuth(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(request.url);
  
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  const producingAgent = searchParams.get('producingAgent');
  
  // Build filters object
  const filters = {};
  if (type && type !== 'all') filters.type = type;
  if (status && status !== 'all') filters.status = status;
  if (producingAgent && producingAgent !== 'all') filters.producingAgent = producingAgent;
  
  const outputs = filterOutputs(filters);
  const types = getOutputTypes();
  const statuses = getOutputStatuses();
  
  // Get unique producing agents
  const allOutputs = getAllOutputs();
  const producingAgents = [...new Set(allOutputs.map((o) => o.producingAgent))].sort();
  
  return NextResponse.json({
    outputs,
    metadata: {
      types,
      statuses,
      producingAgents,
      total: allOutputs.length,
    },
  });
}
