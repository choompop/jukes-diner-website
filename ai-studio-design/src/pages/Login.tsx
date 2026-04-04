import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Truck } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(username);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid username. Access restricted to authorized personnel.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-diner-cream relative overflow-hidden">
      <div className="absolute inset-0 checkerboard opacity-5" />
      
      <div className="max-w-md w-full glass-card p-10 rounded-3xl relative z-10">
        <div className="text-center mb-10">
          <Truck className="h-12 w-12 text-diner-red mx-auto mb-4" />
          <h1 className="text-3xl text-diner-black mb-2">STAFF LOGIN</h1>
          <p className="text-gray-500 font-serif italic">Restricted Access Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-xs font-display text-gray-500 uppercase tracking-widest mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-diner-red focus:border-transparent outline-none transition-all"
              placeholder="Enter your name..."
              required
            />
          </div>

          {error && (
            <p className="text-diner-red text-sm font-serif italic text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-diner-red text-white py-4 rounded-xl font-display text-lg hover:bg-red-700 transition-colors shadow-lg"
          >
            SIGN IN
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 font-serif italic">
            Authorized users: john, daniel, justin, tyler
          </p>
        </div>
      </div>
    </div>
  );
}
