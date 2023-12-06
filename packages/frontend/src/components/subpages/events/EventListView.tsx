import { useAtomValue } from 'jotai';
import { Stack } from 'react-bootstrap';

import { EventCardView } from '@/components/domains/events/EventCardView';
import { allEventsAtom } from '@/states/events';

export const EventListView: React.FC = () => {
  const allEvents = useAtomValue(allEventsAtom);

  return (
    <Stack gap={2}>
      {allEvents.map((event) => (
        <EventCardView event={event} key={event.id} />
      ))}
    </Stack>
  );
};
