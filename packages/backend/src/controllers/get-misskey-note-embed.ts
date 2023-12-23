import { toEmbed404, toEmbedMisskeyNote } from '../services/EmbedMisskeyNote';
import { send400 } from '../services/error';

import type { Controller } from './base';
import type { MisskeyNote } from '../types/note';


export const getMisskeyNoteEmbedController: Controller = async (c) => {
  const { url } = c.req.query();
  if ((url === undefined) || (typeof url !== 'string')) {
    return send400(c, 'url is required');
  }

  const match = url.match(/^https?:\/\/(.+?)\/notes\/(\w+)$/);
  if (match === null) {
    return send400(c, 'invalid url');
  }

  const domain = match[1];
  const noteId = match[2];

  const res = await fetch(`https://${domain}/api/notes/show`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      noteId,
    }),
  });

  if (!res.ok) {
    c.status(404);
    return c.html(await toEmbed404());
  }

  const note = await res.json<MisskeyNote>();

  return c.html(await toEmbedMisskeyNote(note, domain));
};
