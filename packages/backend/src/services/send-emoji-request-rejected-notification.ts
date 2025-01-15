import { EmojiRequests, Users } from '../db/repository';

import { sendMisskeyNotification } from './send-misskey-notification';

export const sendEmojiRequestRejectedNotification = async (requestId: string, db: D1Database) => {
  const request = await EmojiRequests.readById(db, requestId);
  if (!request) {
    console.warn('No such request');
    return;
  }

  const user = await Users.readById(db, request.user_id);
  if (!user) {
    console.warn('No such user');
    return;
  }

  const token = user.misskey_token;
  await sendMisskeyNotification(token, '絵文字の申請が却下されました', `\`:${request.name}:\`\n\n理由: ${request.staff_comment}`);
};


