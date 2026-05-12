import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

import {
  WORKFLOW_LANE_IDS,
  createDefaultWorkflowBoard,
  getWorkflowLanes,
  readWorkflowBoard,
  writeWorkflowBoard,
} from './workflow-kanban.mjs';

export const FRANCHISE_BRAIN_LAYER_IDS = ['content-pipeline', 'internal-ops'];
export const FRANCHISE_BRAIN_ITEM_STATUSES = ['active', 'planned', 'blocked', 'done', 'archived'];
export const FRANCHISE_BRAIN_ITEM_PRIORITIES = ['low', 'normal', 'medium', 'high', 'urgent'];

const DEFAULT_BRAIN_FILE_PATH = path.join(process.cwd(), 'data', 'franchise-brain.json');
const DEFAULT_SIGNAL_INBOX_FILE_PATH = path.join(process.cwd(), 'data', 'franchise-brain-signals.json');

export const FRANCHISE_BRAIN_SIGNAL_STATUSES = ['new', 'triaged', 'in_progress', 'waiting', 'done', 'archived'];
export const FRANCHISE_BRAIN_SIGNAL_PRIORITIES = ['low', 'normal', 'high', 'urgent'];
export const FRANCHISE_BRAIN_SIGNAL_TYPES = [
  'ops_note',
  'content_idea',
  'catering_lead',
  'booking_lead',
  'customer_feedback',
  'sop_update',
  'vendor_issue',
  'team_loop',
];

