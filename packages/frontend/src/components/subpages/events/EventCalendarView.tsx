import { isWithinInterval } from 'date-fns';
import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { Button, Offcanvas, Stack } from 'react-bootstrap';


import type { EventDto } from '@/types/event';

import { CalendarView } from '@/components/common/CalendarView';
import { EventCardView } from '@/components/domains/events/EventCardView';
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

  const events = useAtomValue(allEventsAtom);

  const calendarEvents = useMemo(() => events.map((e) => ({
    id: e.id,
    title: e.name,
    startDate: new Date(e.startDate),
    endDate: e.endDate ? new Date(e.endDate) : null,
    isAllDay: e.isAllDay,
  })), [events]);

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

      if (e.id === 'd89b381a-13cb-4cf0-a75e-2e1a0830cd92') {
        console.log(JSON.stringify({
          title: e.name,
          startDate,
          endDate,
          currentDay,
        }, null, 2));
      }

      return isWithin;
    });

    setFlyoutData({
      day,
      events: dayEvents,
    });
    setFlyoutShow(true);
  };

  const isToday = now.getFullYear() === year && now.getMonth() === month;

  return (
    <>
      <header className="d-flex mb-2">
        <h2 className="fs-4">
          {year}年{month + 1}月
        </h2>
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
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
