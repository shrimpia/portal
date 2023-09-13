import { sendFailedToGetMisskeyUserError } from '../services/error';
import { getShrimpiaPlus } from '../services/get-shrimpia-plus';
import { getMisskeyUser } from '../services/misskey-api';


import type { Controller } from './base';

/**
 * 現在のセッションを取得します。
 */
export const getSessionController: Controller = async c => {
  const misskeyUser = await getMisskeyUser(c.portalUser!.misskey_token);
  if (!misskeyUser) {
    return sendFailedToGetMisskeyUserError(c);
  }

  return c.json({
    username: misskeyUser.username,
    name: misskeyUser.name || misskeyUser.username,
    shrimpiaPlus: getShrimpiaPlus(misskeyUser),
    isEmperor: misskeyUser.isAdmin,
    avatarUrl: misskeyUser.avatarUrl,
    canManageCustomEmojis: misskeyUser.policies.canManageCustomEmojis,
  });
};
