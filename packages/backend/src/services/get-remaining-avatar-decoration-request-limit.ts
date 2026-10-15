import { AVATAR_DECORATION_REQUEST_MAX } from '../const';
import { AvatarDecorationRequests } from '../db/repository';

import { getShrimpiaPlus } from './get-shrimpia-plus';
import { getMisskeyUser } from './misskey-api';

import type { User } from '../db/models/user';
import type { MisskeyUser } from '../types/user';

/**
 * 指定したユーザーが 1 ヶ月に申請できるアバターデコレーションリクエストの上限数を取得します。
 */
export const getAvatarDecorationRequestQuota = (misskeyUser: MisskeyUser): number => {
  if (misskeyUser.policies.canManageAvatarDecorations) return Number.MAX_SAFE_INTEGER;

  const shrimpiaPlus = getShrimpiaPlus(misskeyUser);
  if (shrimpiaPlus === 'not-member') return 0;

  return AVATAR_DECORATION_REQUEST_MAX[shrimpiaPlus];
};

export const getRemainingAvatarDecorationRequestLimit = async (db: D1Database, portalUser: User): Promise<number> => {
  const misskeyUser = await getMisskeyUser(portalUser.misskey_token);
  if (!misskeyUser) {
    throw new Error('Failed to get misskey user');
  }

  const quota = getAvatarDecorationRequestQuota(misskeyUser);
  if (quota === 0) return 0;

  const requestCount = await AvatarDecorationRequests.countByUserIdAndCreatedYearAndCreatedMonthWithoutRejected(db, portalUser.id, new Date().getUTCFullYear(), new Date().getUTCMonth() + 1);
  if (requestCount === null) {
    throw new Error('Request count is null');
  }

  const remaining = quota - requestCount;

  return remaining;
};
