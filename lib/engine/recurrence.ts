import { EngineSession, GenerateOptions, ScheduleItem } from './types';
import { addMinutes, getDuration, timeToMinutes } from './time';
import { insertBreaks } from './breaks';

export interface RecurrenceRule {
  id: string;
  frequency: 'once' | 'daily' | 'weekly' | 'weekdays' | 'monthly' | 'yearly' | 'custom_days' | 'custom_weeks';
  interval?: number; // e.g. every X days/weeks/months
  daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startDate?: string; // YYYY-MM-DD
  until?: string; // YYYY-MM-DD
  count?: number;
}

export interface ScheduleException {
  id: string;
  scheduleBlockId: string;
  exceptionType: 'skip' | 'replace';
  originalDate: string; // YYYY-MM-DD
  replacementSubjectId?: string | null;
  replacementStartTime?: string | null;
  replacementEndTime?: string | null;
}

// Extend existing types with recurrence fields
export interface RecurrentEngineSession extends EngineSession {
  recurrenceRule?: RecurrenceRule;
  exceptions?: ScheduleException[];
}

/**
 * Checks whether a recurring session should occur on a given date (YYYY-MM-DD)
 * taking timezone into account.
 */
export function shouldOccurOnDate(
  session: RecurrentEngineSession,
  dateStr: string,
  timezone: string = 'UTC'
): boolean {
  // Parse target date
  const [yStr, mStr, dStr] = dateStr.split('-');
  const targetYear = parseInt(yStr, 10);
  const targetMonth = parseInt(mStr, 10);
  const targetDay = parseInt(dStr, 10);

  const targetDate = new Date(Date.UTC(targetYear, targetMonth - 1, targetDay));
  const targetDayOfWeek = targetDate.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  const rule = session.recurrenceRule;

  // Handle exceptions first
  if (session.exceptions) {
    const exception = session.exceptions.find((e) => e.originalDate === dateStr);
    if (exception) {
      if (exception.exceptionType === 'skip') {
        return false;
      }
      // Replacement exceptions are handled in generation time
    }
  }

  // If no rule, legacy default is to occur every day
  if (!rule) {
    return true;
  }

  // Check UNTIL date bounds
  if (rule.until) {
    const [uY, uM, uD] = rule.until.split('-');
    const untilDate = new Date(Date.UTC(parseInt(uY, 10), parseInt(uM, 10) - 1, parseInt(uD, 10)));
    if (targetDate.getTime() > untilDate.getTime()) {
      return false;
    }
  }

  // Calculate start date bounds
  const ruleStartDateStr = rule.startDate || '1970-01-01';
  const [sY, sM, sD] = ruleStartDateStr.split('-');
  const ruleStartDate = new Date(Date.UTC(parseInt(sY, 10), parseInt(sM, 10) - 1, parseInt(sD, 10)));

  if (targetDate.getTime() < ruleStartDate.getTime()) {
    return false;
  }

  const frequency = rule.frequency;
  const interval = rule.interval || 1;

  switch (frequency) {
    case 'once':
      return dateStr === ruleStartDateStr;

    case 'daily': {
      const diffTime = targetDate.getTime() - ruleStartDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays % interval === 0;
    }

    case 'weekdays':
      return [1, 2, 3, 4, 5].includes(targetDayOfWeek);

    case 'weekly': {
      const days = rule.daysOfWeek || [ruleStartDate.getUTCDay()];
      if (!days.includes(targetDayOfWeek)) {
        return false;
      }

      // Calculate week interval based on alignment of Sundays
      const ruleStartWeekDay = ruleStartDate.getUTCDay();
      const ruleStartSunday = new Date(ruleStartDate.getTime() - ruleStartWeekDay * 24 * 60 * 60 * 1000);
      const targetSunday = new Date(targetDate.getTime() - targetDayOfWeek * 24 * 60 * 60 * 1000);
      const diffWeeks = Math.round((targetSunday.getTime() - ruleStartSunday.getTime()) / (1000 * 60 * 60 * 24 * 7));

      return diffWeeks >= 0 && diffWeeks % interval === 0;
    }

    case 'monthly': {
      const ruleDay = ruleStartDate.getUTCDate();
      if (targetDay !== ruleDay) {
        return false;
      }
      const diffMonths = (targetYear - ruleStartDate.getUTCFullYear()) * 12 + (targetMonth - 1 - ruleStartDate.getUTCMonth());
      return diffMonths >= 0 && diffMonths % interval === 0;
    }

    case 'yearly': {
      const ruleMonth = ruleStartDate.getUTCMonth() + 1;
      const ruleDay = ruleStartDate.getUTCDate();
      if (targetMonth !== ruleMonth || targetDay !== ruleDay) {
        return false;
      }
      const diffYears = targetYear - ruleStartDate.getUTCFullYear();
      return diffYears >= 0 && diffYears % interval === 0;
    }

    case 'custom_days': {
      const diffTime = targetDate.getTime() - ruleStartDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays % interval === 0;
    }

    case 'custom_weeks': {
      const days = rule.daysOfWeek || [ruleStartDate.getUTCDay()];
      if (!days.includes(targetDayOfWeek)) {
        return false;
      }

      const ruleStartWeekDay = ruleStartDate.getUTCDay();
      const ruleStartSunday = new Date(ruleStartDate.getTime() - ruleStartWeekDay * 24 * 60 * 60 * 1000);
      const targetSunday = new Date(targetDate.getTime() - targetDayOfWeek * 24 * 60 * 60 * 1000);
      const diffWeeks = Math.round((targetSunday.getTime() - ruleStartSunday.getTime()) / (1000 * 60 * 60 * 24 * 7));

      return diffWeeks >= 0 && diffWeeks % interval === 0;
    }

    default:
      return true;
  }
}

