
import { atomsWithQuery } from 'jotai-tanstack-query';

import { api } from '@/services/api';

export const [emojisAtom, emojisStatusAtom] = atomsWithQuery(() => ({
  queryKey: ['emojis'],
  queryFn: async () => {
    return await api(null).getEmojis();
  },
}));
