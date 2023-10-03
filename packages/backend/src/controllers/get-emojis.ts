import { KeyValue } from '../db/repository';

import type { Controller } from './base';

export const getEmojisController: Controller = async (c) => {
  const data = await KeyValue.getEmojis(c.env.KV);
  return c.json(data, 200, {
    'Content-Type': 'application/json',
  });
};
