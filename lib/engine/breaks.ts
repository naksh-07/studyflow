import { ScheduleItem, BreakBlock, GenerateOptions, EngineSession } from './types';
import { DEFAULT_BREAK_INTERVAL, DEFAULT_BREAK_DURATION } from './constants';
import { addMinutes, timeToMinutes } from './time';

export function insertBreaks(
  items: ScheduleItem[],
  options: GenerateOptions
): ScheduleItem[] {
  const result: ScheduleItem[] = [];
  const breakInterval = options.breakInterval ?? DEFAULT_BREAK_INTERVAL;
  const breakDuration = options.breakDuration ?? DEFAULT_BREAK_DURATION;

  let continuousStudyTime = 0;
  let currentTime = options.wakeUpTime;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if ('isBreak' in item || 'isFreeTime' in item) {
      // Just adjust times for existing breaks/free time if needed, or assume they are fixed
      const duration = item.durationMinutes;
      const startTime = currentTime;
      const endTime = addMinutes(startTime, duration);
      
      result.push({
        ...item,
        startTime,
        endTime
      } as ScheduleItem);
      
      currentTime = endTime;
      continuousStudyTime = 0;
      continue;
    }

    const session = item as EngineSession;
    
    // Check if we need a break BEFORE this session starts
    // (e.g. if we are already at or over the break interval)
    if (continuousStudyTime >= breakInterval && result.length > 0) {
      const breakStartTime = currentTime;
      const breakEndTime = addMinutes(currentTime, breakDuration);
      result.push({
        id: crypto.randomUUID(),
        isBreak: true,
        startTime: breakStartTime,
        endTime: breakEndTime,
        durationMinutes: breakDuration
      });
      currentTime = breakEndTime;
      continuousStudyTime = 0;
    }

    const sessionStart = currentTime;
    const sessionEnd = addMinutes(sessionStart, session.durationMinutes);

    result.push({
      ...session,
      startTime: sessionStart,
      endTime: sessionEnd
    });

    currentTime = sessionEnd;
    continuousStudyTime += session.durationMinutes;
  }
  
  return result;
}
