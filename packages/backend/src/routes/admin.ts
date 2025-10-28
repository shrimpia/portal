import { Hono } from 'hono';
import { z } from 'zod';

import { CATEGORY_NAME_NEW } from '../const';
import { AvatarDecorationRequests, Bucket, EmojiRequests, Hints, SurveyAnswers, Users } from '../db/repository';
import { emperorGuard } from '../middlewares/emperor-guard';
import { hintStaffGuard } from '../middlewares/hint-staff-guard';
import { moeStaffGuard } from '../middlewares/moe-staff-guard';
import { send400, send404, sendError } from '../services/error';
import { callMisskeyApi } from '../services/misskey-api';
import { sendAvatarDecorationRequestApprovedNotification } from '../services/send-avatar-decoration-request-approved-notification';
import { sendAvatarDecorationRequestRejectedNotification } from '../services/send-avatar-decoration-request-rejected-notification';
import { sendEmojiRequestApprovedNotification } from '../services/send-emoji-request-approved-notification';
import { sendEmojiRequestRejectedNotification } from '../services/send-emoji-request-rejected-notification';

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
    // 申請者にMisskey通知を送信
    await sendEmojiRequestApprovedNotification(id, c.env.DB);
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
    // 申請者にMisskey通知を送信
    await sendEmojiRequestRejectedNotification(id, c.env.DB);
  } catch (e) {
    return sendError(c, 500, e instanceof Error ? e.message : `${e}`);
  }

  return c.json({
    ok: true,
  });
});

app.get('/hints', hintStaffGuard, async (c) => {
  const hints = await Hints.readAll(c.env.DB);
  return c.json(hints);
});

const hintRequestbodySchema = z.object({
  content: z.string().min(1).max(80),
  url: z.string().url().nullable(),
});

// ヒントを新規作成するAPI
app.post('/hints', hintStaffGuard, async (c) => {
  const validation = await hintRequestbodySchema.safeParseAsync(await c.req.json());
  if (!validation.success) {
    return send400(c, validation.error.message);
  }

  const { data } = validation;
  const author = c.portalUser!;
  await Hints.create(c.env.DB, {
    content: data.content,
    url: data.url,
    authorId: author.id,
  });

  return c.json({
    ok: true,
  });
});

// ヒントを削除するAPI
app.delete('/hints/:id', hintStaffGuard, async (c) => {
  const id = c.req.param('id');
  await Hints.delete(c.env.DB, id);
  return c.json({
    ok: true,
  });
});

// ヒントを更新するAPI
app.post('/hints/:id', hintStaffGuard, async (c) => {
  const validation = await hintRequestbodySchema.safeParseAsync(await c.req.json());
  if (!validation.success) {
    return send400(c, validation.error.message);
  }

  const { data } = validation;
  const id = c.req.param('id');
  await Hints.update(c.env.DB, id, {
    content: data.content,
    url: data.url,
  });

  return c.json({
    ok: true,
  });
});

const hintPublicationRequestbodySchema = z.object({
  isPublished: z.boolean(),
});

// ヒントの公開・非公開を切り替えるAPI（皇帝のみ）
app.post('/hints/:id/publication', emperorGuard, async (c) => {
  const validation = await hintPublicationRequestbodySchema.safeParseAsync(await c.req.json());
  if (!validation.success) {
    return send400(c, validation.error.message);
  }

  const isPublished = validation.data.isPublished;
  const id = c.req.param('id');
  const hint = await Hints.readById(c.env.DB, id);
  if (!hint) {
    return send404(c);
  }

  await Hints.update(c.env.DB, id, {
    is_published: isPublished ? 1 : 0,
  } as any);

  return c.json({
    ok: true,
  });
});

app.get('/survey/answers', emperorGuard, async (c) => {
  const answers = await SurveyAnswers.readAll(c.env.DB);
  return c.json(answers);
});

app.post('/survey/answers/:id/staff_comment', emperorGuard, async (c) => {
  const { comment } = await c.req.json();
  if (typeof comment !== 'string') {
    return send400(c, 'invalid param: comment');
  }
  const id = c.req.param('id');
  await SurveyAnswers.updateStaffComment(c.env.DB, id, comment);
  return c.json({
    ok: true,
  });
});

/**
 * アバターデコレーションリクエスト一覧を取得する
 */
app.get('/avatar-decoration-requests', moeStaffGuard, async (c) => {
  const req = await AvatarDecorationRequests.readAllPendings(c.env.DB);
  return c.json(req.map(r => AvatarDecorationRequests.toAdminDto(r, c)));
});

/**
 * アバターデコレーションリクエストの詳細を取得する
 */
app.get('/avatar-decoration-requests/:id', moeStaffGuard, async (c) => {
  const param = c.req.param('id');
  if (!param) {
    return send400(c, 'id is required');
  }
  const r = await AvatarDecorationRequests.readById(c.env.DB, param);
  if (!r) {
    return send404(c);
  }

  return c.json(AvatarDecorationRequests.toAdminDto(r, c));
});

/**
 * アバターデコレーションリクエストを承認する
 */
app.post('/avatar-decoration-requests/:id/approve', moeStaffGuard, async (c) => {
  const id = c.req.param('id');
  const decorationRequest = await AvatarDecorationRequests.readById(c.env.DB, id);
  if (!decorationRequest) {
    return send400(c, 'invalid param: id');
  }

  const file = await Bucket.get(c.env.BUCKET, decorationRequest.image_key);
  if (!file) {
    return sendError(c, 500, 'no such file');
  }

  const body = new FormData();
  body.append('file', file);
  body.append('i', c.env.MISSKEY_ADMIN_TOKEN);

  try {
    const driveFile = await callMisskeyApi<{url: string}>('drive/files/create', body);

    await callMisskeyApi('admin/avatar-decorations/create', {
      i: c.env.MISSKEY_ADMIN_TOKEN,
      url: driveFile.url,
      name: decorationRequest.name,
      description: decorationRequest.description,
    });

    await AvatarDecorationRequests.updateStatus(c.env.DB, id, 'approved');
    await AvatarDecorationRequests.updateProcessor(c.env.DB, id, c.portalUser!.id);
    // 申請者にMisskey通知を送信
    await sendAvatarDecorationRequestApprovedNotification(id, c.env.DB);
  } catch (e) {
    return sendError(c, 500, e instanceof Error ? e.message : `${e}`);
  }

  return c.json({
    ok: true,
  });
});

/**
 * アバターデコレーションリクエストを却下する
 */
app.post('/avatar-decoration-requests/:id/reject', moeStaffGuard, async (c) => {
  const { reason } = await c.req.json();
  if (typeof reason !== 'string') {
    return send400(c, 'invalid param: reason');
  }
  if (reason.length > 500) {
    return send400(c, 'reason is too long (max 500 characters)');
  }

  const id = c.req.param('id');

  try {
    await AvatarDecorationRequests.updateStatus(c.env.DB, id, 'rejected');
    await AvatarDecorationRequests.updateStaffComment(c.env.DB, id, reason);
    await AvatarDecorationRequests.updateProcessor(c.env.DB, id, c.portalUser!.id);
    // 申請者にMisskey通知を送信
    await sendAvatarDecorationRequestRejectedNotification(id, c.env.DB);
  } catch (e) {
    return sendError(c, 500, e instanceof Error ? e.message : `${e}`);
  }

  return c.json({
    ok: true,
  });
});

export default app;
