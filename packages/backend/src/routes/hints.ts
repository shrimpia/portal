import { Hono } from 'hono';

import { Hints } from '../db/repository';

import type { PortalEnv } from '../env';

const app = new Hono<PortalEnv>();

app.get('/', async (c) => {
  const hints = await Hints.readAllPublished(c.env.DB);
  return c.json(hints.map(h => ({
    content: h.content,
    url: h.url,
  })));
});

export default app;
