import { NextResponse } from 'next/server';
import { requireDashboardApiAuth } from '@/lib/dashboard-auth.mjs';
import { getSupabase } from '@/lib/supabase';

export async function GET(request) {
  const auth = requireDashboardApiAuth(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ dumps: [], error: 'Database not configured' });
    }

    const { searchParams } = new URL(request.url);
    const user = searchParams.get('user');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let query = supabase
      .from('dumps')
      .select('*')
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);

    if (user) {
      query = query.eq('user_name', user);
    }
    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ dumps: [], error: null, warning: 'Brain dump history is not configured yet' });
    }

    return NextResponse.json({ dumps: data });
  } catch (err) {
    console.error('Dumps API error:', err);
    return NextResponse.json({ dumps: [], error: null, warning: 'Brain dump history is temporarily unavailable' });
  }
}
