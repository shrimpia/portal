import { MinecraftAccounts } from '../db/repository';

import type { MinecraftAccount } from '../db/models/minecraft-account';

export const generateMinecraftAuthCode = async (db: D1Database): Promise<number> => {
  let authCode = 0;
  let existingAccount: MinecraftAccount | null;
  do {
    authCode = Math.floor(Math.random() * 1000000);
    existingAccount = await MinecraftAccounts.getMinecraftAccountByAuthCode(db, authCode.toString());
  } while (existingAccount);

  return authCode;
};
