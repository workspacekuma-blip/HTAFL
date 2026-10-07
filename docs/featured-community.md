# Featured community work — 7 October 2026

The owner requested a featured section for community uploads and selected
**Community only**. The existing Community gallery now provides that section at
`/community/#gallery`; no gallery is added to Home or Merchandise.

## Behavior

- Displays the latest six approved uploads, using the existing server's ordering
  by submission date. This is an automatic recent-work feature, not a claim of
  editorial awards or a separate manual selection system.
- Each work keeps its actual title, creator credit, description and image alt
  text. Images retain their proportions and lazy-load with explicit dimensions.
- With more than six approved works, View all reveals the remaining uploads and
  Show featured works restores the short selection. The control exposes
  `aria-expanded` and `aria-controls`, with a polite count/status announcement.
- Images open the existing accessible viewer. Uploaded work has its own title,
  permission note and creator credit; it is never described as stock photography.
  Arrow keys/Previous/Next browse the displayed uploaded works only. Escape
  restores focus to the original image button.
- Empty, loading, offline/retry and no-JavaScript states remain useful. No fake
  works, creators or testimonials are preloaded. A retry restores useful focus
  after the temporary retry button is removed.

## Publishing actual uploads

The upload form remains `/community/#share-work`. New submissions are private.
The existing `/admin/` review dashboard or host review command approves work only
with the creator's publication permission and required rights/review consent.
Approval makes the work eligible for this section automatically. Withdrawal
removes it from the public API and gallery on the next load. Contact email and
private review details are excluded from public records. The gallery requests
current server data without caching it in browser storage.

Configure the existing administrator credentials before moderating real work.
No new backend, storage model, approval workflow or dependency is introduced.
The currently listed email/hosting setup requirements still apply; this change
does not activate unconfigured services.

## Files changed

- `scripts/community-gallery.js`: featured limit, view-all, rendering, validation,
  status/empty/retry and focus behavior.
- `scripts/editorial.js`: existing viewer discovers dynamically loaded work and
  separates illustrative photographs from approved community uploads.
- `styles/editorial.css`: shared gallery image/button and credit styling.
- `design/figma-context/generate-pages.py`: featured section source and a media-note
  hook for the reused viewer.
- `community/index.html`: regenerated featured section.
- Other generated public HTML files: only the existing viewer note gets the
  `data-media-note` hook; their page content and gallery placement do not change.
- `tests/featured-community-browser.cjs`: isolated approved/private/pending records,
  six/all selection, actual image viewer, keyboard/focus, four widths, automated
  accessibility, withdrawal, empty and retry states. Test fixtures never enter
  the actual community storage or live website.
- This guide and `docs/publication-readiness.md`.

The existing interaction suite verifies process-photograph browsing still works,
and shared responsive checks verify the rest of the website.
