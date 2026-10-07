# Merchandise and retail accents — 7 October 2026

The owner requested the colors/social treatment shown in an ASOS screenshot and
a merchandise page, then confirmed **Coming soon for now**. The reference was
inspected on the official website. Only general color treatment is used; no
ASOS design, logo or downloadable asset is copied.

## Delivered

- Black footer with white text, a deep-blue divider and colored social badges.
- White header/mobile navigation and deep-blue primary buttons.
- Central retail accent tokens: black `#000000`, white `#FFFFFF`, blue `#051A6E`.
  Existing HTAFL core tokens, typography, logo, copy and layouts remain intact.
- Existing Instagram, X and TikTok links retain new-tab access, safe link
  attributes, accessible names and local licensed glyphs. Focus, hover, reduced
  motion and forced colors remain supported.
- `/merchandise/` in desktop/mobile navigation, plus static navigation fallback.
  The page shares normal components, metadata, photography and the site shell.
- A clear coming-soon message; no ordering, cart, payment or fake product catalog.
  The process photograph is explicitly illustrative, not an HTAFL product.

## To enable merchandise sales later

Provide approved product photographs, names/descriptions, prices/currency,
variants/availability and the actual store or checkout destination. Shipping and
returns information also needs real operating details. Support bank/crypto
instructions are for contributions; they are not merchandise checkout.

## Files changed

- `styles/tokens.css`, `styles/tokens.json`: central retail/social presentation values.
- `styles/components.css`: blue/white primary button colors.
- `styles/editorial.css`: white header/menu, black/white footer, colored badges,
  forced-color fallback and merchandise section accents.
- `scripts/site-shell.js`: Merchandise navigation and social presentation hooks.
- `server/index.js`: explicitly allows the new public static route.
- `design/figma-context/generate-pages.py`: page source and fallback navigation.
- New `merchandise/index.html`; regenerated public HTML files get the fallback
  navigation entry. No page body content other than merchandise changes.
- `tests/merchandise-browser.cjs`: new route, state, layout/accessibility, color,
  social/new-tab and mobile navigation checks.
- `tests/browser-qa.cjs`: adds the merchandise route to responsive coverage.
- `tests/admin-browser.cjs`: locates Instagram by its stable URL after the previous
  accessible new-tab label change.
- `docs/web-resources.md`, `docs/publication-readiness.md`, this guide.

Verification: merchandise checks cover 1440/768/390/320px, semantic headings,
automated WCAG A/AA checks, social links, keyboard/Escape and no fake checkout.
Screenshots were reviewed at desktop/mobile sizes. Shared responsive checks and
backend tests cover the existing website. Public launch service setup remains
listed in the publication-readiness report.
