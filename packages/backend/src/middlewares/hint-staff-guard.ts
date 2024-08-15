import { HINT_EDITOR_ROLE_ID } from '../const';
import { Users } from '../db/repository';
import { send401, sendNotHintEditorError } from '../services/error';
import { getMisskeyUser } from '../services/misskey-api';

import type { MiddlewareHandler } from 'hono';

/**
 * セッション情報を取得し、ユーザーがヒント編集権限を持つか確認するミドルウェア。
 */
export const hintStaffGuard: MiddlewareHandler = async (c, next) => {
  const token = c.req.header('X-Shrimpia-Token');
  if (!token) return send401(c);

  c.portalUser = await Users.readByPortalToken(c.env.DB, token);

  const misskeyUser = await getMisskeyUser(c.portalUser!.misskey_token);
  console.log(misskeyUser?.roles);
  if (!misskeyUser?.roles.some(r => r.id === HINT_EDITOR_ROLE_ID)) return sendNotHintEditorError(c);

  await next();
};
