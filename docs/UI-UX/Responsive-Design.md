# Responsive Design

## Purpose

This document defines how the application adapts to different screen sizes and devices.

The goal is to provide a consistent experience while respecting the strengths of each device.

---

# Core Philosophy

The experience should remain consistent.

The layout may change.

The interaction should not.

Users should instantly recognize the application regardless of the device they are using.

---

# Supported Platforms

The application should work on:

* Mobile
* Tablet
* Desktop
* Installed PWA

The core experience should remain the same everywhere.

---

# Mobile First

The application is designed for mobile first.

Every feature should be designed and tested on a phone before adapting it to larger screens.

Mobile is the primary experience.

Desktop is secondary.

---

# Mobile Layout

The layout should be compact but comfortable.

Structure

Current Session

↓

Complete Button

↓

Next Session

↓

Progress

↓

Hamburger Menu

The entire interface should be reachable with one hand.

---

# Tablet Layout

Tablet should keep the same structure as mobile.

Only spacing should increase.

Cards may become wider.

No additional features should appear.

---

# Desktop Layout

Desktop should not become a dashboard.

Keep the same simple experience.

Allow more white space.

Increase maximum content width for readability.

Avoid stretching content across the full screen.

---

# Maximum Content Width

Content should remain centered.

Very wide layouts reduce readability.

The interface should always feel focused.

---

# Touch & Mouse Support

The application should work naturally with:

* Touch
* Mouse
* Trackpad
* Keyboard

No interaction should depend on a single input method.

---

# Navigation

Navigation should remain identical across devices.

Home always remains the primary screen.

The Hamburger Menu should behave consistently.

Avoid separate desktop navigation.

---

# PWA Experience

When installed as a PWA, the application should feel like a native app.

Requirements

* Full-screen experience
* Fast launch
* Offline support
* Automatic updates
* Smooth performance

The user should forget they are using a website.

---

# Orientation

Portrait is the primary orientation.

Landscape should remain fully usable.

The interface should adapt naturally without hiding important information.

---

# Scaling

Increase spacing before increasing the number of elements.

More screen space should create more breathing room.

Never add extra features simply because more space is available.

---

# Responsiveness Rules

* Scale layouts, not complexity.
* Preserve the visual hierarchy.
* Keep interactions identical.
* Avoid device-specific feature differences.
* Every platform should feel familiar.

---

# Performance

The interface should remain responsive on all supported devices.

Targets

* Fast startup
* Smooth scrolling
* Smooth animations
* Instant navigation

The application should always feel lightweight.

---

# Accessibility

Responsive design must also remain accessible.

Requirements

* Comfortable touch targets
* Readable text
* Consistent spacing
* Good contrast
* Keyboard accessibility on desktop

Accessibility should never be sacrificed for aesthetics.

---

# Things We Will Never Do

* Separate desktop-only features
* Separate mobile-only workflows
* Different navigation systems
* Dashboard layouts on large screens
* Fill empty space with unnecessary content

More screen space does not justify more complexity.

---

# Device Principles

## Mobile

Fast.

Focused.

One-handed.

---

## Tablet

Comfortable.

Spacious.

Familiar.

---

## Desktop

Minimal.

Centered.

Calm.

Never overwhelming.

---

# Final Goal

Regardless of the device,

the experience should always feel the same.

The user should open the application and immediately know what to study next.

The device changes.

The experience does not.
