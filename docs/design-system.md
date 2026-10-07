# HTAFL design foundation

Plain HTML/CSS; no framework, dependencies or build step. Open
`docs/design-system.html` for the internal component reference.

## Entry point

Every page needs a viewport meta tag and `<link rel="stylesheet" href="main.css">`.
The entry point loads local OFL-1.1 WOFF2 fonts through `styles/fonts.css`
(Space Grotesk 600–700; Inter 400–700), then tokens, global styles, layout,
components and accessibility. These are unchanged official Google Fonts files,
with `font-display: swap` and language subsets loaded on demand. The site uses
Inter 400/600/700; its unused 500 declaration was removed. Fonts load on demand
from CSS, without speculative preloads or external font requests. This also
avoids preload CORS errors in direct file previews. Arial/sans-serif remain
the failure fallback.
See [font provenance and licenses](web-resources.md#website-fonts-license-and-loading)
and the license notices beside the fonts in `assets/fonts/`.

`styles/tokens.css` preserves the supplied tokens. `styles/tokens.json` preserves
their values, with the brand concept updated to **HTAFL Five-Path Mark**.
CSS is the runtime source; JSON is available for future tooling. Keep both in sync
when approved tokens change. `tokens.css` includes the JSON spacing scale as
`--space-*`; `global.css` adds semantic aliases referencing the original brand palette.

## Layout

```html
<body class="page">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="container section section--compact">…</header>
  <main id="main" tabindex="-1">
    <section class="section surface surface--mist" aria-labelledby="title">
      <div class="container stack">
        <h1 id="title">Page title</h1>
        <div class="grid">
          <div class="grid__two-thirds prose">…</div>
          <aside class="grid__sidebar">…</aside>
        </div>
      </div>
    </section>
  </main>
  <footer class="section surface surface--ink">…</footer>
</body>
```

- `.container`: centered 1200px maximum content width, minimum 20px gutters.
- `.container--reading`: centered 720px container; `.reading`: inner 720px measure.
- `.section`, `.section--compact`: fluid or compact vertical spacing.
- `.inset`: shared padding for an inner surface or panel.
- `.stack`, `.cluster`: vertical flow or wrapping horizontal flow. Customize
  `--stack-gap` / `--cluster-gap` using spacing tokens.
- `.grid`: 1 column below 48rem, 8 at 48rem, 12 at 75rem. Default children span all
  columns. `.grid__half` / `.grid__third` span 4 tablet columns and 6/4 desktop
  columns. `.grid__two-thirds` / `.grid__sidebar` stack until desktop, then span 8/4.
- `.card-grid`: 1/2/3 equal columns at the same breakpoints.

Breakpoints are implementation choices; the brief specifies column counts without
thresholds. Native media query conditions cannot use CSS variables, so their
literal values are documented in `layout.css`.

## Typography and surfaces

Semantic heading levels are independent of visual styles: `.type-display`,
`.type-h1`, `.type-h2`, `.type-h3`, `.type-body-lg`, `.type-body`, `.type-small`,
`.type-label`. `.prose` adds editorial spacing.

Use `.surface` with `.surface--white`, `--mist`, `--coral`, `--ink` or `--cobalt`.
The base surface is paper. Text/link/border aliases adapt together. Nested cards
reset to their own surface. Slate secondary text is used on white; ink secondary
text on paper/mist/coral preserves contrast. Avoid white on coral or cobalt on ink.

## Buttons and cards

```html
<button class="button button--primary" type="submit">Submit</button>
<a class="button button--secondary" href="about.html">About HTAFL</a>
<a class="button button--text" href="#details">
  Read details <span class="button__arrow" aria-hidden="true">→</span>
</a>
<article class="card card--resource card--interactive">
  <div class="card__body">
    <h2 class="type-h3">Descriptive resource title</h2>
    <p>Verified summary.</p>
  </div>
  <div class="card__footer"><a href="actual-resource-url">Read the resource title</a></div>
</article>
```

Use links for navigation and native buttons for actions. Set `type="button"` for
non-submit actions. Use native `disabled` on buttons; CSS or `aria-disabled` alone
does not disable links. `.button--block` fills its container. Secondary controls
use ink on light surfaces and white on dark/cobalt surfaces. Use secondary/text
controls on cobalt so their boundaries remain distinguishable.

Cards: `.card--action` with `.card--create`, `.card--overcome` or `.card--connect`;
`.card--resource`; `.card--challenge`. Shared `.card__body`, `.card__footer` and
optional 4:3 `.card__media` slots support composition. Images still require alt
text, explicit HTML dimensions and lazy loading below the fold.
Only add `.card--interactive` when there is a real link/button inside. Do not make
articles focusable or nest interactive elements. Status must be written out.

## Accessibility

Shared styles provide a skip link, solid dual-color focus rings, 44px button
targets, responsive wrapping, reduced motion and forced-colors support. The
original translucent focus token is supplemented with a solid outline.
Reduced motion removes lifts/arrow movement and minimizes CSS animation and
transition durations. Future JavaScript animations must also respect
`matchMedia('(prefers-reduced-motion: reduce)')`.

Each future page still needs logical landmarks/headings, labeled fields,
descriptive links and media alternatives. Check keyboard use, 200% zoom and narrow
viewports. The unrelated HTML-learning exercise and unused tutorial images were
removed during the repository cleanup.

## Next

The shared logo/header/mobile navigation/footer are now implemented; see
`docs/site-shell.md`. The homepage is now built; see `docs/homepage.md` for its
interactions. The seven completed routes reuse these primitives; see
`docs/pages.md` and `docs/interactions.md`. Published challenge/resource/gallery
records and a contact submission service are still needed.

