import { readSnapshot, writeSnapshot } from '@/storage/indexed-db';
import { DEFAULT_SETTINGS, StudyFlowSnapshot, TimetableData } from '@/storage/types';

export class LocalStudyFlowRepository {
  async getSnapshot(): Promise<StudyFlowSnapshot> {
    const snapshot = await readSnapshot();

    if (snapshot) {
      if (!snapshot.timetables || !snapshot.activeTimetableId) {
        const legacySettings = (snapshot as any).settings || DEFAULT_SETTINGS;
        const legacySessions = (snapshot as any).originalSessions || [];
        const legacyTodayItems = (snapshot as any).todayItems || [];
        const legacyTodayDate = (snapshot as any).todayDate || null;

        const defaultTimetable: TimetableData = {
          id: 'default-timetable',
          name: 'Daily Timetable',
          settings: legacySettings,
          originalSessions: legacySessions,
          todayItems: legacyTodayItems,
          todayDate: legacyTodayDate,
          updatedAt: snapshot.updatedAt || new Date().toISOString(),
        };

        const migratedSnapshot: StudyFlowSnapshot = {
          id: 'default',
          activeTimetableId: 'default-timetable',
          timetables: [defaultTimetable],
          updatedAt: new Date().toISOString(),
        };

        await writeSnapshot(migratedSnapshot);
        return migratedSnapshot;
      }
      return snapshot;
    }

    const defaultTimetable: TimetableData = {
      id: 'default-timetable',
      name: 'Daily Timetable',
      settings: DEFAULT_SETTINGS,
      originalSessions: [],
      todayItems: [],
      todayDate: null,
      updatedAt: new Date().toISOString(),
    };

    return {
      id: 'default',
      activeTimetableId: 'default-timetable',
      timetables: [defaultTimetable],
      updatedAt: new Date().toISOString(),
    };
  }

  async saveSnapshot(snapshot: Omit<StudyFlowSnapshot, 'id' | 'updatedAt'>): Promise<StudyFlowSnapshot> {
    const nextSnapshot: StudyFlowSnapshot = {
      ...snapshot,
      id: 'default',
      updatedAt: new Date().toISOString(),
    };

    await writeSnapshot(nextSnapshot);
    return nextSnapshot;
  }
}
