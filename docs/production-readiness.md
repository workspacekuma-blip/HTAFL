# HTAFL production-readiness pass — 5 October 2026

The seven public pages passed local production checks with the established
branding, layout, copy and interactions preserved. The site remains plain
HTML/CSS/JavaScript with no package installation or website build step.

## Files changed in this pass

- `get-involved/index.html`: gave the focusable, labelled error summary an
  explicit `group` role. Its validation, focus behavior and text are unchanged.
- `about.html`: added the existing About description, production SVG favicon,
  brand theme color and `noindex` to the legacy redirect. Its destination,
  fallback link, title and layout are unchanged.
- `robots.txt`: added crawl exclusions for the internal `docs`, `social` and
  `youtube` reference folders. Public pages, scripts, styles and assets remain
  crawlable.
- `README.md`: linked this report and deployment notes.
- `docs/production-readiness.md`: this report.

No other files changed during this pass. The earlier cleanup is recorded
separately in [cleanup.md](cleanup.md).

## Checks and results

- All seven routes, navigation links and local fragments resolved over a local
  HTTP server. Local-file navigation and the legacy About redirect also passed.
  HTML/CSS references, duplicate IDs, JavaScript syntax and JSON parsing passed.
  No console/runtime errors or failed requests appeared in the browser audit.
- Each public page has a distinct title and description, English language,
  viewport/charset metadata, a single main landmark and H1, and the production
  favicon. No invented public domain or canonical URL was added.
- Layout checks passed at 320, 360, 390, 768, 1024, 1200 and 1440px. All seven
  pages also passed at 200% text size on desktop and at 320px. The menu remained
  scrollable and keyboard accessible in a 320×256 landscape viewport.
- Keyboard skip links, visible focus rings, form-control focus, forced-colors
  focus, mobile focus trapping, Escape, scroll/focus restoration and desktop
  resize passed. Native disclosure Enter/Space behavior passed.
- The exact five production logo paths, one-pass 800ms entrance, hero states,
  approach cards, section reveals, connection line, reduced-motion rendering
  and live motion cancellation passed. No animation was changed.
- Challenge/resource filtering, search, query state, history and empty states
  passed. Test records were injected only by the temporary test server.
- Empty/invalid form review, error-summary focus and links, correction, optional
  URL rejection, reset and local status messages passed. No enquiry was sent,
  stored or placed in a URL. Without JavaScript, submission stays disabled.
- Rendered images loaded and had explicit dimensions and alt attributes.
  Decorative logos remain excluded from redundant announcements. The future
  gallery retains lazy loading, async decoding and validated image dimensions.
- axe-core 4.14.0 reported zero violations across 25 desktop, mobile, open-menu,
  disclosure, filtered-empty and form-error states. The labelled generic error
  summary was flagged for review; its explicit role resolved that ambiguity.
  Decorative-arrow/indicator contrast review items use the passing inherited
  brand color pairs. This is a local automated and keyboard audit, not a claim
  of a complete screen-reader or cross-browser certification.
- Shared components and tokens remain central. No additional duplicate or
  orphan component styles required removal; documented reusable primitives and
  no-JavaScript fallbacks remain intentional. There are no unnecessary package
  dependencies. The accessibility tool was used from a temporary file only.

## Deployment setup

1. Configure the actual static host, public domain and HTTPS. Publish `index.html`,
   `about.html`, `robots.txt`, the completed route directories, `main.css`, `assets`,
   `styles` and `scripts`. The route directories must serve `index.html` and
   redirect a directory URL without its trailing slash to the slash form.
   Keep internal reference folders out of the public upload.
2. Serve `robots.txt` at the origin root. Its exclusions assume a root deployment;
   prefix them with the site's path if deploying under a subdirectory. Once the
   public domain is confirmed, add real canonical URLs and a sitemap. Configure
   the host to redirect `/about.html` permanently to `/about/` when possible;
   the HTML redirect remains a static fallback.
3. If deploying from Git, include the new/untracked site files and earlier
   deletions in the deployment commit. This pass made no commit or deployment.
4. To accept enquiries, connect a real form endpoint and recipient, validate on
   the server, confirm the response/privacy text, and implement real pending,
   failure and success states. The current review-only form is safe to publish
   with its existing availability notice. Do not present it as a working inbox.
5. Connect approved challenge/resource/gallery records when available. Existing
   empty states can remain live. Use only permission-approved content and credit.
   Public social destinations and sharing images/URLs still need real values.
6. Inter and Space Grotesk are now self-hosted in `assets/fonts/`, with their
   OFL-1.1 notices. Deploy that directory and `styles/fonts.css`; serve WOFF2 as
   `font/woff2`. A font CSP can use `font-src 'self'`; fonts no longer need Google
   domains. Inline SVG/JSON/style usage must still be supported. Configure cache
   headers and HTTP compression for CSS. Font filenames are not content-hashed:
   version them before enabling year-long `immutable` caching. Cross-origin
   font serving, if introduced later, needs appropriate CORS headers.
7. After upload, repeat route/asset/form checks on the real domain and spot-check
   iOS/Safari, Android and a screen reader. Local browser testing used Chrome;
   hosting redirects, headers and real-device behavior were not deployed here.
