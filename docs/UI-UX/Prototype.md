# Prototype

## Purpose

This document defines the interactive behavior of the application's prototype.

The objective is to validate the user experience before development begins.

The prototype should answer one question:

**"Does the application feel effortless?"**

---

# Prototype Philosophy

The prototype should feel like a real application.

Every interaction should have a purpose.

The user should never become confused about what to do next.

The prototype is used to test experience, not visual beauty.

---

# Prototype Scope

The prototype includes only the essential user experience.

Included

* First-Time Setup
* Home Screen
* Complete Session
* Just Woke Up
* Delete Session For Today
* Edit Timetable
* Dark Mode
* About

Everything else is outside the scope of Version 1.

---

# Entry Flow

Launch Application

↓

Is Timetable Available?

├── No

│

▼

Timetable Setup

↓

Save

↓

Home

└── Yes

↓

Home

---

# Home Flow

Home Opens

↓

Current Session Visible

↓

User Studies

↓

Tap Complete

↓

Next Session Appears

↓

Continue Studying

---

# Complete Session Flow

Tap Complete

↓

Session Card Updates

↓

Progress Updates

↓

Next Session Becomes Active

↓

Ready To Continue

No page reload.

No unnecessary animation.

---

# Just Woke Up Flow

Open Hamburger Menu

↓

Tap Just Woke Up

↓

Confirmation

↓

Schedule Recalculates

↓

Home Updates

The user never manually adjusts today's timetable.

---

# Delete Session Flow

Open Hamburger Menu

↓

Delete Session For Today

↓

Confirmation

↓

Schedule Updates

↓

Next Session Appears

Only today's schedule changes.

---

# Edit Timetable Flow

Open Hamburger Menu

↓

Edit Timetable

↓

Timetable Setup

↓

Save

↓

Return Home

The updated timetable applies according to the scheduling engine rules.

---

# Theme Flow

Open Hamburger Menu

↓

Dark Mode

↓

Theme Changes

↓

Return Home

No restart required.

---

# About Flow

Open Hamburger Menu

↓

About

↓

Application Information

↓

Close

↓

Return Home

---

# Navigation Rules

Every interaction should return to the Home screen.

The user should never feel lost.

Maximum navigation depth:

Home

↓

Bottom Sheet

↓

Home

Avoid long navigation chains.

---

# Animation Rules

Animations should explain state changes.

Recommended animations

* Bottom Sheet Slide
* Card State Change
* Theme Transition
* Progress Update

Avoid

* Bounce Effects
* Confetti
* Flashing Elements
* Decorative Motion

---

# Interaction Rules

Every interaction should feel immediate.

The user should never wait unnecessarily.

The application should always respond to user input.

---

# Prototype Testing Checklist

The prototype is successful if users can complete these tasks without instructions.

☐ Create a timetable

☐ Understand the Home screen

☐ Complete a study session

☐ Use Just Woke Up

☐ Delete today's session

☐ Edit the timetable

☐ Switch theme

☐ Return Home without confusion

---

# Success Criteria

The prototype succeeds when:

* The user understands the interface immediately.
* No tutorial is required.
* Every important action takes one or two taps.
* Navigation feels effortless.
* The user always knows what to study next.

---

# Final Vision

The prototype should feel calm, predictable, and focused.

The application should quietly guide the user through the day without creating unnecessary decisions.

If users can begin studying within a few seconds of opening the app, the prototype has achieved its goal.
