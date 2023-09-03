import { URL_EMPIRE } from '../const';
import { generateToken } from '../services/generate-token';

import type { Controller } from './base';

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

  const data = await res.json() as { token: string, user: Record<string, unknown> };
  console.log(`username: ${data.user.username}`);
  const user = await c.env.DB.prepare('SELECT * FROM user WHERE username = ?')
    .bind(data.user.username)
    .first();

  let portalToken: string;

  if (user) {
    portalToken = user.portal_token as string;
    await c.env.DB.prepare('UPDATE user SET misskey_token = ?')
      .bind(data.token)
      .run();
  } else {
    portalToken = generateToken();
    await c.env.DB.prepare('INSERT INTO user (portal_token, misskey_token, username) VALUES (?, ?, ?)')
      .bind(portalToken, data.token, data.user.username)
      .run();
  }

  return c.json({
    token: portalToken,
  });
};
