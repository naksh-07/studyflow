import { drizzle } from 'drizzle-orm/d1';
import { sessions, settings, subjects, timetables, todaySchedule, users } from '../schema';

export async function seed(env: { DB: D1Database }) {
  const db = drizzle(env.DB);
  
  await db.delete(sessions);
  await db.delete(todaySchedule);
  await db.delete(timetables);
  await db.delete(subjects);
  await db.delete(settings);
  await db.delete(users);

  const [user] = await db.insert(users).values({
    id: 'user_1',
    email: 'demo@studyflow.app',
  }).returning();

  await db.insert(settings).values({
    id: 'settings_1',
    userId: user.id,
    wakeTime: '06:00',
    sleepTime: '23:00',
  });

  const [physics] = await db.insert(subjects).values({
    id: 'sub_physics',
    userId: user.id,
    name: 'Physics',
    color: '#3b82f6',
  }).returning();
  
  const [reasoning] = await db.insert(subjects).values({
    id: 'sub_reasoning',
    userId: user.id,
    name: 'Reasoning',
    color: '#8b5cf6',
  }).returning();

  const [timetable] = await db.insert(timetables).values({
    id: 'tt_1',
    userId: user.id,
    name: 'Main Routine',
    isActive: true,
  }).returning();

  const [schedule] = await db.insert(todaySchedule).values({
    id: 'sch_today',
    userId: user.id,
    date: new Date().toISOString().split('T')[0],
  }).returning();

  await db.insert(sessions).values([
    {
      id: 'original_sess_1',
      userId: user.id,
      timetableId: timetable.id,
      todayScheduleId: null,
      subjectId: physics.id,
      startTime: '08:45',
      endTime: null,
      durationMinutes: 90,
      status: 'planned',
    },
    {
      id: 'original_sess_2',
      userId: user.id,
      timetableId: timetable.id,
      todayScheduleId: null,
      subjectId: reasoning.id,
      startTime: '10:30',
      endTime: null,
      durationMinutes: 90,
      status: 'planned',
    },
    {
      id: 'sess_1',
      userId: user.id,
      timetableId: null,
      todayScheduleId: schedule.id,
      subjectId: physics.id,
      startTime: '08:45',
      endTime: '10:15',
      durationMinutes: 90,
      status: 'planned',
    },
    {
      id: 'sess_2',
      userId: user.id,
      timetableId: null,
      todayScheduleId: schedule.id,
      subjectId: reasoning.id,
      startTime: '10:30',
      endTime: '12:00',
      durationMinutes: 90,
      status: 'planned',
    }
  ]);
}
