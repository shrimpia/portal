import { getUserFromHeader } from '../routes/helpers/get-user-from-header';
import { send401, sendNotMoeStaffError } from '../services/error';
import { getMisskeyUser } from '../services/misskey-api';

import type { MiddlewareHandler } from 'hono';

/**
 * セッション情報を取得し、ユーザーが絵文字庁職員であるか確認するミドルウェア。
 */
export const moeStaffGuard: MiddlewareHandler = async (c, next) => {
  const user = await getUserFromHeader(c);
  if (!user) return send401(c);

  c.portalUser = user;

  const misskeyUser = await getMisskeyUser(user.misskey_token);
  if (misskeyUser?.policies.canManageCustomEmojis !== true) return sendNotMoeStaffError(c);

  await next();
};
