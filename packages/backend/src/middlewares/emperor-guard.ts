import { getUserFromHeader } from '../routes/helpers/get-user-from-header';
import { send401, sendNotEmperorError } from '../services/error';
import { getMisskeyUser } from '../services/misskey-api';

import type { MiddlewareHandler } from 'hono';

/**
 * セッション情報を取得し、ユーザーが皇帝であるか確認するミドルウェア。
 */
export const emperorGuard: MiddlewareHandler = async (c, next) => {
  const user = await getUserFromHeader(c);
  if (!user) return send401(c);

  c.portalUser = user;

  const misskeyUser = await getMisskeyUser(user.misskey_token);
  if (misskeyUser?.isAdmin !== true) return sendNotEmperorError(c);

  await next();
};
