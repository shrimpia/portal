
import { format } from 'date-fns';
import React, { useCallback, useMemo } from 'react';

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
  onClick?: (day: number) => void;
}

type CalendarEventViewModel = {
  id: string;
  index: number;
  title: string;
  time: string | null;
  isAllDay: boolean;
  isStart: boolean;
  isEnd: boolean;
};

const weekdays = '日月火水木金土'.split('');

export const CalendarView: React.FC<CalendarViewProp> = ({ year, month, events, onClick }) => {
  const cell = useMemo(() => {
    const daysCount = new Date(year, month + 1, 0).getDate();
    const firstDate = new Date(year, month, 1);
    const firstWeekday = firstDate.getDay();
  
    const days = Array.from({ length: daysCount }, (_, index) => index + 1);
    const emptyDays = Array.from({ length: firstWeekday }, () => null);
  
    const cell = sliceByCount([...emptyDays, ...days], 7);

    return cell;
  }, [month, year]);

  const eventViewModels = useMemo(() => {
    if (!events) return [];
    const vms: CalendarEventViewModel[][] = [];

    events.forEach(event => {
      if (event.startDate.getFullYear() !== year || event.startDate.getMonth() !== month) return;
      const endDayOfMonth = new Date(year, month + 1, 0).getDate(); 

      const startDayOfEvent = event.startDate.getDate();
      let endDayOfEvent = event.endDate?.getDate() ?? startDayOfEvent;
      if (endDayOfEvent < startDayOfEvent) endDayOfEvent = endDayOfMonth;

      const days = Array.from({ length: endDayOfEvent - startDayOfEvent + 1 }, (_, i) => startDayOfEvent + i);

      days.forEach(day => {
        const isStart = day === startDayOfEvent;
        const isEnd = day === endDayOfEvent;

        const vm: CalendarEventViewModel = {
          id: event.id,
          index: day,
          title: event.title,
          time: event.isAllDay ? null : isStart ? format(event.startDate, 'HH:mm') : isEnd && event.endDate ? format(event.endDate, 'HH:mm') : null,
          isAllDay: event.isAllDay,
          isStart,
          isEnd,
        };

        if (!vms[day]) vms[day] = [];
        vms[day].push(vm);
      });
    });

    return vms;
  }, [events, month, year]);

  const isToday = useCallback((day: number) => {
    const today = new Date();
    return year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
  }, [month, year]);

  const getClassName = useCallback((event: CalendarEventViewModel) => {
    const classNames: string[] = [];
    if (event.isStart) classNames.push('start');
    if (event.isEnd) classNames.push('end');
    if (event.isAllDay) classNames.push('all-day');
    return classNames.join(' ');
  }, []);

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
            onClick={() => onClick?.(day ?? 0)}
            role="button"
          >
            <div>{day}</div>
            <ul className="events">
              {day && eventViewModels[day]?.map(e => (
                <li className={getClassName(e)} key={e.id + '-' + e.index}>{`${e.time ?? ''} ${e.title}`.trim()}</li>
              ))}
            </ul>
          </div>
        ))
      ))}
    </div>
  );
};
