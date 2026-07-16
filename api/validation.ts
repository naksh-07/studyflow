import { StudyFlowSnapshot } from '@/storage/types';

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isValidSettings(value: unknown) {
  if (!isRecord(value)) {
    return false;
  }

  return timePattern.test(String(value.wakeTime)) && timePattern.test(String(value.sleepTime));
}

function isValidSession(value: unknown) {
  if (!isRecord(value)) {
    return false;
  }

  const status = value.status;

  return (
    typeof value.id === 'string' &&
    (typeof value.subjectId === 'string' || value.subjectId === null) &&
    (typeof value.startTime === 'string' || value.startTime === null) &&
    (typeof value.endTime === 'string' || value.endTime === null) &&
    typeof value.durationMinutes === 'number' &&
    (status === 'planned' || status === 'completed' || status === 'skipped')
  );
}

function isValidScheduleItem(value: unknown) {
  if (!isRecord(value)) {
    return false;
  }

  if ('status' in value) {
    return isValidSession(value);
  }

  return (
    (value.isBreak === true || value.isFreeTime === true) &&
    typeof value.id === 'string' &&
    typeof value.startTime === 'string' &&
    typeof value.endTime === 'string' &&
    typeof value.durationMinutes === 'number'
  );
}

export function validateSnapshot(value: unknown): StudyFlowSnapshot {
  if (!isRecord(value)) {
    throw new Error('Request body must be an object.');
  }

  if (
    value.id !== 'default' ||
    !isValidSettings(value.settings) ||
    !Array.isArray(value.originalSessions) ||
    !Array.isArray(value.todayItems) ||
    (typeof value.todayDate !== 'string' && value.todayDate !== null) ||
    typeof value.updatedAt !== 'string'
  ) {
    throw new Error('Snapshot payload is invalid.');
  }

  if (!value.originalSessions.every(isValidSession) || !value.todayItems.every(isValidScheduleItem)) {
    throw new Error('Snapshot contains invalid schedule data.');
  }

  return value as unknown as StudyFlowSnapshot;
}
