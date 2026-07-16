import { EngineSession, GenerateOptions, ScheduleItem } from './types';
import { recurrenceEngine } from './recurrence';

export function generateTodaySchedule(
  originalSessions: EngineSession[],
  options: GenerateOptions,
  dateStr?: string,
  timezone?: string
): ScheduleItem[] {
  const targetDate = dateStr || new Date().toISOString().slice(0, 10);
  const targetTimezone = timezone || 'UTC';
  return recurrenceEngine.generateOccurrences(originalSessions, targetDate, options, targetTimezone);
}
