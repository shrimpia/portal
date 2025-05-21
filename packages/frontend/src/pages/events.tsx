import { useAtom } from 'jotai';
import { Suspense, useCallback, useState } from 'react';
import { Button, Container, Nav } from 'react-bootstrap';

import type { EventDraft } from '@/types/event';

import { LoadingView } from '@/components/common/LoadingView';
import { EditEventModal } from '@/components/domains/events/EditEventModal';
import { EventCalendarView } from '@/components/subpages/events/EventCalendarView';
import { EventListView } from '@/components/subpages/events/EventListView';
import { useSaveEvent } from '@/hooks/useRegisterEvent';
import { viewModeAtom } from '@/states/events';
import { useLoginGuard } from '@/hooks/useLoginGuard';

const EventsPage: React.FC = () => {
  useLoginGuard();
  const [show, setShow] = useState(false);
  const [viewMode, setViewMode] = useAtom(viewModeAtom);

  const save = useSaveEvent();

  const onSave = useCallback(async (event: EventDraft) => {
    if (!await save(event)) return;
    setShow(false);
  }, [save]);

  return (
    <Container>
      <h1 className="fs-3 mb-3">イベントカレンダー</h1>
      <div className="d-flex mb-3">
        <Nav variant="underline" activeKey={viewMode} onSelect={key => setViewMode(key as typeof viewMode)}>
          <Nav.Item>
            <Nav.Link eventKey="list">
              <i className="bi bi-card-heading"/> リスト
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="calendar">
              <i className="bi bi-calendar-event"/> カレンダー
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Button className="ms-auto" onClick={() => setShow(true)}>
          <i className="bi bi-plus-lg"/> イベントを追加
        </Button>
      </div>
      <Suspense fallback={<LoadingView />}>
        {viewMode === 'calendar' ? <EventCalendarView /> : <EventListView />}
      </Suspense>
      <EditEventModal show={show} onHide={() => setShow(false)} onSave={onSave} />
    </Container>
  );
};

export default EventsPage;
