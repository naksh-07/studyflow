import { RecurrenceRule, ScheduleException } from './recurrence';

export type SessionStatus = 'planned' | 'completed' | 'skipped';

export interface EngineSession {
  id: string;
  timetableId?: string | null;
  todayScheduleId?: string | null;
  subjectId: string | null;
  startTime: string | null; // HH:mm format
  endTime: string | null; // HH:mm format
  durationMinutes: number;
  status: SessionStatus;
  priority?: number; // 1 (highest) to 3 (lowest) - defaulting to 2 if not present
  isDeepWork?: boolean;
  recurrenceRule?: RecurrenceRule;
  exceptions?: ScheduleException[];
}

export interface BreakBlock {
  id: string;
  isBreak: true;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number;
}

export interface FreeTimeBlock {
  id: string;
  isFreeTime: true;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

export type ScheduleItem = EngineSession | BreakBlock | FreeTimeBlock;

export interface EngineState {
  todayScheduleId: string | null;
  date: string | null;
  items: ScheduleItem[];
  isDayCompleted: boolean;
}

export interface ProgressState {
  totalPlannedMinutes: number;
  completedMinutes: number;
  skippedMinutes: number;
  percentage: number;
}

export interface GenerateOptions {
  wakeUpTime: string; // HH:mm
  deepWorkMinDuration?: number; // minutes
  breakInterval?: number; // minutes
  breakDuration?: number; // minutes
}

export interface AdjustOptions {
  currentTime: string; // HH:mm
  preserveOrder?: boolean;
}
