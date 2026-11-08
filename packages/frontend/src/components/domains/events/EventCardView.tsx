import { format } from 'date-fns';
import { useAtom } from 'jotai';
import React, { useCallback, useState } from 'react';

import { EditEventModal } from './EditEventModal';

import type { EventDraft, EventDto } from '@/types/event';

import { MfmView } from '@/components/common/MfmView';
import { UserLinkView } from '@/components/common/UserLinkView';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Stack } from '@/components/ui/Stack';
import { useWithSpinner } from '@/hooks/useWithSpinner';
import { useAPI } from '@/services/api';
import { userAtom } from '@/states/user';

import './EventCardView.scss';
import { allEventsAtom } from '@/states/events';

export type EventCardViewProp = {
    event: EventDto;
}

const getFormat = (isAllDay: boolean) => isAllDay ? 'yyyy/MM/dd' : 'yyyy/MM/dd HH:mm';

export const EventCardView: React.FC<EventCardViewProp> = ({ event }) => {
  const [{data: user}] = useAtom(userAtom);
  const [{refetch}] = useAtom(allEventsAtom);
  const api = useAPI();
  const withSpinner = useWithSpinner();

  const [isShowingEditModal, setShowingEditModal] = useState(false);

  const onClickEdit = useCallback(() => {
    setShowingEditModal(true);
  }, []);

  const onClickDelete = useCallback(() => {
    if (!confirm('本当にこのイベントを削除しますか？')) return;

    api.deleteEvent(event.id);
    refetch();
  }, [api, event.id, refetch]);

  const onSave = useCallback((data: EventDraft) => withSpinner(async () => {
    try {
      await api.editEvent(event.id, data);
      setShowingEditModal(false);
      await refetch();
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
        console.error(e);
      }
    }
  }), [api, event.id, refetch, withSpinner]);

  return (
    <Card className={event.isOfficial ? 'official' : ''}>
      {event.isOfficial ? (
        <Card.Text className="lu-text-primary lu-text-small">
          <i className="bi bi-patch-check-fill" /> 公式
        </Card.Text>
      ) : null}
      <Card.Title>{event.name}</Card.Title>
      <Card.Subtitle className="lu-mb-2 lu-text-dimmed">
        {format(new Date(event.startDate), getFormat(event.isAllDay))}
        {event.endDate && ` ～ ${format(new Date(event.endDate), getFormat(event.isAllDay))}`}
      </Card.Subtitle>
      <div>
        <UserLinkView username={event.authorName} />
        <div className="mfm">
          <MfmView>{event.description}</MfmView>
          {!event.description && <div className="lu-text-dimmed">イベントの説明はありません</div>}
        </div>
      </div>
      {(event.authorName === user?.username || user?.isEmperor) && (
        <Stack direction="horizontal" gap={4} justify="end">
          <Button variant="danger" onClick={onClickDelete}>
            <i className="bi bi-trash" /> 削除
          </Button>
          <Button variant="ghost" onClick={onClickEdit}>
            <i className="bi bi-pencil" /> 編集
          </Button>
        </Stack>
      )}
      <EditEventModal initialEvent={event} show={isShowingEditModal} onHide={() => setShowingEditModal(false)} onSave={onSave} />
    </Card>
  );
};
