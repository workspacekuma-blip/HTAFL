# HTAFL website review — 7 October 2026

**The website is deployed on free Netlify HTTPS with verified private upload
persistence, real email receipt and owner-confirmed live administrator sign-in.
The owner also reported passing the basic checks on Android and iPhone.** Branding, layout and copy were
preserved. No new reproducible website defect was found. The browser review
previously assumed email was always unconfigured; its test now covers the live
availability state and an isolated unavailable state without sending test-fixture
messages through real SMTP.

## Current verification

The table records the local review unless it explicitly names a live result.
The final production address is `https://htaflco.netlify.app`. Its HTTPS,
metadata, 15 public routes, private-file boundary and protected review endpoints
pass direct live checks. Extended live browser runs were interrupted by transient
network timeouts; they are not recorded as a completed deployed browser suite.
Basic owner-reported phone/dashboard results initially belong to `htafl-890` and
must be repeated at the final address.

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

## Launch status and remaining operator checks

1. Administrator access is configured. The owner confirmed that both local and
   deployed dashboards open. Reviewer: HTAFL owner. Keep credentials private.
2. Complete and verify the new free Netlify deployment. The new site is
   `https://htaflco.netlify.app`, linked to the public GitHub source with private
   production settings saved. The Linux build succeeded; live HTTPS, HTTP
   redirection, 15 routes, canonical metadata and the private file boundary pass.
   A private upload was converted and stored without publication, survived a
   GitHub-triggered redeploy, and was withdrawn. Both record and image deletion
   were confirmed. The owner confirmed the live email notification arrived.
   See [Netlify launch](netlify-launch.md).
3. Arrange protected backups, recovery testing and expired-state housekeeping.
   These operator procedures are not automatically supplied by persistence.
4. Confirm operational privacy/retention procedures and verified guardian consent
   before accepting children's personal submissions. A general consent checkbox
   is not a guardian-verification workflow. See [privacy operations](privacy-operations.md).
5. The owner reported that menu, sideways scrolling, resource search and opening
   an involvement form pass on both phones. Complete the remaining landscape,
   assistive-technology, larger-text, image-selection and slow-network checks in
   [phone launch checks](phone-launch-checks.md).

Bank instructions remain owner-supplied and transfers are not automatically
processed or confirmed. Crypto and merchandise are intentional coming-soon
states until their real details are supplied.

## Files changed in this review

- `README.md`: live website and administrator status.
- `docs/backend-tools.md`: live review setup and the Netlify shared-state distinction.
- `docs/email-delivery.md`: confirmed local and deployed inbox receipt.
- `docs/netlify-launch.md`: actual free deployment, HTTPS, private configuration,
  GitHub integration and storage verification.
- `docs/privacy-operations.md`: permission review, rights requests, retention and
  deletion procedures assigned to the owner.
- `docs/phone-launch-checks.md`: owner-reported basic phone results and the remaining
  detailed real-device checklist.
- `docs/publication-readiness.md`: this launch record.
- `tests/browser-qa.cjs`: waits for the actual community availability response
  before checking its submit button. No website design or behavior changed.

Screenshots and working audit outputs are ignored under `test-results/`. The
existing `.env` and private community storage remain excluded from Git.
