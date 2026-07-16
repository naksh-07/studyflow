# StudyFlow Database Architecture (Sprint V1 Finalization)

This document describes the production database architecture of StudyFlow, implemented on top of SQLite/Cloudflare D1 via Drizzle ORM.

## Entity Relationship Diagram (Conceptual)

```text
  ┌─────────────────┐
  │      users      │
  └────────┬────────┘
           │ (1:1 / 1:N)
           ├────────────────────────────┐
           ▼ (1:N)                      ▼ (1:N)
  ┌─────────────────┐          ┌─────────────────┐
  │   timetables    │          │    subjects     │
  └────────┬────────┘          └────────┬────────┘
           │ (1:N)                      │ (1:1 / Set Null)
           ▼                            │
  ┌─────────────────┐                   │
  │ schedule_blocks ◄───────────────────┘
  └────────┬────────┘
           │ (N:1 / Set Null)
           ▼
  ┌─────────────────┐
  │ recurrence_rules│
  └─────────────────┘

  ┌─────────────────┐          ┌─────────────────┐
  │ today_schedule  │          │    sessions     │
  └─────────────────┘          └─────────────────┘
  (Dynamic/Snapshots)          (Legacy / Backward-Compatible App State)
```

---

## Production Tables & Schema Reference

### 1. `users`
Tracks both logged-in users and Google OAuth identifiers for future integration.
* **Fields**:
  * `id`: `text` (UUID, Primary Key)
  * `email`: `text` (Unique, indexable)
  * `googleId`: `text` (Google sub, indexable)
  * `displayName`: `text`
  * `avatarUrl`: `text`
  * `createdAt`: `timestamp`
  * `updatedAt`: `timestamp`
* **Indexes**:
  * `users_email_idx` on `email`
  * `users_google_id_idx` on `google_id`

### 2. `timetables`
Organizes schedule blocks. Fully supports multi-device and travel timezone scenarios.
* **Fields**:
  * `id`: `text` (UUID, Primary Key)
  * `userId`: `text` (Foreign key referencing `users.id` with `cascade` delete)
  * `name`: `text`
  * `isActive`: `boolean` (Default: `false`)
  * `timezone`: `text` (Default: `'UTC'`, stores timetable timezone)
  * `createdAt`: `timestamp`
  * `updatedAt`: `timestamp`
* **Indexes**:
  * `timetables_user_id_idx` on `user_id`

### 3. `subjects`
User-authored study subjects.
* **Fields**:
  * `id`: `text` (UUID, Primary Key)
  * `userId`: `text` (Foreign key referencing `users.id` with `cascade` delete)
  * `name`: `text`
  * `color`: `text`
  * `createdAt`: `timestamp`
  * `updatedAt`: `timestamp`
* **Indexes**:
  * `subjects_user_id_idx` on `user_id`

### 4. `schedule_blocks`
Describes what happens on a schedule. Operates independently of the occurrence recurrence logic.
* **Fields**:
  * `id`: `text` (UUID, Primary Key)
  * `timetableId`: `text` (Foreign key referencing `timetables.id` with `cascade` delete)
  * `subjectId`: `text` (Foreign key referencing `subjects.id` with `set null` delete)
  * `startTime`: `text` (HH:mm format)
  * `endTime`: `text` (HH:mm format)
  * `durationMinutes`: `integer`
  * `recurrenceRuleId`: `text` (Foreign key referencing `recurrence_rules.id` with `set null` delete)
  * `createdAt`: `timestamp`
  * `updatedAt`: `timestamp`
* **Indexes**:
  * `schedule_blocks_timetable_id_idx` on `timetable_id`
  * `schedule_blocks_subject_id_idx` on `subject_id`
  * `schedule_blocks_recurrence_rule_id_idx` on `recurrence_rule_id`

### 5. `recurrence_rules`
Defines the repeating characteristics of schedule blocks without duplicating records.
* **Fields**:
  * `id`: `text` (UUID, Primary Key)
  * `frequency`: `text` (Supports `'once' | 'daily' | 'weekly' | 'weekdays' | 'monthly' | 'yearly' | 'custom_days' | 'custom_weeks'`)
  * `interval`: `integer` (Default: `1`)
  * `daysOfWeek`: `text` (JSON-serialized array of day numbers)
  * `startDate`: `text` (YYYY-MM-DD)
  * `until`: `text` (YYYY-MM-DD, optional)
  * `count`: `integer` (optional)
  * `createdAt`: `timestamp`
  * `updatedAt`: `timestamp`

---

## Migration & Backward Compatibility Notes

* **Cascading Behavior**: Cascading deletion is fully configured. Deleting a User cascadingly deletes all of their Timetables, Subjects, Settings, and Schedules. Deleting a Timetable deletes all of its child Schedule Blocks.
* **Referential Integrity**: Proper relational integrity prevents orphaned records (e.g., setting `subject_id` to `set null` on Schedule Blocks if the corresponding subject is removed).
* **Zero Breaking Changes**: To preserve existing browser, IndexedDB, and API integrations, the `sessions` and `today_schedule` tables remain intact and fully synchronized. Writes to the original timetable write to both the legacy `sessions` table (with embedded recurrence JSON) and the new normalized `schedule_blocks` and `recurrence_rules` relational tables.
