import { Users } from '../db/repository';
import { send401, sendNotMoeStaffError } from '../services/error';
import { getMisskeyUser } from '../services/misskey-api';

import type { MiddlewareHandler } from 'hono';

/**
 * セッション情報を取得し、ユーザーが絵文字庁職員であるか確認するミドルウェア。
 */
export const moeStaffGuard: MiddlewareHandler = async (c, next) => {
  const token = c.req.header('X-Shrimpia-Token');
  if (!token) return send401(c);

  c.portalUser = await Users.readByPortalToken(c.env.DB, token);

  const misskeyUser = await getMisskeyUser(token);
  if (misskeyUser?.policies.canManageCustomEmojis !== true) return sendNotMoeStaffError(c);

  await next();
};
