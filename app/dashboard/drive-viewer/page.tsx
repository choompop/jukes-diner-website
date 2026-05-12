'use client';

import { HardDrive, File, Folder, Search, Filter, ExternalLink, CheckCircle2 } from 'lucide-react';
import integrations from '@/data/dashboard-integrations.json';

export default function DriveViewer() {
  const files = integrations.googleDrive.verifiedFiles;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-diner-black mb-1">GOOGLE DRIVE</h1>
          <p className="text-gray-500 font-sans">Verified Juke&apos;s assets, menus, and content-library links.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={integrations.googleDrive.sheetUrl} target="_blank" rel="noreferrer" className="border border-diner-teal text-diner-teal px-6 py-3 rounded-xl font-display text-sm hover:bg-diner-teal/5 transition-colors flex items-center gap-2">
            <ExternalLink className="h-4 w-4" /> CONTENT INDEX
          </a>
          <a href={integrations.googleDrive.url} target="_blank" rel="noreferrer" className="bg-diner-teal text-white px-6 py-3 rounded-xl font-display text-sm hover:bg-teal-700 transition-colors flex items-center gap-2">
            <ExternalLink className="h-4 w-4" /> OPEN DRIVE FOLDER
          </a>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
          <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-700" />
          <p className="font-display text-lg text-emerald-900">Hermes read access verified</p>
          <p className="mt-2 text-sm text-emerald-800/80">Drive and Sheet assets are reachable by agents for inventory and tagging.</p>
        </div>
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-display uppercase tracking-[0.25em] text-gray-400">Source folder</p>
          <p className="mt-2 font-display text-lg text-diner-black">{integrations.googleDrive.label}</p>
          <p className="mt-2 break-all font-mono text-[11px] text-gray-400">{integrations.googleDrive.folderId}</p>
        </div>
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-display uppercase tracking-[0.25em] text-gray-400">Runtime bridge</p>
          <p className="mt-2 font-display text-lg text-diner-black">Vercel credential needed</p>
          <p className="mt-2 text-sm text-gray-500">Live dashboard can link out now; direct server-side Drive browsing needs a least-privilege Google credential.</p>
        </div>
      </section>

      <div className="glass-card rounded-[2rem] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search verified files..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-diner-teal outline-none text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button className="p-3 rounded-xl border border-gray-200 hover:bg-white transition-colors text-gray-500" aria-label="Filter files">
              <Filter className="h-4 w-4" />
            </button>
            <div className="h-10 w-[1px] bg-gray-200 mx-2" />
            <div className="flex items-center gap-2 text-xs font-display text-gray-400">
              <HardDrive className="h-4 w-4" />
              <span>{files.length} verified links</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30 text-[10px] font-display text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-4">Name</th>
                <th className="px-8 py-4">Source</th>
                <th className="px-8 py-4">Last Modified</th>
                <th className="px-8 py-4">Open</th>
              </tr>
            </thead>
            <tbody className="font-sans">
              {files.map((file) => (
                <tr key={file.url} className="border-b border-gray-50 hover:bg-diner-cream/30 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      {file.type === 'sheet' ? (
                        <Folder className="h-5 w-5 text-diner-teal fill-diner-teal/20" />
                      ) : (
                        <File className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-sm font-medium text-gray-700 group-hover:text-diner-black transition-colors">
                        {file.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-sm text-gray-500">{file.size}</td>
                  <td className="px-8 py-4 text-sm text-gray-500">{file.date}</td>
                  <td className="px-8 py-4">
                    <a href={file.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-diner-teal ring-1 ring-gray-100 hover:bg-diner-teal hover:text-white">
                      Open <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-8 border-t border-gray-50 bg-gray-50/40">
          <h3 className="text-xl text-diner-black mb-2">How to use this</h3>
          <p className="text-sm text-gray-500 font-sans max-w-3xl">
            Use Drive for source material, the Content Library Index for tagging/approval, and Brand & Marketing for what is safe to reuse on the website or in Flo/social workflows.
          </p>
        </div>
      </div>
    </div>
  );
}
