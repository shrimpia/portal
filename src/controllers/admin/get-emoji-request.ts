
import { EmojiRequests } from '../../db/repository';
import { send400, send404 } from '../../services/error';

import type { Controller } from '../base';

export const adminGetEmojiRequestController: Controller = async (c) => {
  const param = c.req.param('id');
  if (!param) {
    return send400(c, 'id is required');
  }
  const r = await EmojiRequests.readById(c.env.DB, param);
  if (!r) {
    return send404(c);
  }

  return c.json(EmojiRequests.toDto(r, c));
};
