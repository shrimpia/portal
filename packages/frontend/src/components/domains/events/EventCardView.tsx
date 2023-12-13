import { format } from 'date-fns';
import { useAtomValue } from 'jotai';
import React, { useCallback, useState } from 'react';
import { Button, Card } from 'react-bootstrap';

import { EditEventModal } from './EditEventModal';

import type { EventDraft, EventDto } from '@/types/event';

import { MfmView } from '@/components/common/MfmView';
import { UserLinkView } from '@/components/common/UserLinkView';
import { useWithSpinner } from '@/hooks/useWithSpinner';
import { useAPI } from '@/services/api';
import { userAtom } from '@/states/user';

import './EventCardView.scss';

export type EventCardViewProp = {
    event: EventDto;
}

const getFormat = (isAllDay: boolean) => isAllDay ? 'yyyy/MM/dd' : 'yyyy/MM/dd HH:mm';

export const EventCardView: React.FC<EventCardViewProp> = ({ event }) => {
  const user = useAtomValue(userAtom);
  const api = useAPI();
  const withSpinner = useWithSpinner();

  const [isShowingEditModal, setShowingEditModal] = useState(false);

  const onClickEdit = useCallback(() => {
    setShowingEditModal(true);
  }, []);

  const onClickDelete = useCallback(() => {
    if (!confirm('本当にこのイベントを削除しますか？')) return;

    api.deleteEvent(event.id);
  }, [api, event.id]);

  const onSave = useCallback((data: EventDraft) => withSpinner(async () => {
    try {
      await api.editEvent(event.id, data);
      setShowingEditModal(false);
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
        console.error(e);
      }
    }
  }), [api, event.id, withSpinner]);

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
        {(event.authorName === user?.username || user?.isEmperor) && (
          <div className="d-flex gap-3 justify-content-end">
            <Button variant="outline-danger" className="border-0" onClick={onClickDelete}>
              <i className="bi bi-trash" /> 削除
            </Button>
            <Button variant="outline-primary" className="border-0" onClick={onClickEdit}>
              <i className="bi bi-pencil" /> 編集
            </Button>
          </div>
        )}
      </Card.Body>
      <EditEventModal initialEvent={event} show={isShowingEditModal} onHide={() => setShowingEditModal(false)} onSave={onSave} />
    </Card>
  );
};
