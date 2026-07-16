# User Flow

## Purpose

This document describes every interaction the user can perform inside the app.

It only focuses on the user's actions.

System logic and internal processing are documented separately in App Flow and Engine Rules.

---

# Primary User Goal

The user opens the app and immediately knows:

"What should I study right now?"

The app should answer this within seconds.

---

# Main Flow

Open App

↓

View Current Study Session

↓

Study

↓

Tap Complete

↓

View Next Session

↓

Repeat

↓

Sleep

---

# First-Time Setup Flow

Install App

↓

Set Wake-up Time

↓

Set Sleep Time

↓

Create Daily Timetable

↓

Save

↓

Start Using App

This setup should happen only once.

---

# Daily Usage Flow

Open App

↓

See Current Session

↓

Study

↓

Complete Session

↓

See Next Session

↓

Repeat Until Day Ends

---

# Late Wake-up Flow

Open App

↓

Open Menu

↓

Tap "Just Woke Up"

↓

Return to Home

↓

Continue Studying

The user never manually rearranges the timetable.

---

# Delete Session Flow

Open Current Session

↓

Tap "Delete Session For Today"

↓

Confirm

↓

Return to Home

↓

Continue Remaining Sessions

---

# Complete Session Flow

Open Current Session

↓

Tap Complete

↓

Next Session Appears

↓

Continue Studying

---

# Resume Flow

Open App

↓

Current Session Appears

↓

Continue From Current Position

The user should never search for where they left off.

---

# End of Day Flow

Complete Final Session

↓

View Today's Progress

↓

Close App

---

# User Inputs

The user can only perform these actions.

- Complete Session
- Just Woke Up
- Delete Session For Today

Everything else is handled automatically.

---

# Navigation

The app should have as few screens as possible.

Home

↓

Settings

No deep navigation.

No complicated menus.

---

# User Flow Principles

- Every important action should take one tap whenever possible.
- The home screen should always answer "What should I study now?"
- The user should never manually rebuild today's timetable.
- The user should never lose track of the current session.
- Every interaction should reduce effort, not create it.

---

# Success Criteria

A new user should be able to use the app without reading a tutorial.

If the user needs instructions to complete a basic action, the flow should be redesigned.