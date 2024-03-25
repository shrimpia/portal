import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import Masonry from 'react-masonry-css';

import { EventCardView } from '@/components/domains/events/EventCardView';
import { allEventsAtom } from '@/states/events';

export const EventListView: React.FC = () => {
  const allEvents = useAtomValue(allEventsAtom);

  const futureEvents = useMemo(() => {
    // 未来に終わるイベントのみを取得
    return allEvents.filter((event) => new Date(event.endDate ?? event.startDate) > new Date());
  }, [allEvents]);

  return futureEvents.length > 0 ? (
    <Masonry breakpointCols={{
      default: 3,
      992: 2,
      768: 1,
    }} className="d-flex gap-3" columnClassName="d-flex flex-column gap-3">
      {futureEvents.map((event) => (
        <EventCardView key={event.id} event={event} />
      ))}
    </Masonry>
  ) : (
    <div className="text-center">イベントはありません</div>
  );
};
