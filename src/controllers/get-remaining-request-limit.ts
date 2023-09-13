import { sendError } from '../services/error';
import { getRemainingRequestLimit as $ } from '../services/get-remaining-request-limit';

import type { Controller } from './base';

export const getRemainingRequestLimitController: Controller = async (c) => {
  try {
    const limit = await $(c.env.DB, c.portalUser!);
    return c.json({ limit });
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    return sendError(c, 500, error.message);
  }
};
