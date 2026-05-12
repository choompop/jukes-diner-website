import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_MEDIA_HUB_PATH = path.join(process.cwd(), 'data', 'media-hub.json');

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function uniqueTags(tags = []) {
  return [...new Set(tags.filter(Boolean))];
}

export function createDefaultMediaHub() {
  return {
    version: 1,
    title: "Juke's Diner Media + Brand Hub",
    updatedAt: '2026-05-08',
    storage: {
      provider: 'local-now-cloud-later',
      rootPath: 'media/jukes-diner',
      roots: [
        { id: 'raw-capture', label: 'Raw Capture', path: 'media/jukes-diner/raw', owner: 'Operators', rule: 'Upload before judging; Flo can tag and route later.' },
        { id: 'approved-assets', label: 'Approved Assets', path: 'media/jukes-diner/approved', owner: 'Brand lead', rule: 'Only polished, reusable assets that can ship externally.' },
        { id: 'brand-board', label: 'Brand Board', path: 'media/jukes-diner/brand-board', owner: 'Marketing lead', rule: 'Visual references, palette, typography, and examples to keep the look cohesive.' },
        { id: 'operator-uploads', label: 'Operator Uploads', path: 'media/jukes-diner/operator-uploads', owner: 'Unit operators', rule: 'Field uploads that need tagging, approval, or follow-up.' },
      ],
    },
    brandBoard: {
      palette: [
        { token: 'diner-red', value: '#D62828', use: 'primary CTA, urgency, classic diner accent' },
        { token: 'diner-cream', value: '#FFF3D7', use: 'background warmth, menu card feel' },
        { token: 'diner-teal', value: '#0F8B8D', use: 'secondary accent, operational trust' },
        { token: 'diner-black', value: '#1E1E1E', use: 'headlines, contrast, retro sign depth' },
      ],
      typography: [
        { name: 'Bebas Neue', role: 'display', use: 'bold diner headlines, readable from distance' },
        { name: 'Inter', role: 'sans', use: 'operator UI, forms, labels, dashboards, body text' },
      ],
      voiceRules: [
        'Retro diner energy without becoming costume-y or fake nostalgic.',
        'Operator-real: show the work, the systems, the prep, and the service moments.',
        'Food first: make burgers, fries, catering trays, and events feel craveable and bookable.',
        'Use plain-spoken confidence; avoid agency jargon and generic influencer language.',
      ],
      contentPillars: [
        { id: 'food-proof', label: 'Food Proof', purpose: 'Make the product craveable and instantly bookable.' },
        { id: 'build-in-public', label: 'Build in Public', purpose: 'Show John building systems and a franchise-able operating model.' },
        { id: 'catering-conversion', label: 'Catering Conversion', purpose: 'Turn event/social proof into catering leads.' },
        { id: 'franchise-signal', label: 'Franchise Signal', purpose: 'Teach the business model and attract future operators.' },
      ],
    },
    assets: [
      { id: 'smash-burger-hero', title: 'Smash Burger Hero', type: 'photo', status: 'approved', storagePath: 'media/jukes-diner/approved/smash-burger-hero.jpg', tags: ['food-proof', 'menu', 'burger'], channels: ['website', 'instagram'], owner: 'Operator' },
      { id: 'hot-chicken-closeup', title: 'Hot Chicken Closeup', type: 'photo', status: 'approved', storagePath: 'media/jukes-diner/approved/hot-chicken-closeup.jpg', tags: ['food-proof', 'menu'], channels: ['website', 'instagram'], owner: 'Operator' },
      { id: 'truck-window-service', title: 'Truck Window Service', type: 'photo', status: 'approved', storagePath: 'media/jukes-diner/approved/truck-window-service.jpg', tags: ['catering-conversion', 'build-in-public'], channels: ['website'], owner: 'Catering owner' },
      { id: 'unit-economics-card', title: 'Unit Economics Proof Card', type: 'image', status: 'approved', storagePath: 'media/jukes-diner/brand-board/unit-economics-card.png', tags: ['franchise-signal'], channels: ['linkedin'], owner: 'John' },
      { id: 'catering-table-spread', title: 'Catering Table Spread', type: 'photo', status: 'needs-approval', storagePath: 'media/jukes-diner/operator-uploads/catering-table-spread.jpg', tags: ['catering-conversion', 'food-proof'], channels: ['website', 'instagram'], owner: 'Catering owner' },
      { id: 'trailer-park-night-sign', title: 'Trailer Park Night Sign', type: 'photo', status: 'needs-approval', storagePath: 'media/jukes-diner/operator-uploads/trailer-park-night-sign.jpg', tags: ['build-in-public'], channels: ['instagram'], owner: 'Operator' },
      { id: 'prep-routine-vertical', title: 'Prep Routine Vertical', type: 'video', status: 'needs-tags', storagePath: 'media/jukes-diner/raw/prep-routine-vertical.mp4', tags: [], channels: ['tiktok'], owner: 'Shift lead' },
      { id: 'event-line-photo', title: 'Event Line Photo', type: 'photo', status: 'needs-tags', storagePath: 'media/jukes-diner/raw/event-line-photo.jpg', tags: [], channels: ['website'], owner: 'Event operator' },
    ],
    captureRequests: [
      { id: 'capture-catering-proof', priority: 'urgent', request: 'Shoot 6 clean horizontal and vertical catering setup clips before guests arrive.', owner: 'Catering owner', channelUse: 'Website catering page + Instagram proof' },
      { id: 'capture-vertical-prep', priority: 'high', request: 'Capture vertical video of prep, line checks, and handoff moments every operating day.', owner: 'Shift lead', channelUse: 'TikTok build-in-public series' },
      { id: 'capture-franchise-proof', priority: 'high', request: 'Record John explaining one operating system: COGS, labor, training, or bookings.', owner: 'John', channelUse: 'LinkedIn + franchise interest funnel' },
      { id: 'capture-customer-reactions', priority: 'normal', request: 'Collect customer reaction photos/videos with permission at busy events.', owner: 'Event operator', channelUse: 'Social proof library' },
    ],
    repurposingRules: [
      { tag: 'food-proof', output: 'Instagram carousel', prompt: 'Turn approved food photos into a craveable menu/story post with a catering CTA.' },
      { tag: 'catering-conversion', output: 'Website proof block', prompt: 'Create a trust-building event recap with headcount, service style, and booking CTA.' },
      { tag: 'build-in-public', output: 'TikTok script', prompt: 'Cut a raw founder/operator lesson with hook, conflict, system, and lesson.' },
      { tag: 'franchise-signal', output: 'Franchise proof card', prompt: 'Turn operational footage into a simple proof point about replicable systems.' },
    ],
  };
}

