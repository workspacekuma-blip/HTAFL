# Fashion website implementation — 6 October 2026

**Current owner-requested refinements:** See [the site refresh](site-refresh.md).
The supplied letter wordmark now replaces the Figma monogram on the public site;
the homepage uses one set of pathway links and a small licensed WebGL textile
study. Each involvement questionnaire has a dedicated page. The earlier Figma
implementation record below is retained as handoff history.

The latest accepted Figma master supersedes the previous all-room renderer.
Its original H/T/A/F/L monogram, navy/ivory/champagne palette, Medium Space Grotesk,
Inter, actual copy, content order, image placements and desktop/mobile dimensions
are the implementation reference. The existing Five-Path assets remain available
as secondary brand material; no logo geometry was invented in this pass.

The Figma connector was quota-blocked. A previously authorized local Figma helper
exported the actual native hierarchy, styles, copy, monogram SVG and homepage PNG
read-only. `design/figma-context/context.json` and `homepage-reference.png` preserve
that evidence. The PNG is a review reference, not a production background image.

## Website behavior

Home, About, How It Works, Create, Community, Resources and Get Involved share the
same shell, tokens and components. Three original self-guided prompts have real
detail routes. Utility pages provide privacy, accessibility, guidelines and 404
states. The optional `/immersive/` scene shares the homepage's accessible tabs.

Fashion atmosphere comes from existing locally hosted, licensed tailoring,
sketchbook, garment-study and workshop photography. Illustrative subjects never
populate the community gallery. Twitter/X and TikTok link to `@htaflco`.

Photo planes respond slightly to desktop pointer and scroll events. There is no
continuous render loop, WebGL canvas, audio or scroll locking. Touch layouts use
ordinary image planes. Reduced motion removes entrance and depth transforms,
reveals content immediately and supports preference changes during a visit.
Photo dialogs are native modals with Escape and focus restoration. Navigation
retains its focus trap, background scroll lock and expanded-state announcement.

## Email and uploads

The Node server serves only allowlisted public directories. It never serves
`.env`, source/design files or the private upload folder. Enquiries validate on
both client and server, and report success only after SMTP accepts delivery to
`htafl@africamail.com`. Without SMTP configuration the form displays a direct email
alternative. Failure preserves entries; pending states prevent duplicate clicks.

Artwork accepts one still JPEG/PNG/WebP, up to 8 MB and 24 megapixels. The actual
file is decoded, stripped of metadata, resized to at most 1800px and converted
to WebP. Untrusted filenames are replaced by server-generated UUIDs. Records
include private contact email, creator credit and distinct review/publication
permissions. No public URL exists until approval and publication consent.

Private records persist even if notification email is unavailable or fails.
The success receipt confirms storage for review, not publication or email
delivery. Inspect `notification` in the private queue. Public records omit email
and consent records. The server validates same-origin requests, imposes upload
and body limits, and applies a bounded basic submission rate limiter.

`npm run review -- list | approve <id> | reject <id> | withdraw <id>` is an
operator-only host command. Review the work and permission before approving it.
Rejected/withdrawn files are removed. Backup removal and inbox deletion remain
operator responsibilities. This is a single-instance filesystem-backed workflow;
multi-instance hosting requires appropriate shared storage and limits.

## Deployment setup

See `.env.example` and README for SMTP, HTTPS origin, proxy and private persistent
volume configuration. Never commit an actual `.env`. Confirm the legal entity,
providers and retention policy before public launch. Assign a real reviewer,
test the configured inbox and withdrawal process, and protect backups and host
access. No deployment, account setup or external test message was performed.

## Files created or changed in this implementation

- Pages: `index.html`, `about/index.html`, `how-it-works/index.html`,
  `create/index.html`, `community/index.html`, `resources/index.html`,
  `get-involved/index.html`, `immersive/index.html`, three resource detail
  `index.html` files, `privacy/index.html`, `accessibility/index.html`,
  `community-guidelines/index.html`, `not-found/index.html`, `404.html`.
- Shared frontend: `main.css`, `styles/tokens.css`, `styles/tokens.json`,
  `styles/fonts.css`, `styles/global.css`, `styles/components.css`,
  `styles/editorial.css`, `scripts/site-shell.js`, `scripts/editorial.js`,
  `styles/site-shell.css`,
  `scripts/resource-library.js`, `scripts/involvement-form.js`,
  `scripts/community-gallery.js`.
- Assets: `assets/htafl-monogram.svg`, `assets/htafl-monogram-ivory.svg`,
  `assets/fonts/manifest.json`. Existing photography was reused unchanged.
- Services: `package.json`, `package-lock.json`, `.gitignore`, `.env.example`,
  `server/index.js`, `server/review.js`, `tests/services.test.js`,
  `tests/browser-qa.cjs`.
- Design evidence/helpers: `design/figma-context/context.json`,
  `design/figma-context/homepage-reference.png`,
  `design/figma-context/generate-pages.py`,
  `design/figma-completion/context-export.js`, `panel.js`, `code.js`.
- Documentation: `README.md`, `docs/web-resources.md`, this document,
  `docs/involvement-form.md`, `docs/community-gallery.md`, `docs/logo-system.md`,
  `robots.txt`.

## Completed verification

- Five Node service tests passed, covering delivery, failed/unconfigured SMTP,
  private-to-approved publication, rights/format/size validation, rate limiting
  and blocking private storage paths. Tests use temporary storage and mock mail.
- 32 browser layout checks passed: eight main pages at 1440, 768, 390 and 320px.
  No horizontal overflow or browser errors were found. Automated axe WCAG A/AA
  checks passed for those eight pages at 390px; this is not certification.
- Keyboard navigation/menu focus and Escape, scene tabs/query state, image-dialog
  focus restoration, resource filters/empty states, unavailable email notice,
  form error-summary focus and reduced-motion behavior passed.
- Browser tests exercised an actual private image upload and enquiry against
  an isolated server with mock mail, plus recoverable email failure. No real
  message, public work or production upload was created.
- Installed production dependencies reported zero known npm audit vulnerabilities
  on 6 October 2026. Desktop/mobile hero and editorial scene were visually reviewed
  against the native Figma export. Real-device touch testing and live SMTP setup
  remain deployment checks.

Pre-existing uncommitted work and unrelated historical assets are preserved.
