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

  async upsertMinecraftAccount(db: D1Database, playerId: string, playerName: string, authCode: string) {
    await db.prepare('INSERT INTO minecraft_accounts (id, player_name, auth_code) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET player_name = ?, auth_code = ?')
      .bind(playerId, playerName, authCode, playerName, authCode)
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

  async bindPortalAccountToMinecraftAccount(db: D1Database, playerId: string, portalUser: User | User['id']) {
    const id = typeof portalUser === 'string' ? portalUser : portalUser.id;

    await db.prepare('UPDATE minecraft_accounts SET user_id = ? WHERE id = ?')
      .bind(id, playerId)
      .run();
  }
}
