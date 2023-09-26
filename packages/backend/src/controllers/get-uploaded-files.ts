import { Bucket } from '../db/repository';

import type { Controller } from './base';

export const getUploadedFilesController: Controller = async (c) => {
  const key = c.req.param('key');

  const obj = await Bucket.get(c.env.BUCKET, key);

  if (!obj) {
    c.status(404);
    return c.body(null);
  }

  c.header('Content-Type', obj.type);
  return c.body(await obj.arrayBuffer());
};