const DEFAULT_FRANCHISE_BRAIN = {
  version: 1,
  title: "Juke's Diner Franchise Brain",
  updatedAt: '2026-05-08',
  layers: [
    {
      id: 'content-pipeline',
      name: 'Content Pipeline',
      strapline: 'What the brand says and ships',
      summary: 'Capture, shape, schedule, and review the stories that keep the diner top of mind.',
      items: [
        {
          id: 'truck-story-capture',
          title: 'Truck Story Capture',
          owner: 'GM + Shift Lead',
          status: 'active',
          priority: 'high',
          cadence: 'daily',
          summary: 'Log customer moments, catering photos, and route surprises before the shift closes.',
          inputs: ['Shift recap', 'Phone photos', 'Customer quotes'],
          outputs: ['Content notes', 'Photo selects', 'Story hooks'],
        },
        {
          id: 'weekly-content-calendar',
          title: 'Weekly Content Calendar',
          owner: 'Marketing Lead',
          status: 'active',
          priority: 'high',
          cadence: 'weekly',
          summary: 'Turn captured moments into a five-post plan across TikTok, Instagram, and local promos.',
          inputs: ['Story hooks', 'Promo windows', 'Upcoming bookings'],
          outputs: ['Posting schedule', 'Asset requests', 'CTA list'],
        },
        {
          id: 'creative-approvals',
          title: 'Creative Approvals',
          owner: 'Founder',
          status: 'active',
          priority: 'medium',
          cadence: 'twice weekly',
          summary: 'Approve offers, visuals, and franchise talking points before publishing.',
          inputs: ['Draft captions', 'Reel cuts', 'Offer copy'],
          outputs: ['Approved assets', 'Revision notes'],
        },
        {
          id: 'performance-feedback-loop',
          title: 'Performance Feedback Loop',
          owner: 'Marketing Analyst',
          status: 'planned',
          priority: 'medium',
          cadence: 'weekly',
          summary: 'Feed top-performing hooks and underperforming posts back into the next content batch.',
          inputs: ['Reach report', 'Lead counts', 'Comment themes'],
          outputs: ['Win list', 'Fix list', 'Next test ideas'],
        },
      ],
      referenceFiles: [
        {
          id: 'brand-voice',
          title: "Juke's Brand Voice + Retro Rules",
          type: 'brand',
          path: 'brain/files/brand-voice.md',
          summary: 'Tone, phrases, visual language, and what Flo should sound like for public-facing work.',
          tags: ['brand', 'voice', 'retro'],
        },
        {
          id: 'content-calendar',
          title: 'Content Calendar + Campaign Rhythm',
          type: 'content',
          path: 'brain/files/content-calendar.md',
          summary: 'Weekly posting cadence, campaign lanes, approvals, and required assets.',
          tags: ['content', 'calendar', 'metricool'],
        },
        {
          id: 'offer-library',
          title: 'Offer Library + Catering CTAs',
          type: 'conversion',
          path: 'brain/files/offer-library.md',
          summary: 'Bookable offers, catering hooks, lead magnets, and approved calls to action.',
          tags: ['catering', 'offers', 'conversion'],
        },
        {
          id: 'performance-notes',
          title: 'Performance Notes + Winning Hooks',
          type: 'analytics',
          path: 'brain/files/performance-notes.md',
          summary: 'Top posts, weak posts, audience response, and what should be reused.',
          tags: ['analytics', 'hooks', 'learning'],
        },
      ],
    },
    {
      id: 'internal-ops',
      name: 'Internal Ops',
      strapline: 'How operators stay aligned',
      summary: 'Keep operators, training, and support decisions visible enough to scale without guesswork.',
      items: [
        {
          id: 'opening-playbook',
          title: 'Opening Playbook',
          owner: 'Operations Director',
          status: 'active',
          priority: 'high',
          cadence: 'per launch',
          summary: 'Bundle permitting, training, local supplier setup, and first-week milestones for each new operator.',
          inputs: ['Launch checklist', 'City requirements', 'Vendor roster'],
          outputs: ['Operator launch board', 'Week-one tasks'],
        },
        {
          id: 'field-ops-scoreboard',
          title: 'Field Ops Scoreboard',
          owner: 'Area Coach',
          status: 'active',
          priority: 'high',
          cadence: 'weekly',
          summary: 'Track sales, ticket times, food cost, and catering close rate in one operating snapshot.',
          inputs: ['POS export', 'Labor notes', 'Catering pipeline'],
          outputs: ['Weekly scorecard', 'Escalation list'],
        },
        {
          id: 'support-escalation-desk',
          title: 'Support Escalation Desk',
          owner: 'Support Lead',
          status: 'active',
          priority: 'medium',
          cadence: 'daily',
          summary: 'Route urgent operator questions into one queue with owner, SLA, and documented fix.',
          inputs: ['Slack requests', 'Email tickets', 'Phone follow-ups'],
          outputs: ['Resolved issues', 'Knowledge base updates'],
        },
        {
          id: 'vendor-sync',
          title: 'Vendor Sync',
          owner: 'Procurement',
          status: 'blocked',
          priority: 'medium',
          cadence: 'monthly',
          summary: 'Consolidate distributor pricing and outage alerts before they hit store-level ordering.',
          inputs: ['Supplier pricing', 'Stock alerts', 'Market notes'],
          outputs: ['Approved substitutions', 'Cost watchlist'],
        },
      ],
      referenceFiles: [
        {
          id: 'ops-sops',
          title: 'Internal Ops SOP Index',
          type: 'sop',
          path: 'brain/files/ops-sops.md',
          summary: 'Opening, closing, prep, staffing, event service, and escalation SOPs.',
          tags: ['ops', 'sop', 'training'],
        },
        {
          id: 'team-roles',
          title: 'Team Roles + Ownership Map',
          type: 'people',
          path: 'brain/files/team-roles.md',
          summary: 'Who owns what across social, catering, field operations, support, and approvals.',
          tags: ['team', 'owners', 'accountability'],
        },
        {
          id: 'catering-intake',
          title: 'Catering Intake + Follow-up Script',
          type: 'sales',
          path: 'brain/files/catering-intake.md',
          summary: 'Required questions, qualification steps, response SLA, and handoff rules for leads.',
          tags: ['catering', 'sales', 'lead'],
        },
        {
          id: 'vendor-roster',
          title: 'Vendor Roster + Substitution Rules',
          type: 'vendor',
          path: 'brain/files/vendor-roster.md',
          summary: 'Approved vendors, backup items, pricing watchlist, and outage escalation notes.',
          tags: ['vendor', 'cost', 'ops'],
        },
      ],
    },
  ],
  commandCenter: [
    {
      id: 'capture-inbox',
      title: 'Capture Inbox',
      description: 'Slack, DMs, field notes, customer comments, and loose ideas enter here first.',
      itemIds: ['truck-story-capture', 'support-escalation-desk'],
      owner: 'Flo + Shift Leads',
    },
    {
      id: 'content-engine',
      title: 'Content Engine',
      description: 'Turns raw stories into approved, scheduled, measured social content.',
      itemIds: ['weekly-content-calendar', 'creative-approvals', 'performance-feedback-loop'],
      owner: 'Marketing Lead',
    },
    {
      id: 'ops-control',
      title: 'Ops Control',
      description: 'Protects execution quality: launch readiness, weekly scoreboard, escalations, vendors.',
      itemIds: ['opening-playbook', 'field-ops-scoreboard', 'vendor-sync'],
      owner: 'Operations Director',
    },
    {
      id: 'franchise-scale',
      title: 'Franchise Scale',
      description: 'Packages learning into playbooks future operators can repeat.',
      itemIds: ['opening-playbook', 'field-ops-scoreboard', 'performance-feedback-loop'],
      owner: 'John',
    },
  ],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeListField(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean);
  return [];
}

