import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q) {
      return NextResponse.json({ results: [] });
    }

    const user = searchParams.get('user');
    const db = getDb();
    const term = `%${q}%`;
    
    let rows;
    if (user) {
      rows = db.prepare(
        `SELECT * FROM dumps 
         WHERE (message LIKE ? OR ai_response LIKE ?) AND user = ?
         ORDER BY timestamp DESC 
         LIMIT 50`
      ).all(term, term, user);
    } else {
      rows = db.prepare(
        `SELECT * FROM dumps 
         WHERE message LIKE ? OR ai_response LIKE ? 
         ORDER BY timestamp DESC 
         LIMIT 50`
      ).all(term, term);
    }

    return NextResponse.json({ results: rows });
  } catch (err) {
    console.error('Search API error:', err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
