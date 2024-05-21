import { Hono } from 'hono';
import { z } from 'zod';

import { Events } from '../db/repository';
import { sessionGuard } from '../middlewares/session-guard';
import { send400, send404, sendError, sendFailedToGetMisskeyUserError } from '../services/error';
import { getMisskeyUser } from '../services/misskey-api';

import type { PortalEnv } from '../env';

const requestBodySchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(1024),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  isAllDay: z.boolean(),
  isOfficial: z.boolean().optional(),
});

const app = new Hono<PortalEnv>();

/**
 * 全てのイベントを取得する
 */
app.get('/', async (c) => {
  const events = await Events.readAll(c.env.DB);
  return c.json(events);
});

/**
 * イベントを取得する
 */
app.get('/:id', async (c) => {
  const id = c.req.param('id');
  const event = await Events.readById(c.env.DB, id);
  if (event == null) {
    return send404(c);
  }
  return c.json(event);
});

/**
 * イベントを作成する
 */
app.post('/', sessionGuard, async (c) => {
  const user = await getMisskeyUser(c.portalUser!.misskey_token);
  if (!user) {
    return sendFailedToGetMisskeyUserError(c);
  }

  // 入国から1ヶ月経ったユーザーのみイベントを作成できる
  // ここで、「新規入国者」ロールがあるかどうかを確認する
  const isNewbie = user.roles.map(r => r.id).includes('9colca84wc');
  if (isNewbie) {
    return send400(c, 'You are newbie and cannot create event yet.');
  }

  const body = await c.req.json();

  const validation = await requestBodySchema.safeParseAsync(body);
  if (!validation.success) {
    return send400(c, validation.error.message);
  }

  const { data } = validation;
  if (data.isOfficial && !user.isAdmin) {
    return send400(c, 'You are not admin and cannot create official event.');
  }

  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  if (endDate < startDate) {
    return send400(c, 'End date must be after start date');
  }

  await Events.create(c.env.DB, {
    ...data,
    startDate,
    endDate,
    authorId: c.portalUser!.id,
  });

  return c.json({
    ok: true,
  });
});

/**
 * イベントを削除する
 */
app.delete('/:id', sessionGuard, async (c) => {
  const user = c.portalUser!;
  const id = c.req.param('id');

  const event = await Events.readById(c.env.DB, id);
  if (!event) {
    return send404(c);
  }

  const misskeyUser = await getMisskeyUser(user.misskey_token);
  if (!misskeyUser) {
    return sendFailedToGetMisskeyUserError(c);
  }

  if (event.authorId !== user.id && !misskeyUser.isModerator)	{
    return sendError(c, 403, 'You are not the author of this event');
  }

  await Events.delete(c.env.DB, id);

  return c.json({
    ok: true,
  });
});

/**
 * イベントを更新する
 */
app.post('/:id', sessionGuard, async (c) => {
  const user = await getMisskeyUser(c.portalUser!.misskey_token);
  if (!user) {
    return sendFailedToGetMisskeyUserError(c);
  }
  const id = c.req.param('id');

  const event = await Events.readById(c.env.DB, id);
  if (!event) {
    return send404(c);
  }

  if (event.authorId !== c.portalUser!.id && !user.isModerator)	{
    return sendError(c, 403, 'You are not the author of this event');
  }

  const body = await c.req.json();

  const validation = await requestBodySchema.safeParseAsync(body);
  if (!validation.success) {
    return send400(c, validation.error.message);
  }

  const { data } = validation;
  if (data.isOfficial && !user.isAdmin) {
    return send400(c, 'You are not admin and cannot create official event.');
  }

  await Events.update(c.env.DB, id, {
    ...data,
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    authorId: c.portalUser!.id,
  });

  return c.json({
    ok: true,
  });
});

export default app;