function normalizeItem(item) {
  return {
    id: item.id,
    title: item.title,
    owner: item.owner,
    status: FRANCHISE_BRAIN_ITEM_STATUSES.includes(item.status) ? item.status : 'planned',
    priority: FRANCHISE_BRAIN_ITEM_PRIORITIES.includes(item.priority) ? item.priority : 'normal',
    cadence: item.cadence,
    summary: item.summary,
    inputs: Array.isArray(item.inputs) ? item.inputs : [],
    outputs: Array.isArray(item.outputs) ? item.outputs : [],
    kanbanTaskId: item.kanbanTaskId || '',
    kanbanTaskStatus: item.kanbanTaskStatus || '',
    kanbanTaskUrl: item.kanbanTaskUrl || '',
  };
}

function normalizeReferenceFile(file) {
  return {
    id: file.id,
    title: file.title,
    type: file.type,
    path: file.path,
    summary: file.summary,
    tags: Array.isArray(file.tags) ? file.tags : [],
  };
}

function normalizeCommandSection(section) {
  return {
    id: section.id,
    title: section.title,
    description: section.description,
    owner: section.owner,
    itemIds: Array.isArray(section.itemIds) ? section.itemIds : [],
  };
}

function normalizeLayer(layer) {
  return {
    id: layer.id,
    name: layer.name,
    strapline: layer.strapline,
    summary: layer.summary,
    items: Array.isArray(layer.items) ? layer.items.map(normalizeItem) : [],
    referenceFiles: Array.isArray(layer.referenceFiles) ? layer.referenceFiles.map(normalizeReferenceFile) : [],
  };
}

export function createDefaultFranchiseBrain() {
  return clone(DEFAULT_FRANCHISE_BRAIN);
}

export function normalizeFranchiseBrain(brain = {}) {
  const defaultBrain = createDefaultFranchiseBrain();
  const layerMap = new Map(
    Array.isArray(brain.layers)
      ? brain.layers.map((layer) => [layer.id, normalizeLayer(layer)])
      : [],
  );

  return {
    version: brain.version ?? defaultBrain.version,
    title: brain.title ?? defaultBrain.title,
    updatedAt: brain.updatedAt ?? defaultBrain.updatedAt,
    layers: FRANCHISE_BRAIN_LAYER_IDS.map((layerId) => {
      if (layerMap.has(layerId)) {
        return layerMap.get(layerId);
      }

      return normalizeLayer(defaultBrain.layers.find((layer) => layer.id === layerId));
    }),
    commandCenter: Array.isArray(brain.commandCenter)
      ? brain.commandCenter.map(normalizeCommandSection)
      : defaultBrain.commandCenter.map(normalizeCommandSection),
  };
}

export async function readFranchiseBrain(filePath = DEFAULT_BRAIN_FILE_PATH) {
  try {
    const raw = await readFile(filePath, 'utf8');
    return normalizeFranchiseBrain(JSON.parse(raw));
  } catch (error) {
    if (error && (error.code === 'ENOENT' || error.name === 'SyntaxError')) {
      return createDefaultFranchiseBrain();
    }

    throw error;
  }
}

export async function writeFranchiseBrain(brain, filePath = DEFAULT_BRAIN_FILE_PATH) {
  const normalized = normalizeFranchiseBrain(brain);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
  return normalized;
}

