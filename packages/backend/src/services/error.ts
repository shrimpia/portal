import type { Context } from 'hono';

export const sendNotShrimpiaPlusError = (c: Context) => {
  return sendError(c, 403, 'You are not a Shrimpia+ member');
};

export const sendNotAdminError = (c: Context) => {
  return sendError(c, 403, 'You are not admin');
};

export const sendNotEmperorError = (c: Context) => {
  return sendError(c, 403, 'You are not emperor');
};

export const sendNotMoeStaffError = (c: Context) => {
  return sendError(c, 403, 'You are not a staff of the Ministry of Emojis.');
};

export const sendNotHintEditorError = (c: Context) => {
  return sendError(c, 403, 'You are not a hint editor');
};

export const sendFailedToGetMisskeyUserError = (c: Context) => {
  return sendError(c, 400, 'Failed to get Misskey user');
};

export const send404 = (c: Context) => {
  return sendError(c, 404, 'Not Found');
};

export const send401 = (c: Context) => {
  return sendError(c, 401, 'Unauthorized');
};

export const send400 = (c: Context, message?: string) => {
  return sendError(c, 400, message ?? 'Bad Request');
};

export const sendError = (c: Context, status: number, message: string) => {
  c.status(status);
  return c.json({
    error: message,
  });
};
