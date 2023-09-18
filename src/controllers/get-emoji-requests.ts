import { EmojiRequests } from '../db/repository';


import type { Controller } from './base';

export const getEmojiRequestsController: Controller = async (c) => {
  const requests = await (c.req.query('filter') === 'mine'
    ? EmojiRequests.readAllByUserId(c.env.DB, c.portalUser!.id)
    : EmojiRequests.readAll(c.env.DB)
  );
  const url = new URL(c.req.url).origin + '/uploaded/';

  return c.json(requests.map(r => ({
    id: r.id,
    name: r.name,
    url: url + r.image_key,
    status: r.status,
    createdYear: r.created_year,
    createdMonth: r.created_month,
    staffComment: r.staff_comment,
    createdAt: r.created_at,
    userId: r.user_id,
    username: r.username,
    processerId: r.processer_id,
    processerName: r.processer_name,
  })));
};
