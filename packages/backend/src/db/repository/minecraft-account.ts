import type { MinecraftAccount } from '../models/minecraft-account';
import type { User } from '../models/user';


export class MinecraftAccountRepository {
  async getMinecraftAccount(db: D1Database, playerId: string) {
    return db.prepare('SELECT * FROM minecraft_accounts WHERE id = ? LIMIT 1')
      .bind(playerId)
      .first<MinecraftAccount>();
  }

  async getMinecraftAccountByAuthCode(db: D1Database, authCode: string) {
    return db.prepare('SELECT * FROM minecraft_accounts WHERE auth_code = ? LIMIT 1')
      .bind(authCode)
      .first<MinecraftAccount>();
  }

  async getAllMinecraftAccountsOfUser(db: D1Database, user: User | User['id']) {
    const id = typeof user === 'string' ? user : user.id;

    return db.prepare('SELECT * FROM minecraft_accounts WHERE user_id = ?')
      .bind(id)
      .all<MinecraftAccount>()
      .then(accounts => accounts.results.map(a => ({
        player_id: a.id,
        player_name: a.player_name,
      })));
  }

  async upsertMinecraftAccount(db: D1Database, playerId: string, playerName: string, authCode: string, expiresAt: Date) {
    await db.prepare('INSERT INTO minecraft_accounts (id, player_name, auth_code, auth_code_expires_at) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET player_name = ?, auth_code = ?, auth_code_expires_at = ?')
      .bind(playerId, playerName, authCode, expiresAt.getTime(), playerName, authCode, expiresAt.getTime())
      .run();
  }

  async updateMinecraftPlayerName(db: D1Database, playerId: string, playerName: string) {
    await db.prepare('UPDATE minecraft_accounts SET player_name = ? WHERE id = ?')
      .bind(playerName, playerId)
      .run();
  }

  async deleteMinecraftAccount(db: D1Database, playerId: string) {
    await db.prepare('DELETE FROM minecraft_accounts WHERE id = ?')
      .bind(playerId)
      .run();
  }

  /**
   * 有効な認証コードに合致する未連携の Minecraft アカウントを、ポータルアカウントに紐づけます。
   * 照合と紐づけは 1 文で行い、使用した認証コードは失効させます。
   * @returns 紐づけに成功したかどうか
   */
  async bindPortalAccountByAuthCode(db: D1Database, authCode: string, portalUser: User | User['id']) {
    const id = typeof portalUser === 'string' ? portalUser : portalUser.id;

    const { meta } = await db.prepare('UPDATE minecraft_accounts SET user_id = ?, auth_code_expires_at = NULL WHERE auth_code = ? AND user_id IS NULL AND auth_code_expires_at > ?')
      .bind(id, authCode, Date.now())
      .run();
    return meta.changes > 0;
  }
}
