import { Events } from '../../db/repository/index.js';
import { send404 } from '../../services/error.js';

import type { Controller } from '../base';

export const getEventByIdController: Controller = async (c) => {
  const id = c.req.param('id');
  const event = await Events.readById(c.env.DB, id);
  if (event == null) {
    return send404(c);
  }
  return c.json(event);
};
