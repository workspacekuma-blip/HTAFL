# HTAFL background and interaction update — 7 October 2026

The owner's request was to bring the website to life and add a background.
This pass uses the existing browser-native CSS and JavaScript stack alongside
the existing WebGL cloth, rather than adding a framework or an unrelated language.

## Appearance

- The initial CSS weave has now been replaced with a locally hosted CC0 Terlenka
  textile diffuse image (838 bytes), beneath an 88% paper-token overlay. The
  background repeats at a small scale without fixed positioning or extra motion.
- Page introductions use locally hosted illustrative photographs: sketchbook
  for About/Resources, atelier sewing for Create, the staircase for Overcome,
  artists sharing sketches for Community, and workshop for How It Works/Get
  Involved. Other creative openings use sewing.
  Legal, credits and error openings retain the texture without photography.
- Desktop title columns remain on the clear side of the photographic gradient.
  Smaller layouts make the photo much quieter. Long founder-story copy and form
  surfaces retain the paper background.
- Original logo, palette, typefaces, copy, destinations, forms and the existing
  WebGL implementation remain unchanged.

## Interaction and access

The introduction photograph responds to desktop pointer movement by at most
six horizontal and four vertical pixels, then returns to rest. A thin line below
the sticky header shows reading progress. Both are decorative CSS layers without
focus targets or essential content. Existing navigation/dialog behavior remains.

Rendering is scheduled only after input, scrolling, resizing or content-size
changes; there is no idle loop. Hidden pages cancel pending work. Touch devices
have no new photographic parallax. Reduced motion clears pointer offsets and
removes the reading line; forced colors remove decorative backgrounds. Static
backgrounds still work without JavaScript. No audio or scroll locking was added.

## Resources and changed files

The existing Pexels images and original creators/licenses are recorded in
`assets/photography/illustrative/manifest.json`, `docs/web-resources.md` and public
Credits. They illustrate activities, not real HTAFL members or the founder.
The owner's subsequent selected-resource application adds four local Pexels
photos and one CC0 fabric diffuse image, documented in the resource log and
manifests. It installs no dependency. The original CSS-only background record
in the resource log describes the earlier pass.

- New `styles/atmosphere.css`: textile texture, route-specific introduction
  backgrounds, gradients, pointer offset and progress-line styling.
- `main.css`: imports this shared stylesheet.
- `scripts/editorial.js`: bounded background motion and reading feedback.
- `design/figma-context/generate-pages.py`: writes a stable `data-page` identity.
- Regenerated `index.html`, `404.html`, and the HTML files under `about/`,
  `how-it-works/`, `create/`, `overcome/`, `community/`, `resources/`,
  `get-involved/`, `credits/`, `immersive/`, `privacy/`, `accessibility/`,
  `community-guidelines/` and `not-found/`: only the body attribute changes.
- This guide and the resource-log entry.

Verification includes the existing 40 responsive page checks with automated
WCAG A/AA checks, plus focused background, pointer/reset, reading-progress,
sticky-navigation, reduced-motion and console checks. Browser screenshots were
reviewed at desktop and mobile sizes. Real-device GPU testing remains a launch
check for the existing WebGL implementation.
