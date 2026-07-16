# Sprint 04 — Frontend Integration

## Sprint Summary

Sprint 04 connects the approved user interface with the Scheduling Engine created in Sprint 03.

No scheduling rules should exist inside React components.

The frontend becomes a presentation layer.

The Scheduling Engine becomes the single source of truth.

This sprint transforms the prototype into a functional application.

---

# Sprint Goal

Connect the UI with the Scheduling Engine while preserving the architecture.

At the end of this sprint:

- The Home Screen displays live engine data.
- User actions call the engine.
- UI updates automatically.
- No mock state remains.
- Business logic stays outside React.

---

# Sprint Scope

## Included

- Home Screen Integration
- Timetable Setup Integration
- Engine → UI Connection
- State Management
- Theme Integration
- Dialog Integration
- Bottom Sheet Integration
- Progress Integration
- Error Handling
- Loading States

---

## Not Included

- Backend
- Cloudflare Workers
- IndexedDB
- D1
- Authentication
- Notifications
- Background Sync
- Analytics

---

# Required Documentation

Use only:

- Architecture.md
- Screen-Design.md
- Design-System.md
- Component-Library.md
- UI-Design-Rules.md
- Engine-Rules.md
- Definition-of-Done.md

Ignore all other documents.

---

# Deliverables

## Home Screen

Replace all mock data.

Display live data returned by the Scheduling Engine.

Display

- Current Session
- Next Session
- Progress
- Break
- Free Time
- Day Completed

No hardcoded values.

---

## Timetable Setup

Replace mock setup.

Save data through the repository layer.

Validate user input.

Generate Original Timetable.

Do not generate Today's Schedule here.

---

## User Actions

Connect

Complete Session

↓

Scheduling Engine

↓

Updated State

↓

UI Refresh

---

Connect

Skip Session

↓

Scheduling Engine

↓

Updated State

↓

UI Refresh

---

Connect

Adjust Today's Schedule

↓

Scheduling Engine

↓

Updated Schedule

↓

UI Refresh

---

# State Management

Use a centralized state solution.

The UI must never own scheduling logic.

Responsibilities

Engine

↓

State

↓

UI

React components should remain dumb.

---

# Component Responsibilities

Components should

Display data

Handle user interaction

Call actions

Render updates

Components must never

Calculate schedules

Generate breaks

Calculate progress

Handle business rules

---

# Navigation

Navigation should remain unchanged from the approved prototype.

Do not redesign screens.

Do not add routes.

Keep navigation simple.

---

# Error Handling

Handle

Invalid timetable

Empty timetable

Corrupt schedule

Missing session

Unexpected engine errors

Display friendly UI states.

---

# Loading States

Support loading while

Generating schedule

Updating session

Saving timetable

Refreshing state

Reuse approved Loading components.

---

# Theme

Integrate

Light Theme

Dark Theme

Natural Theme

No visual changes.

---

# Responsive Design

Verify

Mobile

Tablet

Desktop

Maintain consistency with the prototype.

---

# Folder Structure

Expected additions

```text
store/

providers/

actions/

state/

```

Business logic should remain inside the engine.

The frontend should consume engine outputs.

---

# Engineering Rules

During Sprint 04

Do

- Keep components reusable.
- Keep state centralized.
- Reuse approved components.
- Follow Architecture.md.

Do Not

- Duplicate engine logic.
- Calculate anything inside components.
- Hardcode schedule values.
- Introduce mock state.

---

# Manual Testing

Verify

- Home updates correctly.
- Complete Session works.
- Skip Session works.
- Break screen appears.
- Free Time appears.
- Day Completed appears.
- Timetable creation works.
- Theme switching works.
- Responsive layout works.

---

# Acceptance Criteria

Sprint 04 is complete only if

- Mock data is removed.
- Engine drives every UI state.
- Components remain presentation-only.
- State updates correctly.
- Build succeeds.
- No TypeScript errors.
- No ESLint errors.
- Code review passes.

---

# Risks

Possible issues

- State synchronization bugs
- Infinite re-renders
- UI updating before engine
- Component coupling
- Duplicate business logic

Resolve before closing Sprint.

---

# Review Checklist

Review

- Engine integration
- State management
- Component responsibility
- UI consistency
- Error handling
- Loading states
- Accessibility
- Performance

---

# Git Strategy

Branch

```text
feature/frontend-integration
```

Suggested commits

```text
feat: connect home screen to engine

feat: connect timetable setup

feat: integrate centralized state

feat: connect dialogs

feat: integrate progress

refactor: remove mock data
```

---

# Definition of Done

Sprint 04 is complete when

- Every screen is powered by the Scheduling Engine.
- Mock data has been removed.
- UI remains identical to the approved prototype.
- Components contain no business logic.
- State updates correctly.
- Build passes.
- Code review passes.
- No critical issues remain.

---

# Out of Scope

Do not implement

- Backend APIs
- Cloudflare Workers
- D1
- IndexedDB
- Authentication
- Notifications
- Analytics
- Cloud Sync

---

# Sprint Handoff

## Next Sprint

Sprint 05 — Backend & Synchronization

### Required Documents

- Architecture.md
- Database-Planning.md
- Engine-Rules.md
- Definition-of-Done.md

### Expected Output

Connect the application to the backend.

Implement

- Cloudflare Workers
- API layer
- IndexedDB
- Local-first storage
- Background synchronization
- Offline support

The Scheduling Engine should remain unchanged.

Do not begin Sprint 05 until Sprint 04 has been reviewed and approved.

---

# Expected Result

At the end of Sprint 04,

StudyFlow should function as a real application from the user's perspective.

The Scheduling Engine should fully control application behavior.

The frontend should only present engine outputs and user interactions.

The UI should remain visually identical to the approved prototype while replacing all mock behavior with real engine-driven state.