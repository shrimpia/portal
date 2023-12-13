
import type { Event } from '../models/event';

export type EventCreateData = {
	name: string;
	description: string;
	startDate: Date;
	endDate?: Date | null;
	isAllDay: boolean;
	isOfficial?: boolean;
	authorId: string;
};

export type EventDto = {
	id: string;
	name: string;
	description: string;
	startDate: Date;
	endDate: Date | null;
	isAllDay: boolean;
	isOfficial: boolean;
	authorId: string;
	authorName: string | null;
	createdAt: Date;
};

export class EventRepository {
  async create(db: D1Database, data: EventCreateData) {
    const id = crypto.randomUUID();

    if (data.endDate < data.startDate) {
      throw new Error('End date must be after start date');
    }

    await db.prepare(
      'INSERT INTO event (id, name, description, start_date, end_date, is_all_day, is_official, author_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    ).bind(
      id,
      data.name,
      data.description,
      data.startDate.toISOString(),
      data.endDate?.toISOString() ?? null,
      data.isAllDay ? 1 : 0,
      data.isOfficial ? 1 : 0,
      data.authorId,
      new Date().toISOString(),
    ).run();
    return id;
  }

  async readAll(db: D1Database): Promise<EventDto[]> {
    return await db
      .prepare('SELECT *, e.id as id, u.username as author_name FROM event e JOIN user u ON u.id = e.author_id ORDER BY e.start_date ASC')
      .all<Event & { author_name: string | null }>()
      .then(events => events.results.map(event => this.toDto(event)).filter(e => e !== null) as EventDto[]);
  }

  async readById(db: D1Database, id: string): Promise<EventDto | null> {
    return await db
      .prepare('SELECT *, e.id as id, u.username as author_name FROM event e JOIN user u ON u.id = e.author_id WHERE e.id = ?')
      .bind(id)
      .first<Event & { author_name: string | null }>()
      .then(event => this.toDto(event));
  }

  async update(db: D1Database, id: string, data: Omit<EventCreateData, 'author_id'>): Promise<void> {
    if (data.endDate < data.startDate) {
      throw new Error('End date must be after start date');
    }

    await db.prepare(
      'UPDATE event SET name = ?, description = ?, start_date = ?, end_date = ?, is_all_day = ?, is_official = ? WHERE id = ?',
    ).bind(
      data.name,
      data.description,
      data.startDate.toISOString(),
      data.endDate?.toISOString() ?? null,
      data.isAllDay ? 1 : 0,
      data.isOfficial ? 1 : 0,
      id,
    ).run();
  }

  async delete(db: D1Database, id: string): Promise<void> {
    await db.prepare('DELETE FROM event WHERE id = ?').bind(id).run();
  }

  toDto(event?: (Event & { author_name: string | null }) | null): EventDto | null {
    return event ? {
      id: event.id,
      name: event.name,
      description: event.description,
      startDate: new Date(event.start_date),
      endDate: event.end_date ? new Date(event.end_date) : null,
      createdAt: new Date(event.created_at),
      isAllDay: Boolean(event.is_all_day),
      isOfficial: Boolean(event.is_official),
      authorId: event.author_id,
      authorName: event.author_name,
    } : null;
  }
}
