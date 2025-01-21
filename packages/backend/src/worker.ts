import { Hono } from 'hono';
import { cors } from 'hono/cors';

import index from './routes';

import type { PortalEnv } from './env';

const app = new Hono<PortalEnv>();

app.use('*', cors());

app.route('/', index);

app.onError((err, c) => {
  console.error(err);
  c.status(500);
  return c.json({
    ok: false,
    error: err.message,
  });
});

export default app;
