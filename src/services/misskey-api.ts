import { URL_EMPIRE } from '../const';

import type { MisskeyUser } from '../types/user';

export const getMisskeyUser = async (misskeyToken: string) => {
  return await callMisskeyApi<MisskeyUser>('i', {
    i: misskeyToken,
  }).catch(() => null);
};


export const callMisskeyApi = async <T>(endpoint: string, params: FormData | Record<string, unknown>) => {
  const headers: HeadersInit = {};
  if (!(params instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(`${URL_EMPIRE}/api/${endpoint}`, {
    headers,
    method: 'POST',
    body: params instanceof FormData ? params : JSON.stringify(params),
  });

  const json: any = await res.json();

  if (!res.ok) {
    throw new Error(json.error);
  }

  return json as T;
};