export function validateFranchiseBrainItemUpdate(updates = {}) {
  const allowed = new Set(['layerId', 'title', 'summary', 'owner', 'status', 'priority', 'cadence', 'inputs', 'outputs', 'kanbanTaskId', 'kanbanTaskStatus', 'kanbanTaskUrl']);
  const sanitized = {};

  for (const [key, value] of Object.entries(updates)) {
    if (!allowed.has(key)) continue;
    if (['inputs', 'outputs'].includes(key)) {
      sanitized[key] = normalizeListField(value);
    } else if (typeof value === 'string') {
      sanitized[key] = value.trim();
    }
  }

  if (sanitized.layerId && !FRANCHISE_BRAIN_LAYER_IDS.includes(sanitized.layerId)) {
    throw new Error(`Invalid item layer: ${sanitized.layerId}`);
  }
  if (sanitized.status && !FRANCHISE_BRAIN_ITEM_STATUSES.includes(sanitized.status)) {
    throw new Error(`Invalid item status: ${sanitized.status}`);
  }
  if (sanitized.priority && !FRANCHISE_BRAIN_ITEM_PRIORITIES.includes(sanitized.priority)) {
    throw new Error(`Invalid item priority: ${sanitized.priority}`);
  }

  return sanitized;
}

function buildUniqueBrainItemId(brain, idBase) {
  const existingIds = new Set(getFranchiseBrainItems(brain).map((existing) => existing.id));
  const baseId = slugifyBrainId(idBase);
  let itemId = baseId;
  let suffix = 2;
  while (existingIds.has(itemId)) {
    itemId = `${baseId}-${suffix}`;
    suffix += 1;
  }
  return itemId;
}

export async function createFranchiseBrainItem(updates = {}, filePath = DEFAULT_BRAIN_FILE_PATH) {
  const sanitized = validateFranchiseBrainItemUpdate(updates);
  const title = sanitized.title || '';
  if (!title) {
    throw new Error('Brain item title is required');
  }

  const brain = await readFranchiseBrain(filePath);
  const targetLayerId = sanitized.layerId || 'internal-ops';
  const layer = brain.layers.find((candidate) => candidate.id === targetLayerId);
  if (!layer) {
    throw new Error(`Invalid item layer: ${targetLayerId}`);
  }

  const nextItem = normalizeItem({
    id: buildUniqueBrainItemId(brain, updates.id || title),
    title,
    owner: sanitized.owner || 'Unassigned',
    status: sanitized.status || 'planned',
    priority: sanitized.priority || 'normal',
    cadence: sanitized.cadence || 'as needed',
    summary: sanitized.summary || 'New operating card created from dashboard controls.',
    inputs: sanitized.inputs || [],
    outputs: sanitized.outputs || [],
  });

  const nextBrain = {
    ...brain,
    updatedAt: new Date().toISOString().slice(0, 10),
    layers: brain.layers.map((currentLayer) => (
      currentLayer.id === targetLayerId
        ? { ...currentLayer, items: [nextItem, ...currentLayer.items] }
        : currentLayer
    )),
  };

  const savedBrain = await writeFranchiseBrain(nextBrain, filePath);
  return {
    item: nextItem,
    brain: savedBrain,
    targetLayerId,
  };
}

export async function updateFranchiseBrainItem(itemId, updates = {}, filePath = DEFAULT_BRAIN_FILE_PATH) {
  if (!itemId) {
    throw new Error('Brain item id is required');
  }

  const brain = await readFranchiseBrain(filePath);
  const sanitized = validateFranchiseBrainItemUpdate(updates);
  let matchedItem = null;
  let sourceLayerId = null;

  for (const layer of brain.layers) {
    const item = layer.items.find((candidate) => candidate.id === itemId);
    if (item) {
      matchedItem = item;
      sourceLayerId = layer.id;
      break;
    }
  }

  if (!matchedItem) {
    return null;
  }

  const targetLayerId = sanitized.layerId || sourceLayerId;
  const nextItem = normalizeItem({
    ...matchedItem,
    ...sanitized,
    id: matchedItem.id,
  });

  const nextBrain = {
    ...brain,
    updatedAt: new Date().toISOString().slice(0, 10),
    layers: brain.layers.map((layer) => {
      if (layer.id === sourceLayerId && layer.id === targetLayerId) {
        return {
          ...layer,
          items: layer.items.map((item) => (item.id === itemId ? nextItem : item)),
        };
      }
      if (layer.id === sourceLayerId) {
        return {
          ...layer,
          items: layer.items.filter((item) => item.id !== itemId),
        };
      }
      if (layer.id === targetLayerId) {
        return {
          ...layer,
          items: [nextItem, ...layer.items.filter((item) => item.id !== itemId)],
        };
      }
      return layer;
    }),
  };

  const savedBrain = await writeFranchiseBrain(nextBrain, filePath);
  return {
    item: nextItem,
    brain: savedBrain,
    sourceLayerId,
    targetLayerId,
  };
}

