import { EmojiRequests } from '../../db/repository';

import type { Controller } from '../base';

export const adminGetAllPendingEmojiRequestsController: Controller = async (c) => {
  const req = await EmojiRequests.readAllPendings(c.env.DB);
  return c.json(req.map(r => ({
    id: r.id,
    name: r.name,
    url: new URL(c.req.url).origin + '/uploaded/' + r.image_key,
    status: r.status,
    comment: r.comment,
    staffComment: r.staff_comment,
    createdYear: r.created_year,
    createdMonth: r.created_month,
    userId: r.user_id,
    username: r.username,
    createdAt: r.created_at,
    processerId: r.processer_id,
    processedAt: r.processed_at,
  })));
};
