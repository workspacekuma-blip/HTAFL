# Interaction pass

The supplied interaction spec predates the logo replacement. The current HTAFL
Five-Path Mark remains the brand symbol: five sequential 160ms reveals, 800ms total,
one pass, no rotation or looping. Reduced motion renders its exact static paths.

`scripts/interactions.js` shares the existing 320ms / 8px section reveal across the
seven completed pages. Content starts visible; absent JavaScript or observer
support never hides it. Reveals run once, skip sections containing keyboard focus,
and cancel immediately when the motion preference changes to reduce.

The homepage approach has a decorative, noninteractive SVG connecting three points.
Its single path draws with scroll progress through a passive listener and a coalesced
animation frame. Without JavaScript or with reduced motion it is complete. It is
excluded from the accessibility tree and does not affect navigation or content.

Hero Create / Overcome / Connect controls retain mouse hover, focus and tap behavior,
pressed state and supporting copy. Homepage and About approach cards are real links
with accent edges, small title/arrow movement and emphasis on their visible supporting
copy. Shared buttons keep their existing -2px lift, 3px arrow shift and active return;
reduced motion removes transforms. No added sound, parallax, cursor or autoplay media.

The sticky header, modal mobile menu and native disclosure cards remain shared.
About, Create and Community participation CTAs now reach the completed Get Involved page.
The menu traps Tab in either direction, exposes expanded state, closes with Escape,
restores focus and scroll, and closes when switching to desktop. No new dialog is
needed for the currently empty gallery or challenge library.

## Challenge filtering

Homepage example prompts stay explicitly separate from published challenges.
The native Browse community challenges disclosure contains status filters styled
with existing controls. Native radios provide arrow-key/Space behavior. Results
announce their count and status; all empty states remain honest. `?challenge=current`,
`upcoming` or `past` preserves other parameters and the hash, and Back/Forward restores
the filter. Without JavaScript the disclosure explains that no challenges exist.

`challenge-data` is intentionally `[]`. When real records are available, each needs
`id`, `publicationStatus: "published"`, `status: "current" | "upcoming" | "past"`,
`title` and `description`. An optional `href` must point to a real detail destination
using HTTPS or the same local origin/protocol, without credentials. Records are
deduplicated by id and inserted as text. No placeholder events, dates, enrollment
links or share actions are fabricated.

## Existing library and form

Resources retains search, category filtering, query state, browser history and
useful empty states. There are no published records or tags to offer as tag filters.
The gallery remains empty until publication consent and review are verified.
See [resource library](resource-library.md) and [community gallery](community-gallery.md).

Get Involved retains inline errors, a linked focusable summary, correction/reset and
polite status. Review is local and synchronous; it performs no submission, so there
is no pending request or duplicate send. Real submission and pending-state protection
must be connected together as described in [the form guide](involvement-form.md).

## Verification

Chrome checks passed for all seven routes at 320, 768 and 1440px; hero hover/focus,
logo path geometry and timing, approach emphasis/arrows, line progress, native
disclosure keyboard controls, challenge/resource filters and query history,
mobile focus trapping/Escape/scroll restoration/desktop resize, local form review,
live reduced-motion cancellation and no-JavaScript fallbacks. Temporary in-memory
fixtures exercised populated filters and unsafe URL rejection; no test records were
saved to the site. No browser JavaScript errors or form submission requests occurred.
