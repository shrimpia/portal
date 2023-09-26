import type { AccountDeletionRequest } from '../models/account-deletion-request';

/**
 * ユーザーからのアカウント削除リクエストを扱うリポジトリです。
 */
export class AccountDeletionRequestRepository {
  /**
	 * アカウント削除リクエストを新規追加します。
	 * @param db DBへの参照
	 * @param data 追加するデータ
	 * @returns 追加したレコードのID
	 */
  async create(db: D1Database, data: { userId: string, comment: string}) {
    const id = crypto.randomUUID();
    await db.prepare('INSERT INTO account_deletion_request (id, user_id, comment) VALUES (?, ?, ?)')
      .bind(id, data.userId, data.comment)
      .run();
    return id;
  }

  /**
	 * IDに合致するアカウント削除リクエストを取得します。
	 * @param db DBへの参照
	 * @param id ID
	 * @returns アカウント削除リクエスト
	 */
  async readById(db: D1Database, id: string) {
    return db.prepare('SELECT * FROM account_deletion_request WHERE id = ? LIMIT 1')
      .bind(id)
      .first<AccountDeletionRequest>();
  }

  /**
	 * ユーザーIDに合致するアカウント削除リクエストを取得します。
	 * @param db DBへの参照
	 * @param userId ユーザーID
	 * @returns アカウント削除リクエスト
	 */
  async readByUserId(db: D1Database, userId: string) {
    return db.prepare('SELECT * FROM account_deletion_request WHERE user_id = ? LIMIT 1')
      .bind(userId)
      .first<AccountDeletionRequest>();
  }

  /**
	 * 全てのアカウント削除リクエストを取得します。
	 * @param db DBへの参照
	 * @returns アカウント削除リクエストの配列
	 */
  async readAll(db: D1Database) {
    return db.prepare('SELECT * FROM account_deletion_request')
      .all<AccountDeletionRequest>()
      .then(e => e.results);
  }

  /**
	 * アカウント削除リクエストを、作業済みかどうかでフィルターして取得します。
	 * @param db DBへの参照
	 * @param isCompleted 作業済みかどうか
	 * @returns アカウント削除リクエストの配列
	 */
  async readAllByIsCompleted(db: D1Database, isCompleted: boolean) {
    return db.prepare('SELECT * FROM account_deletion_request WHERE is_completed = ?')
      .bind(isCompleted)
      .all<AccountDeletionRequest>()
      .then(e => e.results);
  }

  /**
	 * アカウント削除リクエストの作業済み状態を更新します。
	 * @param db DBへの参照
	 * @param id ID
	 * @param isCompleted 作業済みかどうか
	 */
  async updateIsCompleted(db: D1Database, id: string, isCompleted: boolean) {
    return db.prepare('UPDATE account_deletion_request SET is_completed = ? WHERE id = ?')
      .bind(isCompleted, id)
      .run();
  }

  /**
	 * アカウント削除リクエストを削除します。
	 * @param db DBへの参照
	 * @param id ID
	 */
  async delete(db: D1Database, id: string) {
    return db.prepare('DELETE FROM account_deletion_request WHERE id = ?')
      .bind(id)
      .run();
  }
}
