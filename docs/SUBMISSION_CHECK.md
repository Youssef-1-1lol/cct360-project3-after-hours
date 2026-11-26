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
| Organized HTML/CSS/JS and attribution | Files separated by role; README, presentation credits and code walkthrough include assistance/asset details |

## Verification completed

- JavaScript syntax check passed.
- HTML parser check: unique IDs, direct JavaScript ID targets, five scenes, and all local CSS/JS dependencies present.
- **17 DOM integration checks passed** using the real application script with LinkeDOM. These cover initialization, keyboard dial events, duplicate dismissal protection, full dismissal, sorting via buttons and simulated pointer events, invalid drops, threshold endpoints, personalized and skipped endings, restart, pending-timer cancellation, backward navigation, motion state and label targets.
- Fixed: paused animation previously could leave a new scene frozen at its entrance frame. Paused mode now disables animation rather than freezing it partway through.
- Added a no-JavaScript explanation and removed an audio-related phrase that could imply sound exists.

## Verification limits

DOM simulation is not a real browser. It does not validate pixel layout, native touch scrolling, actual pointer capture, native dialog focus trapping, browser rendering or screen-reader output. The automatic browser launch is blocked by macOS process permissions, including a fresh headless test runtime. No agent-produced live browser screenshots or actual phone/device checks have been claimed. The user-reported five-scene browser check is recorded separately below.

## Completed delivery preparation

- Public repository created and genuine development commits pushed to main.
- GitHub Pages site returned HTTP 200. Public HTML, CSS and JavaScript match the current source; the Info paragraph removal was separately verified on the live site.
- Youssef confirmed that all five scenes looked and worked properly in the open browser on November 25, 2026. This is a user-reported browser check, not an automated visual/mobile audit.
- Seven-slide editable deck rendered and visually reviewed slide by slide. It covers the concept, experience flow, interaction/navigation, technical features, visual design, rationale, challenge, limitations, references and both clickable project URLs.
- PPTX package, layout/font declarations, seven-slide count and first-party reimport checked by the presentation finalizer.
- Source ZIP regenerated from the completed repository and checked for integrity and matching HTML/CSS/JS. Git metadata and dependencies excluded.
- Recording prompts and live code walkthrough guidance prepared.

## Still required

1. Youssef records the five-minute presentation and checks its audio, screen and any intended camera view.
2. Add that recording to the final coursework package/submission.
3. Prepare to explain the code if selected in class.
4. Ask before final Quercus submission, following the user’s standing preference.

## Rubric focus

Concept and experience: 8 points. Technical proficiency: 8 points. Documentation and presentation: 4 points. Passing implementation checks alone cannot guarantee full marks or replace the remaining deliverables.
