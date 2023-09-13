import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { adminGetAllPendingEmojiRequestsController } from './controllers/admin/get-all-pending-emoji-requests';
import { adminGetEmojiRequestController } from './controllers/admin/get-emoji-request';
import { adminPostApproveEmojiRequestController } from './controllers/admin/post-approve-emoji-request';
import { adminPostRejectEmojiRequestController } from './controllers/admin/post-reject-emoji-request';
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

app.get('/', c => {
  return c.text('Portal API');
});
app.post('/miauth', miauthController);
app.get('/session', sessionGuard, getSessionController);
app.post('/emoji-requests', sessionGuard, createEmojiRequestController);
app.get('/emoji-requests/remaining', sessionGuard, getRemainingRequestLimitController);
app.get('/emoji-requests', sessionGuard, getEmojiRequestsController);
app.get('/admin/emoji-requests', sessionGuard, adminGetAllPendingEmojiRequestsController);
app.get('/admin/emoji-requests/:id', sessionGuard, adminGetEmojiRequestController);
app.post('/admin/emoji-requests/:id/approve', sessionGuard, adminPostApproveEmojiRequestController);
app.post('/admin/emoji-requests/:id/reject', sessionGuard, adminPostRejectEmojiRequestController);
app.get('/uploaded/:key', getUploadedFilesController);

export default app;
