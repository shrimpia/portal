import { Hono } from 'hono';
import { cors } from 'hono/cors';

import index from './routes';
import { postDailyEmojiSummary } from './services/post-daily-emoji-summary';

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
  async scheduled(event: ScheduledEvent, env: PortalEnv['Bindings'], ctx: ExecutionContext) {
    ctx.waitUntil(postDailyEmojiSummary(env, event.scheduledTime));
  },
};
