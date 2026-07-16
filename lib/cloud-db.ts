import fs from 'fs';
import path from 'path';
import { StudyFlowSnapshot, TimetableData } from '@/storage/types';
import { getDb } from '@/db';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { and, eq, desc } from 'drizzle-orm';
import { users as usersTable } from '@/db/schema/users';
import { settings as settingsTable } from '@/db/schema/settings';
import { timetables as timetablesTable } from '@/db/schema/timetables';
import { sessions as sessionsTable } from '@/db/schema/sessions';
import { todaySchedule as todayScheduleTable } from '@/db/schema/today-schedule';
import { D1StudyFlowRepository } from '@/repositories/d1-studyflow.repository';

const DB_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DB_DIR, 'cloud_db.json');

export interface CloudUser {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface CloudSnapshot {
  userId: string;
  snapshot: StudyFlowSnapshot;
  updatedAt: string;
}

interface DbSchema {
  users: CloudUser[];
  snapshots: CloudSnapshot[];
}

const defaultDb: DbSchema = {
  users: [],
  snapshots: [],
};

function ensureDbFile() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf8');
  }
}

function readDb(): DbSchema {
  try {
    ensureDbFile();
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading cloud_db:', err);
    return defaultDb;
  }
}

function writeDb(data: DbSchema) {
  try {
    ensureDbFile();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing cloud_db:', err);
  }
}

async function getDrizzleDb() {
  try {
    const { env } = await getCloudflareContext();
    if (env && (env as any).DB) {
      return getDb({ DB: (env as any).DB as D1Database });
    }
  } catch (e) {
    // Graceful fallback to local JSON file when running outside Cloudflare / Next dev
  }
  return null;
}

export class CloudDb {
  static async getUsers(): Promise<CloudUser[]> {
    const db = await getDrizzleDb();
    if (db) {
      const result = await db.select().from(usersTable);
      return result.map(u => ({
        id: u.id,
        email: u.email || '',
        name: u.displayName || undefined,
        createdAt: u.createdAt.toISOString(),
      }));
    }
    return readDb().users;
  }

  static async findUserByEmail(email: string): Promise<CloudUser | null> {
    const db = await getDrizzleDb();
    if (db) {
      const result = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email.toLowerCase()))
        .limit(1);
      const user = result[0];
      if (!user) return null;
      return {
        id: user.id,
        email: user.email || '',
        name: user.displayName || undefined,
        createdAt: user.createdAt.toISOString(),
      };
    }
    const localDb = readDb();
    return localDb.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  static async findUserById(id: string): Promise<CloudUser | null> {
    const db = await getDrizzleDb();
    if (db) {
      const result = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .limit(1);
      const user = result[0];
      if (!user) return null;
      return {
        id: user.id,
        email: user.email || '',
        name: user.displayName || undefined,
        createdAt: user.createdAt.toISOString(),
      };
    }
    const localDb = readDb();
    return localDb.users.find((u) => u.id === id) ?? null;
  }

  static async createUser(email: string, name?: string): Promise<CloudUser> {
    const db = await getDrizzleDb();
    if (db) {
      const existing = await this.findUserByEmail(email);
      if (existing) {
        return existing;
      }

      const id = 'usr_' + Math.random().toString(36).substring(2, 11);
      const newUser = {
        id,
        email: email.toLowerCase(),
        displayName: name || null,
        googleId: null,
        avatarUrl: null,
      };

      await db.insert(usersTable).values(newUser);

      return {
        id,
        email: email.toLowerCase(),
        name,
        createdAt: new Date().toISOString(),
      };
    }

    const localDb = readDb();
    const existing = localDb.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return existing;
    }

    const newUser: CloudUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 11),
      email,
      name,
      createdAt: new Date().toISOString(),
    };

    localDb.users.push(newUser);
    writeDb(localDb);
    return newUser;
  }

  static async getSnapshot(userId: string): Promise<StudyFlowSnapshot | null> {
    const db = await getDrizzleDb();
    if (db) {
      // Reconstruct StudyFlowSnapshot from D1
      const settingsResult = await db
        .select()
        .from(settingsTable)
        .where(eq(settingsTable.userId, userId))
        .limit(1);
      const userSettings = settingsResult[0];

      const timetableResult = await db
        .select()
        .from(timetablesTable)
        .where(and(eq(timetablesTable.userId, userId), eq(timetablesTable.isActive, true)))
        .limit(1);
      const timetable = timetableResult[0];

      if (!timetable) {
        return null;
      }

      const timetableSessions = await db
        .select()
        .from(sessionsTable)
        .where(eq(sessionsTable.timetableId, timetable.id));

      const mappedOriginalSessions = timetableSessions.map(session => ({
        id: session.id,
        subjectId: session.subjectId ? session.subjectId.replace(/^subject-/, '') : null,
        startTime: session.startTime,
        endTime: session.endTime,
        durationMinutes: session.durationMinutes,
        status: session.status as any,
        recurrenceRule: session.recurrenceRule ? JSON.parse(session.recurrenceRule) : undefined,
        exceptions: session.exceptions ? JSON.parse(session.exceptions) : undefined,
      }));

      const todayScheduleResult = await db
        .select()
        .from(todayScheduleTable)
        .where(eq(todayScheduleTable.userId, userId))
        .orderBy(desc(todayScheduleTable.date))
        .limit(1);
      const tSchedule = todayScheduleResult[0];

      let todayItems: any[] = [];
      let todayDate: string | null = null;

      if (tSchedule) {
        todayDate = tSchedule.date;
        const todaySessions = await db
          .select()
          .from(sessionsTable)
          .where(eq(sessionsTable.todayScheduleId, tSchedule.id));

        todayItems = todaySessions.map(session => ({
          id: session.id,
          subjectId: session.subjectId ? session.subjectId.replace(/^subject-/, '') : null,
          startTime: session.startTime,
          endTime: session.endTime,
          durationMinutes: session.durationMinutes,
          status: session.status as any,
        }));
      }

      const timetableData: TimetableData = {
        id: timetable.id,
        name: timetable.name,
        settings: {
          wakeTime: userSettings?.wakeTime || '06:00',
          sleepTime: userSettings?.sleepTime || '23:00',
          theme: 'natural',
          timezone: timetable.timezone || 'UTC',
        },
        originalSessions: mappedOriginalSessions,
        todayItems,
        todayDate,
        updatedAt: timetable.updatedAt ? timetable.updatedAt.toISOString() : new Date().toISOString(),
      };

      return {
        id: 'default',
        activeTimetableId: timetable.id,
        timetables: [timetableData],
        updatedAt: timetable.updatedAt ? timetable.updatedAt.toISOString() : new Date().toISOString(),
      };
    }

    const localDb = readDb();
    const found = localDb.snapshots.find((s) => s.userId === userId);
    return found ? found.snapshot : null;
  }

  static async saveSnapshot(userId: string, snapshot: StudyFlowSnapshot): Promise<void> {
    const db = await getDrizzleDb();
    if (db) {
      const { env } = await getCloudflareContext();
      const repository = new D1StudyFlowRepository({ DB: (env as any).DB as D1Database });
      await repository.saveSnapshot(snapshot, userId);
      return;
    }

    const localDb = readDb();
    const index = localDb.snapshots.findIndex((s) => s.userId === userId);

    const newRecord: CloudSnapshot = {
      userId,
      snapshot,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      localDb.snapshots[index] = newRecord;
    } else {
      localDb.snapshots.push(newRecord);
    }

    writeDb(localDb);
  }
}

