import { EmojiRequests } from '../../db/repository';
import { send400, sendError } from '../../services/error';

import type { Controller } from '../base';


export const adminPostRejectEmojiRequestController: Controller = async (c) => {
  const { reason } = await c.req.json();
  if (typeof reason !== 'string') {
    return send400(c, 'invalid param: reason');
  }

  const id = c.req.param('id');

  try {
    await EmojiRequests.updateStatus(c.env.DB, id, 'rejected');
    await EmojiRequests.updateStaffComment(c.env.DB, id, reason);
  } catch (e) {
    return sendError(c, 500, e instanceof Error ? e.message : `${e}`);
  }

  return c.json({
    ok: true,
  });
};
