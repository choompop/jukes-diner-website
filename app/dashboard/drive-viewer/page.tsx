'use client';

import { HardDrive, File, Folder, Search, Filter, ExternalLink } from 'lucide-react';

export default function DriveViewer() {
  const mockFiles = [
    { name: 'Franchise_Agreement_v2.pdf', type: 'pdf', size: '2.4 MB', date: '2026-03-28' },
    { name: 'Menu_Spring_2026_Draft.docx', type: 'doc', size: '1.1 MB', date: '2026-04-01' },
    { name: 'Truck_Maintenance_Log.xlsx', type: 'sheet', size: '850 KB', date: '2026-04-03' },
    { name: 'Branding_Assets', type: 'folder', size: '--', date: '2026-02-15' },
    { name: 'Event_Photos_March.zip', type: 'zip', size: '156 MB', date: '2026-03-30' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-diner-black mb-1">GOOGLE DRIVE</h1>
          <p className="text-gray-500 font-serif italic">Centralized franchise assets and documents</p>
        </div>
        <button className="bg-diner-teal text-white px-6 py-3 rounded-xl font-display text-sm hover:bg-teal-700 transition-colors flex items-center gap-2">
          <ExternalLink className="h-4 w-4" /> OPEN IN DRIVE
        </button>
      </div>

      <div className="glass-card rounded-[2rem] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-diner-teal outline-none text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button className="p-3 rounded-xl border border-gray-200 hover:bg-white transition-colors text-gray-500">
              <Filter className="h-4 w-4" />
            </button>
            <div className="h-10 w-[1px] bg-gray-200 mx-2" />
            <div className="flex items-center gap-2 text-xs font-display text-gray-400">
              <HardDrive className="h-4 w-4" />
              <span>4.2 GB / 15 GB</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30 text-[10px] font-display text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-4">Name</th>
                <th className="px-8 py-4">Size</th>
                <th className="px-8 py-4">Last Modified</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="font-serif">
              {mockFiles.map((file, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-diner-cream/30 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      {file.type === 'folder' ? (
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
                  <td className="px-8 py-4 text-right">
                    <button className="text-gray-300 hover:text-diner-teal transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-12 text-center border-t border-gray-50 bg-gray-50/20">
          <HardDrive className="h-12 w-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl text-gray-400 mb-2">GOOGLE DRIVE INTEGRATION</h3>
          <p className="text-gray-400 font-serif italic max-w-md mx-auto">
            This is a live preview of your franchise Google Drive folder. Connect your Google Cloud project to enable real-time file management.
          </p>
        </div>
      </div>
    </div>
  );
}
