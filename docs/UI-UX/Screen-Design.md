\# Screen Design



\## Purpose



This document defines the layout, hierarchy, and behavior of every screen in the application.



It focuses on user experience before any visual design or implementation begins.



\---



\# Screen Philosophy



The application should feel like one continuous experience.



The Home screen is the product.



Everything else exists only to support it.



The user should spend almost all of their time on the Home screen.



\---



\# Screen List



The application contains only two primary screens.



1\. Home

2\. Timetable Setup



Everything else should appear as a Bottom Sheet or Dialog.



\---



\# Home Screen



\## Purpose



The Home screen should answer one question immediately.



\*\*"What should I study right now?"\*\*



The answer should be visible the moment the application opens.



\---



\## Layout



```text

──────────────────────────────



Current Session



Mathematics



07:00 – 08:30



42 min remaining



\[ ✓ Complete ]



──────────────────────────────



Next Session



Physics



08:45 – 10:15



──────────────────────────────



✓ 4 / 6 Sessions Completed



──────────────────────────────



☰



──────────────────────────────

```



\---



\## Visual Hierarchy



Every Home screen should follow this order.



1\. Current Session

2\. Complete Button

3\. Next Session

4\. Today's Progress

5\. Hamburger Menu



Nothing should compete with the current session.



\---



\## Behaviour



The Home screen updates automatically.



Examples



\- Session completed

\- Time changes

\- Today's schedule adjusted

\- Schedule recalculated



No manual refresh is required.



\---



\## Contextual Prompt



If the user opens the application after missing one or more scheduled sessions,



display:



```text

Looks like you're starting late.



Would you like to adjust today's schedule?



\[ Adjust Today's Schedule ]

```



This prompt should appear only when needed.



The option should also remain available inside the Hamburger Menu.



\---



\# Home Screen States



The Home screen can exist in only one state at a time.



\- Study Session

\- Break Session

\- Free Time

\- Day Completed

\- No Timetable



The layout remains consistent across every state.



Only the displayed content changes.



\---



\# Timetable Setup



\## Purpose



Create or edit the original timetable.



This screen is primarily used during first-time setup.



Daily usage should rarely require opening this screen.



\---



\## Layout



```text

──────────────────────────────



Daily Timetable



──────────────────────────────



Wake Time



\[06:00]



──────────────────────────────



Sleep Time



\[23:00]



──────────────────────────────



Subject        Start Time



Math           07:00



Physics        09:00



Reasoning      11:00



Biology        14:00



Revision       20:00



──────────────────────────────



\+ Add Subject



──────────────────────────────



Save



──────────────────────────────

```



The application automatically calculates:



\- Session Duration

\- End Time

\- Breaks



The user only provides:



\- Subject

\- Start Time



\---



\# Hamburger Menu



The menu should remain short.



```text

☰



Adjust Today's Schedule



──────────────



Skip Session For Today



──────────────



Edit Timetable



──────────────



Dark Mode



──────────────



About

```



Every menu item should support the current study session without distracting from it.



\---



\# Bottom Sheets



Use Bottom Sheets instead of additional screens whenever possible.



Current Bottom Sheets



\- Skip Session Confirmation

\- About

\- Dark Mode



Bottom Sheets should be lightweight and dismiss easily.



\---



\# Dialogs



Dialogs should be rare.



Use them only when confirmation is required.



Example



```text

Skip this session for today?



\[ Skip ]



\[ Cancel ]

```



Dialogs should never interrupt the study flow unnecessarily.



\---



\# Empty State



If no timetable exists,



display:



```text

No Timetable Found



Create your daily study routine to get started.



Estimated setup time: Less than 2 minutes.



\[ Create Timetable ]

```



The next action should always be obvious.



\---



\# Loading State



Loading should feel almost invisible.



Use subtle placeholders or lightweight loading indicators.



Avoid blocking the interface.



\---



\# Error State



Errors should remain calm and helpful.



Example



```text

Unable to update today's schedule.



Please try again.

```



Never blame the user.



\---



\# Success State



Use subtle confirmation messages.



Examples



```text

Session Completed



Take your scheduled break.

```



or



```text

Session Completed



Next session starts at 08:45.

```



Messages should disappear automatically.



\---



\# Navigation



```text

First Launch



↓



Timetable Setup



↓



Home



↓



Bottom Sheet



↓



Home

```



The user should never be more than one interaction away from returning to the Home screen.



\---



\# Screen Design Principles



\- One screen should have one purpose.

\- Home is always the primary screen.

\- The current session receives the highest visual attention.

\- Navigation should remain minimal.

\- Secondary actions belong inside the Hamburger Menu.

\- Empty space improves focus.

\- Every interaction should reduce effort.

\- Every screen should feel calm.

\- The user should always understand what to do next without thinking.



\---



\# Final UX Goal



The application should feel effortless.



The complete experience should always be:



```text

Open App



↓



Instantly understand the current session



↓



Study



↓



Complete the session



↓



Take a scheduled break (if applicable)



↓



Continue with the next session



↓



Finish the day without managing the timetable

```



The interface should quietly disappear into the background while the user remains focused on studying.



The application should never become another productivity dashboard.



It should simply become the user's daily study companion.

