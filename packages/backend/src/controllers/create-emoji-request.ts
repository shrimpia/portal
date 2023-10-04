import { Bucket, EmojiRequests } from '../db/repository';
import { postNewEmojiRequestToDiscord } from '../services/discord';
import { sendError, sendFailedToGetMisskeyUserError } from '../services/error';
import { getRemainingRequestLimit } from '../services/get-remaining-request-limit';
import { isDuplicatedEmojiName } from '../services/is-duplicated-emoji-name';
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
};
