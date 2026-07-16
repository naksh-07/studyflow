import { describe, it, expect } from 'vitest';
import { 
  generateTodaySchedule, 
  adjustTodaySchedule, 
  completeSession, 
  skipSession, 
  calculateProgress,
  isDayCompleted,
  resetDay,
  validateSchedule
} from '../index';
import { EngineSession, GenerateOptions, ScheduleItem, BreakBlock, FreeTimeBlock } from '../types';

describe('Scheduling Engine', () => {
  const sampleSessions: EngineSession[] = [
    {
      id: 's1',
      subjectId: 'math',
      startTime: null,
      endTime: null,
      durationMinutes: 60,
      status: 'planned',
      isDeepWork: true,
      priority: 1
    },
    {
      id: 's2',
      subjectId: 'physics',
      startTime: null,
      endTime: null,
      durationMinutes: 45,
      status: 'planned',
      isDeepWork: false,
      priority: 2
    },
    {
      id: 's3',
      subjectId: 'history',
      startTime: null,
      endTime: null,
      durationMinutes: 30,
      status: 'planned',
      isDeepWork: false,
      priority: 3
    }
  ];

  const defaultOptions: GenerateOptions = {
    wakeUpTime: '08:00',
    breakInterval: 60,
    breakDuration: 10,
    deepWorkMinDuration: 60
  };

  it('generates a normal day schedule with breaks', () => {
    const items = generateTodaySchedule(sampleSessions, defaultOptions);
    
    expect(items.length).toBe(4);
    expect((items[0] as EngineSession).subjectId).toBe('math');
    expect('isBreak' in items[1]).toBe(true);
    expect((items[1] as BreakBlock).startTime).toBe('09:00');
    expect((items[2] as EngineSession).subjectId).toBe('physics');
    expect((items[2] as EngineSession).startTime).toBe('09:10');
    expect((items[3] as EngineSession).subjectId).toBe('history');
    
    const valid = validateSchedule(items);
    expect(valid.valid).toBe(true);
  });

  it('adjusts schedule for a late wake (Just Woke)', () => {
    const initial = generateTodaySchedule(sampleSessions, defaultOptions);
    const adjusted = adjustTodaySchedule(initial, { currentTime: '09:00' }, { ...defaultOptions, bedTime: '23:59' });
    
    expect((adjusted[0] as EngineSession).startTime).toBe('09:00');
    expect('isBreak' in adjusted[1]).toBe(true);
    expect((adjusted[1] as BreakBlock).startTime).toBe('10:00');
    
    const valid = validateSchedule(adjusted);
    expect(valid.valid).toBe(true);
  });

  it('compresses or drops sessions for deep work protection', () => {
    const initial = generateTodaySchedule(sampleSessions, defaultOptions);
    const adjusted = adjustTodaySchedule(initial, { currentTime: '08:00' }, { ...defaultOptions, bedTime: '09:50' });
    
    expect(adjusted.length).toBeGreaterThan(0);
    const s1 = adjusted.find(i => (i as EngineSession).subjectId === 'math') as EngineSession;
    expect(s1.durationMinutes).toBe(60); 
  });

  it('handles skip session', () => {
    const initial = generateTodaySchedule(sampleSessions, defaultOptions);
    const s1_id = initial.find(i => (i as EngineSession).subjectId === 'math')!.id;
    const skipped = skipSession(initial, s1_id, '08:00', { ...defaultOptions, bedTime: '23:59' });
    
    const s1 = skipped.find(i => i.id === s1_id) as EngineSession;
    expect(s1.status).toBe('skipped');
    
    const s2 = skipped.find(i => (i as EngineSession).subjectId === 'physics') as EngineSession;
    expect(s2.startTime).toBe('08:00');
  });

  it('handles complete session and generates free time if early', () => {
    const initial = generateTodaySchedule(sampleSessions, defaultOptions);
    const s1_id = initial.find(i => (i as EngineSession).subjectId === 'math')!.id;
    const completed = completeSession(initial, s1_id, '08:45', { ...defaultOptions, bedTime: '23:59' });
    
    const s1 = completed.find(i => i.id === s1_id) as EngineSession;
    expect(s1.status).toBe('completed');
    
    const freeTime = completed.find(i => 'isFreeTime' in i) as FreeTimeBlock;
    expect(freeTime).toBeDefined();
    expect(freeTime.durationMinutes).toBe(15);
    expect(freeTime.startTime).toBe('08:45');
    expect(freeTime.endTime).toBe('09:00');
  });

  it('calculates progress', () => {
    let items = generateTodaySchedule(sampleSessions, defaultOptions);
    let prog = calculateProgress(items);
    expect(prog.totalPlannedMinutes).toBe(135);
    expect(prog.completedMinutes).toBe(0);
    
    const s1_id = items.find(i => (i as EngineSession).subjectId === 'math')!.id;
    items = completeSession(items, s1_id, '09:00', defaultOptions);
    prog = calculateProgress(items);
    expect(prog.completedMinutes).toBe(60);
    expect(prog.percentage).toBe(Math.round((60/135)*100));
  });

  it('detects day completed', () => {
    let items = generateTodaySchedule(sampleSessions, defaultOptions);
    expect(isDayCompleted(items)).toBe(false);
    
    const s1_id = items.find(i => (i as EngineSession).subjectId === 'math')!.id;
    items = completeSession(items, s1_id, '09:00', defaultOptions);
    
    const s2_id = items.find(i => (i as EngineSession).subjectId === 'physics')!.id;
    items = completeSession(items, s2_id, '10:00', defaultOptions);
    
    const s3_id = items.find(i => (i as EngineSession).subjectId === 'history')!.id;
    items = completeSession(items, s3_id, '11:00', defaultOptions);
    
    expect(isDayCompleted(items)).toBe(true);
  });
  
  it('resets day', () => {
    const fresh = resetDay(sampleSessions, defaultOptions);
    expect(fresh.length).toBe(4);
    expect((fresh[0] as EngineSession).status).toBe('planned');
  });
});
