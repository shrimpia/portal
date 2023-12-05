import format from 'date-fns/format';
import { useAtomValue } from 'jotai';
import { Card, Stack } from 'react-bootstrap';

import { MfmView } from '@/components/common/MfmView';
import { UserLinkView } from '@/components/common/UserLinkView';
import { allEventsAtom } from '@/states/events';

import './EventListView.scss';

export const EventListView: React.FC = () => {
  const allEvents = useAtomValue(allEventsAtom);

  const getFormat = (isAllDay: boolean) => isAllDay ? 'yyyy/MM/dd' : 'yyyy/MM/dd HH:mm';

  return (
    <Stack gap={2}>
      {allEvents.map((event) => (
        <Card className={`card ${event.isOfficial ? 'official' : ''}`}>
          <Card.Body>
            {event.isOfficial ? (
              <Card.Text className="text-primary fs-small">
                <i className="bi bi-patch-check-fill" /> 公式
              </Card.Text>
            ) : null}
            <Card.Title>{event.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {format(new Date(event.startDate), getFormat(event.isAllDay))}
              {event.endDate && ` ～ ${format(new Date(event.endDate), getFormat(event.isAllDay))}`}
            </Card.Subtitle>
            <div>
              <UserLinkView username={event.authorName} />
              <div className="mfm">
                <MfmView>{event.description}</MfmView>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}
    </Stack>
  );
};
