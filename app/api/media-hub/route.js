import { NextResponse } from 'next/server';

import { requireDashboardApiAuth } from '@/lib/dashboard-auth.mjs';
import {
  readMediaHub,
  getMediaHubStats,
  getBrandBoard,
  getMediaCaptureQueue,
  getContentRepurposingQueue,
  applyMediaHubAction,
} from '@/lib/media-hub.mjs';

export async function GET(request) {
  const auth = requireDashboardApiAuth(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const hub = await readMediaHub();
    return NextResponse.json({
      hub,
      stats: getMediaHubStats(hub),
      brandBoard: getBrandBoard(hub),
      captureQueue: getMediaCaptureQueue(hub),
      repurposingQueue: getContentRepurposingQueue(hub),
    });
  } catch (error) {
    console.error('Media hub API error:', error);
    return NextResponse.json({ error: 'Failed to load media hub' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = requireDashboardApiAuth(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const { action, payload } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    const result = await applyMediaHubAction(action, payload);
    
    return NextResponse.json({
      success: true,
      action,
      ...result,
    });
  } catch (error) {
    console.error('Media hub action error:', error);
    const status = error.message?.includes('not found') ? 404 
      : error.message?.includes('Unsupported') ? 400 
      : 500;
    return NextResponse.json({ error: error.message || 'Failed to apply media hub action' }, { status });
  }
}
