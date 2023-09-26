import { atomsWithQuery } from 'jotai-tanstack-query';

import { api } from '../services/api';

import { shrimpiaPlusEmulationAtom } from './debug';
import { tokenAtom } from './sessions';

import type { ShrimpiaPlus } from '../types/shrimpia-plus';

export const [userAtom, userStatusAtom] = atomsWithQuery((get) => ({
  queryKey: [get(tokenAtom), get(shrimpiaPlusEmulationAtom)],
  queryFn: async ({ queryKey }) => {
    const token = queryKey[0] as string | null;
    const emulatedPlus = queryKey[1] as ShrimpiaPlus | 'default';
    if (!token) return null;
    const session = await api(token).getSession();
    if (emulatedPlus !== 'default') {
      session.shrimpiaPlus = emulatedPlus;
    }
    return session;
  },
}));

export const [remainingEmojiRequestLimitAtom, remainingEmojiRequestLimitStatusAtom] = atomsWithQuery((get) => ({
  queryKey: [get(tokenAtom)],
  queryFn: async ({ queryKey }) => {
    const token = queryKey[0] as string | null;
    if (!token) return 0;
    const { limit } = await api(token).getRemainingEmojiRequestLimit();
    return limit;
  },
}));
