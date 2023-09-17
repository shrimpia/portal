
import { EmojiRequests, Users } from '../../db/repository';
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
  const u = await Users.readById(c.env.DB, r.user_id);
  if (!u) {
    return send404(c);
  }
  const p = r.processer_id === null ? null : await Users.readById(c.env.DB, r.processer_id);

  return c.json({
    id: r.id,
    name: r.name,
    url: new URL(c.req.url).origin + '/uploaded/' + r.image_key,
    status: r.status,
    comment: r.comment,
    staffComment: r.staff_comment,
    createdYear: r.created_year,
    createdMonth: r.created_month,
    userId: r.user_id,
    username: u.username,
    createdAt: r.created_at,
    processerId: r.processer_id,
    processedAt: r.processed_at,
    processerName: p?.username ?? null,
  });
};
