import { PORTAL_FRONTEND_URL } from '../const';
import { Bucket, EmojiRequests } from '../db/repository';
import { postNewEmojiRequestToDiscord } from '../services/discord';
import { sendError, sendFailedToGetMisskeyUserError } from '../services/error';
import { getRemainingRequestLimit } from '../services/get-remaining-request-limit';
import { getMisskeyUser } from '../services/misskey-api';


import type { Controller } from './base';

const namePattern = /^[a-z0-9_]+$/;

export const createEmojiRequestController: Controller = async (c) => {
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
  if (typeof name !== 'string' || !namePattern.test(name)) {
    return sendError(c, 400, 'invalid param: name');
  }
  if (typeof comment !== 'string') {
    return sendError(c, 400, 'invalid param: comment');
  }
  if (image.size > 200 * 1024) {
    return sendError(c, 400, 'Too much file size');
  }
  if (!['image/png', 'image/apng', 'image/gif', 'image/webp'].includes(image.type)) {
    return sendError(c, 400, 'Invalid image MIME type: ' + image.type);
  }

  const key = await Bucket.upload(c.env.BUCKET, image);

  const now = new Date();
  const createdYear = now.getUTCFullYear();
  const createdMonth = now.getUTCMonth() + 1;

  const id = await EmojiRequests.create(c.env.DB, {
    name, comment, imageKey: key, userId: c.portalUser!.id, createdYear, createdMonth,
  });

  await postNewEmojiRequestToDiscord(c.env.DISCORD_WEBHOOK_URL, c.portalUser!, {
    id,
    name,
    comment: comment.trim(),
    imageUrl: PORTAL_FRONTEND_URL + 'admin/emoji-requests/' + key,
  });

  return c.json({
    ok: true,
  });
};
