import { drizzle } from 'drizzle-orm/d1';

export type Database = ReturnType<typeof drizzle>;

export function getDb(env: { DB: D1Database }) {
  return drizzle(env.DB);
}
