import { atomWithSuspenseQuery } from 'jotai-tanstack-query';

import { tokenAtom } from './sessions';

import { api } from '@/services/api';

export const allHintsAtom = atomWithSuspenseQuery((get) => ({
  queryKey: ['allHints', get(tokenAtom)],
  queryFn: async ({ queryKey }) => {
    return await api(queryKey[1] as string | null).admin.getAllHints();
  },
}));

