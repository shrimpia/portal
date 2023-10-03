import { isDuplicatedEmojiName } from '../services/is-duplicated-emoji-name';

import type { Controller } from './base';

export const getIsDuplicatedNameController: Controller = async (c) => {
  const { name } = c.req.param();

  return c.json(await isDuplicatedEmojiName(name, c.env.KV, c.env.DB));
};
