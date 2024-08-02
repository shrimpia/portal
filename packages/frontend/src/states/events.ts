
import { atomWithStorage } from 'jotai/utils';
import { atomsWithQuery } from 'jotai-tanstack-query';

import { api } from '@/services/api';

export const [allEventsAtom, allEventsStatusAtom] = atomsWithQuery(() => ({
  queryKey: ['allEvents'],
  queryFn: async () => {
    return await api(null).getAllEvents();
  },
}));

export const viewModeAtom = atomWithStorage<'calendar' | 'list'>('events:viewMode', 'calendar');
