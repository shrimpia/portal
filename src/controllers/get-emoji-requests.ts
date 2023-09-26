import { EmojiRequests } from '../db/repository';


import type { Controller } from './base';

export const getEmojiRequestsController: Controller = async (c) => {
  const requests = await (c.req.query('filter') === 'mine'
    ? EmojiRequests.readAllByUserId(c.env.DB, c.portalUser!.id)
    : EmojiRequests.readAll(c.env.DB)
  );

  return c.json(requests.map(r => EmojiRequests.toDto(r, c)));
};
