import { Hono } from 'hono';
import { z } from 'zod';

import { SurveyAnswers } from '../db/repository';
import { send400 } from '../services/error';

import type { PortalEnv } from '../env';


const app = new Hono<PortalEnv>();

const postAnswerBodySchema = z.object({
  questionType: z.enum(['tos_public_comment']),
  body: z.string().max(3000),
  withUserId: z.boolean(),
});

app.post('/answers', async (c) => {
  const validation = await postAnswerBodySchema.safeParseAsync(await c.req.json());
  if (!validation.success) {
    return send400(c, validation.error.message);
  }

  await SurveyAnswers.create(c.env.DB, {
    questionType: validation.data.questionType,
    body: validation.data.body,
    userId: validation.data.withUserId ? c.portalUser?.id : null,
  });

  return c.json({
    ok: true,
  });
});

export default app;
