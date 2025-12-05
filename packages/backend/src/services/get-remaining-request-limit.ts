import { EMOJI_REQUEST_MAX, SHRIMPIAN_ROLE_ID } from '../const';
import { EmojiRequests } from '../db/repository';

import { getShrimpiaPlus } from './get-shrimpia-plus';
import { hasRole } from './has-role';
import { getMisskeyUser } from './misskey-api';

import type { User } from '../db/models/user';

export const getRemainingRequestLimit = async (db: D1Database, portalUser: User): Promise<number> => {
  const misskeyUser = await getMisskeyUser(portalUser.misskey_token);
  if (!misskeyUser) {
    throw new Error('Failed to get misskey user');
  }
  // 絵文字管理権限がある場合は無制限
  if (misskeyUser.policies.canManageCustomEmojis) return Number.MAX_SAFE_INTEGER;

  const shrimpiaPlus = getShrimpiaPlus(misskeyUser);

  // Shrimpia+未加入ユーザーの場合、シュリンピアン・上級シュリンピアンロールがあれば指定件数を許可する
  let remaining: number = EMOJI_REQUEST_MAX[shrimpiaPlus];

  // 100ノート以上していない場合は0にしちゃう
  if (!shrimpiaPlus && !hasRole(misskeyUser, SHRIMPIAN_ROLE_ID) && !hasRole(misskeyUser, '9cuopghgu3')) {
    remaining = 0;
  }

  // 今月すでに申請した個数を取得する（rejectedは除く）
  const requestCount = await EmojiRequests.countByUserIdAndCreatedYearAndCreatedMonthWithoutRejected(db, portalUser.id, new Date().getUTCFullYear(), new Date().getUTCMonth() + 1);
  if (requestCount === null) {
    throw new Error('Request count is null');
  }

  // 申請した個数を引く
  remaining -= requestCount;
  return Math.max(remaining, 0);
};
