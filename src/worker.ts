import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { createEmojiRequestController } from './controllers/create-emoji-request';
import { getEmojiRequestsController } from './controllers/get-emoji-requests';
import { getRemainingRequestLimitController } from './controllers/get-remaining-request-limit';
import { getSessionController } from './controllers/get-session';
import { getUploadedFilesController } from './controllers/get-uploaded-files';
import { miauthController } from './controllers/miauth';
import { sessionGuard } from './middlewares/session-guard';

import type { PortalEnv } from './env';

const app = new Hono<PortalEnv>();

app.use('*', cors());

app.post('/miauth', miauthController);
app.get('/session', sessionGuard, getSessionController);
app.post('/emoji-requests', sessionGuard, createEmojiRequestController);
app.get('/emoji-requests/remaining', sessionGuard, getRemainingRequestLimitController);
app.get('/emoji-requests', sessionGuard, getEmojiRequestsController);
app.get('/uploaded/:key', getUploadedFilesController);

export default app;
