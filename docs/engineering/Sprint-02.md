# Sprint 02 — Database Foundation

## Sprint Summary

Sprint 02 establishes the complete data layer for StudyFlow.

This sprint focuses on creating a clean, scalable, and production-ready database foundation.

No scheduling logic will be implemented.

No business rules will exist.

The database should simply store and retrieve data.

---

# Sprint Goal

Build a reliable data layer that supports future Scheduling Engine development.

At the end of this sprint:

- Database schema exists
- Migrations work
- Type-safe database access exists
- CRUD operations work
- Local development works
- Cloud deployment is ready

---

# Sprint Scope

## Included

- Cloudflare D1
- Drizzle ORM
- Database Schema
- Migrations
- Type-safe Queries
- Database Utilities
- Repository Layer
- Basic CRUD Operations
- Seed Data (Development Only)

---

## Not Included

- Scheduling Engine
- Session Calculations
- Progress Logic
- Break Logic
- Daily Reset
- UI Integration
- Authentication
- API Routes
- Background Sync

---

# Required Documentation

Use only these documents.

- Architecture.md
- Database-Planning.md
- Definition-of-Done.md

Ignore all other documents.

---

# Deliverables

## Database

Configure Cloudflare D1.

Create local and production database configuration.

---

## ORM

Configure Drizzle ORM.

Generate schema.

Generate migrations.

Enable type-safe queries.

---

## Database Tables

Create every table defined in Database-Planning.md.

Examples

- Users
- Timetables
- Subjects
- TodaySchedule
- Sessions
- Settings

No extra tables.

---

## Relationships

Implement all foreign key relationships.

Use proper constraints.

Avoid duplicated data.

---

## Indexes

Create indexes defined in Database-Planning.md.

Optimize for

- Today's Schedule
- Session Lookup
- User Settings

---

## Repository Layer

Create a clean repository layer.

Examples

```text
repositories/

user.repository.ts

timetable.repository.ts

session.repository.ts

settings.repository.ts
```

Repositories should only communicate with the database.

No business logic.

---

## Database Utilities

Create

- Database Client
- Migration Runner
- Seed Script
- Connection Helper

Keep utilities reusable.

---

## Type Safety

Generate TypeScript types directly from Drizzle schema.

Avoid duplicate interface definitions.

Database schema should be the single source of truth.

---

## Seed Data

Create development seed data.

Example

Wake Time

06:00

Sleep Time

23:00

Subjects

- Mathematics
- Physics
- Biology
- Reasoning
- Revision

Seed data should exist only for development.

---

# Folder Structure

Expected additions

```text
db/

schema/

migrations/

repositories/

seed/

```

Keep database code isolated.

---

# Engineering Rules

During Sprint 02

Do

- Keep repositories small.
- Follow repository pattern.
- Write type-safe queries.
- Centralize database access.

Do Not

- Write scheduling logic.
- Calculate session durations.
- Generate today's schedule.
- Handle business rules.
- Add placeholder code.

---

# CRUD Operations

Every table should support

- Create
- Read
- Update
- Delete

Use repositories only.

UI should never access the database directly.

---

# Manual Testing

Verify

- Database connects successfully
- Migrations execute successfully
- Tables are created correctly
- Foreign keys work
- CRUD operations work
- Seed script executes
- TypeScript passes
- Build succeeds

---

# Acceptance Criteria

Sprint 02 is complete only if

- Database schema matches Database-Planning.md
- Drizzle configuration works
- Migrations execute correctly
- CRUD operations succeed
- Seed data loads
- No TypeScript errors
- No database warnings
- No duplicated schema

---

# Risks

Possible issues

- Migration failures
- Schema mismatch
- Incorrect foreign keys
- Type inference problems
- Cloudflare D1 configuration issues

Resolve before closing Sprint.

---

# Review Checklist

Review

- Schema quality
- Table naming
- Relationships
- Indexes
- Repository structure
- Type safety
- Migration quality
- Code readability

---

# Git Strategy

Branch

```text
feature/database-foundation
```

Suggested commits

```text
feat: configure drizzle orm

feat: configure cloudflare d1

feat: create database schema

feat: generate migrations

feat: implement repositories

feat: add seed data
```

---

# Definition of Done

Sprint 02 is complete when

- Database is operational
- Schema is finalized
- Repositories are implemented
- CRUD works
- Migrations succeed
- Build passes
- Code review passes
- No critical issues remain

---

# Out of Scope

The following belong to future sprints

- Scheduling Engine
- Just Woke
- Break Generation
- Daily Reset
- Progress Calculation
- API Endpoints
- IndexedDB
- Sync Engine
- Notifications

Do not implement them.

---

# Sprint Handoff

## Next Sprint

Sprint 03 — Scheduling Engine

### Required Documents

- Engine-Rules.md
- Decision-Trees.md
- Edge-Cases.md
- Database-Planning.md
- Definition-of-Done.md

### Expected Output

A standalone Scheduling Engine capable of

- Generating Today's Schedule
- Adjusting Schedule
- Skip Session
- Complete Session
- Break Generation
- Daily Reset
- Deep Work Protection

The engine must remain completely independent of the UI and database.

Do not begin Sprint 03 until Sprint 02 has been reviewed and approved.

---

# Expected Result

At the end of Sprint 02,

StudyFlow should have a complete, production-ready database layer.

The database should store information efficiently, remain fully type-safe, and be ready for seamless integration with the Scheduling Engine in Sprint 03.

No business logic should exist.

The database should only persist data.