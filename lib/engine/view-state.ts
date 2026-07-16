import { AppScreenState } from './view-types';
import { EngineSession, ProgressState, ScheduleItem } from './types';
import { calculateProgress } from './progress';
import { isDayCompleted } from './validation';
import { timeToMinutes } from './time';

export interface SessionProgressState extends ProgressState {
  completedSessions: number;
  totalSessions: number;
}

export interface EngineViewState {
  appState: AppScreenState;
  currentItem: ScheduleItem | null;
  nextSession: EngineSession | null;
  progress: SessionProgressState;
}

function itemWindow(item: ScheduleItem) {
  if (!item.startTime || !item.endTime) {
    return null;
  }

  return {
    start: timeToMinutes(item.startTime),
    end: timeToMinutes(item.endTime),
  };
}

export function deriveCurrentItem(items: ScheduleItem[], currentTime?: string): ScheduleItem | null {
  if (!currentTime) {
    return items.find((item) => {
      if ('status' in item) {
        return item.status === 'planned';
      }

      return true;
    }) ?? null;
  }

  const now = timeToMinutes(currentTime);
  const activeItem = items.find((item) => {
    const window = itemWindow(item);
    return window ? now >= window.start && now < window.end : false;
  });

  if (activeItem) {
    return activeItem;
  }

  const nextUpcomingItem = items.find((item) => {
    const window = itemWindow(item);

    if (!window) {
      return false;
    }

    if ('status' in item) {
      return item.status === 'planned' && now < window.start;
    }

    return now < window.start;
  });

  if (nextUpcomingItem) {
    return nextUpcomingItem;
  }

  return items.find((item) => 'status' in item && item.status === 'planned') ?? null;
}

export function deriveNextSession(
  items: ScheduleItem[],
  currentItem: ScheduleItem | null = deriveCurrentItem(items)
): EngineSession | null {
  let foundCurrent = currentItem === null;

  for (const item of items) {
    if (item === currentItem) {
      foundCurrent = true;
      continue;
    }

    if (foundCurrent && 'status' in item && item.status === 'planned') {
      return item;
    }
  }

  return null;
}

export function calculateSessionProgress(items: ScheduleItem[]): SessionProgressState {
  const minuteProgress = calculateProgress(items);
  const sessions = items.filter((item): item is EngineSession => 'status' in item);
  const completedSessions = sessions.filter((session) => session.status === 'completed').length;

  return {
    ...minuteProgress,
    completedSessions,
    totalSessions: sessions.length,
  };
}

export function deriveAppState(items: ScheduleItem[], hasTimetable: boolean, currentTime?: string): AppScreenState {
  if (!hasTimetable) {
    return 'empty';
  }

  if (isDayCompleted(items)) {
    return 'completed';
  }

  const currentItem = deriveCurrentItem(items, currentTime);

  if (!currentItem) {
    return items.length > 0 ? 'completed' : 'empty';
  }

  if ('isBreak' in currentItem) {
    return 'break';
  }

  if ('isFreeTime' in currentItem) {
    return 'freetime';
  }

  return 'study';
}

export function deriveEngineViewState(
  items: ScheduleItem[],
  hasTimetable: boolean,
  currentTime?: string
): EngineViewState {
  const currentItem = deriveCurrentItem(items, currentTime);

  return {
    appState: deriveAppState(items, hasTimetable, currentTime),
    currentItem,
    nextSession: deriveNextSession(items, currentItem),
    progress: calculateSessionProgress(items),
  };
}

export function formatRemainingTime(item: ScheduleItem | null, currentTime: string): string {
  if (!item?.startTime || !item.endTime) {
    return '0m';
  }

  const currentMinutes = timeToMinutes(currentTime);
  const targetMinutes =
    currentMinutes < timeToMinutes(item.startTime)
      ? timeToMinutes(item.startTime)
      : timeToMinutes(item.endTime);
  const remainingMinutes = Math.max(0, targetMinutes - currentMinutes);

  if (remainingMinutes >= 60) {
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  return `${remainingMinutes}m`;
}
