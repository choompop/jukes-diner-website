'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('jukes_user');
    if (!user) {
      router.push('/dashboard/login');
      return;
    }
    setCurrentUser(user);
    const saved = localStorage.getItem(`jukes_chat_${user}`);
    if (saved) {
      try { setMessages(JSON.parse(saved)); } catch(e) {}
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function saveMessages(msgs) {
    localStorage.setItem(`jukes_chat_${currentUser}`, JSON.stringify(msgs));
  }

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    const userMsg = { role: 'user', content: text, time: new Date().toISOString() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    saveMessages(updated);
    setLoading(true);

    try {
      const history = messages.slice(-20).map(m => ({ role: m.role, content: m.content }));
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, user: currentUser, history }),
      });

      const data = await res.json();

      if (data.ai_response) {
        const withResponse = [
          ...updated,
          { role: 'assistant', content: data.ai_response, category: data.category, time: new Date().toISOString() },
        ];
        setMessages(withResponse);
        saveMessages(withResponse);
      }
    } catch (err) {
      const withError = [...updated, { role: 'assistant', content: 'Something went wrong. Try again.' }];
      setMessages(withError);
    }

    setLoading(false);
    inputRef.current?.focus();
  }

  function handleNewChat() {
    // Archive current chat
    const archives = JSON.parse(localStorage.getItem(`jukes_archives_${currentUser}`) || '[]');
    if (messages.length > 0) {
      archives.unshift({ messages, date: new Date().toISOString() });
      localStorage.setItem(`jukes_archives_${currentUser}`, JSON.stringify(archives.slice(0, 50)));
    }
    setMessages([]);
    localStorage.removeItem(`jukes_chat_${currentUser}`);
  }

  function logout() {
    localStorage.removeItem('jukes_user');
    router.push('/dashboard/login');
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex flex-col h-screen">
      {/* Header */}
      <div className="flex-shrink-0 bg-zinc-900/95 backdrop-blur border-b border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-bold text-[#C41E2A]">Lexi</h1>
              <p className="text-[10px] text-zinc-500">Juke's Diner AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => router.push('/dashboard/history')} className="text-zinc-500 hover:text-zinc-300 text-xs px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors">
              History
            </button>
            <button onClick={handleNewChat} className="text-zinc-500 hover:text-zinc-300 text-xs px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors">
              New Chat
            </button>
            <button onClick={logout} className="text-zinc-500 hover:text-zinc-300 text-xs px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors">
              Out
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-20 space-y-3">
              <p className="text-4xl font-bold text-[#C41E2A]">Lexi</p>
              <p className="text-zinc-500 text-sm">Juke's Diner AI Assistant</p>
              <p className="text-zinc-600 text-xs max-w-xs mx-auto">
                Brain dump anything. Operations, menu ideas, staffing issues, customer feedback. I'll help you capture it and keep things organized.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === 'user'
                  ? 'bg-[#2A8F8F] text-white rounded-br-md'
                  : 'bg-zinc-800 text-[#FFF8F0] rounded-bl-md'
              }`}>
                {msg.role === 'assistant' && i === 0 && messages[0]?.role === 'assistant' ? null : null}
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.category && (
                  <p className="text-[10px] mt-1 opacity-50">{msg.category}</p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-zinc-800 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-zinc-800 bg-zinc-900/95 backdrop-blur">
        <form onSubmit={handleSend} className="max-w-2xl mx-auto px-4 py-3 flex gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Brain dump here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-full text-[#FFF8F0] placeholder-zinc-500 focus:border-[#2A8F8F] focus:outline-none text-sm disabled:opacity-50"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-2.5 bg-[#C41E2A] hover:bg-red-700 text-white font-medium rounded-full text-sm transition-colors disabled:opacity-30"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
