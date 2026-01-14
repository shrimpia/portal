import { Hono } from 'hono';

import { Bucket, EmojiRequests } from '../db/repository';
import { sessionGuard } from '../middlewares/session-guard';
import { postNewEmojiRequestToDiscord } from '../services/discord';
import { sendError, sendFailedToGetMisskeyUserError } from '../services/error';
import { getRemainingRequestLimit  } from '../services/get-remaining-request-limit';
import { isDuplicatedEmojiName } from '../services/is-duplicated-emoji-name';
import { getMisskeyUser } from '../services/misskey-api';

import type { PortalEnv } from '../env';

const emojiNamePattern = /^[a-z0-9_]+$/;

const app = new Hono<PortalEnv>();

/**
 * 絵文字リクエスト一覧を取得する（ページネーション対応）
 */
app.get('/', sessionGuard, async (c) => {
  const page = parseInt(c.req.query('page') || '1', 10);
  const perPage = parseInt(c.req.query('per_page') || '20', 10);

  const requests = await (c.req.query('filter') === 'mine'
    ? EmojiRequests.readAllByUserIdWithPagination(c.env.DB, c.portalUser!.id, page, perPage)
    : EmojiRequests.readAllWithPagination(c.env.DB, page, perPage)
  );

  return c.json(requests.map(r => EmojiRequests.toDto(r, c)));
});

/**
 * 残りのリクエスト利用可能枠を取得する
 */
app.get('/remaining', sessionGuard, async (c) => {
  try {
    const limit = await getRemainingRequestLimit(c.env.DB, c.portalUser!);
    return c.json({ limit });
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    return sendError(c, 500, error.message);
  }
});

/**
 * 絵文字リクエストを送信する
 */
app.post('/', sessionGuard, async (c) => {
  const user = await getMisskeyUser(c.portalUser!.misskey_token);
  if (!user) {
    return sendFailedToGetMisskeyUserError(c);
  }

  const limit = await getRemainingRequestLimit(c.env.DB, c.portalUser!);
  if (limit < 1) {
    return sendError(c, 400, 'リクエスト利用可能枠がもうありません');
  }

  const { image, name, comment } = await c.req.parseBody();

  if (!(image instanceof File)) {
    return sendError(c, 400, 'invalid param: image');
  }
  if (typeof name !== 'string' || !emojiNamePattern.test(name)) {
    return sendError(c, 400, 'invalid param: name');
  }
  if (typeof comment !== 'string') {
    return sendError(c, 400, 'invalid param: comment');
  }
  if (comment.length > 500) {
    return sendError(c, 400, 'Too long comment');
  }
  if (image.size > 200 * 1024) {
    return sendError(c, 400, 'Too much file size');
  }
  if (!['image/png', 'image/apng', 'image/gif', 'image/webp'].includes(image.type)) {
    return sendError(c, 400, 'Invalid image MIME type: ' + image.type);
  }

  const isDuplicated = await isDuplicatedEmojiName(name, c.env.KV, c.env.DB);
  if (isDuplicated) {
    return sendError(c, 400, 'Duplicated emoji name');
  }

  const imageKey = await Bucket.upload(c.env.BUCKET, image);
  const createdAt = new Date();

  const id = await EmojiRequests.create(c.env.DB, {
    name, comment, imageKey, userId: c.portalUser!.id, createdAt,
  });

  await postNewEmojiRequestToDiscord(c.env.DISCORD_WEBHOOK_URL, c.portalUser!, {
    id,
    name,
    comment: comment.trim(),
    imageUrl: new URL(c.req.url).origin + '/uploaded/' + imageKey,
  });

  return c.json({
    ok: true,
  });
});

/**
 * 絵文字リクエスト詳細を取得する（認証不要・公開用）
 */
app.get('/:id', async (c) => {
  const id = c.req.param('id');
  const request = await EmojiRequests.readById(c.env.DB, id);
  if (!request) {
    return sendError(c, 404, 'Not found');
  }
  return c.json(EmojiRequests.toDto(request, c));
});

export default app;
