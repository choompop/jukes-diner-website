import { NextResponse } from 'next/server';

import { requireDashboardApiAuth } from '@/lib/dashboard-auth.mjs';

import {
  getFranchiseBrain,
  getFranchiseBrainItems,
  getFranchiseBrainStats,
  getFranchiseBrainCommandCenter,
  addFranchiseBrainSignal,
  updateFranchiseBrainSignal,
  validateFranchiseBrainSignalUpdate,
  convertFranchiseBrainSignalToItem,
  archiveFranchiseBrainSignal,
  filterFranchiseBrainSignals,
  readFranchiseBrainSignals,
  getFranchiseBrainSignalStats,
  updateFranchiseBrainItem,
  archiveFranchiseBrainItem,
  createFranchiseBrainItem,
} from '@/lib/franchise-brain.mjs';

export async function GET(request) {
  const auth = requireDashboardApiAuth(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const layer = searchParams.get('layer');
    const status = searchParams.get('status');
    const signalStatus = searchParams.get('signalStatus');
    const signalLayer = searchParams.get('signalLayer');
    const signalType = searchParams.get('signalType');
    const signalPriority = searchParams.get('signalPriority');
    const query = searchParams.get('q') || searchParams.get('query') || '';

    const brain = await getFranchiseBrain();
    const signals = await readFranchiseBrainSignals();
    const items = getFranchiseBrainItems(brain, layer).filter(
      (item) => !status || item.status === status,
    );

    const filteredSignals = filterFranchiseBrainSignals(signals, {
      query,
      status: signalStatus,
      layerId: signalLayer,
      type: signalType,
      priority: signalPriority,
    });

    return NextResponse.json({
      brain,
      items,
      signals: filteredSignals,
      allSignalsCount: signals.length,
      stats: {
        ...getFranchiseBrainStats(brain),
        ...getFranchiseBrainSignalStats(signals),
      },
      commandCenter: getFranchiseBrainCommandCenter(brain),
    });
  } catch (error) {
    console.error('Franchise brain API error:', error);
    return NextResponse.json(
      { error: 'Failed to load franchise brain' },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  const auth = requireDashboardApiAuth(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();

    if (body?.action === 'createItem') {
      const result = await createFranchiseBrainItem(body.updates || body.item || body);
      const signals = await readFranchiseBrainSignals();
      return NextResponse.json({
        saved: true,
        itemCreated: true,
        item: result.item,
        brain: result.brain,
        items: getFranchiseBrainItems(result.brain),
        stats: {
          ...getFranchiseBrainStats(result.brain),
          ...getFranchiseBrainSignalStats(signals),
        },
      }, { status: 201 });
    }

    const text = body?.text || body?.rawText || body?.summary || body?.title;

    if (!text || typeof text !== 'string' || text.trim().length < 3) {
      return NextResponse.json(
        { error: 'Franchise brain signal requires text, rawText, summary, or title.' },
        { status: 400 },
      );
    }

    const item = await addFranchiseBrainSignal(body);
    const signals = await readFranchiseBrainSignals();

    return NextResponse.json({
      saved: true,
      item,
      stats: getFranchiseBrainSignalStats(signals),
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to route brain signal';
    const status = /Invalid|required/.test(message) ? 400 : 500;
    console.error('Franchise brain intake API error:', error);
    return NextResponse.json(
      { error: message },
      { status },
    );
  }
}

export async function PATCH(request) {
  const auth = requireDashboardApiAuth(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const signalId = body?.id || body?.signalId;
    const itemId = body?.itemId || (body?.target === 'item' ? body?.id : null);
    const action = body?.action || body?.updates?.action;

    if (itemId || action === 'updateItem' || action === 'archiveItem') {
      const targetItemId = itemId || body?.id;
      if (!targetItemId || typeof targetItemId !== 'string') {
        return NextResponse.json({ error: 'Brain item id is required.' }, { status: 400 });
      }

      const result = action === 'archiveItem'
        ? await archiveFranchiseBrainItem(targetItemId, body.reason || body.updates?.reason || 'No further action.')
        : await updateFranchiseBrainItem(targetItemId, body.updates || body);

      if (!result) {
        return NextResponse.json({ error: 'Brain item not found.' }, { status: 404 });
      }

      const signals = await readFranchiseBrainSignals();
      return NextResponse.json({
        saved: true,
        itemUpdated: action !== 'archiveItem',
        itemArchived: action === 'archiveItem',
        item: result.item,
        brain: result.brain,
        items: getFranchiseBrainItems(result.brain),
        stats: {
          ...getFranchiseBrainStats(result.brain),
          ...getFranchiseBrainSignalStats(signals),
        },
      });
    }

    if (!signalId || typeof signalId !== 'string') {
      return NextResponse.json({ error: 'Signal id is required.' }, { status: 400 });
    }

    const updates = validateFranchiseBrainSignalUpdate(body.updates || body);

    if (action === 'convert') {
      const result = await convertFranchiseBrainSignalToItem(signalId, body.options || body.updates || {});
      if (!result) {
        return NextResponse.json({ error: 'Signal not found.' }, { status: 404 });
      }
      const signals = await readFranchiseBrainSignals();
      return NextResponse.json({
        saved: true,
        converted: true,
        item: result.item,
        signal: result.signal,
        signals,
        stats: getFranchiseBrainSignalStats(signals),
      });
    }

    if (action === 'archive') {
      const item = await archiveFranchiseBrainSignal(signalId, body.reason || body.updates?.reason || 'No further action.');
      if (!item) {
        return NextResponse.json({ error: 'Signal not found.' }, { status: 404 });
      }
      const signals = await readFranchiseBrainSignals();
      return NextResponse.json({
        saved: true,
        archived: true,
        item,
        signals,
        stats: getFranchiseBrainSignalStats(signals),
      });
    }

    const item = await updateFranchiseBrainSignal(signalId, updates);

    if (!item) {
      return NextResponse.json({ error: 'Signal not found.' }, { status: 404 });
    }

    const signals = await readFranchiseBrainSignals();
    return NextResponse.json({
      saved: true,
      item,
      signals,
      stats: getFranchiseBrainSignalStats(signals),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update brain signal';
    const status = /Invalid/.test(message) ? 400 : 500;
    console.error('Franchise brain triage API error:', error);
    return NextResponse.json({ error: message }, { status });
  }
}
