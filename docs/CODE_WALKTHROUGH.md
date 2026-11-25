# Understanding After Hours

## Explain the idea simply

“My interface is about ending a digital day. Rather than showing an article about distraction, it lets you move through it. You remove interruptions, decide what to keep close and change a visual boundary. The page becomes quieter because of your actions.”

This is a study explanation, not a claim that the website provides therapy or changes the visitor’s device settings.

## What to show in a two to three minute code walkthrough

1. **HTML and scenes:** find the five sections. Explain that only the active scene is visible. Real buttons, headings and labels provide the structure.
2. **The state object:** `scene` tracks the current section, `dismissed` tracks unique removed notifications, `thoughts` stores each placement, and `threshold` holds a number from zero to 100.
3. **One event:** follow a dismiss button into `dismissNotification()`. The notification ID goes into a Set so repeated actions cannot count it twice. CSS handles the exit, then a timer removes the element and updates the progress.
4. **One data-to-style connection:** the slider calls `updateThreshold()`. It updates CSS variables, a percentage output and the scene’s words. The visual opacity is `1 - threshold / 100`.
5. **Reset and inclusion:** `restart()` clears pending removal timers and state, rebuilds the scene content and returns to the beginning. Point out that the swipe/drag gestures also have keyboard alternatives.

## Be able to answer these

**Why a Set for dismissed notifications?** A Set stores unique IDs. Clicking a dismiss button twice cannot increase the count twice.

**What is an event listener?** A function registered to run when an action happens, such as a click, pointer movement or input change.

**What does `hidden` do?** It removes inactive scene content from display and ordinary keyboard navigation. The current scene remains available.

**What is a CSS variable?** A named style value that JavaScript can change. The boundary scene uses variables for line position and word opacity.

**How does dragging find a zone?** `zoneAt()` compares the pointer’s x/y coordinates with each zone’s visible rectangle from `getBoundingClientRect()`.

**How does the dial work?** `Math.atan2()` gives the pointer angle around the dial’s centre. Small angle differences accumulate into a clamped zero-to-100 value. Crossing the angle boundary is corrected so a tiny turn does not create a full revolution.

**What happens if I skip directly to the end?** It gives a generic quiet ending rather than claiming I sorted or dismissed things I did not interact with.

**Where is the data saved?** Only in the page’s JavaScript state. Reloading clears it; there is no server or tracking.

**Why allow ordinary buttons in an experimental interface?** The gestures express the idea, while the alternatives let keyboard users, people with limited dexterity and people who prefer simpler controls reach the same content.

**What are the limitations?** Choices do not persist after reload; notifications are fictional; the page does not silence actual alerts; visual effects cannot demonstrate a psychological outcome; sorting choices currently require restarting to revise.

## Planned five minute presentation flow

- About 40 seconds: concept and intended feeling.
- About 90 seconds: demonstrate the five scenes, including one swipe and one thought placement.
- About 60 seconds: explain the state object, event listeners and the threshold-to-style connection.
- About 50 seconds: visual design, mobile layout and keyboard/reduced-motion alternatives.
- About 40 seconds: challenges, limitations, what you learned and credits.

Adjust these timings after practising. The actual video must be recorded by the student and should accurately describe what they understand and contributed.
