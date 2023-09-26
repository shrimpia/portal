import { EmojiRequests } from '../../db/repository';

import type { Controller } from '../base';

export const adminGetAllPendingEmojiRequestsController: Controller = async (c) => {
  const req = await EmojiRequests.readAllPendings(c.env.DB);
  return c.json(req.map(r => EmojiRequests.toDto(r, c)));
};
