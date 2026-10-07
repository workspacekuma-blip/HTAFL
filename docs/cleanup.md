# Repository cleanup — 5 October 2026

The seven public pages retain the existing HTAFL identity, content, layout and
plain HTML/CSS/JavaScript stack. No packages were added; no website build step
exists. The Google Fonts connection supplies the established typography.

## Changes

- Restored all seven destinations in the shared navigation. Join and Contact
  reach the involvement form. Directory links work over HTTP and through local
  files. Removed obsolete disabled-route branches and unused social-link setup.
- Removed the unrelated `learning.html`, `html5.png`, `img/eiffel.jpg`,
  `img/lascoloradas.jpg` and `project/img/tacos_and_drink_400x267.png`, along with
  their empty directories.
- Moved the internal component reference from `design-system.html` to
  `docs/design-system.html`, corrected its asset paths and marked it `noindex`.
  Preserved the original mission copy in `docs/brand-context.md`.
- Consolidated public JSON/text/URL helpers in `scripts/content-data.js` and
  approved-image embedding in `social/artwork.cjs`. The challenge, resource and
  gallery adapters retain their separate publication and consent requirements.
- Moved spacing definitions into the central token stylesheet without changing
  values. Removed unused shell/preview styles and redundant selector rules.
  Homepage composition styles now load only on the homepage.
- Updated the README and shared-component documentation. Regenerated the four
  social previews after removing their unused inline rule; artwork is unchanged.

Files created: `scripts/content-data.js`, `docs/brand-context.md`, this report.

Files modified: `README.md`, `main.css`, `index.html`, `community/index.html`,
`resources/index.html`, `scripts/site-shell.js`, `scripts/challenge-library.js`,
`scripts/resource-library.js`, `scripts/community-gallery.js`, `scripts/home.js`,
`styles/tokens.css`, `styles/global.css`, `styles/site-shell.css`,
`social/artwork.cjs`, `social/generate.cjs`, `youtube/generate.cjs`,
`docs/design-system.md`, `docs/site-shell.md`, `social/exports/index.html`,
`social/exports/create-square/index.html`,
`social/exports/connect-landscape/index.html`, `social/exports/vertical/index.html`.

The component reference was moved and modified as described above. The five
tutorial files were deleted. Other existing work was retained without staging
or committing it.

## Verification

- Local HTML/CSS asset links, fragments, duplicate IDs, JavaScript syntax and JSON
  parsing passed. Every public page loads central CSS, shell, interactions and
  the production favicon.
- Chrome checks passed at 320, 768, 1200 and 1440px, plus 200% text at desktop and
  320px. All seven routes, active navigation, CTA destinations, direct-file
  links, directory redirects, the legacy About redirect and logo loading passed.
- Narrow-screen visual checks confirmed the homepage, form controls and settled
  sticky header remain readable and aligned.
- Hero controls, logo timing/static geometry, approach cards, native disclosures,
  section reveals, connection line, challenge/resource filters and query history
  passed. Temporary data fixtures existed only in the test server.
- Mobile menu keyboard trapping, Escape, focus/scroll restoration, desktop resize
  and reduced-motion behavior passed. Form validation, error-summary focus,
  local status/reset and disabled no-JavaScript submission fallback were retained.
- Internal component, social and YouTube previews loaded correctly; the silent
  sting skips/cancels playback with reduced motion. No console/runtime errors or
  failed local/external requests appeared in the final browser pass.

## Intentional retained structure

Shared primitive styles documented for future reuse remain, including grid thirds
and full-width buttons. Static shell fallbacks support unavailable JavaScript.
The animated hero uses the same five paths as the production SVG; its inline
geometry is required for individual path reveals. Primary, monochrome and favicon
assets are distinct production variants.

Empty published challenge/resource/gallery data is intentional. No invented
members, submissions, stories or health articles were added. Social/YouTube packs
remain internal editable templates with explicit fields to replace before use.
The involvement form is still a frontend review only: a real submission service
and approved published content remain future integration work.
