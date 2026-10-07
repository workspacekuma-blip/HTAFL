# Get Involved pathways

The five pathways share the existing form components, typography and page layout,
with distinct fields and submit labels. `content/involvement-pathways.json` is
the field source for both the page generator and server-side validation.

| Pathway | Tailored details beyond name, email, message and response consent |
| --- | --- |
| Participate | Area of interest; optional online/in-person preference |
| Create | Creative practice, intended activity, project stage; optional portfolio/social URL; link to the existing artwork upload form |
| Volunteer | Skills, availability, preferred volunteer format; optional area of interest |
| Collaborate | Proposal type; optional timing, organisation and website/portfolio URL |
| Support | Practical support type and frequency; optional organisation; separate bank-transfer instructions and pending crypto option |

The main `/get-involved/` page contains only the five pathway links; it contains
no forms. Each link opens a dedicated page with exactly one tailored form:
`/get-involved/participate/`, `/get-involved/create/`, `/get-involved/volunteer/`,
`/get-involved/collaborate/` and `/get-involved/support/`. These are ordinary
keyboard-accessible links. A form page shows only the selected questionnaire and
one link back to the choice page; it does not repeat the pathway menu alongside
the form. Join HTAFL opens the choice page first. Direct links, reloads and browser history work normally. No personal
details enter URLs or browser storage. Navigating away does not promise to retain
an unsent draft; browser history may retain it independently.

Older `?interest=...` links redirect to the corresponding dedicated page through
the Node server. `scripts/involvement-pathways.js` keeps old query/anchor links
working in static previews. Without JavaScript, the main page still contains no
forms and every pathway link works; each form stays disabled with a direct-email
alternative. The payment option appears only on the Support page.

`scripts/involvement-form.js` provides labelled controls, linked error summaries,
inline errors, pending state, reset, live status and recoverable failures.
`server/involvement.js` validates the same schema and permitted choices. Enquiries
are sent to **htafl@africamail.com**, with readable pathway-specific field labels.
Success appears only after SMTP accepts delivery; this is not a promise of inbox
placement. Details remain editable after a failed request. Unconfigured SMTP
disables sending honestly. No date of birth, medical details, address or payment
information is requested. Response consent does not permit public sharing.

## Financial support

Support displays owner-supplied bank-transfer instructions independently of the
practical-support form and SMTP. Crypto has an intentional pending state until
the currency, network and public wallet address are supplied. Details are rendered
as semantic HTML and remain available without JavaScript. Copy buttons enhance
available Clipboard APIs; permission failures provide a manual-copy status.

The old hosted checkout and payment configuration have been removed. No provider
SDK, payment processing, automated confirmation or receipts are provided.
No memberships, tax benefits or merchandise purchases are implied.
See [public contribution configuration](support-contributions.md).

## Verification

`tests/involvement.test.js` checks all five schemas, mocked email delivery,
invalid choices, the supplied bank details and absence of a hosted checkout/API
payment setting. `tests/involvement-browser.cjs` checks 24 responsive pathway/index
layouts, five mock submissions, WCAG A/AA checks, keyboard routing/history,
legacy redirects, no-JavaScript bank instructions, pending crypto, and copy
success/failure/focus. No transfer or real email is made by these tests.
