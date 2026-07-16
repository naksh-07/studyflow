import { ScheduleItem, EngineSession, ProgressState } from './types';

export function calculateProgress(items: ScheduleItem[]): ProgressState {
  let totalPlannedMinutes = 0;
  let completedMinutes = 0;
  let skippedMinutes = 0;

  for (const item of items) {
    if ('status' in item) {
      const session = item as EngineSession;
      totalPlannedMinutes += session.durationMinutes;
      
      if (session.status === 'completed') {
        completedMinutes += session.durationMinutes;
      } else if (session.status === 'skipped') {
        skippedMinutes += session.durationMinutes;
      }
    }
  }

  const percentage = totalPlannedMinutes > 0 
    ? Math.round((completedMinutes / totalPlannedMinutes) * 100) 
    : 0;

  return {
    totalPlannedMinutes,
    completedMinutes,
    skippedMinutes,
    percentage
  };
}
