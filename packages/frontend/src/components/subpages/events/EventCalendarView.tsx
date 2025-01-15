import { isWithinInterval } from 'date-fns';
import { useAtom } from 'jotai';
import { useCallback, useMemo, useState } from 'react';
import { Button, Offcanvas, Stack } from 'react-bootstrap';

import type { EventDraft, EventDto } from '@/types/event';

import { CalendarView } from '@/components/common/CalendarView';
import { EditEventModal } from '@/components/domains/events/EditEventModal';
import { EventCardView } from '@/components/domains/events/EventCardView';
import { useSaveEvent } from '@/hooks/useRegisterEvent';
import { allEventsAtom } from '@/states/events';

export const EventCalendarView: React.FC = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [flyoutData, setFlyoutData] = useState<{
    day: number;
    events: EventDto[];
  } | null>(null);
  const [isFlyoutShow, setFlyoutShow] = useState(false);
  const [show, setShow] = useState(false);

  const [isHelpShow, setHelpShow] = useState(false);
  
  const save = useSaveEvent();

  const [{data: events}] = useAtom(allEventsAtom);

  const calendarEvents = useMemo(() => events.map((e) => ({
    id: e.id,
    title: e.name,
    startDate: new Date(e.startDate),
    endDate: e.endDate ? new Date(e.endDate) : null,
    isAllDay: e.isAllDay,
  })), [events]);

  const flyoutToday = useMemo(() => flyoutData ? new Date(year, month, flyoutData.day) : null, [flyoutData, month, year]);

  const onClickBackMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
      return;
    }
    setMonth(month - 1);
  };

  const onClickNextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
      return;
    }
    setMonth(month + 1);
  };

  const onClickToday = () => {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  };

  const onClickDayCell = (day: number) => {
    const dayEvents = events.filter(e => {
      const startDate = new Date(e.startDate);
      const endDate = e.endDate ? new Date(e.endDate) : startDate;
      const currentDay = new Date(year, month, day);

      startDate.setHours(0);
      startDate.setMinutes(0);
      startDate.setSeconds(0);
      startDate.setMilliseconds(0);
      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);
      endDate.setMilliseconds(999);

      const isWithin = isWithinInterval(currentDay, { start: startDate, end: endDate });

      return isWithin;
    });

    setFlyoutData({
      day,
      events: dayEvents,
    });
    setFlyoutShow(true);
  };

  const isToday = now.getFullYear() === year && now.getMonth() === month;

  const onClickAddEvent = useCallback(() => {
    setFlyoutShow(false);
    setShow(true);
  }, []);

  const onSave = useCallback(async (event: EventDraft) => {
    if (!await save(event)) return;
    setShow(false);
  }, [save]);

  const showHelp = useCallback(() => {
    setHelpShow(true);
  }, []);

  return (
    <>
      <header className="d-flex mb-2">
        <h2 className="fs-4">
          {year}年{month + 1}月
        </h2>
        <Button variant="outline-primary" className="border-0 ms-2" onClick={showHelp}>
          <i className="bi bi-question-circle" />
        </Button>
        <Stack direction="horizontal" className="ms-auto" gap={1}>
          <Button variant="outline-primary" className="border-0" onClick={onClickBackMonth}>
            <i className="bi bi-chevron-left" />
          </Button>
          <Button variant={isToday ? 'primary' : 'outline-primary'} onClick={onClickToday}>
            今日
          </Button>
          <Button variant="outline-primary" className="border-0" onClick={onClickNextMonth}>
            <i className="bi bi-chevron-right" />
          </Button>
        </Stack>
      </header>
      <CalendarView year={year} month={month} events={calendarEvents} onClick={onClickDayCell} />

      <Offcanvas show={isHelpShow} onHide={() => setHelpShow(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>ヘルプ</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Stack gap={3}>
            <p>
              カレンダー上の日付をクリックすると、その日のイベント一覧が表示されます。イベント一覧の下部にある「イベントを追加」ボタンをクリックすると、イベントを追加できます。
            </p>
            <p>
              また、カレンダー上部の「<i className="bi bi-chevron-left" />」ボタンや「<i className="bi bi-chevron-right" />」ボタンをクリックすると、前月や翌月に移動できます。<br/>
            </p>
            <p>
              なお、カレンダーには見かけ上前月・翌月の枠がありますが、前月・翌月のイベントは仕様上表示されません。ご了承ください。
            </p>
          </Stack>
        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas show={isFlyoutShow} onHide={() => setFlyoutShow(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {year}年{month + 1}月{flyoutData?.day}日
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Stack gap={3}>
            {flyoutData?.events.map((event) => (
              <EventCardView event={event} key={event.id} />
            ))}
          </Stack>
          {flyoutData?.events.length === 0 && (
            <div className="text-center text-muted">
              イベントはありません
            </div>
          )}
          <Button variant="primary" className="mt-3 d-block w-100" onClick={onClickAddEvent}>
            <i className="bi bi-plus-lg" /> イベントを追加
          </Button>
        </Offcanvas.Body>
      </Offcanvas>
      <EditEventModal show={show} initialDate={flyoutToday} onHide={() => setShow(false)} onSave={onSave} />
    </>
  );
};
