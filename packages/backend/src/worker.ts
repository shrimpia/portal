import { Hono } from 'hono';
import { cors } from 'hono/cors';

import index from './routes';
import { postDailyEmojiSummary } from './services/post-daily-emoji-summary';
import { postPendingRequestsSummary } from './services/post-pending-requests-summary';

import type { PortalEnv } from './env';

/** 毎日 18:00 JST。未処理の申請件数を Discord に通知する */
const CRON_PENDING_REQUESTS_SUMMARY = '0 9 * * *';
/** 毎日 19:00 JST。その日登録された絵文字を公式アカウントで投稿する */
const CRON_DAILY_EMOJI_SUMMARY = '0 10 * * *';

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
    // wrangler.toml の crons と対応させること。cron ごとに実行する処理が異なる。
    switch (event.cron) {
      case CRON_PENDING_REQUESTS_SUMMARY:
        ctx.waitUntil(postPendingRequestsSummary(env));
        break;
      case CRON_DAILY_EMOJI_SUMMARY:
        ctx.waitUntil(postDailyEmojiSummary(env, event.scheduledTime));
        break;
      default:
        console.error(`未知の cron です: ${event.cron}`);
    }
  },
};
