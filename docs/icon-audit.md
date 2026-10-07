# HTAFL website icon audit

Audit date: **5 October 2026**. Scope: the seven public routes, shared header/footer, disclosure controls, homepage approach/challenges, resource search/filtering, involvement form, and existing logo/favicon. Social/YouTube templates remain branding artifacts rather than website controls.

## Decision

**No icon library or new SVG collection is needed.** Existing text labels, project glyphs and native form affordances communicate the current actions. Preserve the restrained editorial treatment and keep the site silent. No dependencies, external icon assets or proprietary platform marks were added.

## Inventory and needs

| Area | Existing treatment | Decision |
| --- | --- | --- |
| Brand/home link, favicon and hero | Local Five-Path SVGs; named home links; decorative copies excluded from accessible names | Reuse supplied HTAFL artwork. Do not turn the brand mark into a generic menu, category or status icon. |
| Desktop/mobile navigation | Text links, `Menu`, `Close menu`, `aria-expanded`, native dialog | Keep visible labels. Hamburger/close SVGs would duplicate existing information and are unnecessary. |
| Buttons and approach cards | Text plus decorative `→`, using shared `.button__arrow` styles | Reuse existing arrows. Retain `aria-hidden="true"` on decoration and the existing reduced-motion treatment. |
| Footer | `Back to top` with decorative `↑` | Reuse the existing glyph; the text supplies the action name. |
| Expandable content | Nine native `<details>` controls; How It Works already has shared plus/minus state spans | Five homepage/community indicators always displayed `+`, even when open. Reuse `.disclosure__closed` / `.disclosure__open` to show `−` when open. No new CSS or JavaScript. |
| Search | Visible field label, native `type="search"` and text `Search` button | No magnifier needed. Clear-search/filter action stays explicitly labeled. Native search decorations may vary by browser without affecting meaning. |
| Challenge/resource filters | Labeled native radio buttons with a visible checked state | No category icons needed; retain real category names and native selection cues. |
| Involvement form | Visible labels, native select/checkbox, required text, written errors and status messages | No warning/check/lock icons needed. Do not imply a secured backend, stored submission or successful delivery through iconography. |
| Resources, challenges and community empty states | Meaningful headings, explanatory copy and real next actions | No generic people/avatar, health, trophy or decorative placeholder icons. Stock photography is not member identity. |
| Outbound resource links | Text/source labels; current renderer does not force a new tab | No new-tab icon required. If that behavior changes later, disclose it in accessible text as well as any decorative icon. |
| Social platform links | No verified public profile destinations are configured | Do not add platform logos or speculative links. Use text links when destinations exist; use official platform marks only after verifying their current usage terms. |

## Changes and reuse

- `index.html`: state-aware indicators on **Explore the Toolkit**, **Browse community challenges**, and the final **Join HTAFL** disclosure.
- `community/index.html`: state-aware indicators on **A conversation to consider** and **Explore collaboration**.
- All five retain their visible labels, native disclosure semantics and decorative `aria-hidden` wrapper. The glyph remains the original size and color.
- Existing `styles/components.css` selectors handle state changes immediately, including without page JavaScript. No animation, interaction sound, extra tab stop or duplicate accessible label is introduced.

## Future custom SVG policy

If a new action genuinely needs an icon, prefer a small project-authored inline SVG before adding a package. Use a consistent viewBox and stroke, `currentColor`, explicit dimensions, no filters and no embedded bitmap. Decorative SVGs accompanying text use `aria-hidden="true"` and `focusable="false"`; keep the enclosing control's visible name. An icon-only control needs a clear accessible name and the existing 44px target/focus styles. Do not make meaning depend on color, animation or an unfamiliar symbol.

No unused sprite, custom-element registry, icon font, CDN or speculative icon files were created. If an external set becomes necessary, verify the official repository's license, retain required notices, select only the used icons and record source/version/license/local usage in [web-resources.md](web-resources.md).

## Verification

Focused browser checks cover all nine disclosure indicators in closed/open states, Enter/Space keyboard toggling, accessible summary names without symbol duplication, mobile/desktop widths, reduced motion, forced colors and operation without page JavaScript. All seven routes retain named visible buttons and labeled form controls. Production changes are limited to the five indicator wrappers; typography, colors, layout, logo and navigation behavior remain unchanged.
