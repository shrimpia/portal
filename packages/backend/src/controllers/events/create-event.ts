import { z } from 'zod';

import { Events } from '../../db/repository';
import { send400, sendFailedToGetMisskeyUserError } from '../../services/error';
import { getMisskeyUser } from '../../services/misskey-api';

import type { Controller } from '../base';

export const requestBodySchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(1024),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  isAllDay: z.boolean(),
  isOfficial: z.boolean().optional(),
});

export const createEventController: Controller = async (c) => {
  const user = await getMisskeyUser(c.portalUser!.misskey_token);
  if (!user) {
    return sendFailedToGetMisskeyUserError(c);
  }

  // 入国から1ヶ月経ったユーザーのみイベントを作成できる
  // ここで、「新規入国者」ロールがあるかどうかを確認する
  const isNewbie = user.roles.map(r => r.id).includes('9colca84wc');
  if (isNewbie) {
    return send400(c, 'You are newbie and cannot create event yet.');
  }

  const body = await c.req.json();

  const validation = await requestBodySchema.safeParseAsync(body);
  if (!validation.success) {
    return send400(c, validation.error.message);
  }

  const { data } = validation;
  if (data.isOfficial !== undefined && !user.isAdmin) {
    return send400(c, 'You are not admin and cannot create official event.');
  }

  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  if (endDate < startDate) {
    return send400(c, 'End date must be after start date');
  }

  await Events.create(c.env.DB, {
    ...data,
    startDate,
    endDate,
    authorId: c.portalUser!.id,
  });

  return c.json({
    ok: true,
  });
};
