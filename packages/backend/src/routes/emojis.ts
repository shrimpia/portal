import { Hono } from 'hono';

import { KeyValue } from '../db/repository';
import { isDuplicatedEmojiName } from '../services/is-duplicated-emoji-name';

import type { PortalEnv } from '../env';

const app = new Hono<PortalEnv>();

/**
 * 絵文字一覧を取得する
 */
app.get('/', async (c) => {
  const data = await KeyValue.getEmojis(c.env.KV);
  return c.json(data, 200, {
    'Content-Type': 'application/json',
  });
});

/**
 * 絵文字名が重複しているかどうかを取得する
 */
app.get('/is-duplicated/:name', async (c) => {
  const { name } = c.req.param();

  return c.json(await isDuplicatedEmojiName(name, c.env.KV, c.env.DB));
});

export default app;
