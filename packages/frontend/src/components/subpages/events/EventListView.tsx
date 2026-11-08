import { useAtom } from 'jotai';
import { useMemo } from 'react';
import Masonry from 'react-masonry-css';

import { EventCardView } from '@/components/domains/events/EventCardView';
import { allEventsAtom } from '@/states/events';
import { masonryColumnStyle, masonryStyle } from '@/components/common/masonry';

export const EventListView: React.FC = () => {
  const [{data: allEvents}] = useAtom(allEventsAtom);

  const futureEvents = useMemo(() => {
    // 未来に終わるイベントのみを取得
    return allEvents.filter((event) => new Date(event.endDate ?? event.startDate) > new Date());
  }, [allEvents]);

  return futureEvents.length > 0 ? (
    <Masonry breakpointCols={{
      default: 3,
      992: 2,
      768: 1,
    }} className={masonryStyle} columnClassName={masonryColumnStyle}>
      {futureEvents.map((event) => (
        <EventCardView key={event.id} event={event} />
      ))}
    </Masonry>
  ) : (
    <div className="lu-text-center">イベントはありません</div>
  );
};
