# Sprint 03 — Scheduling Engine

## Sprint Summary

Sprint 03 builds the core Scheduling Engine of StudyFlow.

This is the most important sprint in the project.

The Scheduling Engine is responsible for generating, maintaining, and adapting the user's daily study schedule.

The engine contains all business logic.

The user interface, database, and backend must remain independent of the engine.

The engine should be framework-agnostic and reusable.

---

# Sprint Goal

Build a standalone Scheduling Engine that powers the entire application.

At the end of this sprint, the engine should be capable of:

- Generating Today's Schedule
- Adjusting Today's Schedule
- Completing Sessions
- Skipping Sessions
- Auto Break Generation
- Progress Calculation
- Daily Reset
- Deep Work Protection

No UI implementation should exist.

No backend implementation should exist.

---

# Sprint Scope

## Included

- Schedule Generation
- Schedule Compression
- Session Completion
- Skip Session
- Auto Breaks
- Free Time Detection
- Daily Progress
- Day Completion
- Daily Reset
- Engine Validation
- Unit Tests

---

## Not Included

- UI Components
- API Routes
- Database CRUD
- IndexedDB
- Cloudflare Workers
- Authentication
- Notifications
- Background Sync

---

# Required Documentation

Use only:

- Engine-Rules.md
- Decision-Trees.md
- Edge-Cases.md
- Database-Planning.md
- Definition-of-Done.md

Ignore all other documents.

---

# Deliverables

## Engine Module

Create a dedicated Scheduling Engine.

Suggested structure

```text
lib/

engine/

scheduler.ts

generator.ts

adjuster.ts

breaks.ts

progress.ts

reset.ts

validation.ts

types.ts

constants.ts
```

The engine must not depend on React.

The engine must not import UI components.

---

# Engine Responsibilities

The engine should

Generate

↓

Validate

↓

Adjust

↓

Update

↓

Return

Never render UI.

---

# Core Features

## Generate Today's Schedule

Generate today's temporary schedule from the Original Timetable.

Rules

- Preserve study order.
- Calculate session durations.
- Generate temporary schedule only.
- Original Timetable must never change.

---

## Adjust Today's Schedule

Support

Just Woke

Late Start

Manual Adjustment

The engine should

- Calculate delay
- Shift schedule
- Compress sessions
- Preserve study order
- Protect Deep Work
- Return updated schedule

---

## Complete Session

When a session is completed

The engine should

- Mark completed
- Update progress
- Generate break if required
- Activate next session

Never modify the Original Timetable.

---

## Skip Session

Skip only today's session.

The engine should

- Remove session
- Recalculate remaining day
- Preserve remaining order
- Update progress

Tomorrow must remain unchanged.

---

## Break Generation

Automatically generate breaks.

Rules come from Engine-Rules.md.

Users never manually create breaks.

---

## Free Time

Detect

Early completion

Long gap

Unused time

Return

Free Time Block

instead of empty schedule.

---

## Day Completion

Detect when

All sessions complete

or

No sessions remain.

Return

Day Completed State.

---

## Daily Reset

Detect

New Day

Generate fresh Today's Schedule.

Discard yesterday's temporary state.

Never modify Original Timetable.

---

# Deep Work Protection

This is a critical engine rule.

Never compress deep work below its minimum effective duration.

Instead

Remove lower-priority sessions.

Deep Work must always be preserved.

---

# Engine Principles

The engine must be

Pure

Deterministic

Predictable

Reusable

Independent

Testable

No side effects.

---

# Engine API

Example

```ts
generateTodaySchedule()

adjustTodaySchedule()

completeSession()

skipSession()

generateBreak()

calculateProgress()

resetDay()

validateSchedule()
```

Implementation may differ.

Purpose must remain identical.

---

# Data Flow

```text
Original Timetable

↓

Scheduling Engine

↓

Today's Schedule

↓

Session Updates

↓

Updated Today's Schedule

↓

UI
```

The UI never modifies schedules directly.

---

# Folder Structure

Expected additions

```text
lib/

engine/

tests/

```

Keep business logic isolated.

---

# Unit Testing

Every engine module should have tests.

Minimum

- Normal Day
- Late Wake
- Skip Session
- Complete Session
- Break Generation
- Daily Reset
- Free Time
- Day Completed
- Deep Work Protection

Every Edge Case from Edge-Cases.md should be covered.

---

# Manual Testing

Verify

- Schedule generation
- Session completion
- Skip session
- Progress calculation
- Break generation
- Daily reset
- Deep work preservation
- Free time generation

---

# Acceptance Criteria

Sprint 03 is complete only if

- Engine follows Engine-Rules.md
- Decision Trees are respected
- Edge Cases pass
- Unit tests pass
- Original Timetable remains immutable
- UI dependency does not exist
- Build succeeds
- Code review passes

---

# Risks

Possible issues

- Incorrect schedule calculations
- Infinite recalculation loops
- Mutable state bugs
- Incorrect break generation
- Deep work compression bugs
- Edge case failures

Resolve before closing Sprint.

---

# Review Checklist

Review

- Engine architecture
- Function separation
- Rule compliance
- Decision tree compliance
- Edge case coverage
- Test quality
- Performance
- Readability

---

# Git Strategy

Branch

```text
feature/scheduling-engine
```

Suggested commits

```text
feat: create scheduling engine

feat: implement schedule generator

feat: implement schedule adjustment

feat: implement break engine

feat: implement progress engine

feat: implement daily reset

test: add scheduling engine tests
```

---

# Definition of Done

Sprint 03 is complete when

- Scheduling Engine is fully functional.
- Every Engine Rule is implemented.
- Every Decision Tree is respected.
- Every Edge Case passes.
- Engine is independent from UI.
- Unit tests pass.
- Build succeeds.
- Code review passes.
- No critical issues remain.

---

# Out of Scope

Do not implement

- React UI
- Backend APIs
- IndexedDB
- Cloudflare Workers
- Notifications
- Authentication
- Sync
- Analytics

---

# Sprint Handoff

## Next Sprint

Sprint 04 — Frontend Integration

### Required Documents

- Screen-Design.md
- Design-System.md
- Component-Library.md
- UI-Design-Rules.md
- Definition-of-Done.md

### Expected Output

Connect the Scheduling Engine with the frontend.

The UI should become a thin presentation layer.

The engine remains the single source of truth.

Do not begin Sprint 04 until Sprint 03 has been reviewed and approved.

---

# Expected Result

At the end of Sprint 03,

StudyFlow should have a complete, production-ready Scheduling Engine.

The engine should operate independently of the UI, backend, and database.

Every scheduling decision should originate from this engine.

Future sprints should only consume engine outputs, never duplicate engine logic.