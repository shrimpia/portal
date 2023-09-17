import { CATEGORY_NAME_NEW } from '../../const';
import { Bucket, EmojiRequests, Users } from '../../db/repository';
import { send400, sendError } from '../../services/error';
import { callMisskeyApi } from '../../services/misskey-api';

import type { Controller } from '../base';


export const adminPostApproveEmojiRequestController: Controller = async (c) => {
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
};
