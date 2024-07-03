import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { atomsWithQuery } from 'jotai-tanstack-query';

import { api } from '../services/api';

import { tokenAtom } from './sessions';

export const filterAtom = atomWithStorage<'mine' | 'all'>('emojiRequest:filter', 'mine');
export const currentRequestIdAtom = atom<string | null>(null);

export const [emojiRequestsAtom, emojiRequestsStatusAtom] = atomsWithQuery((get) => ({
  queryKey: ['emojiRequests', get(filterAtom), get(tokenAtom)],
  queryFn: async ({ queryKey }) => {
    const filter = queryKey[1] as 'mine' | 'all';
    const token = queryKey[2] as string | null;
    if (!token) return [];
    const emojiRequests = await api(token).getAllEmojiRequests(filter);
    return emojiRequests;
  },
}));

export const [adminPendingEmojiRequestsAtom, adminPendingEmojiRequestsStatusAtom] = atomsWithQuery((get) => ({
  queryKey: ['adminPendingEmojiRequests', get(tokenAtom)],
  queryFn: async ({ queryKey }) => {
    const token = queryKey[1] as string | null;
    if (!token) return [];
    const emojiRequests = await api(token).admin.getAllPendingEmojiRequests();
    return emojiRequests;
  },
}));

export const [adminCurrentEmojiRequestAtom, adminCurrentEmojiRequestStatusAtom] = atomsWithQuery((get) => ({
  queryKey: ['adminCurrentEmojiRequest', get(tokenAtom), get(currentRequestIdAtom)],
  queryFn: async ({ queryKey }) => {
    const token = queryKey[1] as string | null;
    const id = queryKey[2] as string | null;
    if (!token || !id) return null;
    const req = await api(token).admin.getEmojiRequest(id);
    return req;
  },
}));

