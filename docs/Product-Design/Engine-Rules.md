# Engine Rules

## Purpose

This document defines the decision-making rules of the scheduling engine.

These rules determine how the timetable behaves under different situations.

The engine should always reduce planning effort for the user.

---

# Core Principle

The user manages the study.

The engine manages the timetable.

---

# Rule 1 — Original Timetable Never Changes

The timetable created during setup is permanent.

Daily changes must only affect today's schedule.

Every new day starts from the original timetable.

---

# Rule 2 — Today's Schedule Is Temporary

Today's schedule is generated from the original timetable.

All modifications apply only to today.

Examples

- Just Woke Up
- Skip Session For Today
- Completed Sessions

These changes disappear when a new day begins.

---

# Rule 3 — Current Session

At every moment the engine must know exactly one active session.

There can never be two active sessions.

There can never be zero active sessions during study hours.

---

# Rule 4 — Complete Session

When a session is completed:

- Mark it as Completed.
- Lock the session.
- Update today's progress.
- Start the scheduled break (if one exists).
- Activate the next study session at its planned start time.

Completed sessions should never become active again.

---

# Rule 5 — Just Woke Up

When the user starts studying later than planned,

the engine must:

- Read the current time.
- Calculate the delay.
- Generate a new schedule for today.
- Preserve the original study order whenever possible.
- Protect deep-work sessions from excessive compression.

The user should never manually rearrange today's timetable.

---

# Rule 6 — Skip Session For Today

When a session is skipped:

- Remove it only from today's schedule.
- Recalculate the remaining timetable.
- Keep the original timetable unchanged.

Skipping a session should never affect future days.

---

# Rule 7 — Break Management

Breaks are generated automatically.

The user never creates or edits break sessions.

Default rule

- Study sessions longer than 45 minutes automatically receive a 15-minute break.

Breaks may be adjusted by the scheduling engine when required, but should never disappear unless the day becomes impossible to complete.

---

# Rule 8 — Study Order

Unless absolutely necessary,

the order of study subjects should remain unchanged.

The engine adjusts timings,

not the learning sequence.

---

# Rule 9 — Progress

Progress is based only on completed study sessions.

Skipped sessions are ignored.

Incomplete sessions remain incomplete.

Breaks do not affect progress.

---

# Rule 10 — New Day Reset

At the beginning of every new day:

- Generate a fresh schedule from the original timetable.
- Clear completed sessions.
- Clear skipped sessions.
- Reset daily progress.

Every day begins from the original timetable.

---

# Rule 11 — Automatic Saving

Every user action is automatically saved.

No Save button should ever exist.

---

# Rule 12 — Recovery

If the application closes unexpectedly:

- Restore the latest saved state.
- Restore today's schedule.
- Resume from the correct session.

The user should never lose progress.

---

# Rule 13 — Session State

A study session can exist in only one state.

- Pending
- Active
- Completed
- Skipped

A session can never exist in multiple states simultaneously.

---

# Rule 14 — Sleep Boundary

Once the user's sleep time is reached:

- Today's schedule ends.
- No new study sessions are generated.
- Remaining work is not moved to tomorrow.

Tomorrow always starts from the original timetable.

---

# Rule 15 — Minimize Manual Effort

The engine should always choose the solution requiring the fewest user actions.

Whenever possible,

the engine should solve problems automatically.

---

# Rule 16 — Deep Work Protection ⭐

Long study sessions should be protected.

If the remaining day cannot fit every subject,

the engine should:

- Remove the lowest-priority session(s) first.
- Preserve important deep-work sessions whenever possible.

Deep work should never become shallow work through excessive compression.

---

# Rule 17 — Early Completion ⭐

If a user finishes a study session earlier than its scheduled end:

- Mark the session as Completed.
- Start the scheduled break immediately (if applicable).
- Keep the next study session at its planned start time.
- If there is no break, show the user that they have free time until the next session begins.

Finishing early should never automatically shift the entire timetable forward.

---

# Engine Priorities

Whenever multiple valid solutions exist,

the engine should prioritize them in this order.

1. Protect deep-work sessions.
2. Preserve the original study order.
3. Preserve automatic breaks whenever possible.
4. Keep today's timetable realistic.
5. Respect the user's sleep time.
6. Reduce manual effort.
7. Never require timetable rebuilding.

---

# Non-Negotiable Rules

The engine must never:

- Ask the user what to study next.
- Require manual timetable rebuilding.
- Permanently modify the original timetable.
- Lose completed progress.
- Display multiple active sessions.
- Require a Save button.
- Compress deep-work sessions into unrealistic durations.
- Interrupt the user with unnecessary dialogs.

---

# Definition of Success

The engine is successful when the user only needs to:

- Open the app.
- See what to study.
- Study.
- Tap Complete.

Everything else should happen automatically.