\# Architecture



\## Purpose



This document defines the technical architecture of the application.



It establishes the technologies, engineering principles, project structure, coding standards, and system design before development begins.



The goal is to build a simple, scalable, maintainable, modern, and offline-first application.



\---



\# Architecture Philosophy



The architecture should be:



\- Simple

\- Predictable

\- Modular

\- Scalable

\- Maintainable

\- Offline First

\- Performance Focused



Every technical decision should reduce complexity rather than increase it.



\---



\# Architectural Principles



The architecture follows five core principles.



\## 1. Local First



The application should always work before synchronization.



Users should be able to study without an internet connection.



\---



\## 2. Engine Driven



Business rules belong inside the Scheduling Engine.



The UI only displays the engine's decisions.



\---



\## 3. Single Source of Truth



The original timetable is permanent.



Today's schedule is generated from it.



The original timetable should never be modified automatically.



\---



\## 4. Progressive Enhancement



Cloud synchronization improves the experience.



It is never required for studying.



\---



\## 5. Simplicity First



If a technical decision increases complexity without improving the user experience,



it should be rejected.



\---



\# Overall Architecture



```text

&#x20;                   User

&#x20;                     │

&#x20;                     ▼

&#x20;            Next.js Frontend

&#x20;                     │

&#x20;                     ▼

&#x20;         Local React State

&#x20;                     │

&#x20;                     ▼

&#x20;             IndexedDB Cache

&#x20;                     │

&#x20;                     ▼

&#x20;               Sync Engine

&#x20;                     │

&#x20;                     ▼

&#x20;         Cloudflare Workers API

&#x20;                     │

&#x20;                     ▼

&#x20;            Cloudflare D1 Database

```



Future Cloudflare services can be added without changing the core architecture.



\---



\# Technology Stack



\## Frontend



\- Next.js 15

\- React

\- TypeScript



\---



\## UI



\- Tailwind CSS

\- shadcn/ui

\- Lucide Icons

\- Motion



\---



\## Backend



\- Cloudflare Workers



\---



\## Database



\- Cloudflare D1



\---



\## ORM



\- Drizzle ORM



\---



\## Validation



\- Zod



\---



\## Forms



\- React Hook Form



\---



\## Deployment



\- Cloudflare Pages



\---



\## Package Manager



\- pnpm



\---



\# Why Cloudflare?



The project intentionally uses the Cloudflare ecosystem.



Benefits



\- Edge-first architecture

\- Excellent performance

\- Low operational cost

\- Simple deployment

\- Easy scaling

\- Modern developer experience



Future services can be added easily.



Examples



\- Cloudflare KV

\- Cloudflare R2

\- Cloudflare Queues

\- Cloudflare Analytics



\---



\# Project Structure



```text

studyflow/



├── app/

├── components/

├── hooks/

├── lib/

├── services/

├── types/

├── styles/

├── public/

├── docs/

├── tests/

└── package.json

```



Every folder should have one clear responsibility.



\---



\# Component Structure



```text

components/



├── ui/

├── study/

├── layout/

└── shared/

```



\### ui/



Reusable generic components.



Examples



\- Button

\- Card

\- Dialog



\---



\### study/



Study-specific components.



Examples



\- StudySessionCard

\- ProgressIndicator

\- SubjectCard



\---



\### layout/



Layout components.



Examples



\- Header

\- BottomSheet

\- Navigation



\---



\### shared/



Reusable application components.



Examples



\- ThemeProvider

\- Loading

\- ErrorMessage



\---



\# Naming Convention



Folders



kebab-case



Examples



study-session



bottom-sheet



\---



Files



PascalCase



Examples



StudySessionCard.tsx



CompleteButton.tsx



\---



Variables



camelCase



Examples



currentSession



remainingTime



\---



Constants



UPPER\_SNAKE\_CASE



Examples



MAX\_SESSION\_TIME



DEFAULT\_THEME



\---



Types



PascalCase



Examples



StudySession



UserSettings



TodayState



\---



\# Routing



Keep routing minimal.



```text

/



Home



/setup



Timetable Setup

```



Everything else should use Bottom Sheets or Dialogs.



Avoid unnecessary pages.



\---



\# State Management



Keep state management simple.



Client State



\- React State

\- React Context



Server State



\- TanStack Query



Avoid unnecessary global state.



Do not introduce Redux unless absolutely necessary.



\---



\# Local Data Strategy



