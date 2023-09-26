
import type { EmojiRequest } from '../models/emoji-request';
import type { User } from '../models/user';
import type { Context } from 'hono';

type EmojiRequestWithUserName = EmojiRequest & Pick<User, 'username'> & {
	processer_name: string | null;
};

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
    return db.prepare(`
			SELECT e.*, u1.username, u2.username as processer_name FROM emoji_request e
				LEFT JOIN user u1 on e.user_id = u1.id
				LEFT JOIN user u2 on e.processer_id = u2.id
				WHERE e.id = ? LIMIT 1
		`)
      .bind(id)
      .first<EmojiRequestWithUserName>();
  }

  async readAll(db: D1Database) {
    return db.prepare(`
			SELECT e.*, u1.username, u2.username as processer_name FROM emoji_request e
				LEFT JOIN user u1 on e.user_id = u1.id
				LEFT JOIN user u2 on e.processer_id = u2.id
				ORDER BY e.created_at DESC NULLS LAST
		`)
      .all<EmojiRequestWithUserName>()
      .then(e => e.results);
  }

  async readAllByUserId(db: D1Database, userId: string) {
    return db.prepare(`
			SELECT e.*, u1.username, u2.username as processer_name FROM emoji_request e
				LEFT JOIN user u1 on e.user_id = u1.id
				LEFT JOIN user u2 on e.processer_id = u2.id
				WHERE e.user_id = ? ORDER BY e.created_at DESC NULLS LAST
		`)
      .bind(userId)
      .all<EmojiRequestWithUserName>()
      .then(e => e.results);
  }

  async readAllByUserIdAndCreatedYearAndCreatedMonth(db: D1Database, userId: string, createdYear: number, createdMonth: number) {
    return db.prepare(`
			SELECT e.*, u1.username, u2.username as processer_name FROM emoji_request e
				LEFT JOIN user u1 on e.user_id = u1.id
				LEFT JOIN user u2 on e.processer_id = u2.id
    		WHERE e.user_id = ? AND e.created_year = ? AND e.created_month = ? ORDER BY e.created_at DESC NULLS LAST'
			`)
      .bind(userId, createdYear, createdMonth)
      .all<EmojiRequestWithUserName>()
      .then(e => e.results);
  }

  async readAllByUserIdAndStatus(db: D1Database, userId: string, status: EmojiRequest['status']) {
    return db.prepare(`
			SELECT e.*, u1.username, u2.username as processer_name FROM emoji_request e
				LEFT JOIN user u1 on e.user_id = u1.id
				LEFT JOIN user u2 on e.processer_id = u2.id
				WHERE e.user_id = ? AND e.status = ? ORDER BY e.created_at DESC NULLS LAST
		`)
      .bind(userId, status)
      .all<EmojiRequestWithUserName>()
      .then(e => e.results);
  }

  async readAllByStatus(db: D1Database, status: EmojiRequest['status']) {
    return db.prepare(`
			SELECT e.*, u1.username, u2.username as processer_name FROM emoji_request e
				LEFT JOIN user u1 on e.user_id = u1.id
				LEFT JOIN user u2 on e.processer_id = u2.id
				WHERE e.status = ? ORDER BY e.created_at DESC NULLS LAST'
		`)
      .bind(status)
      .all<EmojiRequestWithUserName>()
      .then(e => e.results);
  }

  async readAllPendings(db: D1Database) {
    return db.prepare(`
			SELECT e.*, u1.username, u2.username as processer_name FROM emoji_request e
				LEFT JOIN user u1 on e.user_id = u1.id
				LEFT JOIN user u2 on e.processer_id = u2.id
				WHERE e.status = 'pending' ORDER BY e.created_at DESC NULLS LAST
		`)
      .all<EmojiRequestWithUserName>()
      .then(e => e.results);
  }

  async countByUserIdAndCreatedYearAndCreatedMonthWithoutRejected(db: D1Database, userId: string, createdYear: number, createdMonth: number) {
    return db.prepare('SELECT COUNT(*) as count FROM emoji_request WHERE user_id = ? AND created_year = ? AND created_month = ? AND status <> \'rejected\'')
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

  toDto(r: EmojiRequestWithUserName, c: Context) {
    return {
      id: r.id,
      name: r.name,
      url: new URL(c.req.url).origin + '/uploaded/' + r.image_key,
      status: r.status,
      comment: r.comment,
      staffComment: r.staff_comment,
      createdYear: r.created_year,
      createdMonth: r.created_month,
      userId: r.user_id,
      username: r.username,
      createdAt: r.created_at,
    };
  }

  toAdminDto(r: EmojiRequestWithUserName, c: Context) {
    return {
      ...this.toDto(r, c),
      processerId: r.processer_id,
      processedAt: r.processed_at,
      processerName: r.processer_name,
    };
  }
}
