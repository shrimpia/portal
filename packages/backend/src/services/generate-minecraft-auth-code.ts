import { MinecraftAccounts } from '../db/repository';

import type { MinecraftAccount } from '../db/models/minecraft-account';

export const generateMinecraftAuthCode = async (db: D1Database): Promise<string> => {
  let authCode: string;
  let existingAccount: MinecraftAccount | null;
  do {
    authCode = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    existingAccount = await MinecraftAccounts.getMinecraftAccountByAuthCode(db, authCode);
    console.log('generate code: ', authCode);
  } while (existingAccount);

  console.log('final code: ', authCode);

  return authCode;
};
