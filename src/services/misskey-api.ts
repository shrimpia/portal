import { URL_EMPIRE } from '../const';

import type { MisskeyUser } from '../types/user';

export const getMisskeyUser = async (misskeyToken: string) => {
  return await callMisskeyApi<MisskeyUser>('i', {
    i: misskeyToken,
  }).catch(() => null);
};


export const callMisskeyApi = async <T>(endpoint: string, params: Record<string, unknown>) => {
  const res = await fetch(`${URL_EMPIRE}/api/${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(params),
  }).then(res => res.json());

  return res as T;
};
