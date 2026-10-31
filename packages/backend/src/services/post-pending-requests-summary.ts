import { AvatarDecorationRequests, EmojiRequests } from '../db/repository';

import { postPendingRequestsSummaryToDiscord } from './discord';

import type { PortalEnv } from '../env';

/**
 * 未処理の申請件数を集計し、1 件以上あれば Discord に通知します。
 */
export const postPendingRequestsSummary = async (env: PortalEnv['Bindings']) => {
  const [emojiCount, avatarDecorationCount] = await Promise.all([
    EmojiRequests.countPendings(env.DB),
    AvatarDecorationRequests.countPendings(env.DB),
  ]);
  if (emojiCount + avatarDecorationCount === 0) return;

  await postPendingRequestsSummaryToDiscord(env.DISCORD_WEBHOOK_URL, { emojiCount, avatarDecorationCount });
};
