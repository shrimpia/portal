import { Events } from '../../db/repository';
import { eventCreateDataSchema } from '../../db/repository/event';
import { send400, sendFailedToGetMisskeyUserError } from '../../services/error';
import { getMisskeyUser } from '../../services/misskey-api';

import type { Controller } from '../base';

export const createEventController: Controller = async (c) => {
  const user = await getMisskeyUser(c.portalUser!.misskey_token);
  if (!user) {
    return sendFailedToGetMisskeyUserError(c);
  }

  // 入国から1ヶ月経ったユーザーのみイベントを作成できる
  // ここで、「新規入国者」ロールがあるかどうかを確認する
  const isNotNewbie = !user.roles.map(r => r.id).includes('9colca84wc');
  if (isNotNewbie) {
    return send400(c, 'You are newbie and cannot create event yet.');
  }

  const body = await c.req.parseBody();

  const validation = await eventCreateDataSchema.safeParseAsync(body);
  if (!validation.success) {
    return send400(c, validation.error.message);
  }

  const { data } = validation;

  await Events.create(c.env.DB, data);

  return c.json({
    ok: true,
  });
};
