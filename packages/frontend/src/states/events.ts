
import { atomWithStorage } from 'jotai/utils';
import { atomWithSuspenseQuery } from 'jotai-tanstack-query';

import { api } from '@/services/api';

export const allEventsAtom = atomWithSuspenseQuery(() => ({
  queryKey: ['allEvents'],
  queryFn: async () => {
    return await api(null).getAllEvents();
  },
}));

export const viewModeAtom = atomWithStorage<'calendar' | 'list'>('events:viewMode', 'calendar');
