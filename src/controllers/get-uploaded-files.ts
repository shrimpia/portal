import { Bucket } from '../db/repository';

import type { Controller } from './base';

export const getUploadedFilesController: Controller = async (c) => {
  const key = c.req.param('key');

  const obj = await Bucket.get(c.env.BUCKET, key);

  if (!obj) {
    c.status(404);
    return c.body(null);
  }

  return c.body(await obj.arrayBuffer());
};
