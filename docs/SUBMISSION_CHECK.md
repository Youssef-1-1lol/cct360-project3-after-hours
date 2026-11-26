# Submission audit

Checked November 25, 2026 against the assignment instructions retained in REQUIREMENTS.md. This is a development record, not an assertion that the full coursework is ready or submitted.

## Website requirements implemented

| Requirement | Evidence |
|---|---|
| Experimental interface, not a standard portfolio | An attention-themed sequence in which the visitor removes and sorts content; no conventional article, résumé or portfolio layout |
| Four to six states | Five sections: Arrival, Noise, Untangling, Boundary, After hours |
| Three or more dynamic behaviours | Dial rotation, notification removal/counting, thought placement, threshold-driven opacity/text, ending based on actual choices |
| Two unconventional navigation/reveal mechanisms | Rotary dial to enter; swipe-to-clear interruptions to reveal the next step; drag-to-place thoughts adds another gesture |
| Two animations/transitions | Scene fade/movement, notification entry/exit, ambient drift and clock blink |
| Responsive CSS | Fluid typography and widths, wrapping thought controls, 800px and 480px breakpoints; rendered visual inspection still outstanding |
| Organized HTML/CSS/JS and attribution | Files separated by role; README, About panel and code walkthrough document include assistance/asset details |

## Verification completed

- JavaScript syntax check passed.
- HTML parser check: unique IDs, direct JavaScript ID targets, five scenes, and all local CSS/JS dependencies present.
- **17 DOM integration checks passed** using the real application script with LinkeDOM. These cover initialization, keyboard dial events, duplicate dismissal protection, full dismissal, sorting via buttons and simulated pointer events, invalid drops, threshold endpoints, personalized and skipped endings, restart, pending-timer cancellation, backward navigation, motion state and label targets.
- Fixed: paused animation previously could leave a new scene frozen at its entrance frame. Paused mode now disables animation rather than freezing it partway through.
- Added a no-JavaScript explanation and removed an audio-related phrase that could imply sound exists.

## Verification limits

DOM simulation is not a real browser. It does not validate pixel layout, native touch scrolling, actual pointer capture, native dialog focus trapping, browser rendering or screen-reader output. The local Playwright launch could not run here: its bundled browser is missing and the available Chrome process exits immediately. No live browser screenshots or actual phone/device checks have been claimed.

## Remaining before a complete submission

1. Check all five scenes in an actual browser at desktop and phone widths, including scroll/overlap, both gesture and keyboard routes, pause/reduced motion, dialog and restart.
2. Publish a public GitHub repository and GitHub Pages site, push the real local commits, then verify both public URLs. No remote is configured in this repository yet.
3. Create and visually verify the required 5–7-slide deck. Include the verified live and repository URLs, overview, interactions/navigation, technical features, visual choices, rationale, challenges/learnings and references/credits.
4. Record the student’s five-minute presentation, using the actual project and an accurate account of their contribution. Do not claim this recording already exists.
5. Regenerate the final source ZIP after any remaining fixes; exclude `.git`, dependencies and temporary outputs.
6. Student reviews code walkthrough and prepares for possible 2–3-minute live explanation.
7. Ask before final Quercus submission, following the user’s standing preference.

## Rubric focus

Concept and experience: 8 points. Technical proficiency: 8 points. Documentation and presentation: 4 points. Passing implementation checks alone cannot guarantee full marks or replace the remaining deliverables.
