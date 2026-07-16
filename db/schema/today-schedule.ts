import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { users } from './users';

export const todaySchedule = sqliteTable('today_schedule', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: text('date').notNull(), // YYYY-MM-DD
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
}, (table) => ({
  userIdIdx: index('today_schedule_user_id_idx').on(table.userId),
  dateIdx: index('today_schedule_date_idx').on(table.date),
}));

export type TodaySchedule = typeof todaySchedule.$inferSelect;
export type NewTodaySchedule = typeof todaySchedule.$inferInsert;