The application follows a Local-First architecture.



During normal use,



the browser becomes the first source of truth.



```text

User



↓



React State



↓



IndexedDB



↓



Sync Queue



↓



Cloudflare Workers



↓



Cloudflare D1

```



Rules



\- Apply every action locally first.

\- Synchronize automatically.

\- Temporary network failures must never interrupt studying.

\- Users should never manually synchronize.

\- The latest successful local action wins.



\---



\# Database Architecture



Core tables



\- users

\- timetable

\- today\_state

\- preferences



Store only permanent information.



Temporary schedules should always be generated by the Scheduling Engine.



Avoid storing calculated values whenever possible.



\---



\# Business Logic



The Scheduling Engine owns all timetable decisions.



Responsibilities



\- Generate today's schedule

\- Adjust today's schedule

\- Handle late start

\- Handle early completion

\- Generate breaks

\- Skip today's session

\- Protect deep-work sessions

\- Daily reset

\- Progress calculation



The UI should never contain scheduling logic.



\---



\# Data Flow



```text

User Action



↓



UI



↓



Scheduling Engine



↓



Local React State



↓



IndexedDB



↓



Sync Queue



↓



Cloudflare Worker



↓



Cloudflare D1



↓



UI Updates

```



The user should never think about storage or synchronization.



\---



\# API Design



The API should remain small.



GET



\- Today's Schedule



POST



\- Complete Session

\- Adjust Today's Schedule

\- Skip Session



PUT



\- Update Timetable

\- Update Settings



The API should expose business actions,



not database operations.



\---



\# Styling



Use



\- Tailwind CSS

\- CSS Variables



Avoid



\- Inline styles

\- Multiple styling systems



The Design System remains the single source of truth.



\---



\# Motion



Use Motion for all animations.



Rules



\- Fast

\- Smooth

\- Purposeful



Animations explain state changes.



Avoid decorative motion.



\---



\# Error Handling



Errors should be predictable.



Rules



\- Never lose user progress.

\- Always display helpful messages.

\- Recover gracefully whenever possible.

\- Fail safely.



\---



\# Offline Strategy



Offline capability is a core feature.



Requirements



\- Open without internet.

\- Continue studying offline.

\- Save locally.

\- Synchronize automatically.

\- Retry failed synchronizations silently.



The user should never notice connectivity changes.



\---



\# Performance Goals



Application Startup



< 2 seconds



Navigation



Instant



Interactions



Responsive



Lighthouse



95+



PWA Score



100 (Target)



Performance is considered a feature.



\---



\# Coding Standards



\- Keep functions small.

\- Prefer composition over inheritance.

\- Keep components focused.

\- Avoid duplicated logic.

\- Write readable code before clever code.

\- Follow TypeScript strictly.

\- Keep files organized.

\- One responsibility per file.



\---



\# Git Strategy



Main



Stable production-ready code.



Feature Branches



One feature per branch.



Examples



feature/home-screen



feature/engine



feature/theme



feature/offline-sync



Merge only after testing.



\---



\# Deployment



```text

Development



↓



Git Push



↓



Cloudflare Pages



↓



Automatic Build



↓



Production

```



Deployment should require no manual steps.



\---



\# Future Scalability



The architecture should support future features without redesign.



Possible additions



\- Cloud Sync

\- Multiple Timetables

\- Backup \& Restore

\- Notifications

\- Multi-language Support

\- Analytics

\- Calendar Integration

\- Wearable Notifications



Future features should extend the architecture,



not replace it.



\---



\# Engineering Principles



\- Simplicity over complexity.

\- Performance over unnecessary abstraction.

\- Readability over cleverness.

\- Automation over manual work.

\- Reuse over duplication.

\- Consistency over creativity.

\- Business logic belongs inside the Scheduling Engine.

\- The UI displays decisions rather than making them.



Every engineering decision should support these principles.



\---



\# Final Goal



The application should remain:



\- Small

\- Fast

\- Reliable

\- Offline-first

\- Easy to maintain



The Scheduling Engine should contain the intelligence.



The interface should remain simple.



The infrastructure should remain invisible.



A user should be able to:



\- Open the application.

\- Study.

\- Close the application.

\- Reopen it.

\- Continue seamlessly.



The user should never need to think about storage, synchronization, or infrastructure.



When a new developer joins the project,



they should understand the architecture within a few minutes and confidently begin contributing.

