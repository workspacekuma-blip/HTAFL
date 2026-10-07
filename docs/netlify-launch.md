# HTAFL Netlify launch — 7 October 2026

The owner chose Netlify and asked for the best free option. The prepared target
is its Free plan with modern Functions and private Blobs, retaining the static
HTML/CSS/JavaScript frontend and shared Express backend. No paid plan, extra
credit purchase or paid upgrade has been made. The owner authorized a new free
site, then selected the existing `https://htaflco.netlify.app` as the final target.
The initial `https://htafl-890.netlify.app` was created in the HTAFL Free team,
with automatic top-ups disabled. Its production mail/admin environment is saved,
the public GitHub source is connected with a read-only deploy key and push webhook.
A Linux production build succeeded. Public HTTPS, HTTP-to-HTTPS redirection,
15 page routes, canonical metadata, the private file boundary and protected
administrator API pass live checks. A private test upload was converted and
stored in production Blobs, stayed unpublished, and sent its notification.
The same private record and converted image survived the GitHub-triggered
redeploy to commit `8c55cbb`. Withdrawal then deleted both, confirmed by protected
storage reads. No test work entered the public gallery.

The final existing `htaflco` site was then deployed successfully with the same
verified production mail/admin settings and its own HTTPS origin. Public HTTPS,
HTTP redirection, 15 routes, canonical metadata, unauthenticated admin protection
and excluded private files pass there. A new private upload was converted, stored,
excluded from the gallery and accepted for email notification. The same record
and converted image survived the GitHub-triggered redeploy to `966f586`.
Withdrawal deleted both. The owner confirmed repeating administrator sign-in and
basic phone checks at the final address. Both test uploads were kept unpublished
and removed; no community submission was migrated or published as a test.

Netlify currently lists a 300-credit monthly Free limit, including Functions and
Blob storage. This is a limited free tier, not unlimited hosting. Check usage in
the account; do not enable a paid upgrade or auto-recharge without owner approval.

## Deploy through the actual Netlify account

1. Use the owner's selected existing site `https://htaflco.netlify.app` and its
   Netlify project `61194eef-4369-403b-8ff5-cba6e1e14435`. The generated `htafl-890`
   site was the initial verification target, not the final destination.
   Local changes must reach the connected repository before Netlify can build them.
   Do not drag-and-drop `dist` alone: that would omit the backend Functions.
2. Keep the Free plan. `netlify.toml` selects Node 24, `npm run build`, the isolated
   `dist` public folder and `netlify/functions`. The Sharp native dependency is
   installed and packaged by the Linux Netlify build; a Windows-built native
   dependency should not be uploaded as the Linux runtime.
3. Add these through Netlify's private environment settings with Functions scope:
   `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`,
   `SMTP_USER=dyrctkm@gmail.com`, `SMTP_FROM=dyrctkm@gmail.com`, the verified
   `SMTP_PASS`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` and
   `COMMUNITY_REVIEWER=HTAFL owner`. All deliveries go to htafl@africamail.com;
   Sending uses dyrctkm@gmail.com after its Gmail App Password is verified.
   Copy the hash, never a plain admin passphrase.
   Never upload `.env` as a public file or paste these secrets in chat. The Free
   team's environment is saved with all supported scopes because granular scopes
   are not available on this plan; application packaging excludes configuration
   and the build does not print private values. Mail/admin values are production-only.
4. Set `PUBLIC_ORIGIN` to the actual HTTPS site origin, with Build and Functions
   scope. The build can also use Netlify's provided `URL`; runtime can use
   `context.site.url`. Do not copy the localhost origin into production.
5. Netlify secures the generated `netlify.app` address automatically. Verify its
   certificate after deployment. A purchased custom domain is optional.
6. Check `/healthz`, `/api/config`, private `/admin/` sign-in and the invitation
   state at `/community/`. Run the authorized delivery test against that origin
   and confirm inbox receipt. Exercise one consent-approved test upload, restart
   or redeploy, verify its private persistence, then remove the test through review.
7. Test the deployed site on actual iOS/Safari and Android/Chrome devices. Chrome
   viewport emulation checks do not establish real-device or deployed performance.

## Uploads and review

Production uses `htafl-community-production`; strong reads gate public images on
an approved record and publication permission. Review rejects/withdrawals remove
the record first and then its image, so a failed image deletion cannot keep a
work publicly accessible. Store operations do not expose arbitrary object keys.
Native image conversion still strips embedded metadata. Uploads are limited to
3 MB in the function adapter; the frontend follows `/api/config` and preserves
the local Node server's 8 MB limit. No new private files enter the public package.

Sessions, login/submission counters and moderation leases use a separate private
store, with conditional writes across instances. Expiry and idle limits are
checked on access; logout revokes the stored session and credential changes
invalidate prior sessions. The credential generation is not a public value.
Expired state needs periodic housekeeping; no scheduled deletion job has been
deployed. Do not claim backups or retention operations are running automatically.

Deploy previews use a separate store per deploy and disable real mail, avoiding
production artwork changes and accidental email. Netlify-native request context
provides the client IP; caller-supplied forwarding headers are discarded.
The application keeps same-origin/CSRF checks, Secure HttpOnly review cookies,
private no-store responses, and consent requirements.

The owner is the community reviewer. Review pending work regularly and remove
work once review is abandoned, rejected or withdrawn. Export private data only
to protected backups; inbox attachments and backup copies require separate
deletion. Blobs persistence does not by itself establish a tested recovery plan.

## Domain metadata and packaging

`server/build-site.js` copies only public folders into `dist`; configuration,
server helpers, private uploads, design sources and tests are excluded. It adds
canonical/Open Graph metadata and a sitemap for the real HTTPS origin, and a
sharing image rendered from the existing wordmark. Preview builds are noindex.
The production source pages retain their current design and copy; domain metadata
is applied to the deployment package, not guessed in local previews.

## Verification and limits

Unit tests exercise persistent storage and cross-instance state using mock object
storage, and the modern Request/Response boundary preserves the existing Express
validation and sign-in behavior. These are not live Netlify integration tests.
The public package and existing site are checked locally. Gmail authentication
and one controlled local form delivery now pass; the owner confirmed inbox receipt.
Netlify account access and Free plan have been verified; site creation, private
production configuration and Linux deployment succeeded. The owner saved the
administrator passphrase privately and confirmed local sign-in. Live HTTPS and
public/backend checks pass. The owner also confirmed that the live administrator
dashboard opens and that the deployed upload notification reached
`htafl@africamail.com`. The owner reported successful menu, sideways-scrolling,
resource-search and involvement-form checks on both Android and iPhone. Additional
real-device accessibility, landscape, image-selection and slow-network checks
remain in [phone launch checks](phone-launch-checks.md).

Official references: [Netlify pricing](https://www.netlify.com/pricing/),
[modern Functions](https://docs.netlify.com/build/functions/api/),
[private Blobs and conditional writes](https://docs.netlify.com/build/data-and-storage/netlify-blobs/),
[managed HTTPS](https://docs.netlify.com/manage/domains/secure-domains-with-https/https-ssl/).
