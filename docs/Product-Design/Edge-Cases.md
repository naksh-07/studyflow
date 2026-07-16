\# Edge Cases



\## Purpose



This document defines how the application should behave in uncommon or unexpected situations.



The goal is to ensure that the application always behaves predictably, remains reliable, and never leaves the user confused.



\---



\# EC-01



\## User opens the app before the first study session.



Expected Behaviour



\- Display the first study session.

\- Show the remaining time until it starts.

\- Do not mark any session as active before its start time.



\---



\# EC-02



\## User opens the app after today's final study session.



Expected Behaviour



\- Display today's completion summary.

\- Do not generate new study sessions.

\- Wait until the next day.



\---



\# EC-03



\## User wakes up late.



Expected Behaviour



\- Prompt the user to adjust today's timetable.

\- Generate a new timetable for today.

\- Preserve the original study order whenever possible.



\---



\# EC-04



\## User wakes up extremely late.



Example



3 PM



Expected Behaviour



\- Generate the most realistic remaining schedule.

\- Respect today's sleep time.

\- Protect deep-work sessions.

\- Remove lower-priority sessions if necessary.

\- Never generate impossible study sessions.



\---



\# EC-05



\## User forgets to adjust today's schedule.



Expected Behaviour



\- Continue using the current timetable.

\- Never assume the user's wake-up time automatically.

\- Allow the user to adjust the schedule later.



\---



\# EC-06



\## User skips one study session.



Expected Behaviour



\- Continue with the next available session.

\- Recalculate today's remaining schedule if necessary.

\- Do not cancel the entire day.



\---



\# EC-07



\## User skips today's current session.



Expected Behaviour



\- Remove only today's session.

\- Recalculate today's remaining timetable.

\- Keep the original timetable unchanged.



\---



\# EC-08



\## User skips multiple sessions.



Expected Behaviour



\- Recalculate after every skipped session.

\- Never modify future days.



\---



\# EC-09



\## User accidentally closes the application.



Expected Behaviour



\- Restore the latest saved state.

\- Resume from the current session.



\---



\# EC-10



\## Device loses internet connection.



Expected Behaviour



\- Continue working normally.

\- Save changes locally.

\- Synchronize automatically when internet becomes available.



\---



\# EC-11



\## User refreshes the page.



Expected Behaviour



\- Restore today's schedule.

\- Restore completed sessions.

\- Restore the current session.



\---



\# EC-12



\## Device restarts.



Expected Behaviour



\- Restore the latest saved state.

\- Continue today's schedule.



\---



\# EC-13



\## User marks the wrong session as completed.



Expected Behaviour



\- Allow completion only for the active session.



OR



\- Display a confirmation before completing another session.



\---



\# EC-14



\## Current time changes during study.



Expected Behaviour



\- Update the countdown automatically.

\- Keep the correct active session.



\---



\# EC-15



\## User leaves the application open for hours.



Expected Behaviour



\- Refresh the current session automatically.

\- Display the correct session when the user returns.



\---



\# EC-16



\## User reaches sleep time with unfinished sessions.



Expected Behaviour



\- End today's schedule.

\- Never move unfinished sessions to tomorrow automatically.



\---



\# EC-17



\## A new day begins.



Expected Behaviour



\- Generate a fresh schedule.

\- Reset today's state.

\- Keep the original timetable unchanged.



\---



\# EC-18



\## Break overlaps with sleep time.



Expected Behaviour



\- Remove the unnecessary break.

\- End today's schedule immediately.



\---



\# EC-19



\## User opens the application after several days.



Expected Behaviour



\- Ignore missed days.

\- Generate today's schedule only.



\---



\# EC-20



\## User changes wake-up time.



Expected Behaviour



\- Apply the new wake-up time from tomorrow.

\- Keep today's schedule unchanged.



\---



\# EC-21



\## User changes sleep time.



Expected Behaviour



\- Apply the new sleep time from tomorrow.

\- Keep today's schedule unchanged.



\---



\# EC-22



\## User edits the original timetable.



Expected Behaviour



\- Future schedules use the updated timetable.

\- Keep today's schedule unless the user regenerates it.



\---



\# EC-23



\## Application crashes unexpectedly.



Expected Behaviour



\- Restore the latest saved state.

\- Never lose completed progress.



\---



\# EC-24



\## No timetable exists.



Expected Behaviour



\- Display an empty state.

\- Ask the user to create a timetable.



\---



\# EC-25



\## Duplicate study sessions exist.



Example



Math



07:00



Math



16:00



Expected Behaviour



\- Allow duplicate subjects.

\- Treat every session independently using Session IDs.



\---



\# EC-26



\## Device time changes.



Example



The user manually changes the device clock or timezone.



Expected Behaviour



\- Detect the change.

\- Recalculate the current session if required.

\- Never lose today's progress.

\- Never generate duplicate sessions.



\---



\# EC-27



\## Sessions overlap after schedule adjustment.



Example



The user starts studying much later than planned.



Expected Behaviour



\- Never allow overlapping sessions.

\- Preserve the original study order whenever possible.

\- Protect deep-work sessions.

\- Remove the lowest-priority session(s) if required.

\- Never compress deep-work sessions into unrealistic durations.

\- Never create multiple active sessions.



\---



\# EC-28



\## No meaningful study time remains.



Example



Current Time



10:55 PM



Sleep Time



11:00 PM



Expected Behaviour



\- Do not generate a new timetable.

\- Inform the user that today's study time has ended.

\- Prepare tomorrow normally.



\---



\# EC-29



\## User completes sessions out of order.



Example



Physics is completed before Mathematics.



Expected Behaviour



\- Allow completion only for the active session.



OR



\- Require confirmation before completing another session.



\---



\# EC-30



\## User finishes a study session early.



Example



A 90-minute Mathematics session finishes in 50 minutes.



Expected Behaviour



\- Mark the session as completed.

\- Start the scheduled break immediately.

\- Keep the next study session at its planned start time.

\- If no break exists, display free time until the next session.

\- Never automatically shift the remaining timetable earlier.



\---



\# EC-31



\## User starts studying much later than planned.



Example



The user opens the application two hours after the first session should have started.



Expected Behaviour



\- Detect that the user is significantly behind schedule.

\- Prompt the user to adjust today's timetable.

\- Generate a realistic schedule.

\- Preserve the original study order.

\- Protect deep-work sessions.



\---



\# EC-32



\## Weekly Rest Day (Future Feature)



Expected Behaviour



\- Do not generate study sessions.

\- Display a calm Rest Day message.

\- Keep the original timetable unchanged.

\- Resume the normal schedule on the next study day.



Note



This edge case is reserved for a future version supporting weekly schedules.



\---



\# EC-33



\## Break interrupted.



Example



The user closes the application during a break.



Expected Behaviour



\- Restore the break when reopening the application.

\- If the break has already ended, activate the next study session.

\- Never lose today's progress.

\- Never require manual intervention.



\---



\# General Rules



The application should never:



\- Lose progress.

\- Lose today's timetable.

\- Corrupt the original timetable.

\- Display multiple active sessions.

\- Require timetable rebuilding.

\- Create impossible study plans.

\- Compress deep-work sessions into unrealistic durations.

\- Punish the user for missing sessions.



Whenever multiple valid solutions exist,



the engine should always choose the solution that:



\- Protects deep-work sessions.

\- Minimizes user effort.

\- Preserves the original study order.

\- Keeps the timetable realistic.



\---



\# Design Philosophy



Whenever an unexpected situation occurs,



the application should automatically choose the solution requiring the fewest actions from the user.



The user should spend time studying,



not managing the timetable.

