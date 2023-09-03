import { URL_EMPIRE } from '../const';
import { getShrimpiaPlus } from '../services/get-shrimpia-plus';

import type { Controller } from './base';
import type { MisskeyUser } from '../models/user';

/**
 * 現在のセッションを取得します。
 */
export const getSessionController: Controller = async c => {
  const token = c.req.header('X-Shrimpia-Token');
  if (token == null) {
    c.status(400);
    return c.json({
      error: 'Missing token',
    });
  }
  const results = await c.env.DB.prepare('SELECT misskey_token FROM user WHERE portal_token = ?')
    .bind(token)
    .first();

  if (results == null) {
    c.status(400);
    return c.json({
      error: 'Invalid token',
    });
  }

  const i: MisskeyUser = await fetch(`${URL_EMPIRE}/api/i`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      i: results.misskey_token,
    }),
  }).then(res => res.json());

  return c.json({
    username: i.username,
    name: i.name || i.username,
    shrimpiaPlus: getShrimpiaPlus(i),
    isEmperor: i.isAdmin,
  });
};
