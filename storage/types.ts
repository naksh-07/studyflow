import { EngineSession, ScheduleItem } from '@/lib/engine/types';

export interface StudyFlowSettings {
  wakeTime: string;
  sleepTime: string;
  theme: 'light' | 'dark' | 'natural';
  timezone: string;
}

export interface TimetableData {
  id: string;
  name: string;
  settings: StudyFlowSettings;
  originalSessions: EngineSession[];
  todayItems: ScheduleItem[];
  todayDate: string | null;
  updatedAt: string;
}

export interface StudyFlowSnapshot {
  id: 'default';
  activeTimetableId: string;
  timetables: TimetableData[];
  updatedAt: string;
}

export type SyncOperationType = 'PUT_SETTINGS' | 'PUT_TIMETABLE' | 'PUT_TODAY' | 'SYNC_STATE';

export interface SyncOperation {
  id: string;
  type: SyncOperationType;
  payload: unknown;
  createdAt: string;
  attempts: number;
  lastError?: string;
}

export const DEFAULT_SETTINGS: StudyFlowSettings = {
  wakeTime: '06:00',
  sleepTime: '23:00',
  theme: 'natural',
  timezone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
};
