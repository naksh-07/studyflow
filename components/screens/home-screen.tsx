import * as React from "react";
import { Header } from "@/components/layout/header";
import { StudyCard } from "@/components/study/study-card";
import { NextSessionCard } from "@/components/study/next-session-card";
import { ProgressIndicator } from "@/components/study/progress-indicator";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { ConfirmationDialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState, LoadingState } from "@/components/feedback/states";
import { Card } from "@/components/ui/card";
import { useEngineStore } from "@/store/engine-store";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { Cloud, LogOut, RefreshCw, Download, Plus } from "lucide-react";
import { usePWAInstall } from "@/hooks/use-pwa-install";

export function HomeScreen() {
  const {
    appState,
    setAppState,
    currentItem,
    nextSession,
    progress,
    remainingTime,
    completeCurrentSession,
    skipCurrentSession,
    adjustSchedule,
    refreshTodaySchedule,
    setTheme,
    errorMessage,
    user,
    authLoading,
    signIn,
    signOut,
    syncCloud,
    timetables,
    activeTimetableId,
    switchTimetable,
    deleteTimetable,
    setSetupTimetableId,
  } = useEngineStore();
  const isOnline = useOnlineStatus();
  const { isInstallable, install } = usePWAInstall();

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [adjustSheetOpen, setAdjustSheetOpen] = React.useState(false);
  const [skipDialogOpen, setSkipDialogOpen] = React.useState(false);
  const [aboutSheetOpen, setAboutSheetOpen] = React.useState(false);
  const [themeSheetOpen, setThemeSheetOpen] = React.useState(false);

  const selectTheme = async (theme: "light" | "dark" | "natural") => {
    document.documentElement.classList.remove("light", "dark", "natural");
    document.documentElement.classList.add(theme);
    await setTheme(theme);
  };

  const renderProgress = () => (
    <div className="pt-4 pb-12">
      <ProgressIndicator completed={progress.completedSessions} total={progress.totalSessions} />
    </div>
  );

  const renderContent = () => {
    switch (appState) {
      case "study":
        if (!currentItem || !("status" in currentItem)) {
          return <EmptyState title="Error" description="Session not found" />;
        }

        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <StudyCard
              subject={currentItem.subjectId || "Unknown"}
              timeRange={`${currentItem.startTime} - ${currentItem.endTime}`}
              remainingTime={remainingTime}
              onComplete={() => void completeCurrentSession()}
            />
            {nextSession && (
              <NextSessionCard
                subject={nextSession.subjectId || "Unknown"}
                timeRange={`${nextSession.startTime} - ${nextSession.endTime}`}
              />
            )}
            {renderProgress()}
          </div>
        );

      case "break":
        if (!currentItem || !("isBreak" in currentItem)) {
          return <EmptyState title="Error" description="Break not found" />;
        }

        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <Card className="p-6 sm:p-8 border-2 border-secondary bg-secondary/20 shadow-sm text-center">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3 block">
                Scheduled Break
              </span>
              <h3 className="text-5xl sm:text-[64px] font-light leading-none font-mono tracking-tighter mb-8 mt-6">
                {currentItem.durationMinutes}m
              </h3>
              <p className="text-muted-foreground mb-8">Take a moment to rest. You&apos;ve earned it.</p>
              <Button size="lg" className="w-full sm:w-auto" variant="secondary" onClick={() => void adjustSchedule()}>
                Skip Break
              </Button>
            </Card>
            {nextSession && (
              <NextSessionCard
                subject={nextSession.subjectId || "Unknown"}
                timeRange={`${nextSession.startTime} - ${nextSession.endTime}`}
              />
            )}
            {renderProgress()}
          </div>
        );

      case "freetime":
        if (!currentItem || !("isFreeTime" in currentItem)) {
          return <EmptyState title="Error" description="Free time not found" />;
        }

        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <Card className="p-6 sm:p-8 border border-border shadow-sm text-center">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3 block">
                Free Time
              </span>
              <h3 className="text-2xl font-medium tracking-tight mb-4 mt-6">
                Next session in {currentItem.durationMinutes}m
              </h3>
              <p className="text-muted-foreground mb-8">You finished your previous session early. Enjoy your free time!</p>
              <Button size="lg" className="w-full sm:w-auto" variant="outline" onClick={() => void adjustSchedule()}>
                Start Next Session Early
              </Button>
            </Card>
            {nextSession && (
              <NextSessionCard
                subject={nextSession.subjectId || "Unknown"}
                timeRange={`${nextSession.startTime} - ${nextSession.endTime}`}
              />
            )}
            {renderProgress()}
          </div>
        );

      case "completed":
        return (
          <div className="space-y-8 animate-in fade-in duration-500 pt-12">
            <EmptyState
              title="Day Completed"
              description="You have successfully finished all your study sessions for today. Great job staying consistent!"
            />
            <div className="pt-4 pb-12 px-6">
              <ProgressIndicator completed={progress.completedSessions} total={progress.totalSessions} />
            </div>
          </div>
        );

      case "empty":
        return (
          <div className="pt-24 animate-in fade-in duration-500">
            <EmptyState
              title="No Timetable Found"
              description="Create your daily study routine to get started. Estimated setup time: Less than 2 minutes."
              actionLabel="Create Timetable"
              onAction={() => setAppState("setup")}
            />
          </div>
        );

      case "loading":
        return (
          <div className="pt-32 animate-in fade-in duration-500">
            <LoadingState message="Loading today's schedule..." />
          </div>
        );

      case "error":
        return (
          <div className="pt-32 animate-in fade-in duration-500">
            <ErrorState
              message={errorMessage ?? "Unable to load today's schedule. Please try again."}
              onRetry={() => void refreshTodaySchedule()}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onMenuClick={() => setMenuOpen(true)} />

      <main id="main-content" className="flex-1 w-full max-w-md mx-auto px-6 py-6 pb-24">
        {!isOnline && (
          <div className="mb-4 rounded-2xl border bg-secondary/60 px-4 py-3 text-sm text-secondary-foreground" role="status" aria-live="polite">
            You&apos;re offline. StudyFlow will keep saving locally and sync again when your connection returns.
          </div>
        )}

        {timetables.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-2 -mx-2 px-2 no-scrollbar" role="tablist" aria-label="Timetables">
            {timetables.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={activeTimetableId === t.id}
                onClick={() => void switchTimetable(t.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all duration-200 shrink-0 border shadow-sm ${
                  activeTimetableId === t.id
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm hover:opacity-90 font-bold'
                    : 'bg-card text-muted-foreground border-border hover:bg-secondary/40'
                }`}
              >
                {t.name}
              </button>
            ))}
            <button
              onClick={() => {
                setSetupTimetableId("new");
                setAppState("setup");
              }}
              className="px-4 py-2 rounded-2xl text-xs font-semibold bg-secondary/60 text-secondary-foreground border border-border/40 hover:bg-secondary transition-all shrink-0 flex items-center gap-1 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
        )}

        {renderContent()}
      </main>

      <BottomSheet isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
        <div className="space-y-1 pt-2">
          {user ? (
            <div className="px-6 py-4 bg-secondary/30 rounded-2xl mb-4 border border-border mx-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cloud Synced</p>
                  </div>
                  <p className="text-sm font-medium truncate max-w-[200px]" title={user.email}>
                    {user.email}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl"
                    disabled={authLoading}
                    onClick={() => void syncCloud()}
                  >
                    <RefreshCw className={`h-4 w-4 ${authLoading ? 'animate-spin' : ''}`} />
                    <span className="sr-only">Sync Now</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl text-destructive hover:text-destructive"
                    disabled={authLoading}
                    onClick={() => {
                      void signOut();
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Sign Out</span>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-6 py-4 bg-secondary/30 rounded-2xl mb-4 border border-border mx-2 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Backup & Sync</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Sign in to back up your routines and keep them synced across all your devices.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full h-11 px-4 text-sm font-medium rounded-xl border border-border hover:bg-secondary flex items-center justify-center gap-2"
                disabled={authLoading}
                onClick={() => {
                  void signIn();
                }}
              >
                {authLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                Sign In with Google
              </Button>
            </div>
          )}

          <Button variant="ghost" className="w-full justify-start text-base h-14 px-6 rounded-xl" onClick={() => { setMenuOpen(false); setAdjustSheetOpen(true); }}>Adjust Today&apos;s Schedule</Button>
          <Button variant="ghost" className="w-full justify-start text-base h-14 px-6 rounded-xl" onClick={() => { setMenuOpen(false); setSkipDialogOpen(true); }}>Skip Session For Today</Button>
          <div className="h-px bg-border my-2 mx-6" />
          
          <div className="space-y-2 px-2 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-4 py-2">Manage Timetables</h4>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {timetables.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-2 px-4 rounded-xl hover:bg-secondary/40 border border-transparent hover:border-border/40 transition-all">
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">{t.name}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {t.originalSessions.length} sessions
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => {
                        setSetupTimetableId(t.id);
                        setAppState("setup");
                        setMenuOpen(false);
                      }}
                      title="Edit sessions"
                    >
                      <svg className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                      disabled={timetables.length <= 1}
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${t.name}"?`)) {
                          void deleteTimetable(t.id);
                        }
                      }}
                      title="Delete timetable"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="h-px bg-border my-2 mx-6" />
          <Button variant="ghost" className="w-full justify-start text-base h-14 px-6 rounded-xl" onClick={() => { setMenuOpen(false); setThemeSheetOpen(true); }}>Appearance</Button>
          {isInstallable && (
            <>
              <div className="h-px bg-border my-2 mx-6" />
              <Button
                variant="ghost"
                className="w-full justify-start text-base h-14 px-6 rounded-xl text-primary font-medium"
                onClick={async () => {
                  setMenuOpen(false);
                  await install();
                }}
              >
                <Download className="h-5 w-5 mr-3 text-muted-foreground" />
                Install App
              </Button>
            </>
          )}
          <div className="h-px bg-border my-2 mx-6" />
          <Button variant="ghost" className="w-full justify-start text-base h-14 px-6 rounded-xl" onClick={() => { setMenuOpen(false); setAboutSheetOpen(true); }}>About</Button>
        </div>
      </BottomSheet>

      <BottomSheet isOpen={adjustSheetOpen} onClose={() => setAdjustSheetOpen(false)}>
        <div className="space-y-8 pt-4 px-2">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold tracking-tight">Adjust Today&apos;s Schedule</h3>
            <p className="text-sm text-muted-foreground">Did you start late? We&apos;ll recalculate your remaining sessions to fit the rest of the day.</p>
          </div>
          <div className="space-y-3">
            <Button className="w-full" size="lg" onClick={() => {
              void adjustSchedule();
              setAdjustSheetOpen(false);
            }}>Recalculate Schedule</Button>
            <Button variant="ghost" className="w-full" size="lg" onClick={() => setAdjustSheetOpen(false)}>Cancel</Button>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet isOpen={themeSheetOpen} onClose={() => setThemeSheetOpen(false)}>
        <div className="space-y-6 pt-4 px-2 text-center">
          <div className="space-y-2 mb-6">
            <h3 className="text-xl font-semibold tracking-tight">Appearance</h3>
            <p className="text-sm text-muted-foreground">Choose your preferred theme.</p>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="w-full h-14 px-6 text-base" onClick={() => { void selectTheme("natural"); setThemeSheetOpen(false); }}>Natural Tone</Button>
            <Button variant="outline" className="w-full h-14 px-6 text-base" onClick={() => { void selectTheme("light"); setThemeSheetOpen(false); }}>Light Mode</Button>
            <Button variant="outline" className="w-full h-14 px-6 text-base bg-secondary" onClick={() => { void selectTheme("dark"); setThemeSheetOpen(false); }}>Dark Mode</Button>
          </div>
          <Button variant="ghost" className="w-full mt-4" size="lg" onClick={() => setThemeSheetOpen(false)}>Cancel</Button>
        </div>
      </BottomSheet>

      <BottomSheet isOpen={aboutSheetOpen} onClose={() => setAboutSheetOpen(false)}>
        <div className="space-y-6 pt-4 px-2 text-center">
          <div className="w-16 h-16 bg-primary text-primary-foreground rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-sm">
            <span className="font-serif italic font-bold text-3xl">S</span>
          </div>
          <h3 className="text-xl font-semibold tracking-tight mb-1">StudyFlow</h3>
          <p className="text-sm text-muted-foreground mb-8">Version 1.0.0<br/>Minimal, adaptive study routine engine.</p>
          <Button variant="secondary" className="w-full" size="lg" onClick={() => setAboutSheetOpen(false)}>Close</Button>
        </div>
      </BottomSheet>

      <ConfirmationDialog
        isOpen={skipDialogOpen}
        onClose={() => setSkipDialogOpen(false)}
        title="Skip this session for today?"
        description="This session will be removed from today's schedule. Future days will not be affected."
        confirmLabel="Skip Session"
        onConfirm={() => {
          setSkipDialogOpen(false);
          void skipCurrentSession();
        }}
      />
    </div>
  );
}
