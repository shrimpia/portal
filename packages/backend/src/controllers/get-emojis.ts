import type { Controller } from './base';

export const getEmojisController: Controller = async (c) => {
  const data = await c.env.KV.get('emojis');
  return c.text(data ?? '[]', 200, {
    'Content-Type': 'application/json',
  });
};
