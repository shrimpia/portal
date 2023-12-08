import { useAtomValue } from 'jotai';
import Masonry from 'react-masonry-css';

import { EventCardView } from '@/components/domains/events/EventCardView';
import { allEventsAtom } from '@/states/events';

export const EventListView: React.FC = () => {
  const allEvents = useAtomValue(allEventsAtom);

  return (
    <Masonry breakpointCols={{
      default: 3,
      992: 2,
      768: 1,
    }} className="d-flex gap-3" columnClassName="d-flex flex-column gap-3">
      {allEvents.map((event) => (
        <EventCardView key={event.id} event={event} />
      ))}
    </Masonry>
  );
};
