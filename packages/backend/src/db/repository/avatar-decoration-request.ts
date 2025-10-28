import type { AvatarDecorationRequest } from '../models/avatar-decoration-request';
import type { User } from '../models/user';
import type { Context } from 'hono';

type AvatarDecorationRequestWithUserName = AvatarDecorationRequest & Pick<User, 'username'> & {
	processer_name: string | null;
};

export class AvatarDecorationRequestRepository {
  async create(db: D1Database, data: {name: string, description: string, imageKey: string, userId: string, createdAt: Date}) {
    const id = crypto.randomUUID();
    const year = data.createdAt.getFullYear();
    const month = data.createdAt.getMonth() + 1;
    await db.prepare('INSERT INTO avatar_decoration_request (id, name, description, image_key, user_id, created_year, created_month, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, data.name, data.description, data.imageKey, data.userId, year, month, data.createdAt.getTime())
      .run();
    return id;
  }

  async readById(db: D1Database, id: string) {
    return db.prepare(`
			SELECT a.*, u1.username, u2.username as processer_name FROM avatar_decoration_request a
				LEFT JOIN user u1 on a.user_id = u1.id
				LEFT JOIN user u2 on a.processer_id = u2.id
				WHERE a.id = ? LIMIT 1
		`)
      .bind(id)
      .first<AvatarDecorationRequestWithUserName>();
  }

  async readAll(db: D1Database) {
    return db.prepare(`
			SELECT a.*, u1.username, u2.username as processer_name FROM avatar_decoration_request a
				LEFT JOIN user u1 on a.user_id = u1.id
				LEFT JOIN user u2 on a.processer_id = u2.id
				ORDER BY a.created_at DESC NULLS LAST
		`)
      .all<AvatarDecorationRequestWithUserName>()
      .then(e => e.results);
  }

  async readAllByUserId(db: D1Database, userId: string) {
    return db.prepare(`
  	SELECT a.*, u1.username, u2.username as processer_name FROM avatar_decoration_request a
  		LEFT JOIN user u1 on a.user_id = u1.id
  		LEFT JOIN user u2 on a.processer_id = u2.id
  		WHERE a.user_id = ? ORDER BY a.created_at DESC NULLS LAST
  `)
      .bind(userId)
      .all<AvatarDecorationRequestWithUserName>()
      .then(e => e.results);
  }

  async readAllByUserIdWithPagination(db: D1Database, userId: string, page: number, perPage: number) {
    const offset = (page - 1) * perPage;
    return db.prepare(`
  	SELECT a.*, u1.username, u2.username as processer_name FROM avatar_decoration_request a
  		LEFT JOIN user u1 on a.user_id = u1.id
  		LEFT JOIN user u2 on a.processer_id = u2.id
  		WHERE a.user_id = ?
  		ORDER BY a.created_at DESC NULLS LAST
  		LIMIT ? OFFSET ?
  `)
      .bind(userId, perPage, offset)
      .all<AvatarDecorationRequestWithUserName>()
      .then(e => e.results);
  }

  async readAllWithPagination(db: D1Database, page: number, perPage: number) {
    const offset = (page - 1) * perPage;
    return db.prepare(`
  	SELECT a.*, u1.username, u2.username as processer_name FROM avatar_decoration_request a
  		LEFT JOIN user u1 on a.user_id = u1.id
  		LEFT JOIN user u2 on a.processer_id = u2.id
  		ORDER BY a.created_at DESC NULLS LAST
  		LIMIT ? OFFSET ?
  `)
      .bind(perPage, offset)
      .all<AvatarDecorationRequestWithUserName>()
      .then(e => e.results);
  }

  async readAllByUserIdAndCreatedYearAndCreatedMonth(db: D1Database, userId: string, createdYear: number, createdMonth: number) {
    return db.prepare(`
			SELECT a.*, u1.username, u2.username as processer_name FROM avatar_decoration_request a
				LEFT JOIN user u1 on a.user_id = u1.id
				LEFT JOIN user u2 on a.processer_id = u2.id
    		WHERE a.user_id = ? AND a.created_year = ? AND a.created_month = ? ORDER BY a.created_at DESC NULLS LAST
			`)
      .bind(userId, createdYear, createdMonth)
      .all<AvatarDecorationRequestWithUserName>()
      .then(e => e.results);
  }

  async readAllByUserIdAndStatus(db: D1Database, userId: string, status: AvatarDecorationRequest['status']) {
    return db.prepare(`
			SELECT a.*, u1.username, u2.username as processer_name FROM avatar_decoration_request a
				LEFT JOIN user u1 on a.user_id = u1.id
				LEFT JOIN user u2 on a.processer_id = u2.id
				WHERE a.user_id = ? AND a.status = ? ORDER BY a.created_at DESC NULLS LAST
		`)
      .bind(userId, status)
      .all<AvatarDecorationRequestWithUserName>()
      .then(e => e.results);
  }

  async readAllByStatus(db: D1Database, status: AvatarDecorationRequest['status']) {
    return db.prepare(`
			SELECT a.*, u1.username, u2.username as processer_name FROM avatar_decoration_request a
				LEFT JOIN user u1 on a.user_id = u1.id
				LEFT JOIN user u2 on a.processer_id = u2.id
				WHERE a.status = ? ORDER BY a.created_at DESC NULLS LAST
		`)
      .bind(status)
      .all<AvatarDecorationRequestWithUserName>()
      .then(e => e.results);
  }

  async readAllPendings(db: D1Database) {
    return db.prepare(`
			SELECT a.*, u1.username, u2.username as processer_name FROM avatar_decoration_request a
				LEFT JOIN user u1 on a.user_id = u1.id
				LEFT JOIN user u2 on a.processer_id = u2.id
				WHERE a.status = 'pending' ORDER BY a.created_at DESC NULLS LAST
		`)
      .all<AvatarDecorationRequestWithUserName>()
      .then(e => e.results);
  }

  async countByUserIdAndCreatedYearAndCreatedMonthWithoutRejected(db: D1Database, userId: string, createdYear: number, createdMonth: number) {
    return db.prepare('SELECT COUNT(*) as count FROM avatar_decoration_request WHERE user_id = ? AND created_year = ? AND created_month = ? AND status <> \'rejected\'')
      .bind(userId, createdYear, createdMonth)
      .first<{count: number}>()
      .then(it => it?.count ?? null);
  }

  async updateStatus(db: D1Database, id: string, status: AvatarDecorationRequest['status']) {
    return db.prepare('UPDATE avatar_decoration_request SET status = ? WHERE id = ?')
      .bind(status, id)
      .run();
  }

  async updateStaffComment(db: D1Database, id: string, comment: string) {
    return db.prepare('UPDATE avatar_decoration_request SET staff_comment = ? WHERE id = ?')
      .bind(comment, id)
      .run();
  }

  async updateProcessor(db: D1Database, id: string, processerId: string) {
    return db.prepare('UPDATE avatar_decoration_request SET processer_id = ?, processed_at = ? WHERE id = ?')
      .bind(processerId, new Date().getTime(), id)
      .run();
  }

  async delete(db: D1Database, id: string) {
    return db.prepare('DELETE FROM avatar_decoration_request WHERE id = ?')
      .bind(id)
      .run();
  }

  toDto(r: AvatarDecorationRequestWithUserName, c: Context) {
    return {
      id: r.id,
      name: r.name,
      description: r.description,
      url: new URL(c.req.url).origin + '/uploaded/' + r.image_key,
      status: r.status,
      staffComment: r.staff_comment,
      createdYear: r.created_year,
      createdMonth: r.created_month,
      userId: r.user_id,
      username: r.username,
      createdAt: r.created_at,
    };
  }

  toAdminDto(r: AvatarDecorationRequestWithUserName, c: Context) {
    return {
      ...this.toDto(r, c),
      processerId: r.processer_id,
      processedAt: r.processed_at,
      processerName: r.processer_name,
    };
  }
}
