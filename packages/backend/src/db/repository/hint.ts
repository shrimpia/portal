import type { Hint } from '../models/hint';

export type HintCreateData = {
	content: string;
	url: string | null;
	authorId: string;
};

export class HintRepository {
  async create(db: D1Database, data: HintCreateData) {
    const id = crypto.randomUUID();
    await db.prepare('INSERT INTO hints (id, content, url, created_at, author_id, is_published) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(id, data.content, data.url, new Date().toISOString(), data.authorId, 0)
      .run();
    return id;
  }

  async readById(db: D1Database, id: string) {
    return db.prepare('SELECT * FROM hints WHERE id = ? LIMIT 1')
      .bind(id)
      .first<Hint>();
  }

  async readAll(db: D1Database) {
    return db.prepare('SELECT * FROM hints ORDER BY created_at DESC')
      .all<Hint>()
      .then(e => e.results);
  }

  async readAllPublished(db: D1Database) {
    return db.prepare('SELECT * FROM hints WHERE is_published = 1 ORDER BY created_at DESC')
      .all<Hint>()
      .then(e => e.results);
  }

  async update(db: D1Database, id: string, data: Partial<Hint>) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const set = keys.map((key) => `${key} = ?`).join(', ');
    await db.prepare(`UPDATE hints SET ${set} WHERE id = ?`)
      .bind(...values, id)
      .run();
  }

  async delete(db: D1Database, id: string) {
    await db.prepare('DELETE FROM hints WHERE id = ?')
      .bind(id)
      .run();
  }
}
