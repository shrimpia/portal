import { format } from 'date-fns';
import React from 'react';
import { Card } from 'react-bootstrap';

import type { EventDto } from '@/types/event';

import { MfmView } from '@/components/common/MfmView';
import { UserLinkView } from '@/components/common/UserLinkView';

import './EventCardView.scss';

export type EventCardViewProp = {
    event: EventDto;
}

const getFormat = (isAllDay: boolean) => isAllDay ? 'yyyy/MM/dd' : 'yyyy/MM/dd HH:mm';

export const EventCardView: React.FC<EventCardViewProp> = ({ event }) => {
  return (
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
            {!event.description && <div className="text-muted">イベントの説明はありません</div>}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
