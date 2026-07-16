\# Decision Trees



\## Purpose



This document defines how the scheduling engine makes decisions.



Instead of documenting every feature separately, the decision trees are organized by engine modules.



Each engine is responsible for one area of the application's behavior.



\---



\# DT-01 — Wake Engine



User starts studying



↓



Is current time after today's sleep time?



├── Yes



│



▼



End Today's Schedule



↓



Show



"Today's study time has ended."



│



└── No



↓



Calculate Wake Delay



↓



Is user on time?



├── Yes



│



▼



Generate Original Schedule



↓



Display Home Screen



│



└── No



↓



Can remaining sessions still fit?



├── Yes



│



▼



Shift Remaining Schedule



↓



Preserve Study Order



│



└── No



↓



Protect Deep Work Sessions



↓



Remove Lowest Priority Session(s)



↓



Generate Updated Schedule



↓



Display Updated Timetable



\---



\# DT-02 — Session Engine



Current Session



↓



User taps Complete?



├── No



│



▼



Continue Current Session



│



└── Yes



↓



Is this the active session?



├── No



│



▼



Ignore



│



└── Yes



↓



Mark Session Completed



↓



Did user finish early?



├── Yes



│



▼



Start Scheduled Break



↓



Keep Next Session Time



↓



Show



"You have free time until your next session."



│



└── No



↓



Start Scheduled Break (if applicable)



↓



Activate Next Session



↓



Update Progress



\---



\# DT-03 — Schedule Engine



User skips today's session



↓



Remove Session From Today's Schedule



↓



Any Sessions Remaining?



├── No



│



▼



End Today's Schedule



│



└── Yes



↓



Recalculate Remaining Schedule



↓



Any Overlap?



├── Yes



│



▼



Resolve Overlap



│



└── No



↓



Display Updated Timetable



\---



\# DT-04 — Progress Engine



App Opens



↓



Load Today's State



↓



Is Current Session Completed?



├── Yes



│



▼



Display Next Session



│



└── No



↓



Display Current Session



↓



Progress Updated?



├── Yes



│



▼



Save Automatically



│



└── No



↓



Continue



\---



\# DT-05 — Daily Reset Engine



App Opens



↓



Is Today Different From Last Active Day?



├── No



│



▼



Restore Today's Schedule



│



└── Yes



↓



Generate Fresh Schedule



↓



Reset Today's State



↓



Keep Original Timetable



↓



Display First Session



\---



\# DT-06 — Break Engine ⭐



Study Session Ends



↓



Is Break Required?



├── No



│



▼



Activate Next Study Session



│



└── Yes



↓



Generate Break



↓



Break Ends?



├── No



│



▼



Continue Break



│



└── Yes



↓



Activate Next Study Session



\---



\# Decision Priorities



Whenever multiple valid decisions exist,



the engine should always follow this order.



1\. Protect deep-work sessions.

2\. Preserve the original study order.

3\. Preserve automatic breaks whenever possible.

4\. Keep today's timetable realistic.

5\. Respect the user's sleep time.

6\. Reduce manual effort.

7\. Never modify the original timetable.

8\. Never create overlapping sessions.



\---



\# Global Decision Rules



Every engine must follow these principles.



\- Always save automatically.

\- Never ask unnecessary questions.

\- Never require manual timetable rebuilding.

\- Never generate impossible schedules.

\- Never lose completed progress.

\- Never modify the original timetable.

\- Never create multiple active sessions.

\- Prefer the simplest solution.

\- Adapt quietly without interrupting the user's study.



\---



\# Engine Overview



```text

&#x20;                User Action

&#x20;                     │

&#x20;                     ▼

&#x20;             ┌─────────────────┐

&#x20;             │   Wake Engine   │

&#x20;             └─────────────────┘

&#x20;                     │

&#x20;                     ▼

&#x20;             ┌─────────────────┐

&#x20;             │ Schedule Engine │

&#x20;             └─────────────────┘

&#x20;                     │

&#x20;                     ▼

&#x20;             ┌─────────────────┐

&#x20;             │ Session Engine  │

&#x20;             └─────────────────┘

&#x20;                     │

&#x20;                     ▼

&#x20;             ┌─────────────────┐

&#x20;             │  Break Engine   │

&#x20;             └─────────────────┘

&#x20;                     │

&#x20;                     ▼

&#x20;             ┌─────────────────┐

&#x20;             │ Progress Engine │

&#x20;             └─────────────────┘

&#x20;                     │

&#x20;                     ▼

&#x20;             ┌─────────────────┐

&#x20;             │ Daily Reset     │

&#x20;             │     Engine      │

&#x20;             └─────────────────┘

```



\---



\# Success Criteria



A successful decision engine is one where:



\- The user never wonders what to study next.

\- One missed session never ruins the day.

\- Deep-work sessions remain protected.

\- The timetable adapts automatically.

\- Breaks happen naturally.

\- The user only studies while the engine handles everything else.

