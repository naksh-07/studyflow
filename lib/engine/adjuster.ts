import { ScheduleItem, EngineSession, AdjustOptions, GenerateOptions } from './types';
import { timeToMinutes, getDuration, addMinutes } from './time';
import { insertBreaks } from './breaks';
import { DEFAULT_DEEP_WORK_MIN_DURATION, MIN_SESSION_DURATION } from './constants';

export function adjustTodaySchedule(
  items: ScheduleItem[],
  adjustOptions: AdjustOptions,
  generateOptions: GenerateOptions & { bedTime?: string }
): ScheduleItem[] {
  // Filter out completed and skipped sessions, but keep them in the result intact?
  // Usually, completed and skipped sessions are in the past and immutable.
  // Wait, if we woke up late, the first planned session is shifted to currentTime.
  
  const pastItems = items.filter(item => 'status' in item && (item.status === 'completed' || item.status === 'skipped'));
  let remainingSessions = items.filter(item => 'status' in item && item.status === 'planned') as EngineSession[];
  
  if (remainingSessions.length === 0) {
    return items; // Nothing to adjust
  }

  const bedTimeMinutes = generateOptions.bedTime ? timeToMinutes(generateOptions.bedTime) : timeToMinutes('23:59');
  let currentTimeMins = timeToMinutes(adjustOptions.currentTime);
  
  const deepWorkMin = generateOptions.deepWorkMinDuration ?? DEFAULT_DEEP_WORK_MIN_DURATION;

  // Calculate total required time including breaks (roughly)
  // We can simulate it by laying it out
  let newItems = layoutSessions(remainingSessions, adjustOptions.currentTime, generateOptions);
  
  let endItem = newItems[newItems.length - 1];
  let endTimeMins = timeToMinutes(endItem.endTime!);
  
  // Need to compress or drop if endTime > bedTime
  while (endTimeMins > bedTimeMinutes && remainingSessions.length > 0) {
    const overage = endTimeMins - bedTimeMinutes;
    
    // Try to compress first
    let compressableTime = 0;
    for (const session of remainingSessions) {
      const minDur = session.isDeepWork ? deepWorkMin : MIN_SESSION_DURATION;
      if (session.durationMinutes > minDur) {
        compressableTime += (session.durationMinutes - minDur);
      }
    }
    
    if (compressableTime >= overage) {
      // Compress proportionally
      let remainingOverage = overage;
      for (let i = remainingSessions.length - 1; i >= 0 && remainingOverage > 0; i--) {
        const session = remainingSessions[i];
        const minDur = session.isDeepWork ? deepWorkMin : MIN_SESSION_DURATION;
        if (session.durationMinutes > minDur) {
          const canCompress = session.durationMinutes - minDur;
          const compressBy = Math.min(canCompress, remainingOverage);
          session.durationMinutes -= compressBy;
          remainingOverage -= compressBy;
        }
      }
    } else {
      // Compress maximally
      for (const session of remainingSessions) {
        const minDur = session.isDeepWork ? deepWorkMin : MIN_SESSION_DURATION;
        if (session.durationMinutes > minDur) {
          session.durationMinutes = minDur;
        }
      }
      
      // Drop lowest priority
      // priority 3 is lowest, 1 is highest. If same priority, drop the ones scheduled later first.
      // Let's refine this: remainingSessions is in chronological order before sorting.
      // We can map them with their index.
      const withIndex = remainingSessions.map((s, idx) => ({ s, idx }));
      withIndex.sort((a, b) => {
        const pA = a.s.priority ?? 2;
        const pB = b.s.priority ?? 2;
        if (pA !== pB) return pB - pA; // 3 comes before 1
        return b.idx - a.idx; // Later index comes first
      });
      
      const droppedId = withIndex[0].s.id;
      
      // Restore original order by filtering the initial chronological array
      const originalOrder = items.filter(i => 'status' in i && i.status === 'planned') as EngineSession[];
      remainingSessions = originalOrder.filter(s => s.id !== droppedId && remainingSessions.some(r => r.id === s.id));
    }
    
    newItems = layoutSessions(remainingSessions, adjustOptions.currentTime, generateOptions);
    if (newItems.length > 0) {
      endItem = newItems[newItems.length - 1];
      endTimeMins = timeToMinutes(endItem.endTime!);
    } else {
      break;
    }
  }

  // Combine past items and new items
  // Note: We need to make sure we don't duplicate breaks from the past
  return [...pastItems, ...newItems];
}

function layoutSessions(sessions: EngineSession[], startTime: string, options: GenerateOptions): ScheduleItem[] {
  // Use a dummy generator with the current time as wakeUpTime to reuse logic
  // We can just use insertBreaks
  return insertBreaks(sessions, { ...options, wakeUpTime: startTime });
}
