import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { adminGetAllPendingEmojiRequestsController } from './controllers/admin/get-all-pending-emoji-requests';
import { adminGetEmojiRequestController } from './controllers/admin/get-emoji-request';
import { adminPostApproveEmojiRequestController } from './controllers/admin/post-approve-emoji-request';
import { adminPostRejectEmojiRequestController } from './controllers/admin/post-reject-emoji-request';
import { createEmojiRequestController } from './controllers/create-emoji-request';
import { createEventController } from './controllers/events/create-event';
import { deleteEventController } from './controllers/events/delete-event';
import { getAllEventsController } from './controllers/events/get-all-events';
import { getEventByIdController } from './controllers/events/get-event';
import { getEmojiRequestsController } from './controllers/get-emoji-requests';
import { getEmojisController } from './controllers/get-emojis';
import { getIsDuplicatedNameController } from './controllers/get-is-duplicated-name';
import { getMisskeyNoteEmbedController } from './controllers/get-misskey-note-embed';
import { getRemainingRequestLimitController } from './controllers/get-remaining-request-limit';
import { getSessionController } from './controllers/get-session';
import { getUploadedFilesController } from './controllers/get-uploaded-files';
import { miauthController } from './controllers/miauth';
import { moeStaffGuard } from './middlewares/moe-staff-guard';
import { sessionGuard } from './middlewares/session-guard';

import type { PortalEnv } from './env';

const app = new Hono<PortalEnv>();

app.use('*', cors());

app.get('/', c => {
  return c.text('Portal API');
});

// -- Auth API
app.get('/session', sessionGuard, getSessionController);
app.post('/miauth', miauthController);

// -- Note Embed API
app.get('/note-embed', getMisskeyNoteEmbedController);

// -- Storage API
app.get('/uploaded/:key', getUploadedFilesController);

// -- Misskey Emojis API
app.get('/emojis', getEmojisController);
app.get('/emojis/is-duplicated/:name', getIsDuplicatedNameController);

// -- Emoji Requests API
app.post('/emoji-requests', sessionGuard, createEmojiRequestController);
app.get('/emoji-requests/remaining', sessionGuard, getRemainingRequestLimitController);
app.get('/emoji-requests', sessionGuard, getEmojiRequestsController);

// -- Event Calendar API
app.get('/events', getAllEventsController);
app.get('/events/:id', getEventByIdController);
app.post('/events', sessionGuard, createEventController);
app.delete('/events/:id', sessionGuard, deleteEventController);

// -- Admin API
app.get('/admin/emoji-requests', moeStaffGuard, adminGetAllPendingEmojiRequestsController);
app.get('/admin/emoji-requests/:id', moeStaffGuard, adminGetEmojiRequestController);
app.post('/admin/emoji-requests/:id/approve', moeStaffGuard, adminPostApproveEmojiRequestController);
app.post('/admin/emoji-requests/:id/reject', moeStaffGuard, adminPostRejectEmojiRequestController);

app.onError((err, c) => {
  console.error(err);
  c.status(500);
  return c.json({
    ok: false,
    error: err.message,
  });
});

export default app;
