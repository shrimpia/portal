import { Hono } from 'hono';
import { z } from 'zod';

import { MinecraftAccounts } from '../db/repository';
import { sessionGuard } from '../middlewares/session-guard';
import { generateMinecraftAuthCode } from '../services/generate-minecraft-auth-code';

import type { PortalEnv } from '../env';

const app = new Hono<PortalEnv>();

const internalAuthRequestApiJsonSchema = z.object({
  playerId: z.string(),
  playerName: z.string(),
});

const userAuthRequestApiJsonSchema = z.object({
  authCode: z.string(),
});

// Minecraft サーバーが利用する内部API。
app.post('/internal-auth', async c => {
  const key = c.req.header('X-Internal-Api-Key');
  if (key !== c.env.MINECRAFT_SERVER_ACCEPTING_KEY) {
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
    await MinecraftAccounts.upsertMinecraftAccount(c.env.DB, playerId, playerName, authCode);

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

  const { authCode } = parsed.data;
  const mcAccount = await MinecraftAccounts.getMinecraftAccountByAuthCode(c.env.DB, authCode);
  if (!mcAccount || mcAccount.user_id !== null) {
    c.status(404);
    return c.json({ error: 'Invalid auth code' });
  }

  // ポータルアカウントとマインクラフトアカウントを紐づける
  await MinecraftAccounts.bindPortalAccountToMinecraftAccount(c.env.DB, mcAccount.id, c.portalUser!);
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
