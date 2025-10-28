import { Hono } from 'hono';

import { AvatarDecorationRequests, Bucket } from '../db/repository';
import { sessionGuard } from '../middlewares/session-guard';
import { postNewAvatarDecorationRequestToDiscord } from '../services/discord';
import { sendError, sendFailedToGetMisskeyUserError } from '../services/error';
import { getRemainingAvatarDecorationRequestLimit } from '../services/get-remaining-avatar-decoration-request-limit';
import { getMisskeyUser } from '../services/misskey-api';

import type { PortalEnv } from '../env';

const app = new Hono<PortalEnv>();

/**
 * アバターデコレーションリクエスト一覧を取得する（ページネーション対応）
 */
app.get('/', sessionGuard, async (c) => {
  const page = parseInt(c.req.query('page') || '1', 10);
  const perPage = parseInt(c.req.query('per_page') || '20', 10);

  const requests = await (c.req.query('filter') === 'mine'
    ? AvatarDecorationRequests.readAllByUserIdWithPagination(c.env.DB, c.portalUser!.id, page, perPage)
    : AvatarDecorationRequests.readAllWithPagination(c.env.DB, page, perPage)
  );

  return c.json(requests.map(r => AvatarDecorationRequests.toDto(r, c)));
});

/**
 * 自分が申請したアバターデコレーションリクエスト一覧を取得する（ページネーション対応）
 */
app.get('/me', sessionGuard, async (c) => {
  const page = parseInt(c.req.query('page') || '1', 10);
  const perPage = parseInt(c.req.query('per_page') || '20', 10);

  const requests = await AvatarDecorationRequests.readAllByUserIdWithPagination(c.env.DB, c.portalUser!.id, page, perPage);
  return c.json(requests.map(r => AvatarDecorationRequests.toDto(r, c)));
});

/**
 * 残りのリクエスト利用可能枠を取得する
 */
app.get('/remaining', sessionGuard, async (c) => {
  try {
    const limit = await getRemainingAvatarDecorationRequestLimit(c.env.DB, c.portalUser!);
    return c.json({ limit });
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    return sendError(c, 500, error.message);
  }
});

/**
 * アバターデコレーションリクエストを送信する
 */
app.post('/', sessionGuard, async (c) => {
  const user = await getMisskeyUser(c.portalUser!.misskey_token);
  if (!user) {
    return sendFailedToGetMisskeyUserError(c);
  }

  const limit = await getRemainingAvatarDecorationRequestLimit(c.env.DB, c.portalUser!);
  if (limit < 1) {
    return sendError(c, 400, 'リクエスト利用可能枠がもうありません');
  }

  const { image, name, description } = await c.req.parseBody();

  if (!(image instanceof File)) {
    return sendError(c, 400, 'invalid param: image');
  }
  if (typeof name !== 'string' || name.trim().length === 0) {
    return sendError(c, 400, 'invalid param: name');
  }
  if (typeof description !== 'string') {
    return sendError(c, 400, 'invalid param: description');
  }
  if (name.length > 100) {
    return sendError(c, 400, 'Too long name');
  }
  if (description.length > 500) {
    return sendError(c, 400, 'Too long description');
  }
  if (image.size > 5 * 1024 * 1024) {
    return sendError(c, 400, 'Too much file size (max 5MB)');
  }
  if (image.type !== 'image/png') {
    return sendError(c, 400, 'Invalid image MIME type: ' + image.type + ' (PNG only)');
  }

  const imageKey = await Bucket.upload(c.env.BUCKET, image);
  const createdAt = new Date();

  const id = await AvatarDecorationRequests.create(c.env.DB, {
    name: name.trim(),
    description: description.trim(),
    imageKey,
    userId: c.portalUser!.id,
    createdAt,
  });

  await postNewAvatarDecorationRequestToDiscord(c.env.DISCORD_WEBHOOK_URL, c.portalUser!, {
    id,
    name: name.trim(),
    description: description.trim(),
    imageUrl: new URL(c.req.url).origin + '/uploaded/' + imageKey,
  });

  return c.json({
    ok: true,
    id,
  });
});

export default app;
