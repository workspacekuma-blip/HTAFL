# HTAFL backend tools

The existing Node server handles enquiries, private artwork uploads and the
approved public gallery. This pass adds operator tools without new dependencies
or changes to the website design.

## First-time setup

1. In the project terminal, run `npm run backend:setup`.
2. Choose an administrator username and a private passphrase of at least 16
   characters. Input is hidden. Only a salted scrypt hash is stored.
3. Optionally configure SMTP in the same wizard. The sender is dyrctkm@gmail.com; use its Gmail App Password
   with two-step verification. Do not put
   credentials in chat. The recipient stays `htafl@africamail.com`.
4. Supply the website origin. For the current preview it is
   `http://localhost:3128`; a deployed host must use its exact HTTPS origin.
   The wizard matches the listening port to a local HTTP preview origin and
   selects production mode for an HTTPS origin.
5. Confirm public bank instructions in `content/support-contributions.json`.
   Crypto is optional and unavailable until its currency, network and address
   are supplied. Regenerate pages after editing these public instructions.
   The setup wizard does not ask for payment-provider credentials.
6. Restart the server and run `npm run backend:check`. The check tests private
   disk writes and SMTP connection/authentication, without sending an email.
   It checks contribution fields only; account ownership and transfer availability
   require manual verification. Optional missing crypto details do not block bank instructions.
7. Open `/admin/`. The current preview is http://localhost:3128/admin/.

The wizard preserves existing settings unless explicitly changed. `.env` is
private and Git-ignored. Alternatively supply `ADMIN_USERNAME`,
`ADMIN_PASSWORD_HASH`, SMTP settings and `PUBLIC_ORIGIN` through the host's
environment controls. The dashboard is disabled until a valid password hash
exists. There is no default/shared password and no unauthenticated public setup
or password reset endpoint. To reset credentials, rerun the host wizard and
restart the server, which also invalidates existing sessions.

## Review Studio

- Sign in to see private artwork, creator credit, contact email, permission,
  upload reference and email notification status.
- Filter pending/approved work or search title, creator and reference.
- Approve publication only after inspecting the work and its permission.
  The server rejects publication without all required consent, even if an
  operator bypasses the interface. Email and consent records never enter the
  public gallery.
- Reject or withdraw work to delete its stored image and record. The dashboard
  requires confirmation. Backup and inbox copies need separate operator removal.
- Retry a failed/unconfigured notification after SMTP setup. Notifications go
  only to the designated HTAFL inbox; already-sent notifications cannot be resent
  through this action. Unavailable or failed SMTP is reported honestly.
- Sign out to invalidate the session and clear private review data from the view.

The existing host-only `npm run review -- list | approve <id> | reject <id> |
withdraw <id>` commands reuse the same record and consent checks.

## Protection and hosting

Review APIs and pending-image endpoints require authentication. Administrator
pages/API responses are `no-store` and `noindex`. Sessions use random HttpOnly,
SameSite=Strict cookies scoped to `/admin`; production uses Secure cookies and
refuses HTTP sign-in. Sessions expire after 30 minutes idle or 8 hours total.
Mutations check the request origin and a per-session CSRF token. Sign-in is
limited to five attempts per IP in 15 minutes. In-progress actions on a work are
serialized within the local process. Netlify uses conditional private Blobs writes
for shared sessions, throttling and moderation locks across function instances.
No password or session token enters URLs or
browser storage.

Set `NODE_ENV=production`, an HTTPS `PUBLIC_ORIGIN`, and the correct trusted
proxy hop count on the actual host. Upload storage must be private and persistent.
Sessions, login limits and submission locks are process-local on the standalone
Node server: use one instance in that mode. The Netlify adapter uses persistent
private state instead. Local server restarts require operators to sign in again.
Restrict host access and protect environment files and backups.

`GET /healthz` is a minimal liveness endpoint; it does not claim email readiness.
The authenticated dashboard reports queue/storage/configuration state. Use the
host readiness command to verify SMTP authentication, then make a controlled
delivery test before public launch. The owner confirmed the local participation
test was received. A deployed private upload notification was accepted by SMTP;
live inbox receipt must also be confirmed.

## Verification

Fifteen service tests pass for private email setup, tailored enquiries, bank contribution presentation, uploads, consent, private endpoints,
password verification, authentication, CSRF/origin protection, publication,
withdrawal, logout, email retries, HTTPS enforcement and login throttling.
`tests/admin-browser.cjs` exercises actual login, mobile layout, automated WCAG
A/AA checks, confirmation-dialog Escape/focus, approval/withdrawal and logout
privacy using isolated storage and test-only artwork. It also checks the accessible Instagram icon in the footer; repeated social links
were removed from mobile navigation. No test work is left in the live gallery.

## Files changed

- `scripts/site-shell.js`: Instagram `https://www.instagram.com/htaflco/` in the
  footer and mobile menu.
- `server/index.js`, `server/review.js`: shared storage/review logic, private
  operator routes and liveness endpoint.
- New `server/storage.js`, `server/password.js`, `server/admin.js`,
  `server/setup.js`, `server/check.js`.
- New `server/admin-ui/index.html`, `app.js`, `admin.css`.
- `package.json`, `.env.example`, `robots.txt`: setup/check commands, admin
  configuration and crawler exclusions. No dependency changes.
- New `tests/admin.test.js`, `tests/admin-browser.cjs`.
- `README.md`, this guide, `docs/web-resources.md`: operations and source records.

## Selected Netlify deployment

[Netlify launch](netlify-launch.md) adds shared private object storage, persistent
sessions, request limits and moderation leases. Process-local restrictions above
apply to the ordinary filesystem Node mode. The new deployment has not run on a
live account. The owner is the reviewer; the private local email/admin setup can
create a salted administrator hash. All notifications now go to htafl@africamail.com.
