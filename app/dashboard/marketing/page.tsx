import {
  Camera,
  CheckCircle2,
  Download,
  FileImage,
  Palette,
  Tags,
  Video,
  Wand2,
} from 'lucide-react';

import {
  readMediaHub,
  getBrandBoard,
  getContentRepurposingQueue,
  getMediaCaptureQueue,
  getMediaHubStats,
} from '../../../lib/media-hub.mjs';
import websitePlacementMap from '../../../data/website-content-placement-map.json';
import { cn } from '../../../lib/utils';
import { MediaWorkflowControls, AddMediaAssetForm } from './MediaWorkflowControls';

const statusStyles: Record<string, string> = {
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'needs-approval': 'bg-yellow-50 text-yellow-700 border-yellow-100',
  'needs-tags': 'bg-red-50 text-red-700 border-red-100',
};

const priorityStyles: Record<string, string> = {
  urgent: 'bg-diner-red text-white',
  high: 'bg-diner-black text-white',
  normal: 'bg-diner-cream text-diner-black',
};

export const dynamic = 'force-dynamic';

export default async function Marketing() {
  const hub = await readMediaHub();
  const stats = getMediaHubStats(hub);
  const board = getBrandBoard(hub);
  const captureQueue = getMediaCaptureQueue(hub);
  const repurposingQueue = getContentRepurposingQueue(hub);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-display uppercase tracking-[0.35em] text-diner-red">MEDIA + BRAND HUB</p>
          <h1 className="mb-2 text-3xl text-diner-black">BRAND & MARKETING</h1>
          <p className="max-w-3xl font-sans text-gray-500">
            One tagged source of truth for Juke&apos;s media, brand voice, operator capture requests, and content repurposing.
          </p>
        </div>
        <AddMediaAssetForm />
      </div>

      <section className="grid gap-4 md:grid-cols-5">
        {[
          { label: 'Total assets', value: stats.totalAssets, icon: FileImage },
          { label: 'Approved', value: stats.approvedAssets, icon: CheckCircle2 },
          { label: 'Need tags', value: stats.needsTags, icon: Tags },
          { label: 'Need approval', value: stats.needsApproval, icon: Camera },
          { label: 'Campaign ready', value: stats.campaignReadyAssets, icon: Wand2 },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <Icon className="mb-4 h-5 w-5 text-diner-red" />
              <p className="font-display text-3xl text-diner-black">{item.value}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{item.label}</p>
            </article>
          );
        })}
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-display uppercase tracking-[0.3em] text-diner-red">Website placement map</p>
            <h2 className="font-display text-xl text-diner-black">CURATED SITE SLOTS — NOT A DRIVE DUMP</h2>
            <p className="mt-2 max-w-3xl text-sm text-gray-500">
              {websitePlacementMap.purpose} Source of truth: {websitePlacementMap.sourceOfTruth}.
            </p>
          </div>
          <span className="rounded-full bg-diner-cream px-3 py-1 text-[10px] font-display uppercase tracking-[0.2em] text-diner-black">
            {websitePlacementMap.slots.length} slots
          </span>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {websitePlacementMap.slots.map((slot) => (
            <article key={slot.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-display uppercase tracking-[0.2em] text-diner-red">{slot.priority}</p>
                  <h3 className="font-display text-base text-diner-black">{slot.label}</h3>
                </div>
                <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold uppercase text-gray-500">
                  {slot.pageTargets.join(' · ')}
                </span>
              </div>
              <p className="text-sm leading-6 text-gray-600">{slot.idealAssetType}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {slot.tagsRequired.slice(0, 5).map((tag) => (
                  <span key={tag} className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-gray-500">#{tag}</span>
                ))}
              </div>
              <p className="mt-4 rounded-xl bg-white p-3 text-xs leading-5 text-gray-500">
                <span className="font-bold text-diner-black">Cadence:</span> {slot.updateCadence}
              </p>
              <p className="mt-3 text-xs font-semibold text-diner-red">Guardrail: {slot.doNotUse}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8">
          <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl">APPROVED + INTAKE ASSET LIBRARY</h2>
                <p className="mt-2 text-sm text-gray-500">Use this as the future upload/tagging index Flo can reference before creating posts, proof cards, and brand assets.</p>
              </div>
              <span className="rounded-full bg-diner-cream px-3 py-1 text-[10px] font-display uppercase tracking-[0.2em] text-diner-black">{hub.storage.rootPath}</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {hub.assets.map((asset) => (
                <article key={asset.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-diner-red">
                        {asset.type === 'video' ? <Video className="h-4 w-4" /> : <FileImage className="h-4 w-4" />}
                        <span className="text-[10px] font-display uppercase tracking-[0.2em]">{asset.type}</span>
                      </div>
                      <h3 className="font-display text-base text-diner-black">{asset.title}</h3>
                      <p className="mt-1 text-xs text-gray-500">{asset.owner}</p>
                    </div>
                    <span className={cn('rounded-full border px-2 py-1 text-[10px] font-bold uppercase', statusStyles[asset.status] || 'border-gray-100 bg-white text-gray-500')}>
                      {asset.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="mb-3 truncate rounded-xl bg-white px-3 py-2 font-mono text-[10px] text-gray-400">{asset.storagePath}</p>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {(asset.tags?.length ? asset.tags : ['needs-tags']).map((tag) => (
                      <span key={tag} className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-gray-500">#{tag}</span>
                    ))}
                  </div>
                  <MediaWorkflowControls asset={asset} />
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="mb-6 font-display text-xl">REPURPOSING QUEUE</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {repurposingQueue.slice(0, 8).map((item) => (
                <article key={item.id} className="rounded-2xl border border-gray-100 p-5">
                  <p className="mb-2 text-[10px] font-display uppercase tracking-[0.2em] text-diner-red">{item.output}</p>
                  <h3 className="font-bold text-diner-black">{item.assetTitle}</h3>
                  <p className="mt-2 text-sm text-gray-500">{item.prompt}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="rounded-3xl bg-diner-black p-8 text-white shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <Palette className="h-6 w-6 text-diner-cream" />
              <h2 className="font-display text-lg">BRAND BOARD</h2>
            </div>
            <div className="mb-6 grid grid-cols-4 gap-3">
              {board.palette.map((color) => (
                <div key={color.token}>
                  <div style={{ backgroundColor: color.value }} className="mb-2 h-12 rounded-xl border border-white/10" />
                  <p className="text-[9px] uppercase text-white/60">{color.token}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {board.voiceRules.map((rule) => (
                <p key={rule} className="rounded-2xl bg-white/10 p-3 text-sm text-white/80">{rule}</p>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="mb-6 font-display text-lg">CAPTURE REQUESTS</h2>
            <div className="space-y-4">
              {captureQueue.map((item) => (
                <article key={item.id} className="rounded-2xl bg-gray-50 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className={cn('rounded-full px-2 py-1 text-[10px] font-display uppercase', priorityStyles[item.priority] || 'bg-gray-200 text-gray-700')}>{item.priority}</span>
                    <span className="text-[10px] text-gray-400">{item.owner}</span>
                  </div>
                  <p className="text-sm font-semibold text-diner-black">{item.request}</p>
                  <p className="mt-2 text-xs text-gray-500">{item.channelUse}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
