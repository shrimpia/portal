import { z } from 'zod';

import type { Event } from '../models/event';

export const eventCreateDataSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(1024),
  startDate: z.date(),
  endDate: z.date().optional().nullable(),
  isAllDay: z.boolean(),
  isOfficial: z.boolean().optional(),
  authorId: z.string().uuid(),
});

export type EventCreateData = z.infer<typeof eventCreateDataSchema>;

export type EventDto = {
	id: string;
	name: string;
	description: string;
	startDate: Date;
	endDate: Date | null;
	isAllDay: boolean;
	isOfficial: boolean;
	authorId: string;
	createdAt: Date;
};

export class EventRepository {
  async create(db: D1Database, data: EventCreateData) {
    const id = crypto.randomUUID();
    const year = data.startDate.getFullYear();
    const month = data.startDate.getMonth() + 1;
    await db
      .prepare(
        'INSERT INTO event (id, name, description, start_date, end_date, is_all_day, is_official, author_id, created_year, created_month, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      )
      .bind(
        id,
        data.name,
        data.description,
        data.startDate,
        data.endDate ?? null,
        data.isAllDay,
        data.isOfficial ?? false,
        data.authorId,
        year,
        month,
        new Date(),
      )
      .run();
    return id;
  }

  async readAll(db: D1Database): Promise<EventDto[]> {
    return await db
      .prepare('SELECT * FROM event ORDER BY start_date ASC')
      .all<Event>().then(events => events.results.map(event => this.toDto(event)).filter(e => e !== null) as EventDto[]);
  }

  async readById(db: D1Database, id: string): Promise<EventDto | null> {
    return await db
      .prepare('SELECT * FROM event WHERE id = ?')
      .bind(id)
      .first<Event>()
      .then(event => this.toDto(event));
  }

  async delete(db: D1Database, id: string): Promise<void> {
    await db.prepare('DELETE FROM event WHERE id = ?').bind(id).run();
  }

  toDto(event?: Event | null): EventDto | null {
    return event ? {
      id: event.id,
      name: event.name,
      description: event.description,
      startDate: new Date(event.start_date),
      endDate: event.end_date ? new Date(event.end_date) : null,
      createdAt: new Date(event.created_at),
      isAllDay: event.is_all_day,
      isOfficial: event.is_official,
      authorId: event.author_id,
    } : null;
  }
}
