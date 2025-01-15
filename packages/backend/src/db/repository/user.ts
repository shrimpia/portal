import { CURRENT_MISSKEY_TOKEN_VERSION } from '../../const';

import type { User } from '../models/user';

/**
 * ユーザー情報を扱うリポジトリです。
 */
export class UserRepository {
  /**
	 * ユーザーを新規追加します。
	 * @param db DBへの参照
	 * @param data 追加するデータ
	 * @returns 追加したレコードのID
	 */
  async create(db: D1Database, data: {username: string, portalToken: string, misskeyToken: string}) {
    const id = crypto.randomUUID();
    await db.prepare('INSERT INTO user (id, portal_token, misskey_token, username, misskey_token_version) VALUES (?, ?, ?, ?, ?)')
      .bind(id, data.portalToken, data.misskeyToken, data.username, CURRENT_MISSKEY_TOKEN_VERSION)
      .run();
    return id;
  }

  /**
	 * IDに合致するユーザーを取得します。
	 * @param db DBへの参照
	 * @param id ID
	 * @returns ユーザー
	 */
  async readById(db: D1Database, id: string) {
    return db.prepare('SELECT * FROM user WHERE id = ? LIMIT 1')
      .bind(id)
      .first<User>();
  }

  /**
	 * ユーザー名に合致するユーザーを取得します。
	 * @param db DBへの参照
	 * @param username ユーザー名
	 * @returns ユーザー
	 */
  async readByName(db: D1Database, username: string) {
    return db.prepare('SELECT * FROM user WHERE username = ? LIMIT 1')
      .bind(username)
      .first<User>();
  }

  /**
	 * ポータルトークンに合致するユーザーを取得します。
	 * @param db DBへの参照
	 * @param portalToken ポータルトークン
	 * @returns ユーザー
	 */
  async readByPortalToken(db: D1Database, portalToken: string) {
    return db.prepare('SELECT * FROM user WHERE portal_token = ? LIMIT 1')
      .bind(portalToken)
      .first<User>();
  }

  /**
	 * 指定したユーザーの、Misskeyのアクセストークンを更新します。
	 * @param db DBへの参照
	 * @param id ユーザーID
	 * @param token Misskeyのアクセストークン
	 * @returns
	 */
  async updateMisskeyToken(db: D1Database, id: string, token: string) {
    return db.prepare('UPDATE user SET misskey_token = ?, misskey_token_version = ? WHERE id = ?')
      .bind(token, CURRENT_MISSKEY_TOKEN_VERSION, id)
      .run();
  }

  /**
	 * 指定したユーザーの、ポータルトークンを更新します。
	 * @param db
	 * @param id
	 * @returns
	 */
  async delete(db: D1Database, id: string) {
    return db.prepare('DELETE FROM user WHERE id = ?')
      .bind(id)
      .run();
  }
}
