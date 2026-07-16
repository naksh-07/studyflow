# App Flow

## Purpose

This document describes how the application behaves internally after every user interaction.

It focuses on the application's workflow, processing, and responses.

No implementation details or programming language are included here.

---

# Application Startup

User opens the app.

↓

Load user settings.

↓

Load today's timetable.

↓

Determine current time.

↓

Identify the active study session.

↓

Display Home Screen.

---

# First-Time Setup

User completes initial setup.

↓

Validate all inputs.

↓

Generate complete daily timetable.

↓

Generate automatic break sessions.

↓

Save timetable.

↓

Save user settings.

↓

Open Home Screen.

---

# Home Screen

Whenever the Home Screen is opened:

↓

Load today's schedule.

↓

Find current session.

↓

Calculate remaining time.

↓

Display:

- Current Subject
- Current Time Slot
- Remaining Time
- Next Session

---

# Complete Session

User taps:

Complete

↓

Mark session as completed.

↓

Calculate next active session.

↓

Update today's progress.

↓

Refresh Home Screen.

---

# Just Woke Up

User taps:

Just Woke Up

↓

Read current time.

↓

Compare with planned wake-up time.

↓

Calculate delay.

↓

Generate updated timetable.

↓

Update today's schedule.

↓

Refresh Home Screen.

---

# Delete Session For Today

User selects:

Delete Session For Today

↓

Remove session from today's schedule.

↓

Recalculate remaining timetable.

↓

Update progress.

↓

Refresh Home Screen.

The original timetable remains unchanged.

Only today's schedule is modified.

---

# Automatic Breaks

When a study session finishes:

↓

Determine next break.

↓

Activate break session.

↓

After break ends

↓

Activate next study session.

The user never manages breaks manually.

---

# Session Progress

Whenever a session changes:

↓

Update current session.

↓

Update completed count.

↓

Update remaining sessions.

↓

Refresh progress.

---

# End of Day

Final study session completed.

↓

Calculate today's completion.

↓

Store today's progress.

↓

Wait for next day.

---

# New Day

New day detected.

↓

Load original timetable.

↓

Generate today's schedule.

↓

Reset completed sessions.

↓

Display first study session.

Yesterday's changes do not affect future days.

---

# Data Persistence

The application automatically saves:

- User settings
- Timetable
- Today's progress
- Completed sessions

No manual Save button should exist.

---

# Error Recovery

If the app closes unexpectedly:

↓

Restore latest saved state.

↓

Continue from current session.

The user should never lose progress.

---

# Core Processing Order

Open App

↓

Load Settings

↓

Load Timetable

↓

Determine Current Session

↓

Display Current Subject

↓

User Action

↓

Update Schedule

↓

Save Changes

↓

Refresh Home Screen

---

# App Principles

- Every user action should automatically save.
- Every screen should always display the correct current session.
- The app should never require manual schedule rebuilding.
- The system should always recover gracefully after interruptions.
- Today's changes should never permanently modify the original timetable.
