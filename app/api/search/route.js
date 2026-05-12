import { NextResponse } from 'next/server';
import { requireDashboardApiAuth } from '@/lib/dashboard-auth.mjs';
import { getSupabase } from '@/lib/supabase';

export async function GET(request) {
  const auth = requireDashboardApiAuth(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q) {
      return NextResponse.json({ results: [] });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ results: [], error: 'Database not configured' });
    }

    const user = searchParams.get('user');
    const term = `%${q}%`;

    let query = supabase
      .from('dumps')
      .select('*')
      .or(`message.ilike.${term},ai_response.ilike.${term}`)
      .order('timestamp', { ascending: false })
      .limit(50);

    if (user) {
      query = query.eq('user_name', user);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase search error:', error);
      return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }

    return NextResponse.json({ results: data });
  } catch (err) {
    console.error('Search API error:', err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