export async function readMediaHub(filePath = DEFAULT_MEDIA_HUB_PATH) {
  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error?.code === 'ENOENT') return createDefaultMediaHub();
    throw error;
  }
}

export async function writeMediaHub(hub, filePath = DEFAULT_MEDIA_HUB_PATH) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(hub, null, 2)}\n`, 'utf8');
  return hub;
}

export function getMediaHubStats(hub) {
  const assets = hub.assets || [];
  return {
    totalAssets: assets.length,
    approvedAssets: assets.filter((asset) => asset.status === 'approved').length,
    needsTags: assets.filter((asset) => asset.status === 'needs-tags').length,
    needsApproval: assets.filter((asset) => asset.status === 'needs-approval').length,
    campaignReadyAssets: assets.filter((asset) => asset.status !== 'needs-tags' && asset.tags?.length).length,
  };
}

export function getMediaByTag(hub, tag) {
  return (hub.assets || []).filter((asset) => asset.tags?.includes(tag));
}

export function filterAssetsByTag(hub, tag) {
  return getMediaByTag(hub, tag);
}

export function filterAssetsByStatus(hub, status) {
  return (hub.assets || []).filter((asset) => asset.status === status);
}

export function getAllAssets(hub) {
  return hub.assets || [];
}

export function getBrandBoard(hub) {
  return hub.brandBoard || createDefaultMediaHub().brandBoard;
}

export function getMediaCaptureQueue(hub) {
  return hub.captureRequests || hub.captureQueue || [];
}

export function getContentRepurposingQueue(hub) {
  const approvedAssets = (hub.assets || []).filter((asset) => asset.status === 'approved');
  const rules = hub.repurposingRules || [];
  return approvedAssets.flatMap((asset) =>
    rules
      .filter((rule) => asset.tags?.includes(rule.tag))
      .map((rule) => ({
        id: `${asset.id}-${slugify(rule.output)}`,
        assetId: asset.id,
        assetTitle: asset.title,
        output: rule.output,
        prompt: rule.prompt,
      })),
  );
}

export function addMediaAsset(hub, payload) {
  const asset = {
    id: payload.id || slugify(payload.title),
    title: payload.title,
    type: payload.type || 'photo',
    status: payload.status || 'needs-approval',
    storagePath: payload.storagePath,
    tags: uniqueTags(payload.tags || []),
    channels: payload.channels || [],
    owner: payload.owner || 'Operator',
    addedAt: payload.addedAt || new Date().toISOString().slice(0, 10),
  };
  const nextHub = { ...hub, assets: [...(hub.assets || []), asset], updatedAt: new Date().toISOString().slice(0, 10) };
  return { hub: nextHub, asset };
}

export function tagMediaAsset(hub, assetId, tags) {
  let taggedAsset;
  const assets = (hub.assets || []).map((asset) => {
    if (asset.id !== assetId) return asset;
    taggedAsset = {
      ...asset,
      tags: uniqueTags(tags),
      status: 'needs-approval',
    };
    return taggedAsset;
  });
  if (!taggedAsset) throw new Error(`Media asset not found: ${assetId}`);
  return { hub: { ...hub, assets, updatedAt: new Date().toISOString().slice(0, 10) }, asset: taggedAsset };
}

export function reviewMediaAsset(hub, assetId, review) {
  let reviewedAsset;
  const status = review.decision === 'approve' ? 'approved' : 'rejected';
  const assets = (hub.assets || []).map((asset) => {
    if (asset.id !== assetId) return asset;
    const approvedPath = status === 'approved'
      ? asset.storagePath?.replace('/operator-uploads/', '/approved/').replace('/raw/', '/approved/')
      : asset.storagePath;
    reviewedAsset = {
      ...asset,
      status,
      storagePath: approvedPath,
      reviewedBy: review.reviewer,
      reviewedAt: new Date().toISOString().slice(0, 10),
      ...(status === 'rejected' ? { rejectionReason: review.reason || 'Rejected by reviewer.' } : {}),
    };
    return reviewedAsset;
  });
  if (!reviewedAsset) throw new Error(`Media asset not found: ${assetId}`);
  return { hub: { ...hub, assets, updatedAt: new Date().toISOString().slice(0, 10) }, asset: reviewedAsset };
}

export function promoteMediaAssetToRepurposing(hub, assetId, options = {}) {
  let promotedAsset;
  const assets = (hub.assets || []).map((asset) => {
    if (asset.id !== assetId) return asset;
    if (asset.status !== 'approved') throw new Error('Only approved assets can be promoted into repurposing.');
    promotedAsset = {
      ...asset,
      promotedToRepurposing: true,
      promotedBy: options.promotedBy || 'Marketing lead',
      promotedAt: new Date().toISOString().slice(0, 10),
    };
    return promotedAsset;
  });
  if (!promotedAsset) throw new Error(`Media asset not found: ${assetId}`);
  const nextHub = { ...hub, assets, updatedAt: new Date().toISOString().slice(0, 10) };
  return { hub: nextHub, asset: promotedAsset, queueItems: getContentRepurposingQueue(nextHub).filter((item) => item.assetId === assetId) };
}

export async function applyMediaHubAction(action, payload, filePath = DEFAULT_MEDIA_HUB_PATH) {
  const hub = await readMediaHub(filePath);
  let result;
  if (action === 'addAsset') result = addMediaAsset(hub, payload);
  else if (action === 'tagAsset') result = tagMediaAsset(hub, payload.assetId, payload.tags);
  else if (action === 'reviewAsset') result = reviewMediaAsset(hub, payload.assetId, payload.review || payload);
  else if (action === 'promoteAsset') result = promoteMediaAssetToRepurposing(hub, payload.assetId, payload.options || payload);
  else throw new Error(`Unsupported action: ${action}`);

  await writeMediaHub(result.hub, filePath);
  return result;
}
