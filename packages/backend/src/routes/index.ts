/**
 * その他諸々のAPI
 */

import { Hono } from 'hono';

import { URL_EMPIRE } from '../const';
import { Bucket } from '../db/repository';
import { sessionGuard } from '../middlewares/session-guard';
import { detectImageType } from '../services/detect-image-type';
import { toEmbed404, toEmbedMisskeyNote } from '../services/EmbedMisskeyNote';
import { send400, sendFailedToGetMisskeyUserError } from '../services/error';
import { getShrimpiaPlus } from '../services/get-shrimpia-plus';
import { callMisskeyApi, getMisskeyUser } from '../services/misskey-api';
import { sendMisskeyNotification } from '../services/send-misskey-notification';
import { upsertUser } from '../services/upsert-user';

import admin from './admin';
import avatarDecorationRequests from './avatar-decoration-requests';
import emojiRequests from './emoji-requests';
import emojis from './emojis';
import events from './events';
import hints from './hints';
import minecraft from './minecraft';
import survey from './survey';

import type { PortalEnv } from '../env';
import type { MisskeyNote } from '../types/note';

const sessionIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const app = new Hono<PortalEnv>();

app.route('/emojis', emojis);
app.route('/events', events);
app.route('/survey', survey);
app.route('/admin', admin);
app.route('/emoji-requests', emojiRequests);
app.route('/avatar-decoration-requests', avatarDecorationRequests);
app.route('/hints', hints);
app.route('/minecraft', minecraft);

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
    misskeyTokenVersion: c.portalUser!.misskey_token_version,
    isEmperor: misskeyUser.isAdmin,
    isModerator: misskeyUser.isModerator,
    avatarUrl: misskeyUser.avatarUrl,
    canManageCustomEmojis: misskeyUser.policies.canManageCustomEmojis,
    canManageAvatarDecorations: misskeyUser.policies.canManageAvatarDecorations,
  });
});

/**
 * MiAuthのコールバック先。
 */
app.post('/miauth', async c => {
  const { sessionId } = await c.req.json<{sessionId: unknown}>();
  if (typeof sessionId !== 'string' || !sessionIdPattern.test(sessionId)) {
    c.status(400);
    return c.json({
      error: 'Invalid sessionId',
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

  const data = await res.json() as { token?: string };
  if (typeof data.token !== 'string') {
    c.status(400);
    return c.json({
      error: 'MiAuth session is not authorized',
    });
  }

  // check のレスポンスに含まれるユーザー情報は信用せず、取得したトークンで本人を確認する
  const misskeyUser = await getMisskeyUser(data.token);
  if (!misskeyUser) {
    return sendFailedToGetMisskeyUserError(c);
  }

  const { portal_token } = await upsertUser(c.env.DB, data.token, misskeyUser);

  return c.json({
    token: portal_token,
  });
});

app.get('test-notification', sessionGuard, async c => {
  if (!c.env.DEV) {
    return c.status(403);
  }
  const token = c.portalUser?.misskey_token;
  if (!token) {
    return c.status(400);
  }
  await sendMisskeyNotification(token, 'テスト通知', 'これはテスト通知です。');
  return c.json({});
});

/**
 * ノート埋め込みHTMLを取得する。取得先は帝国のノートに限る。
 */
app.get('/note-embed', async (c) => {
  const { url } = c.req.query();
  if (typeof url !== 'string') {
    return send400(c, 'url is required');
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return send400(c, 'invalid url');
  }

  const noteId = parsed.pathname.match(/^\/notes\/(\w+)$/)?.[1];
  if (parsed.origin !== URL_EMPIRE || !noteId) {
    return send400(c, 'invalid url');
  }

  const note = await callMisskeyApi<MisskeyNote>('notes/show', { noteId }).catch(() => null);
  if (!note) {
    c.status(404);
    return c.html(await toEmbed404());
  }

  return c.html(await toEmbedMisskeyNote(note, parsed.host));
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

  // 保存時の Content-Type は信用せず、中身から判定した画像形式でのみ配信する
  const data = await obj.arrayBuffer();
  const type = detectImageType(data);

  c.header('X-Content-Type-Options', 'nosniff');
  c.header('Content-Security-Policy', 'default-src \'none\'; sandbox');
  if (type) {
    c.header('Content-Type', type);
  } else {
    c.header('Content-Type', 'application/octet-stream');
    c.header('Content-Disposition', 'attachment');
  }
  return c.body(data);
});

export default app;
