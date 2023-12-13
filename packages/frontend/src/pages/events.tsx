import { useCallback, useState } from 'react';
import { Button, Container, Nav } from 'react-bootstrap';

import type { EventDraft } from '@/types/event';

import { EditEventModal } from '@/components/domains/events/EditEventModal';
import { EventCalendarView } from '@/components/subpages/events/EventCalendarView';
import { EventListView } from '@/components/subpages/events/EventListView';
import { useWithSpinner } from '@/hooks/useWithSpinner';
import { useAPI } from '@/services/api';

const EventsPage: React.FC = () => {
  const [show, setShow] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const api = useAPI();
  const withSpinner = useWithSpinner();

  const onSave = useCallback((event: EventDraft) => withSpinner(async () => {
    try {
      await api.createEvent(event);
      setShow(false);
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
        console.error(e);
      }
    }
  }), [api, withSpinner]);

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
      {viewMode === 'calendar' ? <EventCalendarView /> : <EventListView />}
      <EditEventModal show={show} onHide={() => setShow(false)} onSave={onSave} />
    </Container>
  );
};

export default EventsPage;
