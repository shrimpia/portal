import { Hono } from 'hono';
import { z } from 'zod';

import { MinecraftAccounts } from '../db/repository';
import { sessionGuard } from '../middlewares/session-guard';
import { MINECRAFT_AUTH_CODE_TTL, generateMinecraftAuthCode, normalizeMinecraftAuthCode } from '../services/generate-minecraft-auth-code';

import type { PortalEnv } from '../env';

const app = new Hono<PortalEnv>();

const internalAuthRequestApiJsonSchema = z.object({
  playerId: z.string(),
  playerName: z.string(),
});

const userAuthRequestApiJsonSchema = z.object({
  authCode: z.string().max(32),
});

/**
 * 内部 API キーを定数時間で比較します。サーバー側のキーが未設定の場合は常に false を返します。
 */
const isValidInternalApiKey = (key: string | undefined, expected: string | undefined) => {
  if (!key || !expected) return false;

  const encoder = new TextEncoder();
  const a = encoder.encode(key);
  const b = encoder.encode(expected);
  if (a.byteLength !== b.byteLength) return false;

  return crypto.subtle.timingSafeEqual(a, b);
};

// Minecraft サーバーが利用する内部API。
app.post('/internal-auth', async c => {
  const key = c.req.header('X-Internal-Api-Key');
  if (!isValidInternalApiKey(key, c.env.MINECRAFT_SERVER_ACCEPTING_KEY)) {
    c.status(404);
    return c.text('Not Found');
  }

  const body = await c.req.json();
  const parsed = internalAuthRequestApiJsonSchema.safeParse(body);
  if (!parsed.success) {
    c.status(400);
    return c.json(parsed.error);
  }

  const { playerId, playerName } = parsed.data;

  // DBにプレイヤーのUUIDが記録されているかどうか照会する
  const account = await MinecraftAccounts.getMinecraftAccount(c.env.DB, playerId);

  // アカウントが存在しない、あるいは紐づけがない場合は認証コードを発行し、DBに記録する
  if (!account || account.user_id === null) {
    const authCode = await generateMinecraftAuthCode(c.env.DB);
    await MinecraftAccounts.upsertMinecraftAccount(c.env.DB, playerId, playerName, authCode, new Date(Date.now() + MINECRAFT_AUTH_CODE_TTL));

    return c.json({
      ok: false,
      error: `シュリンピアポータルで認証してください。\n認証コード: ${authCode}`,
      code: authCode,
    });
  }

  // アカウントが存在し、紐づけがある場合は認証成功
  await MinecraftAccounts.updateMinecraftPlayerName(c.env.DB, playerId, playerName);

  return c.json({
    ok: true,
  });
});

// ユーザーがMinecraftアカウントとポータルアカウントを紐づけるためのAPI。
app.post('auth', sessionGuard, async c => {
  const body = await c.req.json();
  const parsed = userAuthRequestApiJsonSchema.safeParse(body);
  if (!parsed.success) {
    c.status(400);
    return c.json(parsed.error);
  }

  // ポータルアカウントとマインクラフトアカウントを紐づける
  const authCode = normalizeMinecraftAuthCode(parsed.data.authCode);
  const bound = await MinecraftAccounts.bindPortalAccountByAuthCode(c.env.DB, authCode, c.portalUser!);
  if (!bound) {
    c.status(404);
    return c.json({ error: 'Invalid auth code' });
  }

  c.status(200);
  return c.json({ ok: true });
});

// ユーザーに紐づいているMinecraftアカウントを取得するAPI。
app.get('accounts', sessionGuard, async c => {
  const accounts = await MinecraftAccounts.getAllMinecraftAccountsOfUser(c.env.DB, c.portalUser!);
  c.status(200);
  return c.json(accounts);
});

export default app;
