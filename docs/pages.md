# Supporting pages

All completed routes now use the [shared three-room environment](immersive-world.md).
Existing content appears in a native reading dialog over its associated room,
with ordinary HTML preserved for unavailable JavaScript/dialog support.

- `/about/`: `about/index.html`, using the approved About copy.
- `/how-it-works/`: `how-it-works/index.html`, using the approved four-area content.
- `/create/`: `create/index.html`, using the approved art/fashion copy and features.
- `/community/`: `community/index.html`, focused on participation and an honest gallery invitation.
- `/resources/`: `resources/index.html`, with accessible search/category filtering and honest empty states.
- `/get-involved/`: `get-involved/index.html`, with five pathways and an accessible involvement enquiry form.

Directory index files provide clean routes on standard static hosting without a
framework, build step or rewrite rule. `about.html` forwards the earlier empty
entry point to the About page. The shell resolves directory links to explicit
index files when opened directly from disk.

These pages reuse `main.css`, the shared logo/header/footer, responsive grids,
typography, cards, buttons and accessibility styles. About presents the conviction
and Create / Overcome / Connect approach. How It Works uses the existing native
disclosure pattern in reusable `.card--disclosure` panels. Their headings are
keyboard-focusable summaries with visible plus/minus indicators; Enter and Space
toggle content without custom JavaScript. Multiple panels can remain open.
`grid--start` keeps collapsed cards at their natural height beside expanded cards.

Pages use shared typography and palette. The room controller handles the current
spatial motion; former section-reveal helpers are not loaded in these reading
panels. CTAs point to existing routes or readable homepage anchors.

Create adds a typographic board and a cobalt headline accent through the isolated
`styles/create.css` composition file. It reuses the same cards, editorial lists,
containers and buttons. The board pairs decorative typography with a licensed
textile-studio photograph. Creative-direction cards use locally optimized sewing,
sketchbook, fashion-design-board and photography images, with alternating portrait
and landscape frames. Each has descriptive alt text and a visible illustrative
label/photographer credit. Source and license records are in
[the web resource inventory](web-resources.md). Photos are never submitted artwork.
The showcases section is an explicit empty state; no submissions, creators or
exhibitions are fabricated. Its publication note requires permission and credit.

Community reuses the shared cards and disclosures for six participation areas.
The empty gallery is ready for approved public records; see
[the gallery connection guide](community-gallery.md).

Resources uses the shared form controls and resource card template. Its data array
is intentionally empty; see [the resource library guide](resource-library.md) for
query state and adding verified records.

Get Involved uses shared cards and form controls. Pathways preselect the involvement
option, and inline validation provides a linked error summary and live status.
The form reviews locally without sending or storing details; see
[the involvement form guide](involvement-form.md) before connecting a service.
