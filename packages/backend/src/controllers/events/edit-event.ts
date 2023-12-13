import { z } from 'zod';

import { Events } from '../../db/repository';
import { send400, send404, sendError, sendFailedToGetMisskeyUserError } from '../../services/error';
import { getMisskeyUser } from '../../services/misskey-api';

import type { Controller } from '../base';

export const requestBodySchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(1024),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional().nullable(),
  isAllDay: z.boolean(),
  isOfficial: z.boolean().optional(),
});

export const editEventController: Controller = async (c) => {
  const user = await getMisskeyUser(c.portalUser!.misskey_token);
  if (!user) {
    return sendFailedToGetMisskeyUserError(c);
  }
  const id = c.req.param('id');

  const event = await Events.readById(c.env.DB, id);
  if (!event) {
    return send404(c);
  }

  if (event.authorId !== user.id && !user.isModerator)	{
    return sendError(c, 403, 'You are not the author of this event');
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

  await Events.update(c.env.DB, id, {
    ...data,
    startDate: new Date(data.startDate),
    endDate: data.endDate ? new Date(data.endDate) : null,
    authorId: c.portalUser!.id,
  });

  return c.json({
    ok: true,
  });
};
