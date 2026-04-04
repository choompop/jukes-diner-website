import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Trash2, Sparkles, History, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getSupabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function BrainDump() {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHistory();
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchHistory = async () => {
    if (!user) return;
    setIsFetchingHistory(true);
    setError(null);
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('brain_dumps')
        .select('*')
        .eq('user_id', user.username)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
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

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const supabase = getSupabase();
      // 1. Persist to Supabase
      const { error: dbError } = await supabase
        .from('brain_dumps')
        .insert([{ content: input, user_id: user?.username }]);

      if (dbError) throw dbError;

      // 2. Get AI Response
      const model = "gemini-3.1-pro-preview";
      const prompt = `You are Lexi, the Juke's Diner Franchise Assistant. Your job is to help franchisees like Daniel and Justin manage their operations, ideas, and growth.
      
      Tone: Professional but nostalgic, helpful, and slightly retro-diner inspired. Use phrases like "Coming right up, boss" or "Here's the scoop."
      
      Context: The user just said: "${input}". 
      Previous context from their brain dump history: ${history.slice(0, 5).map(h => h.content).join(' | ')}.
      
      Categorize their input if needed (e.g., Marketing Idea, Operational Issue, Menu Suggestion).
      Provide a helpful, concise response.`;

      const response = await genAI.models.generateContent({
        model,
        contents: prompt,
      });

      const aiMessage = { role: 'assistant', content: response.text || "I'm having trouble processing that right now, boss. Let me check the grill." };
      setMessages(prev => [...prev, aiMessage]);
      fetchHistory(); // Refresh history
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
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('brain_dumps')
        .delete()
        .eq('user_id', user?.username);
      if (error) throw error;
      setHistory([]);
      setMessages([]);
    } catch (err) {
      console.error('Error clearing history:', err);
      if (err instanceof Error) {
        setError(err.message);
      }
    }
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
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-serif italic">
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
              <p className="font-serif italic max-w-xs">Dump your ideas, tasks, or feedback here. I'll keep track of everything.</p>
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
                <p className="text-sm text-gray-700 line-clamp-2 mb-2 font-serif">{item.content}</p>
                <p className="text-[10px] text-gray-400 font-mono uppercase">
                  {format(new Date(item.created_at), 'MMM d, h:mm a')}
                </p>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-12">
              <p className="text-sm font-serif italic">No history yet.</p>
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
