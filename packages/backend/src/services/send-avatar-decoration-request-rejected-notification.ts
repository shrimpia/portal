import { AvatarDecorationRequests, Users } from '../db/repository';

import { sendMisskeyNotification } from './send-misskey-notification';

export const sendAvatarDecorationRequestRejectedNotification = async (requestId: string, db: D1Database) => {
  const request = await AvatarDecorationRequests.readById(db, requestId);
  // リクエストが存在しない場合は通知を送信しない
  if (!request) return;

  const user = await Users.readById(db, request.user_id);
  // ユーザーが存在しない、またはトークンバージョンが2未満の場合は通知を送信しない
  if (!user || user.misskey_token_version < 2) return;

  await sendMisskeyNotification(
    user.misskey_token,
    '❌️ アバターデコレーションの申請が却下されました',
    `**${request.name}**\n\n理由: ${request.staff_comment}`,
  );
};
