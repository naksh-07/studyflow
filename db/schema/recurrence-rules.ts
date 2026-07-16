import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const recurrenceRules = sqliteTable('recurrence_rules', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  frequency: text('frequency').notNull(), // 'once' | 'daily' | 'weekly' | 'weekdays' | 'monthly' | 'yearly' | 'custom_days' | 'custom_weeks'
  interval: integer('interval').notNull().default(1),
  daysOfWeek: text('days_of_week'), // JSON-serialized number[]: [0, 1, ..., 6]
  startDate: text('start_date'), // YYYY-MM-DD
  until: text('until'), // YYYY-MM-DD
  count: integer('count'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
});

export type RecurrenceRuleRecord = typeof recurrenceRules.$inferSelect;
export type NewRecurrenceRuleRecord = typeof recurrenceRules.$inferInsert;
