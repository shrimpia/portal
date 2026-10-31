import { Hono } from 'hono';
import { cors } from 'hono/cors';

import index from './routes';
import { postPendingRequestsSummary } from './services/post-pending-requests-summary';

import type { PortalEnv } from './env';

const app = new Hono<PortalEnv>();

app.use('*', cors());

app.route('/', index);

app.onError((err, c) => {
  console.error(err);
  c.status(500);
  return c.json({
    ok: false,
    error: c.env.DEV ? err.message : 'Internal Server Error',
  });
});

export default {
  fetch: app.fetch,
  async scheduled(_event: ScheduledEvent, env: PortalEnv['Bindings'], ctx: ExecutionContext) {
    ctx.waitUntil(postPendingRequestsSummary(env));
  },
};
