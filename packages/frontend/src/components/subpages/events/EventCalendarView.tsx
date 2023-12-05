import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { Button, Stack } from 'react-bootstrap';


import { CalendarView } from '@/components/common/CalendarView';
import { allEventsAtom } from '@/states/events';

export const EventCalendarView: React.FC = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

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
      <CalendarView year={year} month={month} events={calendarEvents} />
    </>
  );
};
