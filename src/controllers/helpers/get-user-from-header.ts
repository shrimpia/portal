import { Users } from '../../db/repository';

import type { PortalEnv } from '../../env';
import type { Context } from 'hono';

export const getUserFromHeader = async (c: Context<PortalEnv>) => {
  const token = c.req.header('X-Shrimpia-Token');
  if (!token) return null;

  const user = await Users.readByPortalToken(c.env.DB, token);
  if (!user) return null;

  return user;
};
