import { EngineSession, GenerateOptions, ScheduleItem } from './types';
import { generateTodaySchedule } from './generator';

export function resetDay(
  originalSessions: EngineSession[],
  options: GenerateOptions,
  dateStr?: string,
  timezone?: string
): ScheduleItem[] {
  // Essentially generates a fresh schedule for today based on original timetable
  return generateTodaySchedule(originalSessions, options, dateStr, timezone);
}
