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
    // Load previous messages from localStorage
    const saved = localStorage.getItem(`jukes_chat_${user}`);
    if (saved) {
      try { setMessages(JSON.parse(saved)); } catch(e) {}
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    const userMsg = { role: 'user', content: text };
    setMessages((prev) => {
      const updated = [...prev, userMsg];
      localStorage.setItem(`jukes_chat_${currentUser}`, JSON.stringify(updated));
      return updated;
    });
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          user: currentUser,
          history,
        }),
      });

      const data = await res.json();

      if (data.ai_response) {
        setMessages((prev) => {
          const updated = [
            ...prev,
            {
              role: 'assistant',
              content: data.ai_response,
              category: data.category,
            },
          ];
          // Save to localStorage
          localStorage.setItem(`jukes_chat_${currentUser}`, JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Try again.' },
      ]);
    }

    setLoading(false);
    inputRef.current?.focus();
  }

  return (
    <div className="min-h-screen bg-brand-black flex flex-col h-screen">
      {/* Header */}
      <div className="flex-shrink-0 bg-zinc-900/95 backdrop-blur border-b border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard/login')}
            className="text-zinc-400 hover:text-zinc-200 text-sm transition-colors"
          >
            ← Dashboard
          </button>
          <h1 className="text-sm font-medium text-gold">Brain Dump</h1>
          <span className="text-xs text-zinc-500">{currentUser}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-16 space-y-3">
              <p className="text-2xl">🧠</p>
              <p className="text-zinc-500 text-sm">What's on your mind?</p>
              <p className="text-zinc-600 text-xs max-w-xs mx-auto">
                Dump anything: issues, ideas, observations, feedback. The AI will help you capture the details.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === 'user'
                    ? 'bg-teal text-white rounded-br-md'
                    : 'bg-zinc-800 text-cream rounded-bl-md'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.category && (
                  <p className="text-[10px] mt-1 opacity-60">Filed: {msg.category}</p>
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
            placeholder="Dump it here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-full text-cream placeholder-zinc-500 focus:border-teal focus:outline-none text-sm disabled:opacity-50"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-2.5 bg-red hover:bg-red-700 text-white font-medium rounded-full text-sm transition-colors disabled:opacity-30"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
