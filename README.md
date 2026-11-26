# After Hours

An individual CCT360 Project 3, **Expressive Interfaces**, by Youssef Alhabbal.

A quiet interactive journey about leaving a crowded digital day behind. The visitor turns a dial, dismisses fictional interruptions, gives thoughts a place, and chooses how much visual noise to let through. The final scene reflects their choices without rating them.

## Run

Open `index.html` directly, or serve this folder with `python3 -m http.server 8773` and visit http://localhost:8773. No installation, API, account, key, audio, remote font or internet connection is needed for the experience itself.

## Five states

1. **Arrival:** turn the night dial clockwise to 100%, use its arrow keys, or press the begin button.
2. **The noise:** swipe five fictional notifications horizontally by at least 75 pixels, or use their dismiss buttons.
3. **The untangling:** drag three thoughts into Keep close / Let it wait. Alternatively, select a thought and activate either zone by keyboard or touch.
4. **The boundary:** move the threshold slider. Words fade, the boundary moves and the wording changes with the threshold.
5. **After hours:** see an ending based on your actual dismissal and sorting choices. Restart resets those choices. No score, countdown or required waiting period appears.

Journey dots allow direct navigation to every scene, including skipping gestures. The Previous moment button returns without losing state. The wordmark returns to Arrival without resetting the night. Only Begin another night clears progress.

## Interaction as meaning

The early notification list has irregular offsets and more competing text. Dismissing messages removes that visual clutter. Sorting requires deciding what deserves attention rather than simply scrolling to another paragraph. The threshold turns a personal boundary into a visible, adjustable relationship between outside words and a quiet centre. The last scene offers no new task.

There is no research claim that this experience improves wellbeing. All notifications are fictional. No real notifications, accounts, device settings, personal information or medical measurements are accessed. Choices live in memory only and reset when the page reloads.

## Code map

- `index.html`: semantic five-scene structure, buttons, labelled slider, live status and About dialog.
- `style.css`: layout, responsive breakpoints, CSS variables, scene transitions, notification exit and ambient animation.
- `script.js`: one shared state object, DOM creation, event listeners, Pointer Events, conditionals, sorting, reset and accessible alternatives.
- `docs/REQUIREMENTS.md`: assignment checklist and remaining deliverables.
- `docs/CODE_WALKTHROUGH.md`: explanation and questions for the possible live code walkthrough.

## Accessibility

Every gesture has a button or keyboard equivalent. Scene changes move focus to the new heading; inactive scenes use `hidden`. Buttons have clear names and focus outlines. A live region announces meaningful changes. The dialog supports Escape through the native dialog element. Reduced motion is respected, and the Pause motion control disables transitions and freezes decorative animation. Pausing never blocks a required action.

## Credits and assistance

Original fictional interface copy and CSS scenes were prepared for this project with OpenAI Codex assistance. No external imagery, font, audio, library, API or template asset is included. The interface uses system Arial and Georgia fallback fonts.

Youssef should review and personalize the work, understand its logic and disclose AI assistance according to the course requirements. Actual commits record development milestones; they do not claim classroom attendance, earlier work dates or unaided authorship.

## Development checks

The website itself has no package dependencies. Optional test dependencies are separate: run `pnpm install`, then `pnpm test` for the DOM integration suite and `pnpm check` for syntax. The test file executes the real app script with a simulated document, including simulated pointer events. It is not a replacement for real touch, keyboard, screen-reader or visual browser checks.

## Verification status and remaining deliverables

JavaScript syntax, HTML/source consistency and 17 DOM integration checks passed on November 25, 2026. Fixed a paused-animation bug that could hide a newly opened scene. Actual pointer, keyboard and responsive browser behaviour still needs a browser review before calling the website submission-ready. See `docs/SUBMISSION_CHECK.md` for the exact evidence and limits.

Not yet completed: public GitHub repository/Pages publication, final visual browser check, final source ZIP, 5–7-slide deck and the student’s five-minute recorded presentation. Git commits are currently local until the new remote is created and pushed. No final Quercus submission has been made.
