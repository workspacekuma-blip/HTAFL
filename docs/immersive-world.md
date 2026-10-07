# HTAFL three-room environment

Current implementation: 6 October 2026. One shared native-WebGL environment is
used by the homepage and all six completed content routes. The three unnumbered
rooms are Overcome (practice), Create (expression) and Connect (belonging).
There is no duplicate hero/approach world selector, fourth overview room,
first-person control, scroll interception or audio. Existing branding, production
Five-Path SVGs, fonts and design tokens are retained.

## Stack and ownership

The project remains vanilla static HTML/CSS/JavaScript with no build step.
`scripts/immersive.js` mounts the single decorative canvas through `HTAFLWorld.Scene`
in `immersive/scene.js`, which calls `canvas.getContext('webgl', ...)`. This is real
native WebGL, not a Three.js/WebGLRenderer implementation. No new package is needed.
`immersive/worlds.js` builds original procedural geometry; no commercial model,
texture, environment, brand asset or reference-site source code is copied.

The official [Miu Miu immersive experience](https://immersivebags.miumiu.com/en/)
was inspected for enclosed space, deliberate entry/camera movement and object
prompts opening content. Those interaction principles informed this implementation;
HTAFL's geometry and composition are original. Source/rights decisions are recorded
in [web-resources.md](web-resources.md). The reference's sound was not enabled.

## Three connected rooms

All rooms occupy the same shared floor at X = -12, 0 and +12. Each has a floor,
ceiling, back wall, front entrance and broad side portals connecting its neighbors.
The entrance camera looks into Overcome from outside its front doorway. Selecting
a room travels to its actual scene coordinate, through the side passage or, from
the entrance, along the facade and through the chosen front door. Authored camera
travel preserves visitor control; no image or canvas swap simulates movement.

| Room | Objects and spatial treatment |
| --- | --- |
| Overcome | Six thick receding platforms increase in height, with rising rails and a distant frame. Objects offer Move, Reflect, Reset, Practice, Try again and Progress. |
| Create | Angled paper/drawing surfaces, a folded hanging textile, dark upcycling pedestal, close cobalt photography frame and distant self-expression frame. Objects offer Art, Fashion, Upcycle, Photography, Design and Self-expression. |
| Connect | A central gathering surface, satellite platforms, an ivory foreground portal, offset frames and converging curved paths. Objects offer Community, Collaborate, Share, Support and Participate. |

Production Five-Path contours are sampled into raised junction linework without
changing the source SVG. Direct file previews skip SVG fetching to avoid file-CORS
errors; the rooms and static production logo still work. Materials are restrained
procedural matte/satin surfaces derived from existing paper, white, ink and cobalt
tokens. Key/fill light, distance fog, shallow rim response, grain, planar projected
silhouettes and contact shading provide depth. They approximate materials/shadows;
no physical shadow maps, texture decoder or PBR environment is introduced.

Desktop perspective is 58 degrees; touch/narrow perspective is 70 degrees.
Near/far planes are 0.12 / 115. Transitions use quintic easing over 1600ms desktop
or 1200ms touch, with a smaller vertical/depth arc on mobile. Subtle pointer
response is bounded and disabled on touch. Entered rooms stop rendering at rest;
only the entrance preview has gentle idle drift. There are no room numbers.

## Content and navigation

`scripts/site-shell.js` supplies the same persistent Overcome/Create/Connect
header links at all widths and the existing Join HTAFL form link. A mobile menu
is unnecessary for these three always-visible destinations. Other information
links and the footer lead to existing routes.

Each route loads `styles/immersive.css` and the shared controller. The controller
moves its existing main content and footer into a native dialog without cloning,
replacing copy or losing form/library listeners. A route-anchored base URL keeps
relative images, links and form actions correct during room History changes.
Direct URLs open the associated room plus its reading panel; the room remains
behind the panel. A first static frame is drawn before pausing there. Closing
returns to exploration. Room URLs use `index.html?room=overcome|create|connect`;
Back/Forward restores selection or entrance without adding history entries.

## Accessibility and fallback

All copy, headings, links, buttons, inputs and object choices are semantic HTML.
Desktop object prompts have 44px targets, visible focus/tooltips, projected
anchors and overlap/overlay avoidance. Explore objects exposes every idea even
when a projected prompt is occluded or hidden. Touch uses that same chooser.

Native dialogs make the background inert; CSS locks background scrolling while
open. Escape, Back to room and backdrop dismissal close panels and restore focus.
Reading anchors scroll/focus their actual HTML target. Room selection focuses the
heading and announces its name/idea after camera arrival. The canvas is
`aria-hidden`, presentation-only, has no keyboard stop and conveys no essential
content. Text resizing retains readable controls and normal page scrolling.

Reduced motion skips camera/entry transitions, idle drift, pointer movement and
object interpolation; each room is shown completed and static. Live preference
changes settle transitions. WebGL, context or local helper failure retains the
CSS/SVG background and complete room/idea/content navigation. Forced colors uses
that semantic view without WebGL. Without JavaScript or native dialog support,
static source content and ordinary route links remain usable.

## Performance and deployment

One canvas, two static buffers and two draw calls render the whole environment.
No textures, model downloads, extra canvases or runtime dependencies are added.
The local helper scripts load after the HTML room shell; static geometry builds
once and the context is reused through entry, room selection and return.

DPR is capped at 1.5 desktop / 1.15 touch or limited devices, with an additional
1.1-million / 400,000-pixel budget. Cylinder/textile/contour detail is reduced on
touch and conservative device hints. The context requests low power; this remains
a browser hint. Drawing is capped at 30fps desktop / 20fps touch when active,
and entrance preview at 18fps / 12fps. Rendering pauses for hidden tabs, offscreen
scenes, open content/idea panels and page lifecycle suspension. Resize/DPR changes
coalesce into the next visible frame. Page unload disposes buffers/program/context;
bfcache suspension retains them.

Deploy the seven existing HTML entries, `immersive/`, the two shared controller
files and `styles/immersive.css` with the rest of the static site. Serve correct
JS/CSS MIME types, normal Brotli/gzip and a CSP allowing same-origin scripts.
No key/build step is required. A real submission backend and consent-approved
community/published resource data still require setup before claiming availability.
Real iOS/Safari, Android, screen-reader and thermal/battery checks remain manual.

## Verification

The actual local HTTP experience was reviewed in the in-app browser: entry,
room travel, object prompts and the Create reading panel. Desktop room views and
the touch scene were also visually inspected. Software-rendered Chrome passed
70 distinct focused checks across this revision (72 assertions/check records,
including two repeated layouts), covering:

- One canvas, three room links and removal of duplicate homepage sections.
- Real camera coordinate changes, entry, chooser access to every room idea,
  native Escape, focus restoration and background scroll locking.
- Existing URLs, page titles, homepage anchors and Back/Forward room/route history.
- Resource search/category query state and the form's validation, honest local
  review status and clear/reset behavior.
- All seven routes at desktop and 320px, room layouts at 320/375/768/1024/1440px,
  touch camera travel and 200% text sizing without horizontal overflow.
- Reduced motion including live changes, forced colors, disabled JavaScript,
  unavailable WebGL, context loss and failed helper loading.
- On-demand rendering, modal/hidden-tab pauses, deferred resizing, pixel budgets,
  two static buffers, zero textures and unload disposal.

Axe checks found no violations in the tested desktop room, idea/reading panels,
all six supporting-page dialogs, mobile idea dialog and unavailable-WebGL view.
No unexpected console/JavaScript or missing-asset error occurred. The deliberately
aborted helper test produced its expected network failure and complete fallback.
Static checking also validated local href/src/action targets and fragments on all
seven routes. JavaScript syntax and stylesheet token references passed. SHA-256
comparison confirms unchanged production logo/font assets and base design tokens.

| Profile | Surface triangles (including planar silhouettes) | Line segments | Combined vertex buffers | Textures |
| --- | ---: | ---: | ---: | ---: |
| Desktop | 4,024 | 1,098 | 570,720 bytes | 0 |
| Touch / limited | 2,440 | 618 | 342,240 bytes | 0 |

The two helper scripts total approximately 20.1 KiB raw / 7.3 KiB gzip. Real-device
GPU speed, thermal behavior, Safari/iOS and Android are not established by software
Chrome; those and VoiceOver/NVDA remain manual release checks.

[Create room capture](previews/immersive-create.png) and
[mobile Connect capture](previews/immersive-mobile.png) are local QA evidence only.
They are never loaded by the website.

## Files changed for the three-room request

| File | Change |
| --- | --- |
| `index.html` | Single room entrance/fallback; retained mission, challenges, values and participation reading content; removed duplicate world sections. |
| `about/index.html` | Shared room controller/styles and repaired room-related destinations. |
| `how-it-works/index.html` | Shared room controller/styles and repaired room-related destinations. |
| `create/index.html` | Shared room controller/styles; removed decorative section numbering. |
| `community/index.html` | Shared room controller/styles. |
| `resources/index.html` | Shared room controller/styles; unnumbered empty status. |
| `get-involved/index.html` | Shared room controller/styles; original form retained. |
| `scripts/site-shell.js` | Persistent three-room header; existing logo, Join link and footer retained. |
| `scripts/immersive.js` | Shared room shell, native content/idea dialogs, focus, anchors/history, fallback and lifecycle. |
| `scripts/resource-library.js` | Word-based result status without visible numeric counts; filtering unchanged. |
| `scripts/challenge-library.js` | Word-based result status without visible numeric counts; filtering unchanged. |
| `immersive/worlds.js` | Original enclosed architecture and room geometry. |
| `immersive/scene.js` | Authored room views, connecting camera travel and first static reading-panel frame. |
| `styles/immersive.css` | Responsive room composition, semantic controls, dialogs, prompts and fallback styles. |
| `README.md` | Current room entry and stack guidance. |
| `docs/homepage.md` | Current entry/content behavior. |
| `docs/immersive-world.md` | Current implementation, verification and this file inventory. |
| `docs/pages.md` | Reading-panel integration for supporting routes. |
| `docs/site-shell.md` | Current three-room navigation and general-shell distinction. |
| `docs/web-resources.md` | Reference/source/rights decisions and original procedural resource inventory. |
| `docs/previews/immersive-create.png` | Updated actual room screenshot. |
| `docs/previews/immersive-mobile.png` | New actual touch room screenshot. |

No existing file was deleted. The previous hero/section helper files remain
available but are not loaded by any completed production route.

