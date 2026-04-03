import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getDb } from '@/lib/db';

const SYSTEM_PROMPT = `You are a chill, sharp assistant for Juke's Diner operators. Think of yourself as a coworker they can talk to about anything related to the business.

Keep it natural and conversational. Short responses. Don't be robotic or overly formal. Match their energy.

If they dump something, acknowledge it and ask a quick follow-up only if it would actually help capture useful detail. Don't interrogate them. Sometimes just "got it" or a quick thought is enough.

If they mention a problem, ask what happened and how they handled it.
If they have an idea, riff on it briefly.
If they're venting, let them vent.

You MUST include a category tag at the very end of your response on its own line in this exact format:
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
