import { StudyFlowSnapshot, TimetableData } from '@/storage/types';
import { fetchCloudSnapshot, syncSnapshot } from '@/api/client';
import { LocalStudyFlowRepository } from '@/repositories/local-studyflow.repository';
import { syncQueue } from './sync-queue';

export interface SyncEngine {
  uploadLocalData(): Promise<void>;
  downloadCloudData(): Promise<StudyFlowSnapshot | null>;
  mergeData(local: StudyFlowSnapshot, cloud: StudyFlowSnapshot): Promise<StudyFlowSnapshot>;
  syncPendingChanges(): Promise<void>;
}

export class StudyFlowSyncEngine implements SyncEngine {
  private localRepo = new LocalStudyFlowRepository();

  async uploadLocalData(): Promise<void> {
    const local = await this.localRepo.getSnapshot();
    await syncSnapshot(local);
  }

  async downloadCloudData(): Promise<StudyFlowSnapshot | null> {
    const res = await fetchCloudSnapshot();
    return res?.snapshot || null;
  }

  async mergeData(local: StudyFlowSnapshot, cloud: StudyFlowSnapshot): Promise<StudyFlowSnapshot> {
    const isCloudNewer = new Date(cloud.updatedAt || 0).getTime() > new Date(local.updatedAt || 0).getTime();
    const activeTimetableId = isCloudNewer ? cloud.activeTimetableId : local.activeTimetableId;

    const localTimetables = local.timetables || [];
    const cloudTimetables = cloud.timetables || [];

    const mergedTimetables: TimetableData[] = [];

    const mergeTimetable = (l: TimetableData, c: TimetableData): TimetableData => {
      const isCNewer = new Date(c.updatedAt || 0).getTime() > new Date(l.updatedAt || 0).getTime();
      const settings = isCNewer ? c.settings : l.settings;
      const todayDate = isCNewer ? c.todayDate : l.todayDate;

      const combinedSessions = [...l.originalSessions];
      for (const cs of c.originalSessions) {
        const isDuplicate = combinedSessions.some(
          ls => ls.startTime === cs.startTime && ls.endTime === cs.endTime && ls.subjectId === cs.subjectId
        );
        if (!isDuplicate) {
          combinedSessions.push(cs);
        }
      }

      const combinedItems = [...l.todayItems];
      for (const ci of c.todayItems) {
        const isDuplicate = combinedItems.some(
          li => li.startTime === ci.startTime && li.endTime === ci.endTime && 
                (('status' in li && 'status' in ci && li.subjectId === ci.subjectId) || ('isBreak' in li && 'isBreak' in ci))
        );
        if (!isDuplicate) {
          combinedItems.push(ci);
        }
      }

      return {
        id: l.id,
        name: isCNewer ? c.name : l.name,
        settings,
        originalSessions: combinedSessions,
        todayItems: combinedItems,
        todayDate,
        updatedAt: isCNewer ? c.updatedAt : l.updatedAt,
      };
    };

    const allIds = Array.from(new Set([
      ...localTimetables.map(t => t.id),
      ...cloudTimetables.map(t => t.id)
    ]));

    for (const id of allIds) {
      const l = localTimetables.find(t => t.id === id);
      const c = cloudTimetables.find(t => t.id === id);

      if (l && c) {
        mergedTimetables.push(mergeTimetable(l, c));
      } else if (l) {
        mergedTimetables.push(l);
      } else if (c) {
        mergedTimetables.push(c);
      }
    }

    return {
      id: 'default',
      activeTimetableId,
      timetables: mergedTimetables,
      updatedAt: new Date().toISOString(),
    };
  }

  async syncPendingChanges(): Promise<void> {
    await syncQueue.flush();
  }
}

export const syncEngine = new StudyFlowSyncEngine();
