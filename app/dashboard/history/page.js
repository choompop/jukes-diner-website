'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const [archives, setArchives] = useState([]);
  const [selected, setSelected] = useState(null);
  const [currentUser, setCurrentUser] = useState('');
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('jukes_user');
    if (!user) { router.push('/dashboard/login'); return; }
    setCurrentUser(user);
    const saved = JSON.parse(localStorage.getItem(`jukes_archives_${user}`) || '[]');
    setArchives(saved);
  }, []);

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  function getPreview(archive) {
    const firstUser = archive.messages.find(m => m.role === 'user');
    return firstUser ? firstUser.content.substring(0, 80) + (firstUser.content.length > 80 ? '...' : '') : 'Empty chat';
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <div className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur border-b border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.push('/dashboard/chat')} className="text-zinc-400 hover:text-zinc-200 text-sm">
            Back to Chat
          </button>
          <h1 className="text-sm font-medium text-[#D4A843]">Chat History</h1>
          <span className="text-xs text-zinc-500">{currentUser}</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {selected !== null ? (
          <div>
            <button onClick={() => setSelected(null)} className="text-[#2A8F8F] text-sm mb-4 hover:underline">
              Back to list
            </button>
            <div className="space-y-3">
              {archives[selected].messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user' ? 'bg-[#2A8F8F] text-white rounded-br-md' : 'bg-zinc-800 text-[#FFF8F0] rounded-bl-md'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : archives.length === 0 ? (
          <p className="text-center text-zinc-500 py-12">No archived chats yet. Hit "New Chat" to archive the current one.</p>
        ) : (
          <div className="space-y-2">
            {archives.map((archive, i) => (
              <button key={i} onClick={() => setSelected(i)} className="w-full text-left bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-600 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-[#D4A843]">{archive.messages.length} messages</span>
                  <span className="text-xs text-zinc-500">{formatDate(archive.date)}</span>
                </div>
                <p className="text-sm text-[#FFF8F0]">{getPreview(archive)}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
