import { MinecraftAccounts } from '../db/repository';

import type { MinecraftAccount } from '../db/models/minecraft-account';

/** 紛らわしい文字（I, L, O, U）を除いた Crockford Base32 の文字集合 */
const AUTH_CODE_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const AUTH_CODE_LENGTH = 8;

/** 認証コードの有効期間（ミリ秒） */
export const MINECRAFT_AUTH_CODE_TTL = 10 * 60 * 1000;

/**
 * ユーザーが入力した認証コードを正規化します。
 * 小文字は大文字に、Crockford Base32 で読み替える文字（O→0, I/L→1）は置き換えます。
 */
export const normalizeMinecraftAuthCode = (code: string) => code
  .trim()
  .toUpperCase()
  .replace(/O/g, '0')
  .replace(/[IL]/g, '1');

export const generateMinecraftAuthCode = async (db: D1Database): Promise<string> => {
  let authCode: string;
  let existingAccount: MinecraftAccount | null;
  do {
    // 文字集合が 32 文字なので、下位 5 ビットを使えば偏りなく選べる
    const bytes = crypto.getRandomValues(new Uint8Array(AUTH_CODE_LENGTH));
    authCode = Array.from(bytes, b => AUTH_CODE_ALPHABET[b & 31]).join('');
    existingAccount = await MinecraftAccounts.getMinecraftAccountByAuthCode(db, authCode);
  } while (existingAccount);

  return authCode;
};