export async function archiveFranchiseBrainItem(itemId, reason = 'No further action.', filePath = DEFAULT_BRAIN_FILE_PATH) {
  const brain = await readFranchiseBrain(filePath);
  const current = getFranchiseBrainItems(brain).find((item) => item.id === itemId);
  if (!current) {
    return null;
  }
  const archiveNote = `Archived: ${reason || 'No further action.'}`;
  const outputs = Array.from(new Set([...(current.outputs || []), archiveNote]));
  return updateFranchiseBrainItem(itemId, { status: 'archived', outputs }, filePath);
}

export async function getFranchiseBrain(filePath = DEFAULT_BRAIN_FILE_PATH) {
  return readFranchiseBrain(filePath);
}

export function getFranchiseBrainItems(brain, layerId) {
  const normalized = normalizeFranchiseBrain(brain);

  return normalized.layers
    .filter((layer) => !layerId || layer.id === layerId)
    .flatMap((layer) =>
      layer.items.map((item) => ({
        ...item,
        layerId: layer.id,
        layerName: layer.name,
        layerStrapline: layer.strapline,
      })),
    );
}

export function getFranchiseBrainStats(brain) {
  const items = getFranchiseBrainItems(brain);

  return {
    layers: FRANCHISE_BRAIN_LAYER_IDS.length,
    items: items.length,
    activeItems: items.filter((item) => item.status === 'active').length,
    blockedItems: items.filter((item) => item.status === 'blocked').length,
    highPriorityItems: items.filter((item) => item.priority === 'high').length,
  };
}

export function getFranchiseBrainReferenceFiles(brain, layerId) {
  const normalized = normalizeFranchiseBrain(brain);
  return normalized.layers
    .filter((layer) => !layerId || layer.id === layerId)
    .flatMap((layer) =>
      layer.referenceFiles.map((file) => ({
        ...file,
        layerId: layer.id,
        layerName: layer.name,
      })),
    );
}

export function getFranchiseBrainCommandCenter(brain) {
  const normalized = normalizeFranchiseBrain(brain);
  const itemMap = new Map(getFranchiseBrainItems(normalized).map((item) => [item.id, item]));
  const sections = normalized.commandCenter.map((section) => ({
    ...section,
    items: section.itemIds.map((id) => itemMap.get(id)).filter(Boolean),
  }));

  return {
    sections,
    urgentItems: getFranchiseBrainItems(normalized).filter((item) => item.priority === 'high'),
    referenceFiles: getFranchiseBrainReferenceFiles(normalized),
  };
}

export function routeSlackSignalToBrainItem(signal = {}) {
  const text = String(signal.text || '').trim();
  const lower = text.toLowerCase();
  const isCatering = /catering|tray|event|guest|gluten|wedding|corporate|booking/.test(lower);
  const isContent = /post|reel|photo|video|tiktok|instagram|facebook|content|social/.test(lower);
  const type = isCatering ? 'catering_lead' : isContent ? 'content_idea' : 'ops_note';
  const layerId = isContent && !isCatering ? 'content-pipeline' : 'internal-ops';
  const createdAt = signal.createdAt || new Date().toISOString();
  const title = isCatering
    ? 'Catering lead captured from Slack'
    : isContent
      ? 'Content idea captured from Slack'
      : 'Ops note captured from Slack';

  return {
    id: `slack-${signal.ts || Date.now()}`.replace(/[^a-zA-Z0-9-_]/g, '-'),
    type,
    title,
    summary: text.length > 180 ? `${text.slice(0, 177)}...` : text,
    rawText: text,
    createdAt,
    layerId,
    status: 'new',
    priority: isCatering || /urgent|asap|today|tomorrow|broken|down/.test(lower) ? 'high' : 'normal',
    owner: isCatering ? 'Catering response owner' : isContent ? 'Marketing Lead' : 'Operations Lead',
    tags: [
      ...(isCatering ? ['catering', 'lead'] : []),
      ...(isContent ? ['content', 'social'] : []),
      ...(/gluten/.test(lower) ? ['dietary'] : []),
    ],
    source: {
      platform: 'slack',
      channel: signal.channel || '',
      user: signal.user || '',
      ts: signal.ts || '',
    },
  };
}

