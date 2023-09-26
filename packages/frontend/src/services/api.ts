import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

import { URL_PORTAL_BACKEND } from '../consts';
import { tokenAtom } from '../states/sessions';

import type { EmojiRequest } from '../types/emoji-request';
import type { Session } from '../types/session';


export const $get = async <T>(endpoint: string, args: Record<string, unknown>, token: string | null): Promise<T> => {
  const url = new URL(`${URL_PORTAL_BACKEND}/${endpoint}`);
  Object.keys(args).forEach((key) => url.searchParams.append(key, String(args[key])));
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['X-Shrimpia-Token'] = token;
  }
  const response = await fetch(url.toString(), {
    headers,
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data?.error ?? response.statusText);
  }
  return response.json();
};

export const $post = async <T>(endpoint: string, args: FormData | Record<string, unknown>, token: string | null): Promise<T> => {
  const url = new URL(`${URL_PORTAL_BACKEND}/${endpoint}`);
  const headers: HeadersInit = {
  };
  if (!(args instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['X-Shrimpia-Token'] = token;
  }
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers,
    body: args instanceof FormData ? args : JSON.stringify(args),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data?.error ?? response.statusText);
  }
  return response.json();
};

export const useAPI = () => {
  const token = useAtomValue(tokenAtom);
  return useMemo(() => api(token), [token]);
};

export const api = (token: string | null) => ({
  miauth: (sessionId: string) => $post<{ token: string }>('miauth', { sessionId }, token),
  getSession: () => $get<Session>('session', {}, token),
  getRemainingEmojiRequestLimit: () => $get<{ limit: number }>('emoji-requests/remaining', {}, token),
  createEmojiRequest: (image: Blob, name: string, comment: string) => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', name);
    formData.append('comment', comment);
    return $post<void>('emoji-requests', formData, token);
  },
  getAllEmojiRequests: (filter: 'mine' | 'all') => $get<EmojiRequest[]>('emoji-requests', { filter }, token),
  admin: {
    getAllPendingEmojiRequests: () => $get<EmojiRequest[]>('admin/emoji-requests', {}, token),
    getEmojiRequest: (id: string) => $get<EmojiRequest>(`admin/emoji-requests/${id}`, {}, token),
    approveEmojiRequest: (id: string, tag: string) => $post<void>(`admin/emoji-requests/${id}/approve`, { tag }, token),
    rejectEmojiRequest: (id: string, reason: string) => $post<void>(`admin/emoji-requests/${id}/reject`, { reason }, token),
  },
});