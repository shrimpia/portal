import { Events } from '../../db/repository';

import type { Controller } from '../base';

export const getAllEventsController: Controller = async (c) => {
  const events = await Events.readAll(c.env.DB);
  return c.json(events);
};
