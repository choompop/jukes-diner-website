'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['all', 'operations', 'menu', 'staffing', 'equipment', 'customer feedback', 'ideas', 'other'];
const USERS = ['all', 'john', 'daniel', 'justin'];

const CATEGORY_COLORS = {
  operations: 'bg-teal',
  menu: 'bg-gold',
  staffing: 'bg-red',
  equipment: 'bg-orange-600',
  'customer feedback': 'bg-purple-600',
  ideas: 'bg-green-600',
  other: 'bg-zinc-600',
};

function formatTime(ts) {
  const d = new Date(ts + 'Z');
  const now = new Date();
  const diff = now - d;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function DashboardPage() {
  const [dumps, setDumps] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [currentUser, setCurrentUser] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('jukes_user');
    if (!user) {
      router.push('/dashboard/login');
      return;
    }
    setCurrentUser(user);
    fetchDumps();
  }, []);

  useEffect(() => {
    fetchDumps();
  }, [filterCategory, filterUser]);

  async function fetchDumps() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterCategory !== 'all') params.set('category', filterCategory);
    if (filterUser !== 'all') params.set('user', filterUser);
    
    const res = await fetch(`/api/dumps?${params}`);
    const data = await res.json();
    setDumps(data.dumps || []);
    setLoading(false);
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
    const data = await res.json();
    setSearchResults(data.results || []);
  }

  function clearSearch() {
    setSearchQuery('');
    setSearchResults(null);
  }

  function logout() {
    localStorage.removeItem('jukes_user');
    router.push('/dashboard/login');
  }

  const displayDumps = searchResults !== null ? searchResults : dumps;

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur border-b border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-red">JUKE'S</h1>
              <p className="text-xs text-zinc-500">{currentUser}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/chat')}
                className="px-4 py-2 bg-teal hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                + Brain Dump
              </button>
              <button
                onClick={logout}
                className="px-3 py-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
              >
                Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search all dumps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-cream placeholder-zinc-500 focus:border-teal focus:outline-none text-sm"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-cream rounded-lg text-sm transition-colors"
          >
            Search
          </button>
          {searchResults !== null && (
            <button
              type="button"
              onClick={clearSearch}
              className="px-3 py-2.5 text-zinc-500 hover:text-zinc-300 text-sm"
            >
              Clear
            </button>
          )}
        </form>

        {/* Filters */}
        {searchResults === null && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
            <div className="flex gap-1.5 flex-shrink-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    filterCategory === cat
                      ? 'bg-teal text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {searchResults === null && (
          <div className="flex gap-1.5">
            {USERS.map((u) => (
              <button
                key={u}
                onClick={() => setFilterUser(u)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filterUser === u
                    ? 'bg-gold text-brand-black'
                    : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {searchResults !== null && (
          <p className="text-xs text-zinc-500">
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
          </p>
        )}

        {/* Dumps List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-zinc-500">Loading...</div>
          ) : displayDumps.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              {searchResults !== null ? 'No results found' : 'No dumps yet. Hit that brain dump button!'}
            </div>
          ) : (
            displayDumps.map((dump) => (
              <div key={dump.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gold">{dump.user}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium text-white ${CATEGORY_COLORS[dump.category] || 'bg-zinc-600'}`}>
                      {dump.category}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500">{formatTime(dump.timestamp)}</span>
                </div>
                <p className="text-sm text-cream">{dump.message}</p>
                {dump.ai_response && (
                  <div className="pl-3 border-l-2 border-teal">
                    <p className="text-sm text-zinc-400">{dump.ai_response}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
