import type { EmojiRequest } from '../models/emoji-request';
import type { User } from '../models/user';


export class EmojiRequestRepository {
  async create(db: D1Database, data: {name: string, comment: string, imageKey: string, userId: string, createdYear: number, createdMonth: number}) {
    const id = crypto.randomUUID();
    await db.prepare('INSERT INTO emoji_request (id, name, comment, image_key, user_id, created_year, created_month) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(id, data.name, data.comment, data.imageKey, data.userId, data.createdYear, data.createdMonth)
      .run();
    return id;
  }

  async readById(db: D1Database, id: string) {
    return db.prepare('SELECT * FROM emoji_request WHERE id = ? LIMIT 1')
      .bind(id)
      .first<EmojiRequest>();
  }

  async readAll(db: D1Database) {
    return db.prepare('SELECT * FROM emoji_request ORDER BY id DESC')
      .all<EmojiRequest>()
      .then(e => e.results);
  }

  async readAllByUserId(db: D1Database, userId: string) {
    return db.prepare('SELECT * FROM emoji_request WHERE user_id = ? ORDER BY id DESC')
      .bind(userId)
      .all<EmojiRequest>()
      .then(e => e.results);
  }

  async readAllByUserIdAndCreatedYearAndCreatedMonth(db: D1Database, userId: string, createdYear: number, createdMonth: number) {
    return db.prepare('SELECT * FROM emoji_request WHERE user_id = ? AND created_year = ? AND created_month = ? ORDER BY id DESC')
      .bind(userId, createdYear, createdMonth)
      .all<EmojiRequest>()
      .then(e => e.results);
  }

  async readAllByUserIdAndStatus(db: D1Database, userId: string, status: EmojiRequest['status']) {
    return db.prepare('SELECT * FROM emoji_request WHERE user_id = ? AND status = ? ORDER BY id DESC')
      .bind(userId, status)
      .all<EmojiRequest>()
      .then(e => e.results);
  }

  async readAllByStatus(db: D1Database, status: EmojiRequest['status']) {
    return db.prepare('SELECT * FROM emoji_request WHERE status = ? ORDER BY id DESC')
      .bind(status)
      .all<EmojiRequest>()
      .then(e => e.results);
  }

  async readAllPendings(db: D1Database) {
    return db.prepare('SELECT e.*, u.username FROM emoji_request e LEFT JOIN user u on e.user_id = u.id WHERE status = \'pending\' ORDER BY id DESC')
      .all<EmojiRequest & Pick<User, 'username'>>()
      .then(e => e.results);
  }

  async countByUserIdAndCreatedYearAndCreatedMonth(db: D1Database, userId: string, createdYear: number, createdMonth: number) {
    return db.prepare('SELECT COUNT(*) as count FROM emoji_request WHERE user_id = ? AND created_year = ? AND created_month = ?')
      .bind(userId, createdYear, createdMonth)
      .first<{count: number}>()
      .then(it => it?.count ?? null);
  }

  async updateStatus(db: D1Database, id: string, status: EmojiRequest['status']) {
    return db.prepare('UPDATE emoji_request SET status = ? WHERE id = ?')
      .bind(status, id)
      .run();
  }

  async delete(db: D1Database, id: string) {
    return db.prepare('DELETE FROM emoji_request WHERE id = ?')
      .bind(id)
      .run();
  }
}
