import { getUserFromHeader } from '../routes/helpers/get-user-from-header';
import { send401 } from '../services/error';

import type { MiddlewareHandler } from 'hono';

/**
 * セッション情報を確認し、ユーザーを取得するミドルウェア。
 * トークンが無い、あるいは無効な場合は 401 を返す。
 */
export const sessionGuard: MiddlewareHandler = async (c, next) => {
  const user = await getUserFromHeader(c);
  if (!user) return send401(c);

  c.portalUser = user;
  await next();
};
