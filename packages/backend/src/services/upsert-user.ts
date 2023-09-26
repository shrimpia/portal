import { Users } from '../db/repository';

import { generateToken } from './generate-token';

import type { MisskeyUser } from '../types/user';

export const upsertUser = async (db: D1Database, misskeyToken: string, miUser: MisskeyUser) => {
  const user = await Users.readByName(db, miUser.username);
  let portalToken: string;

  if (user) {
    portalToken = user.portal_token as string;
    await Users.updateMisskeyToken(db, user.id, misskeyToken);
  } else {
    portalToken = generateToken();
    const { username } = miUser;
    await Users.create(db, { username, misskeyToken, portalToken });
  }

  const newUser = await Users.readByName(db, miUser.username);
  if (!newUser) throw new Error('Failed to read user');

  return newUser;
};
