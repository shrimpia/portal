import { EMOJI_REQUEST_MAX } from '../const';
import { EmojiRequests } from '../db/repository';

import { getShrimpiaPlus } from './get-shrimpia-plus';
import { getMisskeyUser } from './misskey-api';

import type { User } from '../db/models/user';

export const getRemainingRequestLimit = async (db: D1Database, portalUser: User): Promise<number> => {
  const misskeyUser = await getMisskeyUser(portalUser.misskey_token);
  if (!misskeyUser) {
    throw new Error('Failed to get misskey user');
  }

  if (misskeyUser.policies.canManageCustomEmojis) return Number.MAX_SAFE_INTEGER;

  const shrimpiaPlus = getShrimpiaPlus(misskeyUser);
  if (shrimpiaPlus === 'not-member') return 0;

  const requestCount = await EmojiRequests.countByUserIdAndCreatedYearAndCreatedMonthWithoutRejected(db, portalUser.id, new Date().getUTCFullYear(), new Date().getUTCMonth() + 1);
  if (requestCount === null) {
    throw new Error('Request count is null');
  }

  const remaining = EMOJI_REQUEST_MAX[shrimpiaPlus] - requestCount;

  return remaining;
};
