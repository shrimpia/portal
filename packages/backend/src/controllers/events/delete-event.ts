import { Events } from '../../db/repository';
import { send404, sendError, sendFailedToGetMisskeyUserError } from '../../services/error';
import { getMisskeyUser } from '../../services/misskey-api';

import type { Controller } from '../base';

export const deleteEventController: Controller = async (c) => {
  const user = c.portalUser!;
  const id = c.req.param('id');

  const event = await Events.readById(c.env.DB, id);
  if (!event) {
    return send404(c);
  }

  const misskeyUser = await getMisskeyUser(user.misskey_token);
  if (!misskeyUser) {
    return sendFailedToGetMisskeyUserError(c);
  }

  if (event.authorId !== user.id && !misskeyUser.isModerator)	{
    return sendError(c, 403, 'You are not the author of this event');
  }

  await Events.delete(c.env.DB, id);

  return c.json({
    ok: true,
  });
};
