# HTAFL site refresh — 6 October 2026

This pass follows the owner's supplied letter-logo image, founder story and
original landing-page screenshots. It keeps the HTML/CSS/Node stack, palette,
fonts, consent-based gallery and existing backend.

## Content and destinations

- Join HTAFL opens the form-free `/get-involved/` choice page (corrected 7 October).
- Partner With HTAFL opens `/get-involved/collaborate/#involvement-form`.
- The homepage has one set of linked Create, Overcome and Connect entrances.
  Details live at `/create/`, `/overcome/` and `/community/`. The short brand
  tagline remains once; duplicate descriptive sections and the Five Ideas
  section are removed.
- Explore Why HTAFL Exists opens `/about/#founder-story`, containing the supplied
  first-person story. The accompanying photography is explicitly illustrative.
- Original Fashion Meets Healing mission copy is on About; Creative Expression
  and Fashion Forward copy is on Create; Safe Spaces copy is on Community;
  Partner copy introduces the collaboration invitation/questionnaire.
- Get Involved is a link-only index. Its five subpages each contain exactly one
  questionnaire. Create asks about medium, purpose and project stage; Volunteer
  asks about skills, availability and format; Collaborate asks about proposal,
  studio, portfolio and optional timing; Support asks about practical support
  type/frequency alongside its separate bank/crypto contribution instructions; Participate asks
  about interests and preferred format. No medical history is requested.
- The shell omits destinations already linked in the main content, rather than
  repeating the same action in the header and footer. The mobile menu supplies
  the same primary navigation as the desktop header. Repeated footer navigation,
  Contact-to-Join shortcut, duplicate artwork links and mobile social links are
  removed. Social icons appear once in the footer with accessible profile names.
- Copyright is included in the shared footer. Public Credits records external
  photography, material and icon attribution.

## Identity and visuals

`assets/htafl-wordmark.svg` recreates the supplied white H/T/A/F/L geometry on a
black plate without relying on a replacement font. The original reference is in
`assets/brand/htafl-wordmark-reference.jpg`. The favicon uses the supplied H
geometry at small sizes; shrinking the complete five-letter image would make it
unreadable at 16px. Header, footer, mobile header/menu, error pages and review
dashboard use the new identity. Historical brand assets and Figma source remain
as source history, without being used as the current public-site logo.

The new locally optimized Gustavo Fring/Pexels studio photo provides homepage
atmosphere. Existing licensed textiles, sketchbook, sewing, walking and group
workshop photographs stay in relevant sections. A sewing photograph provides
the partnership background beneath a readable navy overlay. Photography is not
proof of membership, submitted work, diagnoses or endorsement.

The homepage textile study uses **native WebGL**, with no added dependency.
Microsoft's CC0 Sheen Cloth model from the Khronos sample repository is resampled
to **3,200 triangles**, from 115,200. Mesh plus three optimized 128px material maps
are approximately **167 KiB** before transfer compression. Original normals,
tangents and UVs are retained on selected vertices. The source material is
adapted to the existing ivory token with restrained sheen; this is a lightweight
custom presentation, not a complete glTF PBR loader.

Initialization waits for visibility and GPU availability. Rendering occurs on
pointer/scroll/resize changes and stops after settling, offscreen and when hidden.
Pointer motion is limited to roughly five degrees. DPR is capped at 1.5 desktop
and 1 mobile, with a 350,000-pixel budget. Reduced motion, forced colors, data
saving, very low reported memory, unavailable/lost WebGL or file previews retain
a static CSS textile plane using a 6 KiB still of the same cloth and readable HTML. No audio or continuous idle loop
is introduced.

## Research

`content/research.json` records the global UNESCO bullying indicator, WHO
adolescent anxiety/depression estimates, the WHO arts review and a 2025 fashion
study. Sources are linked beside claims. Population, year and study limitations
are explicit: bullying is not a numerical measure of hate, reviews are not
treatment-success percentages, and fashion research is not evidence that an
HTAFL activity cures a condition. Figures are context, not HTAFL outcomes.

## Files created or modified

- `design/figma-context/generate-pages.py`: central authoring helper; regenerates
  the homepage, About, Create, Community, How It Works and dedicated questionnaires.
- `index.html`, `about/index.html`, `create/index.html`, `community/index.html`,
  `how-it-works/index.html`, `get-involved/index.html`: refreshed content/links.
- New `get-involved/participate/index.html`, `get-involved/create/index.html`,
  `get-involved/volunteer/index.html`, `get-involved/collaborate/index.html`,
  `get-involved/support/index.html`, `overcome/index.html`, `credits/index.html`.
- `resources/index.html`, its three existing prompt-detail HTML files,
  `immersive/index.html`, `privacy/index.html`, `accessibility/index.html`,
  `community-guidelines/index.html`, `not-found/index.html`, `404.html`: generated
  favicon/wordmark, fallback shell and direct enquiry-link updates as applicable.
- `scripts/site-shell.js`, `scripts/involvement-pathways.js`,
  `scripts/involvement-form.js`, new `scripts/fashion-cloth.js`.
- `styles/editorial.css`, `server/index.js`, `server/admin-ui/index.html`.
- `content/involvement-pathways.json`, new `content/founder-story.txt`,
  `content/landing-copy.json`, `content/research.json`.
- New `assets/htafl-wordmark.svg`, updated `assets/htafl-favicon.svg`, supplied
  reference in `assets/brand/`, three individually downloaded SVGs/license in
  `assets/icons/social/`, optimized cloth mesh/maps/license/manifest in
  `assets/materials/sheen-cloth/`, three studio-photo WebPs and updated photo manifest.
- `tests/involvement.test.js`, `tests/involvement-browser.cjs`,
  `tests/services.test.js`, `tests/browser-qa.cjs`, `tests/admin-browser.cjs`, new
  `tests/editorial-browser.cjs`.
- `README.md`, `docs/involvement-form.md`, `docs/backend-tools.md`,
  `docs/fashion-implementation.md`, `docs/web-resources.md`, this guide.

## Verification and remaining setup

Run `npm test` for backend validation, routing, privacy and delivery states.
Browser checks cover 40 page/viewport combinations, 24 questionnaire/index
combinations, keyboard navigation, WCAG A/AA checks, unique visible homepage
destinations, actual WebGL rendering, motion/visibility safeguards, private review
tools and unavailable-service states. Tests use mock mail and isolated uploads;
they do not charge a card or send real email.

Final checks passed: 12 backend tests; 40 responsive page checks; 24 involvement
page/index checks; five mock questionnaire submissions; the dedicated WebGL,
fallback, destination and identity checks. A static audit checked 482 local
references across 22 public HTML pages with zero missing files or anchors.
Unknown nested routes also retain working navigation with JavaScript disabled.
The private review dashboard browser checks passed during this pass. The image
review confirmed that actual photography loads; empty dialog preview elements
are deliberately excluded from image-load assertions until a photograph opens.

Before deployment, configure SMTP and the administrator credentials with the
existing private setup tool, use persistent private upload storage and HTTPS,
and verify the owner-supplied bank contribution instructions. Crypto details
are still pending; the website reports this honestly. No payment API keys are
needed. Conduct a real-device visual/GPU check and a controlled email delivery
test before opening submissions publicly.
