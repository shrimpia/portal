import { Users } from '../db/repository';
import { send401, sendNotEmperorError } from '../services/error';
import { getMisskeyUser } from '../services/misskey-api';

import type { MiddlewareHandler } from 'hono';

/**
 * セッション情報を取得し、ユーザーが皇帝であるか確認するミドルウェア。
 */
export const emperorGuard: MiddlewareHandler = async (c, next) => {
  const token = c.req.header('X-Shrimpia-Token');
  if (!token) return send401(c);

  c.portalUser = await Users.readByPortalToken(c.env.DB, token);

  const misskeyUser = await getMisskeyUser(c.portalUser!.misskey_token);
  if (misskeyUser?.isAdmin !== true) return sendNotEmperorError(c);

  await next();
};
