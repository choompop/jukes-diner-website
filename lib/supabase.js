import { createClient } from '@supabase/supabase-js';

let _supabase;

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    return null;
  }

  if (!_supabase) {
    _supabase = createClient(url, key);
  }
  return _supabase;
}
