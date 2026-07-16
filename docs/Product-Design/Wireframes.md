# Wireframes

## Purpose

This document defines the structural layout of the application.

It focuses on screen hierarchy, navigation, and user interaction.

Visual design, colors, typography, and animations are documented separately.

---

# Design Philosophy

The application should feel like one continuous screen instead of multiple pages.

The user should spend almost all of their time on the Home screen.

Navigation should be minimal.

Every unnecessary screen is considered friction.

---

# Screen Structure

The application contains only two primary screens.

1. Timetable Setup (First-time setup & editing)

2. Home (Daily usage)

Everything else should be accessible without creating a new page.

---

# Screen 1 — Home

## Purpose

The Home screen is the entire application.

The user should immediately know:

> What should I study right now?

---

## Layout

```text
┌──────────────────────────────┐
│            Today             │
├──────────────────────────────┤
│                              │
│ Mathematics                  │
│                              │
│ 07:00 – 08:30                │
│                              │
│ Remaining: 42 min            │
│                              │
│        ✓ Complete            │
│                              │
├──────────────────────────────┤
│ Next                         │
│ Physics                      │
│ 08:45 – 10:15                │
├──────────────────────────────┤
│ ☰                            │
└──────────────────────────────┘
```

---

## Hamburger Menu

```text
☰

Just Woke Up

──────────────

Delete Session For Today

──────────────

Edit Timetable

──────────────

Dark Mode

──────────────

About
```

No separate Settings page.

No separate About page.

These open as bottom sheets or dialogs.

---

# Screen 2 — Timetable Setup

## Purpose

Create or edit the original daily timetable.

This screen is mainly used during first-time setup or when the user wants to change their routine.

---

## Layout

```text
┌──────────────────────────────┐
│      Daily Timetable         │
├──────────────────────────────┤
│ Wake Time                    │
│ [06:00]                      │
├──────────────────────────────┤
│ Sleep Time                   │
│ [23:00]                      │
├──────────────────────────────┤
│ Subject      Start Time      │
│ Math         07:00           │
│ Physics      09:00           │
│ Reasoning    11:00           │
│ Biology      14:00           │
│ Revision     20:00           │
├──────────────────────────────┤
│ + Add Subject                │
├──────────────────────────────┤
│ Save                         │
└──────────────────────────────┘
```

The application automatically calculates study duration using the next session's start time.

The user only enters:

* Subject
* Start Time

---

# Bottom Sheets

The following should never become separate screens.

### Just Woke Up

Confirmation only.

### Delete Session For Today

Confirmation only.

### Dark Mode

Simple toggle.

### About

Application information.

Version

GitHub

License

---

# Navigation

```text
First Launch

↓

Timetable Setup

↓

Home

↓

(Hamburger Menu)

↓

Bottom Sheet

↓

Home
```

The user should never be more than one interaction away from returning to the Home screen.

---

# Screen Priority

Home

95%

Timetable Setup

5%

Bottom Sheets

Rare

---

# Wireframe Principles

* Home is the product.
* Everything starts from Home.
* Everything returns to Home.
* One tap for every common action.
* No unnecessary navigation.
* No dashboard.
* No analytics page.
* No calendar page.
* No profile page.
* No notifications page.
* No feature overload.

---

# Final UX Goal

The application should feel less like navigating an app and more like checking a study card.

The user should:

Open App

↓

See Current Subject

↓

Study

↓

Tap Complete

↓

Continue

Nothing else should interrupt the study flow.
