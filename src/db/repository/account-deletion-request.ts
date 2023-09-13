import type { AccountDeletionRequest } from '../models/account-deletion-request';

export class AccountDeletionRequestRepository {
  async create(db: D1Database, data: { userId: string, comment: string}) {
    const id = crypto.randomUUID();
    await db.prepare('INSERT INTO account_deletion_request (id, user_id, comment) VALUES (?, ?, ?)')
      .bind(id, data.userId, data.comment)
      .run();
    return id;
  }

  async readById(db: D1Database, id: string) {
    return db.prepare('SELECT * FROM account_deletion_request WHERE id = ? LIMIT 1')
      .bind(id)
      .first<AccountDeletionRequest>();
  }

  async readByUserId(db: D1Database, userId: string) {
    return db.prepare('SELECT * FROM account_deletion_request WHERE user_id = ? LIMIT 1')
      .bind(userId)
      .first<AccountDeletionRequest>();
  }

  async readAll(db: D1Database) {
    return db.prepare('SELECT * FROM account_deletion_request')
      .all<AccountDeletionRequest>()
      .then(e => e.results);
  }

  async readAllByIsCompleted(db: D1Database, isCompleted: boolean) {
    return db.prepare('SELECT * FROM account_deletion_request WHERE is_completed = ?')
      .bind(isCompleted)
      .all<AccountDeletionRequest>()
      .then(e => e.results);
  }

  async updateIsCompleted(db: D1Database, id: string, isCompleted: boolean) {
    return db.prepare('UPDATE account_deletion_request SET is_completed = ? WHERE id = ?')
      .bind(isCompleted, id)
      .run();
  }

  async delete(db: D1Database, id: string) {
    return db.prepare('DELETE FROM account_deletion_request WHERE id = ?')
      .bind(id)
      .run();
  }
}
