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

  // res.status = 204 なら、戻り値がないのでそのまま返す
  if (res.status === 204) {
    return {} as T;
  }

  // resのcontent-typeがapplication/jsonでない場合は異常系なのでエラーを投げる
  if (!res.headers.get('content-type')?.startsWith('application/json')) {
    throw new Error(`Failed to call Misskey API. Status:${res.status} ${res.statusText} Response:${await res.text()}`);
  }

  const json: any = await res.json();

  if (!res.ok) {
    throw new Error(JSON.stringify(json.error));
  }

  return json as T;
};
