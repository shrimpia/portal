export interface MinecraftAccount {
  /** Minecraft UUID。主キー */
  id: string;

  /** 認証コード。認証を通すために使用する */
  auth_code: string;

  /** 認証コードの有効期限（UNIX ミリ秒）。NULL なら失効済み */
  auth_code_expires_at: number | null;

  /** プレイヤー名 */
  player_name?: string;

  /** シュリンピアポータルのユーザーID。認証済みの場合、この値がセットされる */
  user_id?: string;
}
