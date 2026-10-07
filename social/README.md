# HTAFL social template pack

Open [the preview](exports/index.html) and use
[the brand specifications](../docs/social-brand-system.md). This internal reference
is not a new public website page and does not appear in site navigation.

The pack contains 14 editable content layouts covering the 12 supplied template
types, including three educational carousel phases, plus a mark-only avatar and
a formal banner. Bracketed fields and empty image frames are explicit placeholders.
No quotes, founder statements, events, challenges, people or community work have
been invented. Replace all bracketed fields before publishing.

## Edit and generate

Edit `templates.json`: `headline`, `body` (short lines), `cta`, `page`, `family` and
optional `format`. Carousel hook/content/final are linked parts of one sequence;
duplicate the middle layout as needed and update every page number consistently.
Each slide must use the same format, family and campaign branding.

From the repository root, run:

```powershell
node social/generate.cjs
node social/generate.cjs --family create --format square --out social/exports/create-square
node social/generate.cjs --family overcome --format portrait --out social/exports/overcome-portrait
node social/generate.cjs --family connect --format landscape --out social/exports/connect-landscape
node social/generate.cjs --format vertical --out social/exports/vertical
```

No installation or website build step is required. Outputs may only go inside
`social/exports`; use a separate subfolder for campaign variants. Re-running a
command replaces generated SVGs and its preview, so edit the JSON source first.

The generator reads the **existing** `styles/tokens.json` and production five paths
from `assets/htafl-mark.svg`. Do not copy a palette or redraw the mark into a second
system. Export sizes are HTAFL working canvases, not universal platform upload rules.
Copy that does not fit raises an error; shorten it or split across slides rather
than shrinking it to unreadable size. Wrapping is conservative; inspect final fonts.

## Images and permission

Image layouts use an empty frame by default. To use a real, approved local image,
add these fields to the template record:

```json
{
  "image": {"src": "assets/approved-work.png", "alt": "Describe the actual work here"},
  "publicationConsent": true,
  "credit": "Approved public credit"
}
```

That is a field example, not an existing asset or consent record. Keep approval
records privately; the flag is a display guard and cannot verify consent. Use PNG,
JPEG or WebP inside the repository. Images are embedded into the exported SVG,
cropped to their frame and credited. Headlines/body copy remain outside imagery.
Do not include private participant information in exports or their metadata.

## Deliver finished artwork

SVG text stays editable and specifies Space Grotesk 700 and Inter 400/500. Install
those exact fonts in the design tool or outline text before handing off final SVGs;
fallback fonts are not approved brand output. The inline preview uses the site's
Google Fonts setup, with its existing fallbacks if unavailable. Export approved
artwork to PNG for text/graphics or high-quality JPEG for photographic posts.
SVG source is an editing asset, not a social upload format.

Check the real placement preview, especially vertical lower/right UI zones and
profile/grid crops. Use the supplied avatar centered in the circular crop. Pair the
formal banner's mark with the **full HTAFL** wordmark. Its 1500×500 canvas suits X;
adapt it to other actual banner placements rather than claiming a universal size.

Supply platform alt text separately; exported metadata does not automatically
become social alt text. Captions carry sources, access details, permissions/credits
and the real CTA. Do not invent an account handle, website URL or submission route.

## Included variants and checks

`exports/index.html` previews the default families and portrait layouts, with the
video cover in vertical format. Ready-made variant previews are also included in
`exports/create-square`, `exports/connect-landscape` and `exports/vertical`.
Each pack contains 14 content SVGs, the avatar, the formal banner and its preview.
All layouts can be regenerated in the remaining family/format combinations.

Chrome checks confirmed the website fonts loaded, every text element stayed within
its canvas in all four packs, previews fit 320/768/1440px screens, source colors
match the supplied tokens, and the avatar uses the exact five production paths
with no wordmark. Review again after replacing copy or adding an approved image.
