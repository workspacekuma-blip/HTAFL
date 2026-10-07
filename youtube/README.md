# HTAFL YouTube production pack

Open [the visual reference](exports/index.html) and follow
[the implementation specifications](../docs/youtube-brand-system.md).
This internal preview is not a public website route or an uploaded YouTube channel.

The pack has 21 editable SVG assets: a mark-only avatar; banner and safe-area guide;
three playlist, thumbnail, Shorts and chapter variants; transparent lower third;
quote and source/reference cards; clean end screen and placement guide; and static
brand-sting lockup. The preview adds explicit silent sting playback.

## Edit and regenerate

Edit `templates.json`, then run from the repository root:

```powershell
node youtube/generate.cjs
```

No installation or website build step is needed. `social/artwork.cjs` shares the
existing palette, exact five logo paths, typography, SVG text, shapes and wrapping
between social and YouTube. This is one identity, not a new token system.

The thumbnail/Shorts configurations are shared across all three family variants;
edit a campaign's copy and choose the appropriate export. Brackets are placeholders,
not content to publish. Name, role, quote, source and photo slots must be filled
with approved actual material. Do not invent a participant, founder statement,
source, event or quotation.

Optional image fields use the same pattern as the social pack: `image.src` is a
local PNG/JPEG/WebP path inside this repository; `image.alt` describes the actual
image; `publicationConsent` must be true; `credit` is the approved public credit.
The flag cannot verify permission: keep actual approval records privately. Image
rights and consent must be checked before generation. The generator embeds the
image; add the approved credit in the video description rather than cluttering
the thumbnail. Empty frames make the absence of approved photos explicit.

## Export and implement

The SVG text remains editable. Use Space Grotesk 700 and Inter 400/500 in the design
tool, or outline text before final SVG handoff. The inline browser preview loads
the existing website fonts; external SVG previews may use fallback fonts until
the fonts are installed. Check copy fit after edits, including credits and roles.

Rasterize channel art/thumbnails to PNG/JPEG at the SVG's physical dimensions.
Thumbnail coordinates use a 1280×720 viewBox with a 3840×2160 export size; Shorts
use 1080×1920 coordinates with a 2160×3840 export size. Do not change the aspect
ratio. Crop/recompose instead of stretching. Check current upload limits in Studio.

The lower third has a transparent full-HD canvas; export it as PNG with alpha or
rebuild it as editable text/shapes in the video editor. Keep its panel above the
caption band. Do not bake placeholder name/role text into a finished video.

Use `channel-banner.svg` for upload artwork after rasterization;
`channel-banner-guide.svg` is for reviewing clearance only. Likewise, use
`end-screen.svg` as the video background and `end-screen-guide.svg` only to place
actual Next video, Playlist and Subscribe elements in YouTube Studio. Guides have
no clickable behavior and must not be presented as real interface controls.

## Sting implementation

`brand-sting.svg` is the static design source. `sting.js` and the preview provide
the animation reference; no rendered video/audio file is implied. Reproduce the
timeline in the editor: five sequential 160ms directional reveals (0–800ms),
wordmark fade (800–960ms), tagline fade (960–1120ms), then hold to 2400ms and cut
to content. No loop, bounce, rotation, glow, flash or sound. Use after the hook or
at a useful transition so the introduction does not delay the content.

The preview plays only on button activation and locks duplicate playback while
running. It cancels immediately when reduced motion is enabled and displays the
untouched static lockup. For a reduced-motion video variant, use a direct cut to
the static asset; a rendered YouTube video cannot read a viewer's browser motion
preference. The final five paths exactly match the production symbol.

## Before publication

Choose a truthful 3–5 word thumbnail headline and one relevant focal image. Avoid
shock expressions, imagery of distress, fear-based headlines or claims of a cure.
Practical mental-health content needs verified sources and appropriate review;
HTAFL must not be represented as replacing professional care. No helpline details
or clinical advice are supplied by this template pack.

Provide accurate captions, descriptive spoken context when visuals carry meaning,
and actual source/credit/resource links in the video description. Confirm native
Studio crop previews and end-screen destinations. Never upload a guide or leave
an editing placeholder in final artwork.

## Verification

Chrome checks confirmed 21 readable SVG previews, exact website colors/fonts and
the same mark-only avatar as the social pack. All default text stays within its
canvas; essential banner text fits the center guide; thumbnail text clears the
duration-badge corner. Preview layouts fit 320/768/1440px screens.

Keyboard playback, five-path sequencing, duplicate-play prevention, static final
geometry, live reduced-motion cancellation and no-JavaScript static fallback
passed without browser errors. Extracting shared artwork helpers preserved the
existing default social SVGs byte-for-byte. Recheck after replacing content/images.
