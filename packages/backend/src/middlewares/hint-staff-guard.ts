import { HINT_EDITOR_ROLE_ID } from '../const';
import { getUserFromHeader } from '../routes/helpers/get-user-from-header';
import { send401, sendNotHintEditorError } from '../services/error';
import { getMisskeyUser } from '../services/misskey-api';

import type { MiddlewareHandler } from 'hono';

/**
 * セッション情報を取得し、ユーザーがヒント編集権限を持つか確認するミドルウェア。
 */
export const hintStaffGuard: MiddlewareHandler = async (c, next) => {
  const user = await getUserFromHeader(c);
  if (!user) return send401(c);

  c.portalUser = user;

  const misskeyUser = await getMisskeyUser(user.misskey_token);
  if (!misskeyUser?.roles.some(r => r.id === HINT_EDITOR_ROLE_ID)) return sendNotHintEditorError(c);

  await next();
};