function normalizeBrainSignal(item = {}) {
  const status = FRANCHISE_BRAIN_SIGNAL_STATUSES.includes(item.status) ? item.status : 'new';
  const priority = FRANCHISE_BRAIN_SIGNAL_PRIORITIES.includes(item.priority) ? item.priority : 'normal';
  const layerId = FRANCHISE_BRAIN_LAYER_IDS.includes(item.layerId) ? item.layerId : 'internal-ops';
  const type = FRANCHISE_BRAIN_SIGNAL_TYPES.includes(item.type) ? item.type : 'ops_note';

  return {
    id: item.id || `signal-${Date.now()}`,
    type,
    title: item.title || 'Captured brain signal',
    summary: item.summary || item.rawText || '',
    rawText: item.rawText || item.summary || '',
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
    layerId,
    status,
    priority,
    owner: item.owner || 'Unassigned',
    nextAction: item.nextAction || '',
    tags: Array.isArray(item.tags) ? item.tags : [],
    source: {
      platform: item.source?.platform || 'manual',
      channel: item.source?.channel || '',
      user: item.source?.user || '',
      ts: item.source?.ts || '',
    },
  };
}

export async function readFranchiseBrainSignals(filePath = DEFAULT_SIGNAL_INBOX_FILE_PATH) {
  try {
    const raw = await readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    const signals = Array.isArray(parsed) ? parsed : parsed.signals;
    return Array.isArray(signals) ? signals.map(normalizeBrainSignal) : [];
  } catch (error) {
    if (error && (error.code === 'ENOENT' || error.name === 'SyntaxError')) {
      return [];
    }

    throw error;
  }
}

export async function writeFranchiseBrainSignals(signals, filePath = DEFAULT_SIGNAL_INBOX_FILE_PATH) {
  const normalized = Array.isArray(signals) ? signals.map(normalizeBrainSignal) : [];
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
  return normalized;
}

export async function addFranchiseBrainSignal(signal, filePath = DEFAULT_SIGNAL_INBOX_FILE_PATH) {
  const hasStructuredSignal = Boolean(signal?.type || signal?.title || signal?.summary || signal?.rawText || signal?.layerId);
  const routed = hasStructuredSignal
    ? normalizeBrainSignal({
        ...signal,
        rawText: signal.rawText || signal.text || signal.summary || '',
        summary: signal.summary || signal.text || signal.rawText || '',
        source: signal.source || {
          platform: signal.platform || 'manual',
          channel: signal.channel || '',
          user: signal.user || '',
          ts: signal.ts || '',
        },
      })
    : normalizeBrainSignal(routeSlackSignalToBrainItem(signal));
  const current = await readFranchiseBrainSignals(filePath);
  const withoutDuplicate = current.filter((existing) => existing.id !== routed.id);
  const next = [routed, ...withoutDuplicate].slice(0, 500);
  await writeFranchiseBrainSignals(next, filePath);
  return routed;
}


export async function updateFranchiseBrainSignal(signalId, updates = {}, filePath = DEFAULT_SIGNAL_INBOX_FILE_PATH) {
  if (!signalId) {
    throw new Error('Signal id is required');
  }

  const signals = await readFranchiseBrainSignals(filePath);
  let updatedSignal = null;
  const next = signals.map((signal) => {
    if (signal.id !== signalId) {
      return signal;
    }

    updatedSignal = normalizeBrainSignal({
      ...signal,
      ...updates,
      source: signal.source,
      tags: Array.isArray(updates.tags)
        ? updates.tags
        : typeof updates.tags === 'string'
          ? updates.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
          : signal.tags,
      updatedAt: new Date().toISOString(),
    });
    return updatedSignal;
  });

  if (!updatedSignal) {
    return null;
  }

  await writeFranchiseBrainSignals(next, filePath);
  return updatedSignal;
}

