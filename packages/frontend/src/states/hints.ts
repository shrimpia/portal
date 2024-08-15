import { atomsWithQuery } from 'jotai-tanstack-query';

import { tokenAtom } from './sessions';

import { api } from '@/services/api';

export const [allHintsAtom, allHintsStatusAtom] = atomsWithQuery((get) => ({
  queryKey: ['allHints', get(tokenAtom)],
  queryFn: async ({ queryKey }) => {
    return await api(queryKey[1] as string | null).admin.getAllHints();
  },
}));

