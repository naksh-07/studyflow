import { and, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { sessions, settings, subjects, timetables, todaySchedule, users, scheduleBlocks, recurrenceRules } from '@/db/schema';
import { EngineSession, ScheduleItem } from '@/lib/engine/types';
import { StudyFlowSnapshot, TimetableData } from '@/storage/types';

const DEFAULT_USER_ID = 'local-user';
const DEFAULT_SETTINGS_ID = 'settings-local-user';
const DEFAULT_TIMETABLE_ID = 'timetable-local-user';

function subjectRecordId(subjectName: string) {
  return `subject-${subjectName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function isStudySession(item: ScheduleItem): item is EngineSession {
  return 'status' in item;
}

export class D1StudyFlowRepository {
  private readonly db: ReturnType<typeof getDb>;

  constructor(env: { DB: D1Database }) {
    this.db = getDb(env);
  }

  async getSettings(userId = DEFAULT_USER_ID) {
    const result = await this.db.select().from(settings).where(eq(settings.userId, userId)).limit(1);
    return result[0] ?? null;
  }

  async getTimetable(userId = DEFAULT_USER_ID) {
    const timetableResult = await this.db
      .select()
      .from(timetables)
      .where(and(eq(timetables.userId, userId), eq(timetables.isActive, true)))
      .limit(1);

    const timetable = timetableResult[0];

    if (!timetable) {
      return null;
    }

    const timetableSessions = await this.db
      .select()
      .from(sessions)
      .where(eq(sessions.timetableId, timetable.id));

    const mappedSessions = timetableSessions.map(session => ({
      ...session,
      recurrenceRule: session.recurrenceRule ? JSON.parse(session.recurrenceRule) : undefined,
      exceptions: session.exceptions ? JSON.parse(session.exceptions) : undefined,
    }));

    return {
      ...timetable,
      sessions: mappedSessions,
    };
  }

  async getToday(date: string, userId = DEFAULT_USER_ID) {
    const scheduleResult = await this.db
      .select()
      .from(todaySchedule)
      .where(and(eq(todaySchedule.userId, userId), eq(todaySchedule.date, date)))
      .limit(1);

    const schedule = scheduleResult[0];

    if (!schedule) {
      return null;
    }

    const scheduleSessions = await this.db
      .select()
      .from(sessions)
      .where(eq(sessions.todayScheduleId, schedule.id));

    return {
      ...schedule,
      sessions: scheduleSessions,
    };
  }

  async saveSnapshot(snapshot: StudyFlowSnapshot, userId = DEFAULT_USER_ID) {
    const activeId = snapshot.activeTimetableId;
    const activeTimetable = snapshot.timetables?.find(t => t.id === activeId) || snapshot.timetables?.[0];

    if (!activeTimetable) {
      return {
        syncedAt: new Date().toISOString(),
      };
    }

    await this.db
      .insert(users)
      .values({ id: userId, email: null })
      .onConflictDoNothing();

    await this.db
      .insert(settings)
      .values({
        id: DEFAULT_SETTINGS_ID,
        userId,
        wakeTime: activeTimetable.settings.wakeTime,
        sleepTime: activeTimetable.settings.sleepTime,
      })
      .onConflictDoUpdate({
        target: settings.id,
        set: {
          wakeTime: activeTimetable.settings.wakeTime,
          sleepTime: activeTimetable.settings.sleepTime,
        },
      });

    const timezone = activeTimetable.settings?.timezone || 'UTC';

    await this.db
      .insert(timetables)
      .values({
        id: DEFAULT_TIMETABLE_ID,
        userId,
        name: activeTimetable.name || 'Daily Timetable',
        isActive: true,
        timezone,
      })
      .onConflictDoUpdate({
        target: timetables.id,
        set: {
          name: activeTimetable.name || 'Daily Timetable',
          isActive: true,
          timezone,
        },
      });

    await this.saveSubjects(activeTimetable, userId);
    await this.saveOriginalTimetable(activeTimetable.originalSessions, userId);

    if (activeTimetable.todayDate) {
      await this.saveTodaySchedule(activeTimetable, userId);
    }

    return {
      syncedAt: new Date().toISOString(),
    };
  }

  private async saveSubjects(snapshot: TimetableData, userId: string) {
    const subjectNames = new Set<string>();

    for (const session of snapshot.originalSessions) {
      if (session.subjectId) {
        subjectNames.add(session.subjectId);
      }
    }

    for (const item of snapshot.todayItems) {
      if (isStudySession(item) && item.subjectId) {
        subjectNames.add(item.subjectId);
      }
    }

    for (const subjectName of subjectNames) {
      await this.db
        .insert(subjects)
        .values({
          id: subjectRecordId(subjectName),
          userId,
          name: subjectName,
          color: null,
        })
        .onConflictDoUpdate({
          target: subjects.id,
          set: {
            name: subjectName,
          },
        });
    }
  }

  private async saveOriginalTimetable(originalSessions: EngineSession[], userId: string) {
    await this.db.delete(sessions).where(eq(sessions.timetableId, DEFAULT_TIMETABLE_ID));
    await this.db.delete(scheduleBlocks).where(eq(scheduleBlocks.timetableId, DEFAULT_TIMETABLE_ID));

    for (const session of originalSessions) {
      let recurrenceRuleId: string | null = null;
      if (session.recurrenceRule) {
        recurrenceRuleId = session.recurrenceRule.id || crypto.randomUUID();
        await this.db
          .insert(recurrenceRules)
          .values({
            id: recurrenceRuleId,
            frequency: session.recurrenceRule.frequency,
            interval: session.recurrenceRule.interval ?? 1,
            daysOfWeek: session.recurrenceRule.daysOfWeek ? JSON.stringify(session.recurrenceRule.daysOfWeek) : null,
            startDate: session.recurrenceRule.startDate || null,
            until: session.recurrenceRule.until || null,
            count: session.recurrenceRule.count || null,
          })
          .onConflictDoUpdate({
            target: recurrenceRules.id,
            set: {
              frequency: session.recurrenceRule.frequency,
              interval: session.recurrenceRule.interval ?? 1,
              daysOfWeek: session.recurrenceRule.daysOfWeek ? JSON.stringify(session.recurrenceRule.daysOfWeek) : null,
              startDate: session.recurrenceRule.startDate || null,
              until: session.recurrenceRule.until || null,
              count: session.recurrenceRule.count || null,
            },
          });
      }

      await this.db.insert(scheduleBlocks).values({
        id: session.id,
        timetableId: DEFAULT_TIMETABLE_ID,
        subjectId: session.subjectId ? subjectRecordId(session.subjectId) : null,
        startTime: session.startTime || '00:00',
        endTime: session.endTime || '00:00',
        durationMinutes: session.durationMinutes,
        recurrenceRuleId,
      });

      await this.db.insert(sessions).values({
        id: session.id,
        userId,
        timetableId: DEFAULT_TIMETABLE_ID,
        todayScheduleId: null,
        subjectId: session.subjectId ? subjectRecordId(session.subjectId) : null,
        startTime: session.startTime,
        endTime: session.endTime,
        durationMinutes: session.durationMinutes,
        status: session.status,
        recurrenceRule: session.recurrenceRule ? JSON.stringify(session.recurrenceRule) : null,
        exceptions: session.exceptions ? JSON.stringify(session.exceptions) : null,
      } as any);
    }
  }

  private async saveTodaySchedule(snapshot: TimetableData, userId: string) {
    const todayScheduleId = `today-${userId}-${snapshot.todayDate}`;

    await this.db
      .insert(todaySchedule)
      .values({
        id: todayScheduleId,
        userId,
        date: snapshot.todayDate ?? new Date().toISOString().slice(0, 10),
      })
      .onConflictDoUpdate({
        target: todaySchedule.id,
        set: {
          date: snapshot.todayDate ?? new Date().toISOString().slice(0, 10),
        },
      });

    await this.db.delete(sessions).where(eq(sessions.todayScheduleId, todayScheduleId));

    for (const item of snapshot.todayItems) {
      if (!isStudySession(item)) {
        continue;
      }

      await this.db.insert(sessions).values({
        id: item.id,
        userId,
        timetableId: null,
        todayScheduleId,
        subjectId: item.subjectId ? subjectRecordId(item.subjectId) : null,
        startTime: item.startTime,
        endTime: item.endTime,
        durationMinutes: item.durationMinutes,
        status: item.status,
      });
    }
  }
}
