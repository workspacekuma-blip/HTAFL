# Interactive enhancements — 7 October 2026

The owner asked for more JavaScript interaction. This bounded update builds on
the existing navigation, resource filters, forms, image dialog and WebGL cloth.
It preserves the site structure, branding, copy and locally hosted assets.

- Homepage entrance cards and resource cards react to desktop mouse position
  with at most 1.5° of `rotateX` and 2° of `rotateY`. Existing section reveals
  are preserved. The visual effect returns to rest when
  the pointer leaves. Keyboard focus clears pointer tilt and keeps the existing
  focus indicator. Dynamically filtered cards use the same delegated behavior.
- The existing photo dialog gains Previous/Next controls where multiple process
  photos exist, with Left/Right keyboard browsing, current position and creator
  credit. Escape closes the native dialog and returns focus to the original
  invoker. Single-photo views hide navigation controls. Touch uses the buttons.
- The three self-guided resource prompts gain optional checkable steps and a
  live progress message. Reset clears checks and focuses the first step. No
  progress is sent, saved in browser storage or retained after a fresh visit;
  restoring from the back/forward cache also clears it. Original instructions
  remain normal list items when JavaScript is unavailable.

## Performance and access

No package or framework was added. Card motion uses CSS transforms and one
scheduled frame after pointer input, without idle rendering or a polling loop.
It is disabled below the existing desktop breakpoint, on touch, in forced colors,
with reduced motion and while the page is hidden. Background scroll remains
native. Cards are links/content, without pointer-only essential functionality.
Checklists use native labeled checkboxes and a polite status message; they do not
claim a health or wellbeing outcome. No audio, autoplay or extra WebGL is added.

## Files

- `scripts/editorial.js`: shared card depth and existing photo-viewer enhancement.
- `scripts/practice-checklist.js`: new page-local checklist helper.
- `styles/editorial.css`: scoped card transforms, gallery controls and checklist
  styles using existing tokens.
- `design/figma-context/generate-pages.py`: emits the step-list hook and loads the
  helper only on self-guided prompt pages.
- `resources/redesign-something-old/index.html`,
  `resources/an-image-of-strength/index.html`,
  `resources/offer-encouragement/index.html`: regenerated from that source.
- `tests/interactivity-browser.cjs`: focused behavior and accessibility checks.
- This guide and `docs/publication-readiness.md`: verification/handoff notes.

Verification covers keyboard checking/reset, lack of persistence, no-JavaScript
instructions, gallery keyboard/button browsing and focus restoration, bounded
mouse response, touch/static and reduced-motion behavior. The shared responsive
and editorial browser suites provide regression coverage. Private email,
administrator, payment and hosting setup requirements remain unchanged.
