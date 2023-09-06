import { Users } from '../db/repository';

import { generateToken } from './generate-token';

import type { MisskeyUser } from '../models/user';

export const upsertUser = async (db: D1Database, token: string, miUser: MisskeyUser) => {
  const user = await Users.readByName(db, miUser.username);
  let portalToken: string;

  if (user) {
    portalToken = user.portal_token as string;
    await Users.updateMisskeyToken(db, user.id, token);
  } else {
    portalToken = generateToken();
    await Users.create(db, miUser.username, portalToken, token);
  }

  const newUser = await Users.readByName(db, miUser.username);
  if (!newUser) throw new Error('Failed to read user');

  return newUser;
};