export function validateFranchiseBrainSignalUpdate(updates = {}) {
  const allowed = new Set(['status', 'priority', 'owner', 'type', 'layerId', 'nextAction', 'title', 'summary', 'tags']);
  const sanitized = {};
  for (const [key, value] of Object.entries(updates)) {
    if (!allowed.has(key)) continue;
    if (typeof value === 'string') sanitized[key] = value.trim();
    else if (Array.isArray(value)) sanitized[key] = value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (sanitized.status && !FRANCHISE_BRAIN_SIGNAL_STATUSES.includes(sanitized.status)) {
    throw new Error(`Invalid status: ${sanitized.status}`);
  }
  if (sanitized.priority && !FRANCHISE_BRAIN_SIGNAL_PRIORITIES.includes(sanitized.priority)) {
    throw new Error(`Invalid priority: ${sanitized.priority}`);
  }
  if (sanitized.type && !FRANCHISE_BRAIN_SIGNAL_TYPES.includes(sanitized.type)) {
    throw new Error(`Invalid type: ${sanitized.type}`);
  }
  if (sanitized.layerId && !FRANCHISE_BRAIN_LAYER_IDS.includes(sanitized.layerId)) {
    throw new Error(`Invalid layer: ${sanitized.layerId}`);
  }

  return sanitized;
}


function slugifyBrainId(value) {
  return String(value || 'brain-item')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72) || `brain-item-${Date.now()}`;
}

function signalToCanonicalBrainItem(signal, options = {}) {
  const normalized = normalizeBrainSignal(signal);
  const title = options.targetTitle || normalized.title;
  const idBase = options.targetId || title || normalized.id;

  const operatingStatus = ['active', 'planned', 'blocked'].includes(options.status) ? options.status : 'active';

  return normalizeItem({
    id: slugifyBrainId(idBase),
    title,
    owner: options.owner || normalized.owner || 'Unassigned',
    status: operatingStatus,
    priority: options.priority || normalized.priority || 'normal',
    cadence: options.cadence || (normalized.type === 'content_idea' ? 'campaign' : 'as needed'),
    summary: options.summary || normalized.summary || normalized.rawText,
    inputs: [
      normalized.source?.platform ? `${normalized.source.platform} intake` : 'Manual intake',
      normalized.rawText || normalized.summary,
      ...(normalized.tags || []).map((tag) => `Tag: ${tag}`),
    ].filter(Boolean).slice(0, 5),
    outputs: [
      options.output || (normalized.layerId === 'content-pipeline' ? 'Approved content/action card' : 'Owned ops/action card'),
      `Source signal: ${normalized.id}`,
    ],
  });
}

