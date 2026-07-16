# Component Library

## Purpose

This document defines every reusable UI component used throughout the application.

The goal is to maintain consistency, simplicity, and reusability.

A component should be created once and reused everywhere.

---

# Design Philosophy

Build less.

Reuse more.

Every component should solve one problem only.

If two components look or behave almost the same,

they should probably be the same component.

---

# Component Categories

The application contains six component groups.

* Layout Components
* Information Components
* Interactive Components
* Navigation Components
* Feedback Components
* Utility Components

---

# Layout Components

## Screen Container

Purpose

Provides consistent spacing and alignment for every screen.

Used On

* Home
* Timetable Setup

---

## Section

Purpose

Groups related information together.

Examples

Current Session

Next Session

---

# Information Components

## Session Card

Purpose

Displays one study session.

Content

* Subject
* Time
* Remaining Time
* Status

The current session receives the highest visual priority.

---

## Next Session Card

Purpose

Displays the upcoming study session.

It should remain visually secondary.

---

## Progress Indicator

Purpose

Displays today's progress.

Example

4 / 6 Sessions Completed

Keep it simple.

No charts.

No graphs.

---

## Empty State

Purpose

Guide users when no timetable exists.

Should always explain the next action.

---

# Interactive Components

## Primary Button

Purpose

Main action.

Current use

* Complete

There should only be one primary button visible at a time.

---

## Secondary Button

Purpose

Less important actions.

Examples

* Save
* Cancel

Should never compete with the primary action.

---

## Menu Item

Purpose

Actions inside the hamburger menu.

Examples

* Just Woke Up
* Delete Session Today
* Edit Timetable
* Dark Mode
* About

---

## Time Picker

Purpose

Select:

* Wake Time
* Sleep Time
* Subject Start Time

---

## Subject Picker

Purpose

Select the study subject.

Should remain simple and searchable if the list grows.

---

# Navigation Components

## Hamburger Menu

Purpose

Access secondary actions.

Contents

* Just Woke Up
* Delete Session Today
* Edit Timetable
* Dark Mode
* About

The menu should remain short.

---

## Bottom Sheet

Purpose

Display secondary interactions without leaving the Home screen.

Examples

* About
* Dark Mode
* Confirm Delete

---

## Dialog

Purpose

Used only for important confirmations.

Example

Delete Session For Today?

Avoid unnecessary dialogs.

---

# Feedback Components

## Toast Message

Purpose

Display small confirmations.

Examples

Session Completed

Timetable Saved

Should disappear automatically.

---

## Loading Indicator

Purpose

Show that an operation is in progress.

Keep it minimal.

---

## Error Message

Purpose

Explain problems clearly.

Never blame the user.

Always suggest the next step.

---

# Utility Components

## Divider

Purpose

Separate related content.

Use only when spacing is not enough.

---

## Icon

Purpose

Support text.

Icons should never replace text.

Use one icon family throughout the application.

---

## Theme Toggle

Purpose

Switch between:

* Light Mode
* Dark Mode

Should remain simple.

---

# Component Hierarchy

Home Screen

│

├── Screen Container

│

├── Section

│   ├── Session Card

│   ├── Primary Button

│   └── Progress Indicator

│

├── Section

│   └── Next Session Card

│

└── Hamburger Menu

```
├── Menu Item

├── Bottom Sheet

└── Dialog
```

---

# Component Rules

* Every component should have a single responsibility.
* Every component should be reusable.
* Avoid creating duplicate components.
* Keep component APIs simple.
* Prefer composition over creating new components.
* Every component should look and behave consistently.

---

# Things We Will Never Build

* Multiple button styles
* Decorative widgets
* Dashboard cards
* Animated badges
* Achievement banners
* Gamification components
* Floating action buttons
* Complex navigation bars

---

# Final Goal

The user should never notice individual components.

They should experience one calm, consistent interface where every interaction feels natural and predictable.
