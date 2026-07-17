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

function isDefaultSnapshot(snapshot: StudyFlowSnapshot): boolean {
  if (!snapshot || !snapshot.timetables || snapshot.timetables.length !== 1) return false;
  const t = snapshot.timetables[0];
  return (
    (!t.originalSessions || t.originalSessions.length === 0) &&
    (!t.todayItems || t.todayItems.length === 0) &&
    (t.name === 'Daily Timetable' || !t.name)
  );
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
    const localDefault = isDefaultSnapshot(local);
    const cloudDefault = isDefaultSnapshot(cloud);

    if (localDefault && !cloudDefault) {
      return cloud;
    }
    if (!localDefault && cloudDefault) {
      return local;
    }

    const localTime = new Date(local.updatedAt || 0).getTime();
    const cloudTime = new Date(cloud.updatedAt || 0).getTime();
    const isCloudNewer = cloudTime > localTime;

    const activeTimetableId = isCloudNewer ? cloud.activeTimetableId : local.activeTimetableId;

    const localTimetables = local.timetables || [];
    const cloudTimetables = cloud.timetables || [];

    const mergedTimetables: TimetableData[] = [];

    const allIds = Array.from(new Set([
      ...localTimetables.map(t => t.id),
      ...cloudTimetables.map(t => t.id)
    ]));

    for (const id of allIds) {
      const l = localTimetables.find(t => t.id === id);
      const c = cloudTimetables.find(t => t.id === id);

      if (l && c) {
        // Exists in both: choose the one with the newer updatedAt timestamp
        const lTime = new Date(l.updatedAt || 0).getTime();
        const cTime = new Date(c.updatedAt || 0).getTime();
        if (cTime > lTime) {
          mergedTimetables.push(c);
        } else {
          mergedTimetables.push(l);
        }
      } else if (l) {
        // Exists only in local
        // Keep it if local snapshot is newer than or equal to cloud (it was created locally)
        // Drop it if cloud snapshot is newer (it was deleted in the cloud)
        if (localTime >= cloudTime) {
          mergedTimetables.push(l);
        }
      } else if (c) {
        // Exists only in cloud
        // Keep it if cloud snapshot is newer (it was created in the cloud)
        // Drop it if local snapshot is newer (it was deleted locally)
        if (cloudTime > localTime) {
          mergedTimetables.push(c);
        }
      }
    }

    const finalUpdatedAt = new Date(Math.max(localTime, cloudTime)).toISOString();

    return {
      id: 'default',
      activeTimetableId: mergedTimetables.some(t => t.id === activeTimetableId)
        ? activeTimetableId
        : (mergedTimetables[0]?.id || ''),
      timetables: mergedTimetables,
      updatedAt: finalUpdatedAt,
    };
  }

  async syncPendingChanges(): Promise<void> {
    await syncQueue.flush();
  }
}

export const syncEngine = new StudyFlowSyncEngine();
