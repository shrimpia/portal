import { SHRIMPIA_PLUS_ROLE_NAME } from '../const';

import type { ShrimpiaPlus } from '../types/shrimpia-plus';
import type { MisskeyUser } from '../types/user';

/**
 * 指定したユーザーのShrimpia+プランを取得します。
 * @param user
 * @returns Shrimpia+プラン
 */
export const getShrimpiaPlus = (user: MisskeyUser): ShrimpiaPlus => {
  const roleNames = user.roles.map(r => r.name);
  if (roleNames.includes(SHRIMPIA_PLUS_ROLE_NAME.pro)) return 'pro';
  if (roleNames.includes(SHRIMPIA_PLUS_ROLE_NAME.normal)) return 'normal';
  if (roleNames.includes(SHRIMPIA_PLUS_ROLE_NAME.lite)) return 'lite';
  return 'not-member';
};
