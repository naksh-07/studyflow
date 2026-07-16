import { EngineSession } from './types';
import { getDuration, timeToMinutes } from './time';
import { DEFAULT_DEEP_WORK_MIN_DURATION } from './constants';
import { RecurrenceRule, ScheduleException } from './recurrence';

export interface TimetableInputSession {
  id?: string;
  subjectId: string;
  startTime: string;
  recurrenceRule?: RecurrenceRule;
  exceptions?: ScheduleException[];
}

export interface BuildOriginalTimetableOptions {
  sleepTime: string;
  deepWorkMinDuration?: number;
}

export function buildOriginalTimetable(
  sessions: TimetableInputSession[],
  options: BuildOriginalTimetableOptions
): EngineSession[] {
  const deepWorkMinDuration = options.deepWorkMinDuration ?? DEFAULT_DEEP_WORK_MIN_DURATION;
  const sortedSessions = [...sessions].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  return sortedSessions.map((session, index) => {
    const nextStartTime = sortedSessions[index + 1]?.startTime ?? options.sleepTime;
    const durationMinutes = getDuration(session.startTime, nextStartTime);

    return {
      id: session.id ?? crypto.randomUUID(),
      subjectId: session.subjectId,
      startTime: session.startTime,
      endTime: null,
      durationMinutes,
      status: 'planned',
      priority: index + 1,
      isDeepWork: durationMinutes >= deepWorkMinDuration,
      recurrenceRule: session.recurrenceRule,
      exceptions: session.exceptions,
    } as any;
  });
}
