import { URL_EMPIRE } from '../const';
import { upsertUser } from '../services/upsert-user';

import type { Controller } from './base';
import type { MisskeyUser } from '../models/user';

/**
 * MiAuth のチェック処理を行い、ポータルアカウントを新規作成または更新します。
 */
export const miauthController: Controller = async c => {
  const { sessionId } = await c.req.json<{sessionId: string}>();
  if (sessionId == null) {
    c.status(400);
    return c.json({
      error: 'Missing sessionId',
    });
  }

  const res = await fetch(`${URL_EMPIRE}/api/miauth/${sessionId}/check`, {
    method: 'POST',
  });

  if (!res.ok) {
    c.status(400);
    return c.json({
      error: 'Failed to check MiAuth session',
    });
  }

  const data = await res.json() as { token: string, user: MisskeyUser };

  const { portal_token } = await upsertUser(c.env.DB, data.token, data.user);

  return c.json({
    token: portal_token,
  });
};
