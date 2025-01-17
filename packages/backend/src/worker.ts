import { Hono } from 'hono';
import { cors } from 'hono/cors';

import admin from './routes/admin';
import emojiRequests from './routes/emoji-requests';
import emojis from './routes/emojis';
import events from './routes/events';
import hints from './routes/hints';
import minecraft from './routes/minecraft';
import root from './routes/root';

import type { PortalEnv } from './env';

const app = new Hono<PortalEnv>();

app.use('*', cors());

app.route('/', root);
app.route('/emojis', emojis);
app.route('/events', events);
app.route('/admin', admin);
app.route('/emoji-requests', emojiRequests);
app.route('/hints', hints);
app.route('/minecraft', minecraft);

app.onError((err, c) => {
  console.error(err);
  c.status(500);
  return c.json({
    ok: false,
    error: err.message,
  });
});

export default app;
