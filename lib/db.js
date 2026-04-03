import Database from 'better-sqlite3';
import path from 'path';

let db;

export function getDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'jukes.db');
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.exec(`
      CREATE TABLE IF NOT EXISTS dumps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL DEFAULT (datetime('now')),
        user TEXT NOT NULL,
        category TEXT DEFAULT 'other',
        message TEXT NOT NULL,
        ai_response TEXT
      )
    `);
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_dumps_user ON dumps(user);
    `);
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_dumps_category ON dumps(category);
    `);
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_dumps_timestamp ON dumps(timestamp DESC);
    `);
  }
  return db;
}
