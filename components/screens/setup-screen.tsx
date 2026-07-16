import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, Calendar } from "lucide-react";
import { useEngineStore } from "@/store/engine-store";

interface SetupScreenProps {
  timetableId?: string; // Specify target timetable ID to edit, or "new" to create one
  onCancel: () => void;
}

interface SetupSubject {
  id: string;
  name: string;
  time: string;
  repeatWeekly: boolean;
  daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, etc.
  frequency: 'once' | 'daily' | 'weekly' | 'weekdays' | 'monthly' | 'yearly' | 'custom_days' | 'custom_weeks';
  interval: number;
  startDate: string;
  until?: string;
  showAdvanced?: boolean;
}

export function SetupScreen({ timetableId, onCancel }: SetupScreenProps) {
  const saveTimetable = useEngineStore((state) => state.saveTimetable);
  const createTimetable = useEngineStore((state) => state.createTimetable);
  const updateTimetableName = useEngineStore((state) => state.updateTimetableName);
  const refreshTodaySchedule = useEngineStore((state) => state.refreshTodaySchedule);
  const activeTimetableId = useEngineStore((state) => state.activeTimetableId);
  const timetables = useEngineStore((state) => state.timetables);
  const errorMessage = useEngineStore((state) => state.errorMessage);

  const currentDayOfWeek = React.useMemo(() => new Date().getDay(), []);
  const todayStr = React.useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Determine if we are editing an existing timetable or creating a new one
  const isNew = timetableId === "new";
  const editingId = isNew ? null : (timetableId || activeTimetableId);
  const targetTimetable = editingId ? timetables.find((t) => t.id === editingId) : null;

  const [timetableName, setTimetableName] = React.useState(() => {
    if (isNew) return "New Timetable";
    return targetTimetable?.name || "Daily Timetable";
  });

  const [subjects, setSubjects] = React.useState<SetupSubject[]>(() => {
    if (targetTimetable && targetTimetable.originalSessions.length > 0) {
      return targetTimetable.originalSessions.map((s) => {
        const rule = s.recurrenceRule;
        return {
          id: s.id || crypto.randomUUID(),
          name: s.subjectId || "",
          time: s.startTime || "00:00",
          repeatWeekly: rule ? rule.frequency !== 'once' : true,
          daysOfWeek: rule?.daysOfWeek || [currentDayOfWeek],
          frequency: rule?.frequency || 'weekly',
          interval: rule?.interval || 1,
          startDate: rule?.startDate || todayStr,
          until: rule?.until,
          showAdvanced: false,
        };
      });
    } else {
      return [
        {
          id: crypto.randomUUID(),
          name: "",
          time: targetTimetable?.settings.wakeTime || "06:00",
          repeatWeekly: true,
          daysOfWeek: [currentDayOfWeek],
          frequency: 'weekly',
          interval: 1,
          startDate: todayStr,
          showAdvanced: false,
        },
      ];
    }
  });

  const [wake, setWake] = React.useState(() => {
    return targetTimetable?.settings.wakeTime || "06:00";
  });
  const [sleep, setSleep] = React.useState(() => {
    return targetTimetable?.settings.sleepTime || "23:00";
  });

  const addSubject = () => {
    setSubjects([
      ...subjects,
      {
        id: crypto.randomUUID(),
        name: "",
        time: wake,
        repeatWeekly: true,
        daysOfWeek: [currentDayOfWeek],
        frequency: 'weekly',
        interval: 1,
        startDate: todayStr,
        showAdvanced: false,
      },
    ]);
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const updateSubject = <K extends keyof SetupSubject>(index: number, field: K, value: SetupSubject[K]) => {
    const newSubjects = [...subjects];
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setSubjects(newSubjects);
  };

  const handleSave = async () => {
    const mappedSubjects = subjects.map((sub) => {
      let frequency = sub.frequency;
      if (!sub.repeatWeekly) {
        frequency = 'once';
      } else if (sub.repeatWeekly && frequency === 'once') {
        frequency = 'weekly';
      }

      return {
        id: sub.id,
        name: sub.name,
        time: sub.time,
        recurrenceRule: {
          id: crypto.randomUUID(),
          frequency,
          daysOfWeek: (frequency === 'weekly' || frequency === 'custom_weeks' || frequency === 'weekdays') ? sub.daysOfWeek : undefined,
          interval: sub.interval,
          startDate: sub.startDate,
          until: sub.until,
        },
      };
    });

    if (isNew) {
      const newId = await createTimetable(timetableName, mappedSubjects, { wakeTime: wake, sleepTime: sleep });
      if (newId) {
        await refreshTodaySchedule();
        onCancel();
      }
    } else {
      const didSave = await saveTimetable(mappedSubjects, { wakeTime: wake, sleepTime: sleep });
      if (didSave && editingId) {
        await updateTimetableName(editingId, timetableName);
        await refreshTodaySchedule();
        onCancel();
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col animate-in fade-in duration-300">
      <header className="h-20 flex items-center justify-between px-6 sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b">
        <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground" onClick={onCancel}>
          Cancel
        </Button>
        <h1 className="text-lg font-semibold tracking-tight">
          {isNew ? "Create Timetable" : "Edit Timetable"}
        </h1>
        <div className="w-[60px]"></div>
      </header>

      <main id="main-content" className="flex-1 w-full max-w-md mx-auto px-6 py-8 space-y-8 pb-32">
        {/* Timetable Name input */}
        <section className="space-y-2">
          <label htmlFor="timetable-name-input" className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">
            Timetable Name
          </label>
          <input
            id="timetable-name-input"
            type="text"
            value={timetableName}
            onChange={(e) => setTimetableName(e.target.value)}
            className="w-full bg-card p-4 px-5 rounded-2xl border shadow-sm text-base font-medium outline-none focus-visible:ring-2 ring-primary/20 transition-all"
            placeholder="e.g. 📚 College, 🏠 Home Study"
          />
        </section>

        {/* Wake and Sleep times */}
        <section className="space-y-4">
          <div className="flex justify-between items-center bg-card p-4 px-5 rounded-2xl border shadow-sm focus-within:ring-2 ring-primary/20 transition-all">
            <label htmlFor="wake-time" className="font-medium">Wake Time</label>
            <input id="wake-time" aria-label="Wake Time" type="time" value={wake} onChange={e => setWake(e.target.value)} className="bg-transparent font-mono text-lg outline-none text-right cursor-pointer" />
          </div>
          <div className="flex justify-between items-center bg-card p-4 px-5 rounded-2xl border shadow-sm focus-within:ring-2 ring-primary/20 transition-all">
            <label htmlFor="sleep-time" className="font-medium">Sleep Time</label>
            <input id="sleep-time" aria-label="Sleep Time" type="time" value={sleep} onChange={e => setSleep(e.target.value)} className="bg-transparent font-mono text-lg outline-none text-right cursor-pointer" />
          </div>
        </section>

        {/* Study Sessions list */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2 mb-2">Study Sessions</h2>
          {errorMessage && (
            <p className="text-sm text-destructive font-medium px-2" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="space-y-4">
            {subjects.map((subject, i) => (
              <div key={subject.id} className="bg-card p-5 rounded-2xl border shadow-sm space-y-4 transition-all focus-within:ring-2 ring-primary/20">
                <div className="flex justify-between items-center gap-4">
                  <input
                    aria-label="Subject Name"
                    type="text"
                    value={subject.name}
                    onChange={(e) => updateSubject(i, "name", e.target.value)}
                    className="bg-transparent font-medium flex-1 outline-none min-w-0 text-base"
                    placeholder="Subject Name"
                  />
                  <input
                    aria-label="Session Time"
                    type="time"
                    value={subject.time}
                    onChange={(e) => updateSubject(i, "time", e.target.value)}
                    className="bg-transparent font-mono outline-none text-muted-foreground cursor-pointer text-base"
                  />
                  <button
                    className="text-muted-foreground hover:text-destructive h-10 w-10 flex items-center justify-center -mr-2 rounded-full hover:bg-muted/80 transition-colors"
                    onClick={() => removeSubject(i)}
                    aria-label="Remove subject"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="pt-2 border-t border-border/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subject.repeatWeekly}
                        onChange={(e) => updateSubject(i, "repeatWeekly", e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                      />
                      Repeat Session
                    </label>
                    <button
                      type="button"
                      onClick={() => updateSubject(i, "showAdvanced", !subject.showAdvanced)}
                      className="text-xs text-primary font-medium hover:underline"
                    >
                      {subject.showAdvanced ? "Hide Advanced" : "Advanced Settings"}
                    </button>
                  </div>

                  {subject.repeatWeekly && !subject.showAdvanced && (
                    <div className="flex items-center gap-1.5 pt-1">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayName, idx) => {
                        const isSelected = subject.daysOfWeek.includes(idx);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              const days = subject.daysOfWeek.includes(idx)
                                ? subject.daysOfWeek.filter((d) => d !== idx)
                                : [...subject.daysOfWeek, idx];
                              updateSubject(i, "daysOfWeek", days);
                            }}
                            className={`h-8 flex-1 rounded-lg text-xs font-semibold transition-all ${
                              isSelected
                                ? "bg-primary text-primary-foreground shadow-sm font-bold"
                                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                            }`}
                          >
                            {dayName}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {subject.showAdvanced && (
                    <div className="space-y-3 p-3 bg-muted/30 rounded-xl border border-border/50 text-sm animate-in fade-in duration-200">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Frequency</label>
                        <select
                          value={subject.frequency}
                          onChange={(e) => updateSubject(i, "frequency", e.target.value as any)}
                          className="bg-background border rounded-lg h-9 px-2 text-sm outline-none"
                        >
                          <option value="once">One-time</option>
                          <option value="daily">Daily</option>
                          <option value="weekdays">Weekdays</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                          <option value="custom_days">Every X Days</option>
                          <option value="custom_weeks">Every X Weeks</option>
                        </select>
                      </div>

                      {(subject.frequency === 'weekly' || subject.frequency === 'custom_weeks' || subject.frequency === 'weekdays') && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Days of Week</label>
                          <div className="flex items-center gap-1">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayName, idx) => {
                              const isSelected = subject.daysOfWeek.includes(idx);
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    const days = subject.daysOfWeek.includes(idx)
                                      ? subject.daysOfWeek.filter((d) => d !== idx)
                                      : [...subject.daysOfWeek, idx];
                                    updateSubject(i, "daysOfWeek", days);
                                  }}
                                  className={`h-8 flex-1 rounded-lg text-xs font-semibold transition-all ${
                                    isSelected
                                      ? "bg-primary text-primary-foreground font-bold shadow-sm"
                                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                                  }`}
                                >
                                  {dayName}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {(subject.frequency.startsWith('custom_') || subject.frequency === 'daily' || subject.frequency === 'weekly' || subject.frequency === 'monthly') && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Interval</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              value={subject.interval}
                              onChange={(e) => updateSubject(i, "interval", parseInt(e.target.value, 10) || 1)}
                              className="bg-background border rounded-lg h-9 w-16 px-2 text-center text-sm outline-none"
                            />
                            <span className="text-xs text-muted-foreground font-medium">
                              {subject.frequency === 'custom_days' || subject.frequency === 'daily' ? 'day(s)' : ''}
                              {subject.frequency === 'custom_weeks' || subject.frequency === 'weekly' ? 'week(s)' : ''}
                              {subject.frequency === 'monthly' ? 'month(s)' : ''}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Starts
                          </label>
                          <input
                            type="date"
                            value={subject.startDate}
                            onChange={(e) => updateSubject(i, "startDate", e.target.value)}
                            className="bg-background border rounded-lg h-9 px-2 text-xs outline-none cursor-pointer"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Ends (Optional)
                          </label>
                          <input
                            type="date"
                            value={subject.until || ""}
                            onChange={(e) => updateSubject(i, "until", e.target.value || undefined)}
                            className="bg-background border rounded-lg h-9 px-2 text-xs outline-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full border-dashed h-14 rounded-2xl text-muted-foreground hover:text-foreground mt-4 font-medium" onClick={addSubject}>
            <Plus className="h-5 w-5 mr-2" />
            Add Subject
          </Button>
        </section>
      </main>

      <footer className="fixed bottom-0 inset-x-0 p-6 bg-background/80 backdrop-blur-md border-t z-40">
        <div className="max-w-md mx-auto">
          <Button size="lg" className="w-full shadow-sm font-semibold text-base h-12 rounded-xl" onClick={() => void handleSave()}>
            Save Timetable
          </Button>
        </div>
      </footer>
    </div>
  );
}
