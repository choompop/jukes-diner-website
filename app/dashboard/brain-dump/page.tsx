'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, Sparkles, History, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';

interface DumpItem {
  id: string;
  message: string;
  timestamp: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function BrainDump() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<DumpItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = localStorage.getItem('jukes_user');
    if (!user) {
      router.push('/dashboard/login');
      return;
    }
    setCurrentUser(user);
  }, [router]);

  useEffect(() => {
    if (currentUser) {
      fetchHistory();
    }
  }, [currentUser]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchHistory = async () => {
    setIsFetchingHistory(true);
    setError(null);
    try {
      const res = await fetch(`/api/dumps?user=${encodeURIComponent(currentUser)}&limit=50`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setHistory(data.dumps || []);
    } catch (err) {
      console.error('Error fetching history:', err);
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsFetchingHistory(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const chatHistory = messages.slice(-20).map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, user: currentUser, history: chatHistory }),
      });

      const data = await res.json();

      if (data.ai_response) {
        const aiMessage: Message = { role: 'assistant', content: data.ai_response };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble processing that right now, boss. Let me check the grill." }]);
      }

      fetchHistory();
    } catch (err) {
      console.error('AI Error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I hit a pothole. Try again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!confirm('Clear all brain dumps? This cannot be undone.')) return;
    setError(null);
    setHistory([]);
    setMessages([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-160px)]">
      {/* Chat Area */}
      <div className="lg:col-span-2 flex flex-col bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-diner-red p-2 rounded-xl text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg">BRAIN DUMP</h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">AI Assistant Powered</p>
            </div>
          </div>
          <button
            onClick={() => setMessages([])}
            className="text-gray-400 hover:text-diner-red transition-colors"
            title="Clear current chat"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-sans">
            {error}
          </div>
        )}

        <div
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <MessageSquare className="h-16 w-16 mb-4" />
              <h3 className="text-xl font-display">READY FOR ORDERS</h3>
              <p className="font-sans max-w-xs">Dump your ideas, tasks, or feedback here. I&apos;ll keep track of everything.</p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[80%] p-4 rounded-2xl shadow-sm",
                  msg.role === 'user'
                    ? "bg-diner-red text-white rounded-tr-none"
                    : "bg-diner-cream text-diner-black rounded-tl-none border border-diner-chrome/50"
                )}>
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-diner-cream p-4 rounded-2xl rounded-tl-none flex gap-1">
                <div className="w-2 h-2 bg-diner-red rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-diner-red rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-diner-red rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-6 bg-gray-50/50 border-t border-gray-100">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What's on your mind, boss?"
              className="w-full pl-6 pr-16 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-diner-red outline-none shadow-inner"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 bg-diner-red text-white p-3 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>

      {/* History Sidebar */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-3">
          <History className="h-5 w-5 text-diner-teal" />
          <h2 className="font-display text-lg">HISTORY</h2>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-3">
          {isFetchingHistory ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : history.length > 0 ? (
            history.map((item) => (
              <div key={item.id} className="p-4 bg-gray-50 rounded-2xl hover:bg-diner-cream transition-colors group">
                <p className="text-sm text-gray-700 line-clamp-2 mb-2 font-sans">{item.message}</p>
                <p className="text-[10px] text-gray-400 font-mono uppercase">
                  {format(new Date(item.timestamp), 'MMM d, h:mm a')}
                </p>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-12">
              <p className="text-sm font-sans">No history yet.</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-50">
          <button
            onClick={clearHistory}
            className="w-full py-3 text-xs font-display text-gray-400 hover:text-diner-red transition-colors uppercase tracking-widest"
          >
            Clear All History
          </button>
        </div>
      </div>
    </div>
  );
}
