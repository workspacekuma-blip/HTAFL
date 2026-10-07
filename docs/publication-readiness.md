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
metadata, public routes, private-file boundary and protected review endpoints
pass live checks. The latest published-site browser review completed successfully
after resolving the hosting badge warning described below.
The owner confirmed repeating basic phone/dashboard checks at the final address.
The final site's private upload also survived redeploy to `966f586`, remained
unpublished and was withdrawn; record and image deletion were verified.

### Latest published-site review — 7 October 2026

- Reviewed 21 public pages on the final HTTPS address at 1440, 768, 390 and
  320 pixels: 84 layout checks passed without horizontal overflow.
- All 21 pages passed automated WCAG A/AA checks in the tested mobile viewport.
  They each have one main landmark, one H1, a title and a description.
- Mobile navigation focus trapping, Escape, focus restoration and scroll lock;
  social icons/new-tab behavior; image-dialog close/focus; resource filtering,
  empty state, reset and URL search; and invalid-form error-summary focus passed.
- The Get Involved index remains form-free. Email/upload availability is enabled
  on the deployed forms. This review sent no enquiries or uploads.
- Further live checks passed for keyboard prompt checklists, reset, no persistence,
  instructions without JavaScript, image-gallery browsing, bounded pointer depth,
  touch layouts and reduced-motion behavior.
- The final live browser run reported no JavaScript or console errors. Fresh
  desktop/mobile homepage and desktop support screenshots were visually inspected.
- All 22 service tests passed, the public package built successfully, and all
  531 local link/image/style/font references in that package resolved.

**Issue fixed:** Netlify injected its optional badge into an inline frame. Its
script conflicted with HTAFL's existing Content Security Policy and emitted an
error on every page. The final site's `built_with_badge_enabled` setting is now
off. Fresh requests have no badge iframe and no corresponding console warning.
No website code, branding, layout or security-policy relaxation was needed.
This is a hosting setting, not a source-code change. Netlify documents the
[per-project badge setting](https://docs.netlify.com/manage/projects/powered-by-netlify-badge/).

Chrome viewport checks are distinct from actual-phone testing. The owner previously
confirmed basic checks on both phones; detailed screen-reader, landscape, larger-text
and slow-network checks remain in the phone checklist. Guardian verification,
controller details, retention handling and protected backup/recovery remain owner
operations. No new delivery, sign-in or persistence claim is based solely on a
configuration flag; their previous live verification is recorded separately above.

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
3. Encrypted private backup tools and an isolated real-image recovery drill are
   implemented. The first production snapshot and offline recovery passed with
   zero records. Copy the encrypted archive to owner-selected mail.com Drive,
   keep the key separately and verify a downloaded copy. Backup scheduling and
   expired-state housekeeping remain operator tasks. See [backup/recovery](backup-recovery.md).
4. Confirm operational privacy/retention procedures and verified guardian consent
   before accepting children's personal submissions. A general consent checkbox
   is not a guardian-verification workflow. All six forms now enforce an adult-only
   confirmation and exclude child personal details/identifiable images. The
   private guardian verification, separate publication permission and withdrawal
   procedure is in [guardian consent](guardian-consent.md). It must actually be
   followed before collecting any child's information.
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
