# HTAFL website review — 7 October 2026

**Local website, real email delivery and owner-confirmed administrator sign-in
pass review. Live hosting/storage and actual-phone checks remain incomplete.** Branding, layout and copy were
preserved. No new reproducible website defect was found. The browser review
previously assumed email was always unconfigured; its test now covers the live
availability state and an isolated unavailable state without sending test-fixture
messages through real SMTP.

## Current verification

| Check | Result |
| --- | --- |
| Backend/build | All 22 service tests pass; public packaging succeeds. |
| Main pages | 44 responsive checks across desktop/tablet/390px/320px pass, including keyboard navigation, mobile menu Escape/focus, resource filters, form validation and image dialogs. |
| Questionnaires | 24 pathway/index checks and five isolated mock submissions pass. The Get Involved index has no form; each chosen pathway has its own questionnaire. |
| Utility/prompt pages | 21 additional desktop/mobile checks and automated accessibility checks pass for privacy, accessibility, guidelines, not-found and three actual resource prompts. |
| Links/metadata/assets | 24 public pages and all 521 local link/image/stylesheet references resolve. Six form actions are backend routes covered by service tests. Each page has one H1, title and description. Favicon and wordmark resolve. |
| Community | Private upload, consent, publication, withdrawal, featured selection and image-viewer tests pass using isolated fixtures. The live gallery remains empty; no fake profiles or test works were published. |
| Motion/WebGL | Actual cloth rendering, pixel cap, no idle loop, offscreen pause, pointer response, reduced motion and unavailable-GPU fallback pass. |
| Form states | Real availability plus isolated unavailable, validation, success and failed-delivery preservation states pass. Tests do not send fictional enquiries to the live inbox. |
| Dependency audit | Zero known production vulnerabilities reported in the checked registry snapshot. |
| Private boundary | Environment, repository, server/setup, design and private upload paths return 404. Unauthenticated review returns 401; security headers and private no-store/noindex headers pass. |
| Visual inspection | Fresh desktop/mobile screenshots inspected for homepage, bank support and the community invitation. No overlap or horizontal overflow found in tested views. |

Automated accessibility checks and Chrome viewport emulation do not establish an
independent accessibility certification, actual Safari/iOS/Android behavior or
production loading performance. The local-reference audit does not verify every
external website's availability.

## Real email activation

Sender: **dyrctkm@gmail.com**. Recipient/public contact: **htafl@africamail.com**.
The saved private SMTP credential passes connection/authentication. The preview
was restarted to activate it. One previously owner-authorized participation test
was accepted by SMTP; the owner explicitly confirmed receipt in the recipient
inbox. No password is recorded here, in browser code or in Git.

## Still required for public launch

1. Administrator access is configured. The owner confirmed that both local and
   deployed dashboards open. Reviewer: HTAFL owner. Keep credentials private.
2. Complete and verify the new free Netlify deployment. The new site is
   `https://htafl-890.netlify.app`, linked to the public GitHub source with private
   production settings saved. The Linux build succeeded; live HTTPS, HTTP
   redirection, 15 routes, canonical metadata and the private file boundary pass.
   A private upload was converted and stored without publication. Verification
   across redeploy and cleanup is in progress. See [Netlify launch](netlify-launch.md).
3. Verify HTTPS, domain metadata, native-image execution and persistent private
   Blobs on the deployed site. Test an upload across redeploy, approval and
   withdrawal; arrange protected backups and expired-state housekeeping.
4. Confirm operational privacy/retention procedures and verified guardian consent
   before accepting children's personal submissions. A general consent checkbox
   is not a guardian-verification workflow. See [privacy operations](privacy-operations.md).
5. Test the deployed site on the owner's actual iOS/Safari and Android/Chrome
   devices using [phone launch checks](phone-launch-checks.md).

Bank instructions remain owner-supplied and transfers are not automatically
processed or confirmed. Crypto and merchandise are intentional coming-soon
states until their real details are supplied.

## Files changed in this review

- `tests/browser-qa.cjs`: supports enabled live email and explicitly verifies the unavailable state with an isolated configuration response.
- `docs/publication-readiness.md`, `docs/email-delivery.md`, `docs/netlify-launch.md`: current review evidence and confirmed local email activation.

Screenshots and working audit outputs are ignored under `test-results/`. The
existing `.env` and private community storage remain excluded from Git.
