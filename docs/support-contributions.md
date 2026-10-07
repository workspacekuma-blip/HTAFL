# HTAFL contribution instructions — 7 October 2026

The owner replaced hosted checkout with bank transfer and a future crypto wallet.
Only `/get-involved/support/` displays these instructions. The Get Involved index
continues to show five pathway links, with no form or contribution section.

## Public details supplied by the owner

| Field | Value |
| --- | --- |
| Bank | GT Bank |
| Account holder | Ekuma Billclinton |
| Account number | 0473372177 |
| Currency | Naira |

These details are owner-supplied, not independently verified. Visitors are asked
to check the account holder in their banking service before sending. No transfer
code, international instructions or alternative currency has been invented.

Crypto is explicitly unavailable until the owner supplies **all three**:
cryptocurrency, network and public wallet address. No placeholder address,
payment link or QR code is presented. Never put private keys, seed phrases,
passwords or banking login credentials in the public configuration.

## Maintaining the instructions

Edit `content/support-contributions.json`, keeping numbers and addresses as
strings to preserve leading zeros. Run the existing authoring helper
`design/figma-context/generate-pages.py` to regenerate the pages. Partial bank or
crypto configuration renders an unavailable notice rather than incomplete
transfer instructions. Confirm the bank details and exact crypto asset/network
with the owner before publication; field presence does not verify ownership.

Public details are semantic HTML, usable without JavaScript, SMTP or an API
request. The small `scripts/support-payment.js` helper only enhances copying.
Clipboard failure leaves the details visible and announces manual-copy guidance;
keyboard focus remains on the copy button. No new dependency is added.

The website does not process payments, check balances, monitor transactions,
confirm transfers or issue receipts. The existing practical-support questionnaire
remains separate, and its email delivery still requires private SMTP setup.
The previous checkout module, public API setting, environment setting and setup
prompt have been removed; the setup wizard removes the obsolete URL from an
existing environment file when saving.

## Verification

Backend tests cover bank details, absent hosted checkout/API configuration, the
five separate forms and private upload/review boundaries. Browser checks cover
four viewport widths, accessibility, keyboard copying, Clipboard refusal,
no-JavaScript instructions and the pending crypto state. Tests use mocked email
delivery and never make a transfer.

## Files changed

- New `content/support-contributions.json` and this guide.
- `design/figma-context/generate-pages.py`, `get-involved/support/index.html`,
  `privacy/index.html`: semantic contribution instructions and privacy copy.
- `scripts/support-payment.js`, `styles/editorial.css`: accessible copying and
  responsive detail presentation using existing tokens and primitives.
- `server/index.js`, `server/setup.js`, `server/check.js`, `.env.example`:
  remove hosted-checkout setup/API configuration; check public instructions.
- Removed `server/support-payment.js`.
- `tests/involvement.test.js`, `tests/involvement-browser.cjs`,
  `tests/email-setup.test.js`: current contribution states and preserved setup.
- `README.md`, `docs/backend-tools.md`, `docs/involvement-form.md`,
  `docs/publication-readiness.md`, `docs/merchandise.md`, `docs/site-refresh.md`,
  `docs/web-resources.md`: current instructions and superseded reference status.
