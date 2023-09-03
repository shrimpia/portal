import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { getSessionController } from './controllers/get-session';
import { miauthController } from './controllers/miauth';

import type { PortalEnv } from './env';

const app = new Hono<PortalEnv>();

app.use('*', cors());

app.post('/miauth', miauthController);
app.get('/session', getSessionController);

export default app;
