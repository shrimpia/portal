import { PORTAL_FRONTEND_URL } from '../const';

import type { EmojiRequest } from '../db/models/emoji-request';

export const generateEmojiRequestLicense = (emojiRequest: EmojiRequest, author: { username: string }) => {
  const emojiRequestUrl = `${PORTAL_FRONTEND_URL}/emoji-request/${emojiRequest.id}`;
  return `@${author.username} による申請。 詳細: ${emojiRequestUrl}`;
};
