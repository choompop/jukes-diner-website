'use client';

import { useState } from 'react';
import { Check, X, Tags, Upload, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MediaWorkflowControls({ asset, onSuccess }: { asset: any; onSuccess?: (data: any) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagInput, setTagInput] = useState('');

  async function handleAction(action, payload) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/media-hub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Action failed');
      }

      if (onSuccess) {
        onSuccess(data);
      }

      // Refresh the page to show updated data
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleTagSubmit(e) {
    e.preventDefault();
    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
    if (tags.length === 0) return;

    await handleAction('tagAsset', {
      assetId: asset.id,
      tags,
    });

    setShowTagInput(false);
    setTagInput('');
  }

  if (asset.status === 'approved') {
    return (
      <div className="flex gap-2">
        {!asset.promotedToRepurposing && (
          <button
            onClick={() => handleAction('promoteAsset', { assetId: asset.id })}
            disabled={isLoading}
            className="flex items-center gap-1 rounded-lg bg-diner-teal px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
          >
            <Wand2 className="h-3 w-3" />
            Promote to Queue
          </button>
        )}
        {asset.promotedToRepurposing && (
          <span className="rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            ✓ In Repurposing Queue
          </span>
        )}
      </div>
    );
  }

  if (asset.status === 'needs-tags') {
    return (
      <div className="space-y-2">
        {!showTagInput ? (
          <button
            onClick={() => setShowTagInput(true)}
            disabled={isLoading}
            className="flex items-center gap-1 rounded-lg bg-diner-black px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
          >
            <Tags className="h-3 w-3" />
            Add Tags
          </button>
        ) : (
          <form onSubmit={handleTagSubmit} className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="food-proof, catering-conversion, ..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs"
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-diner-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowTagInput(false)}
              className="rounded-lg bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
          </form>
        )}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  if (asset.status === 'needs-approval') {
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <button
            onClick={() => handleAction('reviewAsset', {
              assetId: asset.id,
              decision: 'approve',
              reviewer: 'Brand lead',
            })}
            disabled={isLoading}
            className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            <Check className="h-3 w-3" />
            Approve
          </button>
          <button
            onClick={() => {
              const reason = prompt('Rejection reason (optional):');
              if (reason !== null) {
                handleAction('reviewAsset', {
                  assetId: asset.id,
                  decision: 'reject',
                  reviewer: 'Brand lead',
                  reason: reason || 'Rejected by brand review',
                });
              }
            }}
            disabled={isLoading}
            className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            <X className="h-3 w-3" />
            Reject
          </button>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  if (asset.status === 'rejected') {
    return (
      <div className="text-xs text-gray-500">
        Rejected: {asset.rejectionReason || 'No reason provided'}
      </div>
    );
  }

  return null;
}

export function AddMediaAssetForm({ onSuccess }: { onSuccess?: (data: any) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'photo',
    owner: '',
    tags: '',
    channels: '',
    storagePath: '',
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/media-hub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addAsset',
          payload: {
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            channels: formData.channels.split(',').map(c => c.trim()).filter(Boolean),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add asset');
      }

      if (onSuccess) {
        onSuccess(data);
      }

      // Reset form and close
      setFormData({
        title: '',
        type: 'photo',
        owner: '',
        tags: '',
        channels: '',
        storagePath: '',
      });
      setIsOpen(false);

      // Refresh the page to show the new asset
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-diner-red px-6 py-3 font-display text-sm text-white shadow-lg transition-colors hover:bg-red-700"
      >
        <Upload className="h-4 w-4" />
        ADD MEDIA ASSET
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      <h3 className="mb-4 font-display text-lg">ADD MEDIA ASSET</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="e.g., Saturday catering setup reel"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">Type *</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="photo">Photo</option>
            <option value="video">Video</option>
            <option value="image">Image</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">Owner</label>
          <input
            type="text"
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="e.g., Catering lead"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="e.g., food-proof, catering-conversion"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">Channels (comma-separated)</label>
          <input
            type="text"
            value={formData.channels}
            onChange={(e) => setFormData({ ...formData, channels: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="e.g., instagram, tiktok"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">Storage Path (optional)</label>
          <input
            type="text"
            value={formData.storagePath}
            onChange={(e) => setFormData({ ...formData, storagePath: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="Default: media/jukes-diner/operator-uploads/[id]"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-diner-red px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? 'Adding...' : 'Add Asset'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setError(null);
            }}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
