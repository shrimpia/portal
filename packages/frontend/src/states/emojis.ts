
import { atomWithSuspenseQuery } from 'jotai-tanstack-query';

import { api } from '@/services/api';

export const emojisAtom = atomWithSuspenseQuery(() => ({
  queryKey: ['emojis'],
  queryFn: async () => {
    return await api(null).getEmojis();
  },
}));
