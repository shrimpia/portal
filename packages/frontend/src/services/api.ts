import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

import type { Emoji } from '@/types/emoji';
import type { EmojiRequest } from '@/types/emoji-request';
import type { EventDraft, EventDto } from '@/types/event';
import type { Hint } from '@/types/hint';
import type { Session } from '@/types/session';

import { URL_PORTAL_BACKEND } from '@/consts';
import { tokenAtom } from '@/states/sessions';

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

export const $delete = async <T>(endpoint: string, args: FormData | Record<string, unknown>, token: string | null): Promise<T> => {
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
    method: 'DELETE',
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
  getEmojis: () => $get<Emoji[]>('emojis', {}, token),
  getSession: () => $get<Session>('session', {}, token),
  getRemainingEmojiRequestLimit: () => $get<{ limit: number }>('emoji-requests/remaining', {}, token),
  isDuplicatedEmojiName: (name: string) => $get<boolean>(`emojis/is-duplicated/${encodeURIComponent(name)}`, {}, token),
  createEmojiRequest: (image: Blob, name: string, comment: string) => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', name);
    formData.append('comment', comment);
    return $post<void>('emoji-requests', formData, token);
  },
  getAllEmojiRequests: (filter: 'mine' | 'all') => $get<EmojiRequest[]>('emoji-requests', { filter }, token),
  getAllEvents: () => $get<EventDto[]>('events', {}, token),
  getEvent: (id: string) => $get<EventDto>(`events/${id}`, {}, token),
  createEvent: (data: EventDraft) => $post<void>('events', data, token),
  deleteEvent: (id: string) => $delete<void>(`events/${id}`, {}, token),
  editEvent: (id: string, data: EventDraft) => $post<void>(`events/${id}`, data, token),
  admin: {
    getAllPendingEmojiRequests: () => $get<EmojiRequest[]>('admin/emoji-requests', {}, token),
    getEmojiRequest: (id: string) => $get<EmojiRequest>(`admin/emoji-requests/${id}`, {}, token),
    approveEmojiRequest: (id: string, tag: string) => $post<void>(`admin/emoji-requests/${id}/approve`, { tag }, token),
    rejectEmojiRequest: (id: string, reason: string) => $post<void>(`admin/emoji-requests/${id}/reject`, { reason }, token),
    getAllHints: () => $get<Hint[]>('admin/hints', {}, token),
    createHint: (content: string, url: string | null) => $post<void>('admin/hints', { content, url }, token),
    deleteHint: (id: string) => $delete<void>(`admin/hints/${id}`, {}, token),
    editHint: (id: string, content: string, url: string | null) => $post<void>(`admin/hints/${id}`, { content, url }, token),
    changeHintVisibility: (id: string, isPublished: boolean) => $post<void>(`admin/hints/${id}/publication`, { isPublished }, token),
  },
});
