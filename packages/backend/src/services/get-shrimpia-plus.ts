import { SHRIMPIA_PLUS_ROLE_ID } from '../const';

import { hasRole } from './has-role';

import type { ShrimpiaPlus } from '../types/shrimpia-plus';
import type { MisskeyUser } from '../types/user';

/**
 * 指定したユーザーのShrimpia+プランを取得します。
 * @param user
 * @returns Shrimpia+プラン
 */
export const getShrimpiaPlus = (user: MisskeyUser): ShrimpiaPlus => {
  if (hasRole(user, SHRIMPIA_PLUS_ROLE_ID.pro)) return 'pro';
  if (hasRole(user, SHRIMPIA_PLUS_ROLE_ID.normal)) return 'normal';
  if (hasRole(user, SHRIMPIA_PLUS_ROLE_ID.lite)) return 'lite';
  return 'not-member';
};