export function filterFranchiseBrainSignals(signals = [], filters = {}) {
  const normalized = Array.isArray(signals) ? signals.map(normalizeBrainSignal) : [];
  const query = String(filters.query || filters.q || '').trim().toLowerCase();

  return normalized.filter((signal) => {
    if (filters.status && signal.status !== filters.status) return false;
    if (filters.priority && signal.priority !== filters.priority) return false;
    if (filters.layerId && signal.layerId !== filters.layerId) return false;
    if (filters.type && signal.type !== filters.type) return false;
    if (filters.owner && !signal.owner.toLowerCase().includes(String(filters.owner).toLowerCase())) return false;
    if (!query) return true;

    return [signal.title, signal.summary, signal.rawText, signal.owner, signal.type, signal.layerId, ...(signal.tags || [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(query);
  });
}

export async function archiveFranchiseBrainSignal(signalId, reason = 'No further action.', filePath = DEFAULT_SIGNAL_INBOX_FILE_PATH) {
  return updateFranchiseBrainSignal(signalId, {
    status: 'archived',
    nextAction: `Archived: ${reason || 'No further action.'}`,
  }, filePath);
}

export async function convertFranchiseBrainSignalToItem(
  signalId,
  options = {},
  brainFilePath = DEFAULT_BRAIN_FILE_PATH,
  signalsFilePath = DEFAULT_SIGNAL_INBOX_FILE_PATH,
) {
  const signals = await readFranchiseBrainSignals(signalsFilePath);
  const signal = signals.find((item) => item.id === signalId);
  if (!signal) {
    return null;
  }

  const brain = await readFranchiseBrain(brainFilePath);
  const targetLayerId = FRANCHISE_BRAIN_LAYER_IDS.includes(options.layerId) ? options.layerId : signal.layerId;
  const item = signalToCanonicalBrainItem({ ...signal, layerId: targetLayerId }, options);
  const layerMap = new Map(brain.layers.map((layer) => [layer.id, layer]));
  const layer = layerMap.get(targetLayerId);
  if (!layer) {
    throw new Error(`Invalid target layer: ${targetLayerId}`);
  }

  const existingIds = new Set(getFranchiseBrainItems(brain).map((existing) => existing.id));
  let uniqueItem = item;
  let suffix = 2;
  while (existingIds.has(uniqueItem.id)) {
    uniqueItem = { ...item, id: `${item.id}-${suffix}` };
    suffix += 1;
  }

  const nextBrain = {
    ...brain,
    updatedAt: new Date().toISOString().slice(0, 10),
    layers: brain.layers.map((currentLayer) => (
      currentLayer.id === targetLayerId
        ? { ...currentLayer, items: [uniqueItem, ...currentLayer.items] }
        : currentLayer
    )),
  };

  const savedBrain = await writeFranchiseBrain(nextBrain, brainFilePath);
  const updatedSignal = await updateFranchiseBrainSignal(signalId, {
    status: 'done',
    nextAction: `Converted to ${targetLayerId} item: ${uniqueItem.title}`,
  }, signalsFilePath);

  return {
    item: uniqueItem,
    signal: updatedSignal,
    brain: savedBrain,
  };
}

export function getFranchiseBrainSignalStats(signals = []) {
  const normalized = signals.map(normalizeBrainSignal);
  return {
    signals: normalized.length,
    newSignals: normalized.filter((item) => item.status === 'new').length,
    triagedSignals: normalized.filter((item) => item.status === 'triaged' || item.status === 'in_progress').length,
    highPrioritySignals: normalized.filter((item) => item.priority === 'high' || item.priority === 'urgent').length,
    contentSignals: normalized.filter((item) => item.layerId === 'content-pipeline').length,
    opsSignals: normalized.filter((item) => item.layerId === 'internal-ops').length,
  };
}

export async function linkFranchiseBrainItemToKanbanTask(itemId, linkData = {}, brainFilePath = DEFAULT_BRAIN_FILE_PATH) {
  if (!itemId) {
    throw new Error('Brain item id is required');
  }
  if (!linkData.taskId) {
    throw new Error('Kanban task id is required');
  }

  return updateFranchiseBrainItem(itemId, {
    kanbanTaskId: linkData.taskId,
    kanbanTaskStatus: linkData.status || '',
    kanbanTaskUrl: linkData.url || '',
  }, brainFilePath);
}

export async function createKanbanTaskForFranchiseBrainItem(
  itemId,
  taskOptions = {},
  brainFilePath = DEFAULT_BRAIN_FILE_PATH,
  workflowFilePath,
) {
  if (!itemId) {
    throw new Error('Brain item id is required');
  }

  const brain = await readFranchiseBrain(brainFilePath);
  const item = getFranchiseBrainItems(brain).find((candidate) => candidate.id === itemId);
  if (!item) {
    throw new Error(`Brain item not found: ${itemId}`);
  }

  const workflow = await readWorkflowBoard(workflowFilePath);
  
  // Check if task already exists for this brain item
  const existingTask = workflow.lanes
    .flatMap((lane) => lane.tasks)
    .find((task) => task.brainItemId === itemId);

  if (existingTask && item.kanbanTaskId === existingTask.id) {
    // Task already exists and is linked - return without creating duplicate
    return {
      created: false,
      task: existingTask,
      workflow,
      brain,
    };
  }

  // Create new task
  const targetLaneId = taskOptions.laneId || 'backlog';
  const taskId = taskOptions.taskId || `t_${itemId}`;
  
  const newTask = {
    id: taskId,
    title: taskOptions.title || item.title,
    owner: taskOptions.owner || item.owner,
    priority: taskOptions.priority || item.priority,
    areaId: 'franchise-brain',
    summary: taskOptions.summary || item.summary,
    brainItemId: itemId,
  };

  const nextWorkflow = {
    ...workflow,
    updatedAt: new Date().toISOString().slice(0, 10),
    lanes: workflow.lanes.map((lane) => {
      if (lane.id === targetLaneId) {
        return {
          ...lane,
          tasks: [newTask, ...lane.tasks],
        };
      }
      return lane;
    }),
  };

  const savedWorkflow = await writeWorkflowBoard(nextWorkflow, workflowFilePath);
  
  // Link the brain item to the task
  const linkResult = await linkFranchiseBrainItemToKanbanTask(itemId, {
    taskId,
    status: targetLaneId,
    url: taskOptions.url || `/dashboard/workflow#${taskId}`,
  }, brainFilePath);

  return {
    created: true,
    task: newTask,
    workflow: savedWorkflow,
    brain: linkResult.brain,
  };
}
