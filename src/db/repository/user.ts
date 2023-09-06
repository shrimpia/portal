import type { User } from '../models/user';

export class UserRepository {
  async create(db: D1Database, username: string, portalToken: string, misskeyToken: string) {
    return db.prepare('INSERT INTO user (portal_token, misskey_token, username) VALUES (?, ?, ?)')
      .bind(portalToken, misskeyToken, username)
      .run();
  }

  async readById(db: D1Database, id: number) {
    return db.prepare('SELECT * FROM user WHERE id = ? LIMIT 1')
      .bind(id)
      .first<User>();
  }

  async readByName(db: D1Database, username: string) {
    return db.prepare('SELECT * FROM user WHERE username = ? LIMIT 1')
      .bind(username)
      .first<User>();
  }

  async readByPortalToken(db: D1Database, portalToken: string) {
    return db.prepare('SELECT * FROM user WHERE portal_token = ? LIMIT 1')
      .bind(portalToken)
      .first<User>();
  }

  async updateMisskeyToken(db: D1Database, id: number, token: string) {
    return db.prepare('UPDATE user SET misskey_token = ? WHERE id = ?')
      .bind(token, id)
      .run();
  }

  async delete(db: D1Database, id: number) {
    return db.prepare('DELETE FROM user WHERE id = ?')
      .bind(id)
      .run();
  }
}