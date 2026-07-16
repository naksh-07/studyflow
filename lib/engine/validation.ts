import { ScheduleItem } from './types';
import { timeToMinutes } from './time';

export function validateSchedule(items: ScheduleItem[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!items || items.length === 0) {
    return { valid: true, errors };
  }

  let previousEndTime = -1;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    if (!item.startTime || !item.endTime) {
      errors.push(`Item at index ${i} is missing startTime or endTime.`);
      continue;
    }

    const startMins = timeToMinutes(item.startTime);
    const endMins = timeToMinutes(item.endTime);

    if (startMins >= endMins) {
      errors.push(`Item at index ${i} has invalid duration (startTime >= endTime).`);
    }

    if (previousEndTime !== -1 && startMins < previousEndTime) {
      errors.push(`Item at index ${i} overlaps with previous item (starts before previous ends).`);
    }

    previousEndTime = endMins;
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function isDayCompleted(items: ScheduleItem[]): boolean {
  if (items.length === 0) return false;
  
  // Day is completed if there are no sessions left that are 'planned'
  return !items.some(item => 'status' in item && item.status === 'planned');
}
