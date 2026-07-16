# Database Planning

## Purpose

This document defines what information the application should store.

The database is intentionally kept as simple as possible.

Only information that must be remembered should be stored.

Everything else should be calculated by the scheduling engine.

---

# Design Philosophy

**Store Less. Calculate More.**

The application should avoid storing duplicate or temporary information whenever possible.

A smaller database is easier to maintain, faster to query, and less likely to contain bugs.

---

# Data Model

The application stores only four categories of data.

* User Settings
* Original Timetable
* Today's State
* Application Preferences

Nothing else should be permanently stored.

---

# User Settings

## Purpose

Stores the user's permanent daily routine.

### Fields

* Wake Time
* Sleep Time

These values rarely change.

Future schedules are generated using these settings.

---

# Original Timetable

## Purpose

Stores the user's default study timetable.

This timetable is the source used to generate every new day's schedule.

It is never modified during normal daily usage.

Each study session contains:

* Session ID
* Subject Name
* Start Time
* Display Order

The application automatically calculates:

* End Time
* Session Duration

These values should never be stored.

---

# Today's State

## Purpose

Stores the current state of today's timetable.

Only today's progress is stored.

Every study session contains:

* Session ID
* Status

Optional

* Completed Time

### Possible Status Values

* Pending
* Completed
* Deleted

Future versions may introduce additional states without changing the database structure.

Today's State is temporary.

It resets automatically at the beginning of every new day.

---

# Application Preferences

## Purpose

Stores user interface preferences.

Current fields

* Theme (Light / Dark)

Reserved for future settings

* Accent Color
* Animation Preferences
* Accessibility Preferences
* Other UI Settings

These preferences do not affect the scheduling engine.

---

# Data That Should NEVER Be Stored

The following values should always be calculated.

* Current Session
* Next Session
* Remaining Time
* Session Duration
* Current Progress Percentage
* Active Study Block
* Daily Schedule Position

The engine should determine these values whenever the app opens.

---

# Data Lifetime

## Permanent

* Wake Time
* Sleep Time
* Original Timetable
* Application Preferences

## Temporary

* Today's State

Temporary data resets every new day.

---

# Relationships

```text
User
   │
   ▼
User Settings
   │
   ▼
Original Timetable
   │
   ▼
Today's State
   │
   ▼
Current Session (Calculated)
```

---

# Storage Rules

The application should automatically save every user action.

No manual Save button should ever exist.

Changes should be persisted immediately.

The user should never lose progress.

---

# Daily Reset

At the beginning of every new day:

* Clear Today's State
* Generate a fresh schedule from the Original Timetable
* Reset daily progress
* Keep all permanent data unchanged

Every day starts from the original timetable.

---

# Offline Support

The application should work normally without an internet connection.

User actions should continue to be saved locally.

When internet becomes available,

the application should synchronize automatically without requiring any user interaction.

---

# Future Expansion

The database should support future features without requiring major structural changes.

Possible future additions

* Multiple Timetables
* Backup & Restore
* Language Preference
* Accent Color
* Import / Export
* Cloud Sync

These features should extend the database rather than redesign it.

---

# Database Principles

* Store only permanent information.
* Calculate temporary information.
* Never duplicate data.
* Keep relationships simple.
* Keep automatic saving reliable.
* Design for future expansion.
* Minimize database complexity.

---

# Final Goal

The database should remain small, predictable, and easy to understand.

A new developer should be able to understand the entire database within a few minutes.

The scheduling engine should perform most of the work.

The database should simply remember what cannot be recalculated.
