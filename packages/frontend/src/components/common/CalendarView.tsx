
import groupBy from 'lodash.groupby';
import React, { useMemo } from 'react';

import { sliceByCount } from '@/util/slice-by-count';

import './CalendarView.scss';

export type CalendarEvent = {
  id: string;
  title: string;
  startDate: Date;
  endDate?: Date | null;
  isAllDay: boolean;
}

export type CalendarViewProp = {
  year: number;
  month: number;
  events?: CalendarEvent[];
}

const weekdays = '日月火水木金土'.split('');

export const CalendarView: React.FC<CalendarViewProp> = ({ year, month, events }) => {
  const cell = useMemo(() => {
    const daysCount = new Date(year, month + 1, 0).getDate();
    const firstDate = new Date(year, month, 1);
    const firstWeekday = firstDate.getDay();
  
    const days = Array.from({ length: daysCount }, (_, index) => index + 1);
    const emptyDays = Array.from({ length: firstWeekday }, () => null);
  
    const cell = sliceByCount([...emptyDays, ...days], 7);

    return cell;
  }, [month, year]);

  const groupedEvents = useMemo(() => groupBy(events?.filter(e => e.startDate.getFullYear() === year && e.startDate.getMonth() === month), event => event.startDate.getDate()), [events, month, year]);

  const isToday = (day: number) => {
    const today = new Date();
    return year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
  };

  return (
    <div className="calendar rounded shadow">
      {weekdays.map((weekday, i) => (
        <div key={weekday} className={`cell-weekday ${i === 0 || i === 6 ? 'holiday' : ''}`}>{weekday}</div>
      ))}
      {cell.map((row) => (
        row.map((day, i) => (
          <div
            key={day === null ? `empty-${i}` : `day-${day}`}
            className={`cell ${i === 0 || i === 6 ? 'holiday' : ''} ${day === null ? 'empty' : ''} ${isToday(day ?? 0) ? 'today' : ''}`}
          >
            <div>{day}</div>
            <ul className="events">
              {day && groupedEvents[day]?.map(event => (
                <li key={event.id}>{event.title}</li>
              ))}
            </ul>
          </div>
        ))
      ))}
    </div>
  );
};
