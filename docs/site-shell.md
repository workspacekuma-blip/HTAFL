# Shared HTAFL shell

Stage 2 preserves the plain HTML/CSS stack. No packages, build step or network
fetch is required for the shell. `scripts/site-shell.js` defines light-DOM native
custom elements; the existing `main.css` imports `styles/site-shell.css`.

Open `index.html` for the shell, or `docs/design-system.html` for the shell with the
component reference. The HTML-learning exercise and its unused images were removed during cleanup.
The home entry now opens the shared three-room environment. About, How It Works,
Create, Community, Resources and Get Involved remain directory routes whose
content opens in native reading panels over its associated room. See
[the current room guide](immersive-world.md).

## Reuse on a page

```html
<html lang="en" class="has-site-shell">
<!-- In head: -->
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="assets/htafl-favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="main.css">
<script src="scripts/site-shell.js" defer></script>
<!-- In body: -->
<a class="skip-link" href="#main">Skip to content</a>
<site-header>
  <header class="container section section--compact"><a href="index.html">HTAFL home</a></header>
</site-header>
<main id="main" tabindex="-1"><!-- Page content --></main>
<site-footer>
  <footer class="container section"><p>Create. Overcome. Connect.</p></footer>
</site-footer>
```

Use one header and footer per document. Keep meaningful static fallback content
inside the custom elements for disabled/unavailable JavaScript. The script replaces
only that fallback; page content is always static. On nested pages, adjust the
script/CSS/favicon paths. Component asset/navigation URLs resolve from the script's
location, including when opening files directly in a browser.

## Logo API

See [the logo system](logo-system.md) for the Five-Path Mark meaning and independent
uses across social, clothing, video and events.

The three production SVGs in `assets/` use the **HTAFL Five-Path Mark**, recreated
from the supplied star reference with five clean closed paths. Clockwise from the
top, they represent Hope, Talent, Art, Fashion and Life. The primary symbol is
cobalt, the monochrome asset uses `currentColor`, and the favicon uses paper on
cobalt. The current room environment samples the same paths for its junction linework.
No raster image or font is embedded in the symbol assets. Use:

```html
<site-logo></site-logo>
<site-logo variant="mono"></site-logo>
<site-logo inverse></site-logo>
<site-logo symbol-only></site-logo>
<site-logo stacked tagline></site-logo>
```

`inverse` uses the monochrome geometry rendered white on dark surfaces.
The default uses the cobalt mark. Symbol-only links retain an accessible
HTAFL home label. Wordmarks use Space Grotesk 700, the specified tracking and mark
proportions; the header uses a compact lockup on narrow screens. Reserve clear
space around the component. Set attributes in markup before initialization.

## Destinations

The `routes`, `joinHref` and `contactHref` constants at the top of
`scripts/site-shell.js` are the single configuration source. Home, About, How
It Works, Create, Community, Resources and Get Involved have destinations.
Directory routes resolve to their explicit `index.html` when opened through `file:`.
`joinHref` accepts a relative path or absolute URL. Join HTAFL
now points to the Get Involved enquiry form, whose notice explains that submissions
are not connected. Enrollment is not open yet.

Contact HTAFL points to the same enquiry form. Social links remain omitted until verified destinations are supplied.
Do not add invented addresses, privacy/accessibility links or a newsletter form.
Add route-specific titles and descriptions with each future page. Canonical and
social-sharing URLs should wait until the public domain and real media are known.

## Current room navigation

Every production route uses `body.room-site`, `styles/immersive.css` and
`scripts/immersive.js`. Its header shows the unnumbered Overcome, Create and
Connect links at every viewport width, plus Join HTAFL. These links remain visible
on mobile, so no drawer is used in the room experience. The footer is inside the
route's reading panel. Logo/focus/button styles remain shared.

The room guide documents content/object dialogs, focus restoration, scroll lock,
URL history and reduced motion. The component reference retains the general
seven-route header described below for non-room demonstrations.

## General shell behavior

- Warm-paper sticky header compacts after 64px of scrolling.
- Desktop navigation starts at the existing 75rem desktop breakpoint.
- Native modal dialog supplies background inertness. Tab/Shift+Tab cycle within
  the sheet; Escape, Close, a link activation or clicking the backdrop closes it.
- The trigger exposes `aria-controls` and `aria-expanded`; Close receives initial
  focus. Focus returns to the trigger, or the logo after switching to desktop.
- Body scroll locks while open, then restores its position. A desktop resize
  closes the sheet and clears the lock.
- Sheet entrance animation runs only without a reduced-motion preference.
- Without dialog support, the full ordinary navigation stays visible.

Verified in Chrome at 320/768/1200/1440px, with keyboard opening/focus cycling,
Escape and button dismissal, navigation close, scroll/focus restoration, desktop
resize, reduced motion, 200% text scaling, logo loading and no-JavaScript fallback.
Update destinations here when additional routes or enrollment become available.

