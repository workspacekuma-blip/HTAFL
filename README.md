# HTAFL fashion website

The HTAFL Figma design and subsequent owner-supplied refinements are implemented in responsive HTML, shared CSS
and small browser scripts. Tailoring, textiles, sketchbooks and workshop
photography create the editorial atmosphere. A small, licensed draped-textile WebGL study adds fashion depth to the homepage;
no audio is loaded. Create, Overcome and Connect appear once as linked photographic
entrances, with their details on the destination pages. The supplied HTAFL letter
logo is the website identity; the favicon uses its H for small-size readability.

## Run

Use Node 22.12 or newer. Install with `npm ci`, copy `.env.example` to `.env`, then
run `npm start`. Open http://localhost:3000. The frontend remains static; `npm run build` packages public files for Netlify. See [current refresh and verification](docs/site-refresh.md).
Direct-file previews show the pages; forms and the approved gallery need Node.

## Before deployment

The selected free deployment is Netlify with Functions and private Blobs. See
[Netlify launch instructions](docs/netlify-launch.md) for build, private environment
settings, persistent uploads and HTTPS. It is deployed at
[htaflco.netlify.app](https://htaflco.netlify.app/); live upload persistence
across redeployment and private withdrawal were verified. The local
Node server remains available; the filesystem/proxy notes below apply to that mode.

- Set `PUBLIC_ORIGIN` to the exact HTTPS website origin.
- Confirm the owner-supplied GT Bank account on `/get-involved/support/`.
  Public instructions live in `content/support-contributions.json`; regenerate
  pages after changing them. Crypto remains unavailable until its currency,
  network and public address are supplied. No transfers are processed or
  automatically confirmed here. See [contribution details](docs/support-contributions.md).
- Configure SMTP credentials in private host environment variables. All enquiries
  and artwork notifications go to **htafl@africamail.com**. Sending uses **dyrctkm@gmail.com** via Gmail SMTP,
  with that account’s App Password and two-step verification. Never put
  credentials in browser code or Git. Email remains explicitly unavailable until
  configured. Verify delivery with a controlled test before opening publicly.
- Put `UPLOAD_DIR` on a private persistent volume, outside publicly served folders.
  Default: `var/community`. Do not use temporary/serverless disk for lasting uploads.
- Assign a reviewer and confirm privacy, retention, deletion, backup and consent
  operations. Submitted work remains private; public permission is separate.
- Configure HTTPS and your host's proxy correctly. Set `TRUST_PROXY_HOPS` only for
  the known proxy chain. The basic rate limiter is per process; a multi-instance
  deployment needs shared limits and consistent shared storage.

## Review submissions

The owner is assigned to review community work. The private local
`npm run email:setup` screen can save both verified sending credentials and a
salted administrator hash without exposing passwords in chat. Restart or redeploy
to activate them. The owner has saved the administrator credentials privately
and confirmed that both local and deployed dashboards open. Local and deployed
email receipt are verified. The owner reviews community uploads.

The password-protected **Review Studio** at `/admin/` now provides private image
review, approval, rejection/withdrawal and notification retries. Start with
`npm run backend:setup`, restart the server, then run `npm run backend:check`.
See [backend tools and private setup](docs/backend-tools.md). The wizard hides
password input and preserves existing configuration; no default password exists.

`npm run review -- list` lists private references without exposing contact email.
Inspect the private image and record on the host. `npm run review -- approve <id>`
publishes only a pending work with publication permission. `reject <id>` and
`withdraw <id>` remove its image and record. Keep this command restricted to
operators; the browser dashboard uses separate authenticated endpoints. Notifications are not the queue:
check stored records even if SMTP fails. No fake community works are preloaded.

## Verification and handoff

`npm test` covers mail delivery states, validation, upload privacy, publication,
image conversion, private file boundaries and rate limiting. Browser checks are
in `tests/browser-qa.cjs`; they use an externally installed Playwright and optional
axe script, not frontend dependencies. See [implementation and setup](docs/fashion-implementation.md).

Get Involved has separate Participate, Create, Volunteer, Collaborate and Support
pages with one tailored form each and shared validation. The main Get Involved
page lists only the pathway links. See
[pathway forms and contribution instructions](docs/involvement-form.md).

The source file is `design/HTAFL-Website-UI-Master.fig`. Native Figma measurements,
copy and homepage reference are in `design/figma-context/`. The authoring helper
there produces static pages and is never exposed by the server. Shared theme
values are `styles/tokens.css` and `styles/tokens.json`; all pages load `main.css`.
Photography, fonts and dependency sources are recorded in
[web resources](docs/web-resources.md). Historical 3D, social and YouTube files
are retained; the current website does not load the old room renderer.

The [publication review](docs/publication-readiness.md) records the latest
verification, applied licensed resources and private setup still required before
a full public launch. Use the [phone launch checks](docs/phone-launch-checks.md)
on actual Android and iPhone devices once the HTTPS deployment is ready.
