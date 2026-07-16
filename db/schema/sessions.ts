import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { users } from './users';
import { todaySchedule } from './today-schedule';
import { subjects } from './subjects';
import { timetables } from './timetables';

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  timetableId: text('timetable_id').references(() => timetables.id, { onDelete: 'cascade' }),
  todayScheduleId: text('today_schedule_id').references(() => todaySchedule.id, { onDelete: 'cascade' }),
  subjectId: text('subject_id').references(() => subjects.id, { onDelete: 'set null' }),
  startTime: text('start_time'), // HH:mm
  endTime: text('end_time'),     // HH:mm
  durationMinutes: integer('duration_minutes').notNull(),
  status: text('status', { enum: ['planned', 'completed', 'skipped'] }).notNull().default('planned'),
  recurrenceRule: text('recurrence_rule'), // JSON-serialized RecurrenceRule
  exceptions: text('exceptions'),         // JSON-serialized ScheduleException[]
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
}, (table) => ({
  userIdIdx: index('sessions_user_id_idx').on(table.userId),
  timetableIdIdx: index('sessions_timetable_id_idx').on(table.timetableId),
  todayScheduleIdIdx: index('sessions_today_schedule_id_idx').on(table.todayScheduleId),
  subjectIdIdx: index('sessions_subject_id_idx').on(table.subjectId),
}));

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
