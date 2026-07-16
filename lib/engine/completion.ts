import { ScheduleItem, EngineSession, AdjustOptions, GenerateOptions, FreeTimeBlock } from './types';
import { adjustTodaySchedule } from './adjuster';
import { addMinutes, timeToMinutes } from './time';

export function completeSession(
  items: ScheduleItem[],
  sessionId: string,
  currentTime: string,
  options: GenerateOptions & { bedTime?: string }
): ScheduleItem[] {
  // Mark the session as completed
  const newItems = items.map(item => {
    if ('status' in item && item.id === sessionId) {
      return { ...item, status: 'completed' as const };
    }
    return item;
  });

  // Calculate free time if they finished earlier than expected
  // But wait, the session end time is recorded as the expected end time?
  // Let's assume currentTime is when they clicked complete.
  const completedItem = items.find(i => i.id === sessionId) as EngineSession;
  
  if (completedItem && completedItem.endTime) {
    const expectedEnd = timeToMinutes(completedItem.endTime);
    const actualEnd = timeToMinutes(currentTime);
    
    if (actualEnd < expectedEnd) {
      // Finished early, generate free time
      const freeTimeDuration = expectedEnd - actualEnd;
      // We can insert a Free Time block right after this session
      const index = newItems.findIndex(i => i.id === sessionId);
      newItems.splice(index + 1, 0, {
        id: crypto.randomUUID(),
        isFreeTime: true,
        startTime: currentTime,
        endTime: completedItem.endTime,
        durationMinutes: freeTimeDuration
      } as FreeTimeBlock);
      
      // Since we just fill the gap with free time, the rest of the schedule doesn't need to shift.
      return newItems;
    }
  }

  // If they finished late, we need to adjust the rest of the schedule
  return adjustTodaySchedule(newItems, { currentTime }, options);
}

export function skipSession(
  items: ScheduleItem[],
  sessionId: string,
  currentTime: string,
  options: GenerateOptions & { bedTime?: string }
): ScheduleItem[] {
  // Skip the session
  const newItems = items.map(item => {
    if ('status' in item && item.id === sessionId) {
      return { ...item, status: 'skipped' as const };
    }
    return item;
  });

  // Since we skipped, we shift the remaining schedule up to current time (if they skipped early)
  // or adjust based on current time.
  return adjustTodaySchedule(newItems, { currentTime }, options);
}
