import { EmojiRequests, Users } from '../db/repository';

import { sendMisskeyNotification } from './send-misskey-notification';

export const sendEmojiRequestRejectedNotification = async (requestId: string, db: D1Database) => {
  const request = await EmojiRequests.readById(db, requestId);
  // リクエストが存在しない場合は通知を送信しない
  if (!request) return;

  const user = await Users.readById(db, request.user_id);
  // ユーザーが存在しない、またはトークンバージョンが2未満の場合は通知を送信しない
  if (!user || user.misskey_token_version < 2) return;

  const token = user.misskey_token;
  await sendMisskeyNotification(token, '絵文字の申請が却下されました', `\`:${request.name}:\`\n\n理由: ${request.staff_comment}`);
};


