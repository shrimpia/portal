import type { MisskeyUser } from '@/types/misskey-user';

import { URL_EMPIRE } from '@/consts';

export const fetchUser = async (username: string) => {
  const res = await fetch(`${URL_EMPIRE}/api/users/show`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });
  return await res.json() as MisskeyUser | { error: any };
};
