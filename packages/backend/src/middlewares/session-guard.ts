import { Users } from '../db/repository';
import { send401 } from '../services/error';

import type { MiddlewareHandler } from 'hono';

/**
 * セッション情報を確認し、ユーザーを取得するミドルウェア。
 */
export const sessionGuard: MiddlewareHandler = async (c, next) => {
  const token = c.req.header('X-Shrimpia-Token');
  if (!token) return send401(c);

  c.portalUser = await Users.readByPortalToken(c.env.DB, token);
  await next();
};
