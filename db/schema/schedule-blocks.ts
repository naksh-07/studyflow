import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { timetables } from './timetables';
import { subjects } from './subjects';
import { recurrenceRules } from './recurrence-rules';

export const scheduleBlocks = sqliteTable('schedule_blocks', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  timetableId: text('timetable_id').notNull().references(() => timetables.id, { onDelete: 'cascade' }),
  subjectId: text('subject_id').references(() => subjects.id, { onDelete: 'set null' }),
  startTime: text('start_time').notNull(), // HH:mm
  endTime: text('end_time').notNull(),     // HH:mm
  durationMinutes: integer('duration_minutes').notNull(),
  recurrenceRuleId: text('recurrence_rule_id').references(() => recurrenceRules.id, { onDelete: 'set null' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
}, (table) => ({
  timetableIdIdx: index('schedule_blocks_timetable_id_idx').on(table.timetableId),
  subjectIdIdx: index('schedule_blocks_subject_id_idx').on(table.subjectId),
  recurrenceRuleIdIdx: index('schedule_blocks_recurrence_rule_id_idx').on(table.recurrenceRuleId),
}));

export type ScheduleBlockRecord = typeof scheduleBlocks.$inferSelect;
export type NewScheduleBlockRecord = typeof scheduleBlocks.$inferInsert;
