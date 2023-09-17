import type { EmojiRequest } from '../models/emoji-request';
import type { User } from '../models/user';


export class EmojiRequestRepository {
  async create(db: D1Database, data: {name: string, comment: string, imageKey: string, userId: string, createdAt: Date}) {
    const id = crypto.randomUUID();
    const year = data.createdAt.getFullYear();
    const month = data.createdAt.getMonth() + 1;
    await db.prepare('INSERT INTO emoji_request (id, name, comment, image_key, user_id, created_year, created_month, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, data.name, data.comment, data.imageKey, data.userId, year, month, data.createdAt.getTime())
      .run();
    return id;
  }

  async readById(db: D1Database, id: string) {
    return db.prepare('SELECT * FROM emoji_request WHERE id = ? LIMIT 1')
      .bind(id)
      .first<EmojiRequest>();
  }

  async readAll(db: D1Database) {
    return db.prepare('SELECT * FROM emoji_request ORDER BY "created_at" DESC NULLS LAST')
      .all<EmojiRequest>()
      .then(e => e.results);
  }

  async readAllByUserId(db: D1Database, userId: string) {
    return db.prepare('SELECT * FROM emoji_request WHERE user_id = ? ORDER BY "created_at" DESC NULLS LAST')
      .bind(userId)
      .all<EmojiRequest>()
      .then(e => e.results);
  }

  async readAllByUserIdAndCreatedYearAndCreatedMonth(db: D1Database, userId: string, createdYear: number, createdMonth: number) {
    return db.prepare('SELECT * FROM emoji_request WHERE user_id = ? AND created_year = ? AND created_month = ? ORDER BY "created_at" DESC NULLS LAST')
      .bind(userId, createdYear, createdMonth)
      .all<EmojiRequest>()
      .then(e => e.results);
  }

  async readAllByUserIdAndStatus(db: D1Database, userId: string, status: EmojiRequest['status']) {
    return db.prepare('SELECT * FROM emoji_request WHERE user_id = ? AND status = ? ORDER BY "created_at" DESC NULLS LAST')
      .bind(userId, status)
      .all<EmojiRequest>()
      .then(e => e.results);
  }

  async readAllByStatus(db: D1Database, status: EmojiRequest['status']) {
    return db.prepare('SELECT * FROM emoji_request WHERE status = ? ORDER BY "created_at" DESC NULLS LAST')
      .bind(status)
      .all<EmojiRequest>()
      .then(e => e.results);
  }

  async readAllPendings(db: D1Database) {
    return db.prepare('SELECT e.*, u.username FROM emoji_request e LEFT JOIN user u on e.user_id = u.id WHERE status = \'pending\' ORDER BY "created_at" DESC NULLS LAST')
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

  async updateStaffComment(db: D1Database, id: string, comment: string) {
    return db.prepare('UPDATE emoji_request SET staff_comment = ? WHERE id = ?')
      .bind(comment, id)
      .run();
  }

  async updateProcessor(db: D1Database, id: string, processerId: string) {
    return db.prepare('UPDATE emoji_request SET processer_id = ?, processed_at = ? WHERE id = ?')
      .bind(processerId, new Date().getTime(), id)
      .run();
  }

  async delete(db: D1Database, id: string) {
    return db.prepare('DELETE FROM emoji_request WHERE id = ?')
      .bind(id)
      .run();
  }
}
