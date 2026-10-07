# HTAFL logo system

**Current website identity (6 October 2026):** The accepted Brand & Website UI
Master uses its original H/T/A/F/L letter monogram as the primary website mark.
The exact native Figma SVG is `assets/htafl-monogram.svg`, with an ivory variant.
The Five-Path Mark remains a secondary motif; the historical concept and asset
guidance below are retained. See [the current implementation](fashion-implementation.md).

## Concept: HTAFL Five-Path Mark

Five interconnected geometric paths represent:

- Hope
- Talent
- Art
- Fashion
- Life

Together they form one star symbol representing the idea that creativity,
resilience, identity and community are interconnected. Each path contributes to
the whole while retaining its own identity.

The symbol works independently of the wordmark as a social avatar, favicon,
clothing mark, embroidery, YouTube avatar, watermark or event mark.

## Symbol and wordmark

Use the full wordmark **HTAFL** in the existing Space Grotesk 700 typography.
The symbol can appear alone or in the existing horizontal, stacked and tagline
lockups. Preserve its five-path geometry and proportions; do not stretch, rotate,
add effects or recolor individual paths.

The tagline remains **Create. Overcome. Connect.** The HTAFL mission remains
unchanged; this concept defines the visual symbol.

## Production assets

- `assets/htafl-mark.svg`: primary cobalt symbol.
- `assets/htafl-mark-mono.svg`: monochrome symbol, including inverse use on dark
  backgrounds through the shared logo component.
- `assets/htafl-favicon.svg`: paper symbol on a cobalt tile for small browser icons.

Use these vectors for production rather than embedding the reference image.
Keep the existing brand palette and clear space around the mark. Check legibility
at the final reproduction size, especially for embroidery and watermarks.

See [the shell guide](site-shell.md#logo-api) for reusable logo component variants.
The homepage reveals the five paths sequentially over 800ms, once only; reduced
motion displays the completed symbol immediately.
