import { Hono } from 'hono';

import { CATEGORY_NAME_NEW } from '../const';
import { Bucket, EmojiRequests, Users } from '../db/repository';
import { moeStaffGuard } from '../middlewares/moe-staff-guard';
import { send400, send404, sendError } from '../services/error';
import { callMisskeyApi } from '../services/misskey-api';

import type { PortalEnv } from '../env';

const app = new Hono<PortalEnv>();

/**
 * 絵文字リクエスト一覧を取得する
 */
app.get('/emoji-requests', moeStaffGuard, async (c) => {
  const req = await EmojiRequests.readAllPendings(c.env.DB);
  return c.json(req.map(r => EmojiRequests.toAdminDto(r, c)));
});

/**
 * 絵文字リクエストの詳細を取得する
 */
app.get('/emoji-requests/:id', moeStaffGuard, async (c) => {
  const param = c.req.param('id');
  if (!param) {
    return send400(c, 'id is required');
  }
  const r = await EmojiRequests.readById(c.env.DB, param);
  if (!r) {
    return send404(c);
  }

  return c.json(EmojiRequests.toAdminDto(r, c));
});

/**
 * 絵文字リクエストを承認する
 */
app.post('/emoji-requests/:id/approve', moeStaffGuard, async (c) => {
  const { tag } = await c.req.json();
  if (typeof tag !== 'string') {
    return send400(c, 'invalid param: tag');
  }
  const tags = tag.split(' ');

  const id = c.req.param('id');
  const emojiRequest = await EmojiRequests.readById(c.env.DB, id);
  if (!emojiRequest) {
    return send400(c, 'invalid param: id');
  }

  const author = await Users.readById(c.env.DB, emojiRequest.user_id);
  if (!author) {
    return sendError(c, 500, 'no such user');
  }

  const file = await Bucket.get(c.env.BUCKET, emojiRequest.image_key);
  if (!file) {
    return sendError(c, 500, 'no such file');
  }

  const body = new FormData();
  body.append('file', file);
  body.append('i', c.env.MISSKEY_ADMIN_TOKEN);

  try {
    const driveFile = await callMisskeyApi<{id: string}>('drive/files/create', body);

    await callMisskeyApi('admin/emoji/add', {
      i: c.env.MISSKEY_ADMIN_TOKEN,
      fileId: driveFile.id,
      name: emojiRequest.name,
      category: CATEGORY_NAME_NEW,
      aliases: tags,
      license: `(C) @${author.username}`,
    });

    await EmojiRequests.updateStatus(c.env.DB, id, 'approved');
    await EmojiRequests.updateProcessor(c.env.DB, id, c.portalUser!.id);
  } catch (e) {
    return sendError(c, 500, e instanceof Error ? e.message : `${e}`);
  }

  return c.json({
    ok: true,
  });
});

/**
 * 絵文字リクエストを却下する
 */
app.post('/emoji-requests/:id/reject', moeStaffGuard, async (c) => {
  const { reason } = await c.req.json();
  if (typeof reason !== 'string') {
    return send400(c, 'invalid param: reason');
  }

  const id = c.req.param('id');

  try {
    await EmojiRequests.updateStatus(c.env.DB, id, 'rejected');
    await EmojiRequests.updateStaffComment(c.env.DB, id, reason);
    await EmojiRequests.updateProcessor(c.env.DB, id, c.portalUser!.id);
  } catch (e) {
    return sendError(c, 500, e instanceof Error ? e.message : `${e}`);
  }

  return c.json({
    ok: true,
  });
});

export default app;
