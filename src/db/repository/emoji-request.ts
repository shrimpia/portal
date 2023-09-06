import type { EmojiRequest } from '../models/emoji-request';

export class EmojiRequestRepository {
  async create(db: D1Database, name: string, imageUrl: string, userId: number, createdYear: number, createdMonth: number) {
    return db.prepare('INSERT INTO emoji_request (name, image_url, user_id, created_year, created_month) VALUES (?, ?, ?, ?, ?)')
      .bind(name, imageUrl, userId, createdYear, createdMonth)
      .run();
  }

  async readById(db: D1Database, id: number) {
    return db.prepare('SELECT * FROM emoji_request WHERE id = ? LIMIT 1')
      .bind(id)
      .first<EmojiRequest>();
  }

  async readAllByUserId(db: D1Database, userId: number) {
    return db.prepare('SELECT * FROM emoji_request WHERE user_id = ?')
      .bind(userId)
      .all<EmojiRequest>()
      .then(e => e.results);
  }

  async readAllByUserIdAndCreatedYearAndCreatedMonth(db: D1Database, userId: number, createdYear: number, createdMonth: number) {
    return db.prepare('SELECT * FROM emoji_request WHERE user_id = ? AND created_year = ? AND created_month = ?')
      .bind(userId, createdYear, createdMonth)
      .all<EmojiRequest>()
      .then(e => e.results);
  }

  async readAllByStatus(db: D1Database, status: EmojiRequest['status']) {
    return db.prepare('SELECT * FROM emoji_request WHERE status = ?')
      .bind(status)
      .all<EmojiRequest>()
      .then(e => e.results);
  }

  async updateStatus(db: D1Database, id: number, status: EmojiRequest['status']) {
    return db.prepare('UPDATE emoji_request SET status = ? WHERE id = ?')
      .bind(status, id)
      .run();
  }

  async delete(db: D1Database, id: number) {
    return db.prepare('DELETE FROM emoji_request WHERE id = ?')
      .bind(id)
      .run();
  }
}
