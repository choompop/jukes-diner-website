import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get('user');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let query = 'SELECT * FROM dumps WHERE 1=1';
    const params = [];

    if (user) {
      query += ' AND user = ?';
      params.push(user);
    }
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const db = getDb();
    const rows = db.prepare(query).all(...params);

    return NextResponse.json({ dumps: rows });
  } catch (err) {
    console.error('Dumps API error:', err);
    return NextResponse.json({ error: 'Failed to fetch dumps' }, { status: 500 });
  }
}
