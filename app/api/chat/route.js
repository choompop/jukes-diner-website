import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getDb } from '@/lib/db';

const SYSTEM_PROMPT = `You are the Juke's Diner operations assistant. Your job is to capture information from operators. Ask follow-up questions to get specific details. Categorize each dump. Be brief and conversational. If they mention a problem, ask how they resolved it. If they mention a new idea, ask about implementation details.

After processing each message, you MUST include a category tag at the very end of your response on its own line in this exact format:
[CATEGORY: operations|menu|staffing|equipment|customer feedback|ideas|other]

Pick the single best category. Always include this tag.`;

let _openai;
function getOpenAI() {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

function extractCategory(text) {
  const match = text.match(/\[CATEGORY:\s*(.*?)\]/i);
  if (match) {
    const cat = match[1].trim().toLowerCase();
    const valid = ['operations', 'menu', 'staffing', 'equipment', 'customer feedback', 'ideas', 'other'];
    return valid.includes(cat) ? cat : 'other';
  }
  return 'other';
}

function stripCategoryTag(text) {
  return text.replace(/\n?\[CATEGORY:.*?\]/i, '').trim();
}

export async function POST(request) {
  try {
    const { message, user, history } = await request.json();

    if (!message || !user) {
      return NextResponse.json({ error: 'Missing message or user' }, { status: 400 });
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(history || []).slice(-10),
      { role: 'user', content: message },
    ];

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const rawResponse = completion.choices[0].message.content;
    const category = extractCategory(rawResponse);
    const aiResponse = stripCategoryTag(rawResponse);

    const db = getDb();
    const stmt = db.prepare(
      'INSERT INTO dumps (user, category, message, ai_response) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(user, category, message, aiResponse);

    return NextResponse.json({
      id: result.lastInsertRowid,
      ai_response: aiResponse,
      category,
    });
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