/**
 * Recurrence Engine to dynamically generate occurrences for a given date
 * and manage rules and exceptions.
 */
export class RecurrenceEngine {
  /**
   * Generates timezone-aware schedule occurrences for a specific date
   */
  generateOccurrences(
    sessions: RecurrentEngineSession[],
    dateStr: string,
    options: GenerateOptions,
    timezone: string = 'UTC'
  ): ScheduleItem[] {
    // Filter sessions that occur on the specified date
    const occurringSessions = sessions.filter((s) => shouldOccurOnDate(s, dateStr, timezone));

    if (occurringSessions.length === 0) {
      return [];
    }

    // Sort chronologically by start time
    const sorted = [...occurringSessions].sort((a, b) => {
      const aTime = a.startTime || '00:00';
      const bTime = b.startTime || '00:00';
      return timeToMinutes(aTime) - timeToMinutes(bTime);
    });

    // Step 1: Calculate total available study time
    const totalAvailableStudyTime = sorted.reduce((sum, s) => sum + s.durationMinutes, 0);

    // Step 2: Attempt to satisfy every subject's Minimum Minutes / Day
    const sumMin = sorted.reduce((sum, s) => sum + (s.minimumDailyMinutes ?? 30), 0);

    if (totalAvailableStudyTime < sumMin) {
      throw new Error(`The configured minimum daily targets (${sumMin} minutes) cannot fit into the available study time (${totalAvailableStudyTime} minutes).`);
    }

    // Allocate minimum to each
    const allocations = sorted.map(s => s.minimumDailyMinutes ?? 30);

    // Step 3: If additional study time exists, continue distributing time without exceeding each subject's Maximum Minutes / Day
    let remaining = totalAvailableStudyTime - sumMin;

    if (remaining > 0) {
      const capacities = sorted.map((s, idx) => Math.max(0, (s.maximumDailyMinutes ?? 60) - allocations[idx]));
      const totalCapacity = capacities.reduce((sum, c) => sum + c, 0);

      if (totalCapacity > 0) {
        for (let idx = 0; idx < sorted.length; idx++) {
          const capacity = capacities[idx];
          if (capacity > 0) {
            let share = 0;
            if (idx === sorted.length - 1 || totalCapacity === capacity) {
              share = Math.min(remaining, capacity);
            } else {
              share = Math.min(remaining, capacity, Math.floor((capacity / totalCapacity) * (totalAvailableStudyTime - sumMin)));
            }
            allocations[idx] += share;
            remaining -= share;
          }
        }

        // Leftover cleanup due to floor/rounding
        if (remaining > 0) {
          for (let idx = 0; idx < sorted.length && remaining > 0; idx++) {
            const s = sorted[idx];
            const max = s.maximumDailyMinutes ?? 60;
            const currentAlloc = allocations[idx];
            if (currentAlloc < max) {
              const added = Math.min(remaining, max - currentAlloc);
              allocations[idx] += added;
              remaining -= added;
            }
          }
        }
      }
    }

    let currentTime = options.wakeUpTime;
    const items: ScheduleItem[] = [];

    for (let idx = 0; idx < sorted.length; idx++) {
      const session = sorted[idx];
      // Check for replacement exception
      let currentSubjectId = session.subjectId;
      let currentDuration = allocations[idx];

      if (session.exceptions) {
        const exception = session.exceptions.find((e) => e.originalDate === dateStr);
        if (exception && exception.exceptionType === 'replace') {
          if (exception.replacementSubjectId !== undefined) {
            currentSubjectId = exception.replacementSubjectId;
          }
          if (exception.replacementStartTime && exception.replacementEndTime) {
            currentDuration = getDuration(exception.replacementStartTime, exception.replacementEndTime);
          }
        }
      }

      const startTime = currentTime;
      const endTime = addMinutes(startTime, currentDuration);

      items.push({
        ...session,
        id: crypto.randomUUID(), // Ensure new unique occurrence ID
        subjectId: currentSubjectId,
        durationMinutes: currentDuration,
        startTime,
        endTime,
        status: 'planned',
      });

      currentTime = endTime;
    }

    // Insert break intervals between the sessions
    return insertBreaks(items, options);
  }

  /**
   * Helper to add/update a recurrence rule to an engine session
   */
  createRule(session: RecurrentEngineSession, rule: Omit<RecurrenceRule, 'id'>): RecurrentEngineSession {
    const newRule: RecurrenceRule = {
      ...rule,
      id: crypto.randomUUID(),
      startDate: rule.startDate || new Date().toISOString().slice(0, 10),
    };

    return {
      ...session,
      recurrenceRule: newRule,
    };
  }

  /**
   * Helper to remove recurrence (i.e. make session run once/legacy)
   */
  deleteRule(session: RecurrentEngineSession): RecurrentEngineSession {
    const { recurrenceRule, ...rest } = session;
    return rest;
  }
}

export const recurrenceEngine = new RecurrenceEngine();
