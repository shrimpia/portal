/**
 * その他諸々のAPI
 */

import { Hono } from 'hono';

import { URL_EMPIRE } from '../const';
import { Bucket } from '../db/repository';
import { sessionGuard } from '../middlewares/session-guard';
import { toEmbed404, toEmbedMisskeyNote } from '../services/EmbedMisskeyNote';
import { send400, sendFailedToGetMisskeyUserError } from '../services/error';
import { getShrimpiaPlus } from '../services/get-shrimpia-plus';
import { getMisskeyUser } from '../services/misskey-api';
import { upsertUser } from '../services/upsert-user';

import type { PortalEnv } from '../env';
import type { MisskeyNote } from '../types/note';
import type { MisskeyUser } from '../types/user';

const app = new Hono<PortalEnv>();

app.get('/', c => {
  return c.text('Portal API');
});

/**
 * セッション情報を取得する
 */
app.get('/session', sessionGuard, async c => {
  const misskeyUser = await getMisskeyUser(c.portalUser!.misskey_token);
  if (!misskeyUser) {
    return sendFailedToGetMisskeyUserError(c);
  }

  return c.json({
    username: misskeyUser.username,
    name: misskeyUser.name || misskeyUser.username,
    shrimpiaPlus: getShrimpiaPlus(misskeyUser),
    isEmperor: misskeyUser.isAdmin,
    avatarUrl: misskeyUser.avatarUrl,
    canManageCustomEmojis: misskeyUser.policies.canManageCustomEmojis,
  });
});

/**
 * MiAuthのコールバック先。
 */
app.post('/miauth', async c => {
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
});

/**
 * ノート埋め込みHTMLを取得する
 */
app.get('/note-embed', async (c) => {
  const { url } = c.req.query();
  if ((url === undefined) || (typeof url !== 'string')) {
    return send400(c, 'url is required');
  }

  const match = url.match(/^https?:\/\/(.+?)\/notes\/(\w+)$/);
  if (match === null) {
    return send400(c, 'invalid url');
  }

  const domain = match[1];
  const noteId = match[2];

  const res = await fetch(`https://${domain}/api/notes/show`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      noteId,
    }),
  });

  if (!res.ok) {
    c.status(404);
    return c.html(await toEmbed404());
  }

  const note = await res.json<MisskeyNote>();

  return c.html(await toEmbedMisskeyNote(note, domain));
});

/**
 * R2 にアップロードされたファイルを取得する
 */
app.get('/uploaded/:key', async (c) => {
  const key = c.req.param('key');

  const obj = await Bucket.get(c.env.BUCKET, key);

  if (!obj) {
    c.status(404);
    return c.body(null);
  }

  c.header('Content-Type', obj.type);
  return c.body(await obj.arrayBuffer());
});

export default app;
