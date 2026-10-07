# HTAFL web references and resources

## Backend operator tools — 6 October 2026

No new package, icon set or external asset was downloaded. The review dashboard
reuses the existing tokens, fonts and brand mark. Original authentication and
operator code uses Node's built-in crypto plus the already installed Express
and Nodemailer packages and their previously recorded licenses.

| Technical reference | URL | Actual use / rights |
| --- | --- | --- |
| Node.js crypto, official documentation | [scrypt and crypto API](https://nodejs.org/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback) | Salted password hashing, random session tokens and timing-safe comparisons. Technical reference; no third-party code or assets copied. |
| Express, official security guidance | [Production security](https://expressjs.com/en/advanced/best-practice-security/) | HTTPS and cookie flags, bounded login attempts and cautious input handling. Technical reference; existing Express MIT dependency retained. |
| Nodemailer, official SMTP guide | [SMTP transport](https://nodemailer.com/smtp) | The host check uses transport verification without sending email; operator retries reuse private SMTP delivery. Existing MIT-0 dependency retained. |

See [backend tools](backend-tools.md) for deployment requirements, limitations
and tested behavior. Instagram now links to the user-supplied `@htaflco` handle;
no proprietary social icon was added.

## Current Figma fashion-site implementation — 6 October 2026

This section describes the current website. Older room-renderer entries below
are historical: the current pages do not load that renderer, its objects or audio.

| Resource / source | Rights and local use |
| --- | --- |
| [HTAFL Brand & Website UI Master](https://www.figma.com/design/ByICC8Kylyu2LGDRgjL3hT) / user-supplied HTAFL design | Project design source, used at the owner's request. Native monogram SVGs exported into `assets/htafl-monogram.svg` and `assets/htafl-monogram-ivory.svg`; exact copy/layout/style evidence in `design/figma-context/`. Figma review PNG is not embedded in production. No third-party brand composition copied. |
| Existing Pexels photographs / creators in `assets/photography/illustrative/manifest.json` | Reused locally under the previously verified Pexels License. Original URLs, creators, dimensions and alt text remain recorded in that manifest and the photography sections below. Tailoring/textiles/sketchbooks/garment-study/workshop/walking images support atmosphere. No newly downloaded photography, models, textures or HDRIs. Stock subjects are not HTAFL members or submissions. |
| Existing Space Grotesk / Florian Karsten and Inter / Rasmus Andersson | Existing official-source self-hosted OFL font assets and notices retained. Space Grotesk's actual local variable font was inspected: weight axis 300–700 includes the Figma Medium 500. `styles/fonts.css` now exposes that actual range instead of 600–700. No replacement font, new remote request or unnecessary preload added. Source/license entries below and `assets/fonts/manifest.json` remain authoritative. |
| [Express](https://expressjs.com/) / official package, 5.2.1 | MIT, verified in installed package. Server dependency in `package-lock.json`; serves allowlisted public files and validated form endpoints. No client bundle/CDN. |
| [Multer](https://expressjs.com/en/resources/middleware/multer/) / official middleware, 2.4.0 | MIT, verified in installed package. One bounded in-memory multipart image, followed by actual format decoding. No untrusted filename used as a path. |
| [Sharp](https://sharp.pixelplumbing.com/) / official package, 0.35.5 | Apache-2.0, verified in installed package; native dependency notices retained by package installation. [Constructor and image limits](https://sharp.pixelplumbing.com/api-constructor/) guide real-format validation and the 24MP cap. Metadata removed by conversion; 1800px WebP uploads kept on private storage. |
| [Nodemailer SMTP](https://nodemailer.com/smtp) / official package, 10.0.15 | MIT-0, verified in installed package. Email delivery and private artwork notifications to `htafl@africamail.com`; credentials remain host-only. [Official Google App Password guidance](https://support.google.com/accounts/answer/185833) informs private sender authentication. No real email was sent during QA. |

Dependencies are version-pinned and installed locally by npm. They are required
only by the Node upload/email server; no frontend framework or large browser
library was added. Package notices ship with installed dependencies. Existing
font notices and photo attribution are preserved. Source and usage details for
the current implementation are also in [the handoff](fashion-implementation.md).

## Website icon sourcing decision

Icon audit: **5 October 2026**. See [the complete inventory and findings](icon-audit.md). The seven public routes use existing project glyphs (`→`, `↑`, `+`, `−`), supplied HTAFL SVG branding, visible text controls and native browser form affordances. **No external icon source is required or downloaded; no icon library, package, font, CDN or proprietary platform marks are added.** Five homepage/community disclosure indicators now reuse the existing closed/open styles rather than displaying `+` in both states. All decorative symbols remain excluded from accessible names.

If later needed, prefer project-authored inline SVGs. Record any external icon set's original repository, exact version/icons, local files, license and retained notices here before use. Social platform marks need verified official usage permission; an open-source drawing of a platform logo does not by itself grant trademark permission.

Research, resource audits and font verification began **5 October 2026**. The live homepage hero uses procedural materials without downloaded resources. The inventories below record local illustrative photographs, one optional CC0 studio environment, and the self-hosted website fonts. Five licensed photographs illustrate `/create/`. The optional homepage approach installation uses original procedural geometry; the approved hero and supporting pages are preserved. No runtime dependencies were added.

## Repository remains the source of truth

- Identity: the existing **HTAFL Five-Path Mark**, using the production SVG contours in `assets/htafl-mark.svg` and its monochrome variant. Hope, Talent, Art, Fashion and Life remain interconnected paths of one symbol.
- Palette: `styles/tokens.css`: ink `#111827`, cobalt `#3157FF`, coral `#FF6B57`, paper `#F7F3EA`, mist `#DCE7F7`, slate `#667085`, white `#FFFFFF`. Keep the existing semantic colors too.
- Typography: `main.css` and the shared tokens retain Space Grotesk for display/wordmark and Inter for body text.
- Messaging: **Create. Overcome. Connect.** and all existing page copy remain unchanged. Follow the current HTML, rather than importing another site's narrative or historical campaign copy.
- Structure: preserve the seven routes, shared shell and homepage sequence: hero → mission → approach → creativity → movement → community → challenges → values → participation.
- Implementation: plain HTML/CSS/JavaScript, with the approved native WebGL hero in `scripts/hero-3d.js` and an optional, separately lazy-loaded approach installation in `immersive/`. The rest of the homepage uses CSS planes and bounded desktop scroll separation through `styles/home-spatial.css` and `scripts/home-spatial.js`. No framework migration or additional rendering engine is justified by these references.

## Research method and limits

Sources below are official brand/studio case studies, official technical documentation and asset publishers' own license pages. The useful-for-HTAFL assessments are recommendations, rather than claims that the reference implements HTAFL's accessibility or performance requirements.

These pages were available during research; that does not mean every project launched in 2026. KidSuper's case study identifies 2024; Lusion's Oryzo article was updated in April 2026. Studio descriptions and published imagery establish the visual reference. No live site's motion, mobile accessibility or frame rate has been independently benchmarked here.

Some live experiences depend on client-side rendering: the text reader returned KidSuper's loading shell, could not access Agog's requested live URL, and timed out on Dioriviera's launch URL. Prefer the linked studio case studies for durable references; do not infer current live behavior from them.

## Visual references

| Resource/reference | URL | Useful for HTAFL | Type | License / usage status |
| --- | --- | --- | --- | --- |
| Agog — 14islands / Upstatement | [Official case study](https://www.14islands.com/work/agog) | The studio describes a philanthropic organization whose identity extends into 3D with progressive enhancement and a WebXR layer. Study the continuity between a flat symbol, sculptural logo and ordinary website. Strong conceptual fit for a community mission; HTAFL does not need XR, flowers or their materials. | Inspiration only | No reusable asset/code license established on this case study. Do not extract the logo, models, illustrations, website code or composition. |
| Dioriviera — Immersive Garden | [Official case study](https://immersive-g.com/projects/dioriviera-1) | Luxury fashion expressed through an intentional 3D environment and a concluding monogram reveal. Study lighting, object staging and a deliberate brand reveal at a much smaller scale: HTAFL's existing mark is the sculpture. The full scenic journey and sound design exceed HTAFL's restrained direction. | Inspiration only | No reuse permission established. Dior products, monogram, scenes and campaign media are protected brand material; no downloading or replication. |
| KidSuper World — basement studio | [Official case study](https://basement.studio/showcase/kidsuper-breaking-the-norm); [live experience](https://kidsuper.world/) | Art and streetwear presented as a connected creative world. Useful for treating CREATE as expression with a cultural context rather than a generic product card. Retain HTAFL's ordinary navigation and readable copy; do not adopt the full immersive storefront or entry experience. | Inspiration only | Live site states “All rights reserved.” No downloadable production assets licensed for HTAFL. Preserve creator attribution in the reference; do not copy garments, art, characters or interface design. |
| Artisans d'Idées — Immersive Garden | [Official case study](https://immersive-g.com/projects/artisans-d-idees); [live organization](https://www.artisansdidees.com/en) | A creative agency expresses collaboration through symbolic objects, shadow and scrollable storytelling. Useful for linking CREATE / OVERCOME / CONNECT through one recurring motif. Keep HTAFL's fixed palette, bounded motion and silent experience; do not reproduce their statues, shifting colors or sound. | Inspiration only | No asset/code reuse license established. Case study credits Immersive Garden and Mooders. Their artwork and identity are not available for use. |
| Oryzo BTS, Part 3: Website UX/UI and Illustrations — Lusion | [Primary creator article](https://blog.lusion.co/oryzo-bts-part-3-7-website-ux-ui-and-illustrations) | Explains typography supporting a realistic 3D scene and keeping the surrounding UI quiet. Strong fit for HTML type in front of/behind decorative planes, without changing the existing typefaces or colors. Use its design rationale, not its desk scene, illustrations, humor or fashion-magazine type substitutions. | Inspiration / implementation discussion; not an asset pack | No permissive reuse license established for the article's artwork or renders. Link and credit Lusion; do not copy media or assume unpublished technical chapters are available. |
| Flipside — 14islands | [Official case study](https://www.14islands.com/work/flipside) | A narrow reference for a recognizable geometric logo gaining volume and for large type beside 3D forms. The case study shows 3D logo imagery; it does not establish a particular live WebGL implementation. The crypto narrative and saturated treatments are a poor overall match for HTAFL. | Secondary inspiration only | No reusable media/model/code license established. Study shape legibility only; do not use their logo, graphics, colors or brand system. |

## Technical references and optional code

| Resource/reference | URL | Useful for HTAFL | Type | License / usage status |
| --- | --- | --- | --- | --- |
| WebGL best practices — MDN | [Official documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices) | Keep the native renderer small: bounded back-buffer resolution, fewer draw calls, predictable GPU allocation, appropriate shader precision and cleanup. Prefer these refinements over adding an engine for one logo. | Technical reference; no asset | MDN documentation policy below. Implement ideas in project-owned code; no copied snippets in this research. |
| Rendering on Demand — Three.js | [Current manual URL](https://threejs.org/manual/pages/rendering-on-demand.html) | Coalesce invalidations into one pending animation frame. Useful even in native WebGL/CSS. Truly static scenes should render only after changes; HTAFL's visible idle animation still requires frames while it moves, with offscreen/hidden pauses. | Technical reference with example code | Three.js [MIT license](https://github.com/mrdoob/three.js/blob/dev/LICENSE). Preserve copyright and license notices if incorporating substantial code; the manual's imported third-party helpers need their own license checks. |
| SVGLoader and ExtrudeGeometry — Three.js | [SVGLoader](https://threejs.org/docs/pages/SVGLoader.html); [ExtrudeGeometry](https://threejs.org/docs/pages/ExtrudeGeometry.html) | Conditional alternative if future geometry requirements outgrow the native helper. Parse HTAFL's own SVG paths, retain separate meshes for the five reveals, and use shallow depth. Bevels must not change the recognizable contour. Current SVGLoader docs flag `createShapes` as deprecated since r185: pin a version and check its current API before implementation. | Actual downloadable open-source library/addon, **not installed** | Three.js [MIT license](https://github.com/mrdoob/three.js/blob/dev/LICENSE), including its copyright/permission notice. The library license does not license unrelated models, fonts or textures shown in demos. |
| Scroll-driven animations — Chrome for Developers | [Official tutorial](https://developer.chrome.com/docs/css-ui/scroll-driven-animations/) | Native scroll/view timelines for gentle decorative foreground/background separation without replacing browser scrolling. Animate transforms, keep essential text stationary and never make content depend on the effect. | Technical reference with examples | Page footer specifies documentation under CC BY 4.0 and code samples under Apache 2.0, unless otherwise noted. Preserve the applicable notices/attribution if reusing content or code. No samples copied here. |
| `animation-timeline` — MDN | [Current property reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline) | Compatibility check for that optional CSS approach. MDN currently marks it as limited availability. Use feature detection and static fallback; keep the existing lightweight visible-only JavaScript approach unless testing demonstrates a benefit. | Technical reference; no asset | MDN policy below. Browser support must be checked again against actual deployment targets before adopting. |
| `transform-style` — MDN | [Current property reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transform-style) | Understand preserve-3D versus independent projected planes. Grouping properties such as opacity below 1, filters and isolation can flatten a 3D context. Put clipping/fading on a separate wrapper when real child depth is needed; keep focus rings outside decorative clipping. | Technical reference; no asset | MDN policy below. This is a future implementation consideration, not a request to restructure the current page. |
| Intersection Observer — MDN | [Official API guide](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) | Observe stage visibility and initialize or update only relevant layers. Useful for retaining lazy hero initialization and visible-only decorative updates. | Technical reference; no asset | MDN policy below. |
| Page Visibility API — MDN | [Official API guide](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) | Stop work when the tab is hidden; resume without replaying the logo entrance. Complements element visibility, which is a separate condition. | Technical reference; no asset | MDN policy below. |
| `prefers-reduced-motion` — MDN | [Current media-feature reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) | Keep the finished SVG and static editorial layers in reduced-motion mode. Gate JavaScript as well as CSS, including preference changes during a visit. | Technical reference; no asset | MDN policy below. |

MDN attribution/licensing source: [Attribution and copyright licensing](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Attrib_copyright_license), by Mozilla Contributors. Its documentation is CC BY-SA 2.5 or later unless otherwise indicated; reuse needs attribution and the applicable share-alike terms. Code sample licensing depends on when a sample was added (CC0 from 20 August 2010; older samples MIT). Do not assume every example is CC0 if provenance is unclear. This document links to sources and supplies original HTAFL-specific assessments; it includes no copied code or article passages.

## Mobile WebGL performance review

Verified **5 October 2026** against official Three.js documentation and MDN. HTAFL uses native WebGL, not Three.js; the guidance informs the existing renderer without introducing an engine, loader, codec or new asset.

| Topic / authoritative source | Current HTAFL decision |
| --- | --- |
| Adaptive DPR / [Three.js responsive rendering](https://threejs.org/manual/pages/responsive.html), [MDN devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio) | Keep explicit drawing-buffer sizing separate from CSS sizing. Existing effective DPR is capped at 1.25 for touch/limited-device hints and 1.5 otherwise; these are conservative project settings, not universal recommendations or a GPU benchmark. Added a resolution media-query watcher so display/zoom DPR changes refresh the buffer even without a window resize. No runtime FPS-driven quality controller is justified by this small scene. |
| Hidden/offscreen rendering / [MDN Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API), [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) | Keep both gates: a visible tab does not mean the hero is onscreen. Initialization is deferred until visible. Existing drawing pauses offscreen, while hidden, with the mobile menu open and on pagehide; pageshow resumes without replaying a completed entrance. Resize work now also waits while these gates are closed. |
| Idle rendering and battery / [Three.js rendering on demand](https://threejs.org/manual/pages/rendering-on-demand.html) | A truly static scene should draw only after changes. HTAFL's approved idle movement requires updates while visible, so retain the existing 20 fps touch/limited-device and 30 fps desktop draw caps, low-power context request and single canvas. These are draw caps; requestAnimationFrame callbacks can still run at display refresh rate. `powerPreference` is a browser hint, not a guarantee or battery measurement. |
| Efficient geometry / [MDN WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices) | Keep one-time SVG contour triangulation and five STATIC_DRAW buffers. The existing mesh is 984 triangles / 82,656 vertex bytes with five draw calls per rendered frame. No remeshing, asset decoder, geometry compression, instancing, VAO layer or new abstraction is needed for five small paths. |
| Texture compression / [Three.js KTX2Loader](https://threejs.org/docs/pages/KTX2Loader.html), [MDN WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices) | GPU-compressed textures can help actual texture-heavy scenes; Three.js KTX2 requires format-support detection and a transcoder. The HTAFL hero creates zero textures and uses procedural shading, so adding KTX2/Basis/WASM would add work without reducing current texture memory. Website WebP photographs are DOM images, not hero GPU textures. |
| Environment sizing / [Three.js PMREMGenerator](https://threejs.org/docs/pages/PMREMGenerator.html) | Keep the optional 128×64 studio HDRI unloaded: the native shader does not sample an environment. Current Three.js PMREM docs describe 1024×512 equirectangular input for its 256×256 cubemap output; this is guidance for that specific PBR pipeline, not a requirement for HTAFL. Compressed file size alone does not describe GPU allocation. Do not connect an HDRI merely because one is available. |
| Resize handling / [MDN ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver), [Three.js responsive rendering](https://threejs.org/manual/pages/responsive.html) | Coalesce window/element notifications into one pending animation frame. Keep a dirty flag while paused, apply the latest dimensions on resume, and change canvas width/height and viewport only when the effective buffer size actually changes. Bounds are measured on resize, not on every draw. |
| Reduced motion / [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) | Keep the completed static SVG, with no assembly, pointer rotation or idle animation. Initial reduced-motion mode creates no WebGL context; live preference changes stop drawing and show SVG. No resize allocation is performed while this mode is active. |
| WebGL failure and cleanup / [MDN context events](https://developer.mozilla.org/en-US/docs/Web/API/WebGLContextEvent), [Three.js cleanup](https://threejs.org/manual/pages/cleanup.html) | Keep the exact production SVG visible if context creation, shader linking or geometry allocation fails, or the context is lost. Buffers/program are deleted on disposal. Essential HTML, keyboard controls and navigation continue without WebGL or JavaScript. |

### Applied changes and validation

Only `scripts/hero-3d.js` changes at runtime: a live DPR watcher and coalesced/deferred resize handling. No logo geometry, shaders, materials, assembly timing, pointer bounds, copy, CSS, routes or other animation changed. Existing capped resolution, frame timing, visibility gates, reduced-motion support and fallback were verified rather than replaced.

Browser instrumentation compares the original and updated renderer, including bursts of resize events, hidden-buffer deferral and resizing on return. It also checks a DPR change without a window-resize event. The existing hero checks cover five-path geometry, sequential assembly under 1.5 seconds, pointer return, touch controls, offscreen/hidden/menu pauses, reduced-motion changes, forced colors, WebGL/context-loss fallback and responsive/accessibility behavior. GPU geometry remains five buffers / 82,656 bytes / 984 triangles, with no textures or external hero-resource requests. Headless Chrome uses software WebGL for reproducibility; these checks do not establish real-phone frame rate, thermal behavior or battery life.

All listed resources are technical references, not downloaded production assets. Three.js references are covered by the project's [MIT license](https://github.com/mrdoob/three.js/blob/dev/LICENSE); MDN's documentation/sample policy is recorded above. No library or source example was imported. Revisit compression, GPU timing, automatic quality tiers or a PBR environment pipeline only if actual device testing or a future agreed scene warrants them.

## Clearly licensed downloadable assets — optional catalog

| Resource/reference | URL | Useful for HTAFL | Type | License / usage status |
| --- | --- | --- | --- | --- |
| Studio Small 09 — Poly Haven, Sergej Majboroda | [Asset and author](https://polyhaven.com/a/studio_small_09); [publisher license](https://polyhaven.com/license) | Neutral studio illumination for an optional offline material study of the existing mark. Prefer evaluating soft light and silhouette before introducing runtime environment maps. Keep backdrop/material colors within HTAFL tokens. | Downloadable HDRI; compact local derivative now acquired, recorded in the logo material inventory below; unused by the live hero | CC0. Commercial use and modification allowed; attribution optional, appreciated. Retain the author/source record anyway. Poly Haven's website graphics, example renders, logos and other site content are excluded from the asset license. |
| Metal 032 — ambientCG | [Asset](https://ambientcg.com/view?id=Metal032); [publisher license](https://docs.ambientcg.com/license/) | Optional smooth-metal roughness/normal study for an ink-colored sculpture. This is not evidence of an anisotropic brushed finish. Avoid importing its base color or a full texture bundle when project-owned shader shading already works. | Actual downloadable PBR maps; not downloaded | CC0 1.0 Universal. Commercial use and modification allowed; attribution optional. Record ambientCG and the asset ID; credit wording can follow the publisher's license page. |

Neither asset is necessary for the current hero. An HDRI or PBR bundle adds bytes, texture memory and material complexity; evaluate a small local derivative only if an agreed visual improvement warrants it. CC0 availability alone does not justify adding it.

## Recommended direction for HTAFL

1. **Agog + Artisans d'Idées:** continuity of a meaningful symbol across dimensions and a connected creative narrative. Apply that principle to HTAFL's own five paths and existing sections.
2. **Lusion's Oryzo design rationale:** readable DOM typography, quiet controls and one clear sculptural focal point. Keep the current Space Grotesk/Inter system and palette.
3. **KidSuper, selectively:** art/fashion as a creative world with participation at its center. Retain HTAFL's restraint rather than the reference's entire immersive shopping experience.
4. **MDN WebGL guidance + Three.js rendering-on-demand pattern:** improve the existing native implementation without adding Three.js. Retain the single hero canvas, static SVG fallback, visibility gating and reduced-motion behavior.
5. **Native CSS scroll timelines, conditionally:** a future experiment for decorative depth only, behind feature detection and mobile/reduced-motion gates. No new scroll container, mandatory snapping or scroll hijacking.

Dioriviera and Flipside are narrow lighting/shape references, not templates for an HTAFL redesign. The two CC0 asset candidates are optional study resources, not production recommendations at this stage.

## Approved hero: production resource decision

The approved effect is already implemented by the existing stack. It needs the local Five-Path SVG, its current extrusion helper, the existing token-based material shader and the browser's WebGL APIs. **No additional external resource is required.** Keep this implementation rather than add a rendering library, generic model or environment map to reproduce functionality already present.

### Resources actually used

| Resource | Local source / implementation | Where used | Usage / provenance |
| --- | --- | --- | --- |
| Exact Five-Path geometry | `assets/htafl-mark.svg`; matching inline SVG in `index.html` | Hero fallback and five extruded meshes | Existing HTAFL production artwork supplied for this project. Reuse within HTAFL; no new third-party license or public-domain claim assigned to the brand mark. |
| Curve sampling, triangulation and shallow extrusion | `scripts/hero-3d.js`: `curve`, `contour`, `triangles`, `mesh` | Geometry created once during hero initialization | Existing repository implementation. No external model, triangulation library or code sample imported. |
| Matte face, dark edges and broad warm highlight | `scripts/hero-3d.js`: vertex/fragment shaders; colors from `styles/tokens.css` | Hero material and lighting | Existing project shader uses HTAFL ink/paper tokens, directional key/fill light and a restrained edge sheen. No sampled texture, HDRI, external shader pack or brand material. |
| Scheduling and lifecycle | `scripts/hero-3d.js`: `update`, `draw`, `pause`, `resume` | Lazy initialization, entry sequence, bounded pointer/idle motion and visibility pauses | Browser APIs plus existing project code. [Three.js rendering-on-demand](https://threejs.org/manual/pages/rendering-on-demand.html) is a technique reference, not an imported dependency. The visible idle state intentionally needs frames while it moves. |
| Layout and static presentation | `styles/home.css`; inline SVG in `index.html` | Accessible HTML copy and completed static logo | Existing local CSS and vector fallback. Reduced motion/forced colors use the SVG; unavailable WebGL and context loss also fall back without fetching another asset. |

### External candidates: verified rights and disposition

| Candidate / original source | Verified license source | Possible purpose | Decision and production usage |
| --- | --- | --- | --- |
| [Three.js](https://github.com/mrdoob/three.js), including SVGLoader/ExtrudeGeometry | [MIT license](https://github.com/mrdoob/three.js/blob/dev/LICENSE); retain copyright and permission notice if code is incorporated | General renderer and SVG extrusion | **Not required; not downloaded or installed.** Existing native WebGL already implements the five-path construction and material. Used nowhere in production. Official examples remain references only. |
| [Earcut — Mapbox](https://github.com/mapbox/earcut) | [ISC license](https://raw.githubusercontent.com/mapbox/earcut/main/LICENSE); retain copyright and permission notice if incorporated | Robust polygon triangulation if future geometry gains holes or more complex contours | **Not required; not downloaded.** The five fixed, hole-free paths already triangulate correctly. Used nowhere in production; no Earcut code copied into the current helper. |
| [OGL — oframe](https://github.com/oframe/ogl) | The official repository's [Unlicense section](https://github.com/oframe/ogl#unlicense) dedicates its software to the public domain | Minimal WebGL abstraction and shader setup | **Not required; not downloaded.** Replacing the current renderer would add an abstraction without a missing capability. Used nowhere in production. Recheck any separately licensed extensions if this choice changes later. |
| [Studio Small 09 — Poly Haven / Sergej Majboroda](https://polyhaven.com/a/studio_small_09) | [Poly Haven CC0 asset license](https://polyhaven.com/license) | Soft studio environment lighting | **Unnecessary for the live hero.** A compact neutral derivative was subsequently sourced for optional material studies; see the logo material inventory below. Used nowhere in production. The existing matte treatment remains procedural. |
| [Metal 032 — ambientCG](https://ambientcg.com/view?id=Metal032) | [CC0 1.0 Universal](https://docs.ambientcg.com/license/) | Roughness/normal material study | **Licensed but unnecessary; not downloaded.** A texture bundle is not needed at the current logo size. Used nowhere in production. |
| Models, shader packs or other assets without verifiable rights | No verified license | Unspecified | **Reject for production.** No luxury-brand models, campaign assets or unclear-license downloads are admitted. Nothing is downloaded on the basis of an image-search result. |

The [official Three.js material documentation](https://threejs.org/docs/pages/MeshStandardMaterial.html) describes its PBR workflow, additional shading cost and the value of environment maps for that material. This does not make an HDRI necessary for HTAFL's existing custom matte shader. Moving to PBR plus environment-map loading would be a material/renderer change with added cost, not a required resource integration. The documentation is associated with the [Three.js MIT license](https://github.com/mrdoob/three.js/blob/dev/LICENSE); no sample code was copied.

### Hero download and usage manifest

- External material/environment files loaded by the live hero: **none**. The optional local environment for material studies is recorded below.
- New runtime hero asset requests or hotlinks: **none**.
- New packages, engines, shader helpers or copied external code: **none**.
- External resources used in production by the hero: **none**. Shared fonts were served by Google Fonts at the time of that audit; they are now self-hosted as recorded below.
- Hero resource audit implementation changes: **none required**; retain the approved hero. That audit only updated this resource record. Photography sourcing is documented separately below.

### Verification evidence

Instrumented headless Chrome with software WebGL reported one hero context, five static geometry buffers, **984 triangles / 82,656 geometry bytes**, zero textures, and no model/HDRI/third-party hero resource requests. The renderer file is **17,460 bytes**, or **5,832 bytes gzip** when compressed for measurement; deployment must configure compression separately.

The hero regression checks passed: exact production SVG contours, sequential assembly within 1.5 seconds, bounded pointer movement and return, offscreen/hidden-tab/menu pause, DPR caps, live reduced-motion/forced-color switching, context-loss fallback, unavailable-WebGL fallback, no-JavaScript fallback and zero initial GPU allocation in reduced motion. Homepage accessibility and responsive/200% text checks passed. HTTP testing also passed asset loading, keyboard navigation, native disclosures and mobile menu behavior without console errors.

These are browser checks and measured resource counts, not an FPS or battery benchmark on physical mobile hardware. No visual change or extra dependency was introduced merely to integrate a resource.

## Resource handling for any later implementation

- Create HTAFL's composition and motion independently. Do not reproduce protected identities, exact scenes, campaign choreography or website designs.
- Use the supplied HTAFL vector geometry. Do not borrow another brand's logo/model or substitute a downloaded star.
- Do not download or use a resource with unclear rights. Search visibility, Google Images and Pinterest are not usage permission.
- For an approved download, record its exact source URL, creator where provided, asset/version ID, license URL, retained notices, modifications and local destination in this document. The photography inventory below records the current downloads.
- Serve permitted assets locally rather than hotlinking a publisher's production files. Optimize derivatives while retaining required attribution and notices.
- Keep all mission copy and essential headings in HTML. Preserve keyboard navigation, static fallbacks and reduced-motion behavior when testing any technique.

## Temporary illustrative photography inventory

### Verified source and usage

Each selected image was checked on its original Pexels photo page, which identifies the creator and offers the photograph under the [Pexels License](https://www.pexels.com/license/). License checked **5 October 2026, before downloading**. This is Pexels' custom license, not CC0. Website use and modifications are permitted; attribution is optional, and creator credits are retained here and in the local manifest. Do not imply endorsement, portray identifiable people offensively, use photos as a trademark, resell unaltered copies, or redistribute them as a stock collection. Pictured brands, artwork and people are not independent assets licensed for unrelated uses.

These are **illustrative licensed photographs**, not HTAFL members, workshop attendees, community submissions, testimonials or event documentation. Neutral creative-activity and everyday-movement contexts only: do not attach diagnoses, personal stories or claims of participation. Their source captions do not establish HTAFL affiliation or prove that textiles are recycled. The consent-approved community gallery remains empty. No protected brand campaign assets, model packs or unclear-license photography were selected.

[Review the six-image contact sheet](photography-contact-sheet.jpg). The review sheet is internal selection material, not a production page or public stock-photo collection.

### Selected local photographs

| Local base name / Pexels ID | Photographer / original source | License/source | Placement | Alt-text suggestion |
| --- | --- | --- | --- | --- |
| `illustrative-sketchbook` / pexels-5026534 | Leeloo The First — [original photo](https://www.pexels.com/photo/person-drawing-on-a-sketchbook-5026534/) | Pexels / [Pexels License](https://www.pexels.com/license/) | Live `/create/`: Draw & explore card | Hands drawing in a sketchbook beside loose sheets of paper. |
| `illustrative-sewing` / pexels-5830691 | Anna Shvets — [original photo](https://www.pexels.com/photo/hands-of-a-person-holding-a-fabric-near-a-sewing-machine-5830691/) | Pexels / [Pexels License](https://www.pexels.com/license/) | Live `/create/`: Make & rework card (illustrates sewing, not proof of recycled materials) | Hands guiding fabric beneath a sewing machine needle. |
| `illustrative-textiles` / pexels-7775466 | Ron Lach — [original photo](https://www.pexels.com/photo/a-woman-working-in-a-tailoring-shop-7775466/) | Pexels / [Pexels License](https://www.pexels.com/license/) | Live `/create/`: introductory editorial board | A person spreading blue fabric across a cutting table in a tailoring studio. |
| `illustrative-photography` / pexels-18999428 | Matheus Bertelli — [original photo](https://www.pexels.com/photo/woman-taking-pictures-with-camera-18999428/) | Pexels / [Pexels License](https://www.pexels.com/license/) | Live `/create/`: Find your perspective card | A person raising a camera to take a photograph on a city street. |
| `illustrative-design-board` / pexels-7147453 | Michael Burrows — [original photo](https://www.pexels.com/photo/sketches-and-textile-on-wall-7147453/) | Pexels / [Pexels License](https://www.pexels.com/license/) | Live `/create/`: Shape your identity card; fashion planning and mood-board process | Garment sketches and blue fabric swatches taped to a studio wall. |
| `illustrative-workshop` / pexels-7256206 | Thirdman — [original photo](https://www.pexels.com/photo/people-working-on-table-7256206/) | Pexels / [Pexels License](https://www.pexels.com/license/) | Proposed, not connected: Homepage Connect / participation | Three people discussing drawings around a table in a bright art studio. |
| `illustrative-walking` / pexels-7972658 | George Pak — [original photo](https://www.pexels.com/photo/photo-of-a-group-of-friends-talking-while-walking-7972658/) | Pexels / [Pexels License](https://www.pexels.com/license/) | Proposed, not connected: Homepage Overcome / Connect | Three people walking and talking beside a stone building. |

### Local files and optimization

All selected images are downloaded and served from `assets/photography/illustrative/`; **no hotlinks**. For each base name in the table, these four files exist:

- `<base>-640.webp`
- `<base>-960.webp`
- `<base>-1280.webp`
- `<base>-1280.jpg` (progressive JPEG fallback)

The [local manifest](../assets/photography/illustrative/manifest.json) records every exact file path, dimensions, byte size, SHA-256, creator, original photo URL, actual CDN download URL, license URL, intended section and alt-text suggestion. Every record is classified `illustrative`. The five Create selections have `usedInProduction: true` and explicit `usedIn` locations; workshop/walking remain unused. The source downloads were resized from Pexels' official image CDN into temporary working files; only optimized derivatives are retained in the project.

Pillow performed aspect-ratio-preserving Lanczos resizing, EXIF orientation normalization and metadata removal. No generative edits, recoloring, filters or creative retouching were applied. WebP quality 78; progressive JPEG quality 80. Responsive widths: 640, 960 and 1280 pixels, with a maximum height of 1920 pixels. All downloads were larger than the derivatives; no upscaling.

WebP variants range from **8–106 KiB**; JPEG fallbacks range from **65–242 KiB**. All 28 image derivatives together occupy **1.95 MiB**. Pages request one suitable variant per image, rather than preloading the collection. No new dependencies were installed.

### Create integration and selection

Research covered fashion design, illustration/sketchbooks, textiles, sewing/upcycling, personal style, photography, mood boards and sustainable creative practice. Four existing licensed selections were reused; only the Michael Burrows design-board photograph was newly downloaded. Its simple garment studies and textile swatches fit the existing editorial composition without importing another brand's layout or campaign. The original photo page and current publisher license were verified before download on **5 October 2026**. The new four-file set adds **111 KiB**; its largest WebP is **24 KiB**.

The [Ron Lach orange-swatch mood-board candidate](https://www.pexels.com/photo/creative-professional-making-project-board-9849939/) was rejected after visual review because it prominently includes a separate fashion photograph with unverified underlying rights. Its preview was examined in temporary storage; it was not added to project assets or used on the page. No fashion-brand campaign layouts or materials were sourced.

`create/index.html` uses five semantic figures, descriptive alt text, visible **Illustrative photography** labels and linked creator credits. The introductory textile image loads eagerly with high fetch priority; the four below-fold card photographs load lazily. WebP `srcset`/`sizes` select a local 640/960/1280-width file, with progressive JPEG fallback and declared dimensions. Alternating portrait and landscape card frames support the art/fashion editorial treatment using the existing card primitives, colors and typography. No new JavaScript or animation is required. The consent-approved community showcases stay empty, and all original page copy and routes are preserved.

### Future placement guidance

Use `<picture>` with a WebP `srcset`, an accurate `sizes` attribute, and the local JPEG fallback. Set intrinsic `width` and `height` to prevent layout shifts, `decoding="async"`, and `loading="lazy"` below the fold. Do not lazy-load a future above-the-fold LCP image; no photography is added to the approved 3D hero in this sourcing pass.

Keep faces, hands and tools visible when choosing a crop. The textile and walking selections provide landscape options; the remaining images provide portrait planes. Adapt the proposed alt text to actual placement; purely decorative, redundant imagery should have empty alt text. Essential copy remains semantic HTML.

Keep the `illustrative` classification during later integration. Visible credits use the exact `credit` strings and original photo links from the manifest. Never feed these assets into `community-gallery-data`, present them as submissions or attach invented member names. Replace them with consent-approved HTAFL photography when available. The initial sourcing pass changed no production pages; the subsequent integration is limited to `/create/` and its isolated stylesheet.

## Community: illustrative imagery and visual references

Research and publisher-license verification: **5 October 2026**. Scope: `/community/`, with collaboration, group creativity, shared studios, workshops and people making together as the visual brief. This is a research shortlist, not evidence of HTAFL participation. Production markup, styles, gallery data and page copy are unchanged; no new production assets or dependencies were added.

### Recommended photography

The original publisher pages identify the photographers and offer these images under the current [Pexels License](https://www.pexels.com/license/). That custom license permits website use and modification, with attribution optional. Retain photographer credits; do not imply endorsement or HTAFL membership. It is not CC0, and no separate model/property release documents were independently verified. These recommendations cover neutral illustrative creative activity, not personal stories, health claims or reuse of depicted artwork as standalone assets.

| Resource / creator | Original source | Type and license | Useful for / proposed placement | Alt-text suggestion | Local / production status |
| --- | --- | --- | --- | --- | --- |
| People Working on Table — **Thirdman**, Pexels 7256206 | [Original photograph](https://www.pexels.com/photo/people-working-on-table-7256206/) | Downloadable stock photograph; [Pexels License](https://www.pexels.com/license/) | **First choice:** three people exchanging ideas around art materials in a bright studio. One atmosphere figure after the introductory participation CTA, separate from member work and event listings. | Three people discussing drawings around a table in a bright art studio. | Existing optimized `assets/photography/illustrative/illustrative-workshop-{640,960,1280}.webp` and `illustrative-workshop-1280.jpg`; provenance and hashes in the [manifest](../assets/photography/illustrative/manifest.json). Visually reviewed; not used in production. Reuse rather than duplicate. |
| People Painting Bowls — **KoolShooters**, Pexels 9736520 | [Original photograph](https://www.pexels.com/photo/people-painting-bowls-9736520/) | Downloadable stock photograph; [Pexels License](https://www.pexels.com/license/) | **Optional alternative:** two people decorating ceramic pieces at a shared workbench; tools and studio shelves convey making together. A single collaboration atmosphere figure, separate from the future-events card. Warm, subdued photography complements the existing palette without changing brand colors. | Two people decorating ceramic vessels at a shared workbench in a pottery studio. | Official publisher preview visually reviewed in temporary storage only. Not added to project assets or production. If selected later, download locally and generate the existing 640/960/1280 WebP + progressive JPEG variants; record the actual download URL and file hashes. |

Only one photograph is needed initially. Prefer the existing Thirdman image: it communicates shared creativity, fits the current visual system, and requires no additional download. Its portrait framing has substantial space above the people; choose a crop retaining all three faces, their hands and the shared table. The ceramics alternative should retain both people and their tools rather than cropping to an isolated portrait. Neither image proves that the interaction was candid, documents an HTAFL workshop, or establishes a participant's identity, relationship or wellbeing.

### Official visual/editorial references — inspiration only

| Reference | Official URL | Useful for | License / usage status |
| --- | --- | --- | --- |
| **Blackhorse Workshop** | [Official workshop site](https://blackhorseworkshop.co.uk/) | A future HTAFL photo brief centered on shared workspaces, equipment and the act of making. Its workspace, courses and makers-showcase content provides an example of distinguishing activity, facilities and credited maker stories. | Inspiration only. No reuse license verified for its photography, copy, branding or design; none downloaded or approved as HTAFL assets. Do not copy its layout or imply affiliation. |
| **Print Club London — Workshops** | [Official workshop page](https://printclublondon.com/workshops/) | A future photo brief showing small-group, hands-on creative process: tools, work in progress and people learning alongside one another. Keep imagery grounded in an activity rather than a posed team portrait. | Inspiration only. No reuse license verified for its photography, artwork, testimonials, copy, branding or design; none downloaded or approved as HTAFL assets. Its commercial campaign work and testimonials are excluded from the HTAFL brief. |

These references inform a photo brief and content framing, not a redesign or a source of reusable website layouts. Their actual programmes, instructors, attendees, stories and events must never be transferred to HTAFL.

### Placement and representation rules

- Caption each atmosphere photograph visibly: **“Illustrative photography — not HTAFL members or an HTAFL event.”** Add the photographer's exact credit linked to the original photo page.
- Keep images outside `#gallery`, `community-gallery-data` and the consent-approved gallery adapter. That gallery remains empty until reviewed work and publication consent exist. Do not turn stock subjects into named profiles, testimonials or community stories.
- Keep participation CTAs and existing availability statements intact. Stock photography must not imply that planned discussions, collaborations or events are already operating.
- Use the current shared figure/card media patterns, HTML text and design tokens. No text on faces, new palette, borrowed layout or stock-image background behind essential copy.
- Any later integration must use local responsive files, intrinsic dimensions, meaningful alt text and lazy loading below the fold. Preserve faces, hands and tools in mobile crops; no hotlinking or whole-library preloading.
- Seek consent-approved HTAFL process photography over time: wide shared-workspace views, hands making together, people exchanging ideas and credited work in progress. Keep consent records private and separate from participation.

**Rejected photographic candidate:** [Couple of Artists Working Together — Antoni Shkraba, Pexels 6322369](https://www.pexels.com/photo/couple-of-artists-working-together-6322369/) has a verified Pexels photo license but prominently features numerous separate paintings. Their independent reproduction rights were not established, so it is excluded from the recommended asset set. The preview was reviewed in temporary storage only; no production file was added. Generic corporate meetings, isolated portraits, clinical/support-group stock and staged distress imagery are outside the brief.

## Five-Path Mark: restrained material and environment resources

Sourcing date: **5 October 2026**. The production recommendation is the existing **procedural warm ivory / matte ink** treatment. The small selection below contains two project-owned material recipes and one locally optimized CC0 studio environment. No material library, PBR texture bundle, model or new production shader is added.

### Selected resources and finishes

| Resource / finish | Source and rights | Intended use / status |
| --- | --- | --- |
| Matte ink | Existing project-owned `scripts/hero-3d.js`, `fragmentSource` and `Sculpture.material()`; `--htafl-ink` from `styles/tokens.css`. No external asset or copied shader; no new third-party license applies. | Current Overcome/Connect face treatment and dark extrusion edges. Broad key/fill lighting, low sheen, no reflection texture. **Recommended production finish; already implemented.** |
| Warm ivory with subtle satin edges | Same project shader; `--htafl-paper` face with ink edges and a restrained paper-colored edge highlight. Project-owned recipe, not a downloaded ceramic material. | Current Create face treatment. Reads as a restrained ceramic-like sculpture. **Recommended production finish; already implemented.** This is an artistic lighting approximation, not a physically based ceramic simulation. |
| Studio Small 09 — Sergej Majboroda / Poly Haven | [Original asset and author](https://polyhaven.com/a/studio_small_09); [verified CC0 publisher license](https://polyhaven.com/license); [CC0 1.0 text](https://creativecommons.org/publicdomain/zero/1.0/legalcode). Commercial use and derivatives permitted; attribution optional and retained. | Soft studio-lighting study for the Five-Path Mark. **Downloaded locally and optimized; optional, not connected to the live hero.** Use broad diffuse illumination, never sharp mirror reflections or the photographed room as a page background. |

The native shader currently uses ambient/key/fill weights `0.76 / 0.23 / 0.08` and key/fill directions `(-0.45, 0.65, 1)` / `(0.6, -0.2, 0.7)`. Its paper-colored edge mix is bounded by `0.085`; it does not sample a reflective scene. These are the existing shader values, not new knobs or material changes. Keep the brand tokens as the color source and preserve the exact logo geometry.

Dark brushed metal was considered but deferred. The [ambientCG Metal 032](https://ambientcg.com/view?id=Metal032) asset is [CC0](https://docs.ambientcg.com/license/), but its listing identifies a **smooth** metal, not a brushed material; its smallest JPG bundle is approximately 3 MB. It is not downloaded. Fine brush lines are a poor tradeoff at the current 272px maximum logo stage. A future dark satin-metal study should begin with a low-amplitude procedural directional sheen, evaluated for aliasing on mobile, without importing base-color maps or promising a metallic PBR response from the current diffuse shader. No chrome, neon, holographic or strongly reflective treatment is selected.

### Local environment download and derivative

- Official metadata: [Poly Haven files API](https://api.polyhaven.com/files/studio_small_09).
- Original source file: [Studio Small 09, 1K Radiance HDR](https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr).
- Actual transfer URL: `https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr?download=1`. Bounded HTTP range downloads were assembled and checked against the publisher API's MD5 before conversion. TLS certificate validation remained enabled.
- Original: **1024×512, 1,615,248 bytes**. The original working download remains outside the repository; no 1K/4K/8K HDR or EXR bundle ships with the site.
- Local derivative: [studio-small-09-neutral-128.hdr](../assets/environments/studio-small-09-neutral-128.hdr), **128×64, 27,199 bytes (26.6 KiB)**. About **98.3% smaller** than the downloaded source.
- Internal review preview: [studio-small-09-neutral-preview.webp](../assets/environments/studio-small-09-neutral-preview.webp), **708 bytes**. This is our tonemapped derivative of the CC0 HDR asset, not Poly Haven's separately protected example render. It is an LDR preview, not an HDR lighting substitute.
- Provenance and integrity: [environment manifest](../assets/environments/manifest.json) records creator, source/API/download URLs, license, original MD5/SHA-256, derivative SHA-256, dimensions, byte sizes, modifications and usage status.

Optimization averaged 8×8 source blocks in **linear light**, weighted by latitude solid angle. Linear luminance (`0.2126 R + 0.7152 G + 0.0722 B`) is replicated in RGB to keep lighting neutral; material warmth still comes from the existing paper token. Radiance RGBE run-length encoding retains HDR values rather than clipping them into an 8-bit image. The decoded derivative is finite, has matching neutral RGB channels and a peak of **110** (above the SDR range); maximum encoding error against the reduced linear data is **under 0.8%**. No exposure normalization, new hue or generative texture was introduced. At this resolution the environment is suitable for broad lighting, not sharp glossy reflections.

### Homepage performance and application status

The resource is prepared for optional evaluation; **no website material, logo, color, animation, layout or route changed**. The hero continues to use its existing procedural shader, so this sourcing pass adds **zero runtime bytes, requests, textures or dependencies**. A future integration would need an HDR decoder and a tested diffuse-lighting path; the `.hdr` is not a drop-in input to the current custom shader. Do not add a rendering engine merely to load it. Prefer an offline lighting study or compact baked lighting coefficients if a measurable visual benefit emerges.

If later used at runtime, serve this local derivative, initialize it with the visible hero, avoid showing it as a background, retain low-power/mobile and reduced-motion fallbacks, and check the total decoder/GPU cost as well as its file size. Its decoded RGB float data alone occupies 96 KiB; that excludes decoder buffers, upload formats, mipmaps and any convolution pipeline.

Verification: the downloaded original matches the official API checksum; the optimized HDR decodes with the recorded dimensions and retains dynamic range. Browser instrumentation still reports **one WebGL context, five geometry buffers, 984 triangles, zero textures and no HDRI/model requests**. Existing production files are unchanged.

## Website fonts: license and loading

Verification date: **5 October 2026**. **Space Grotesk (display) and Inter (body) are permitted for public/commercial website use and self-hosting under SIL Open Font License 1.1.** Both remain the established typography. Only official author/project repositories, Google's font distribution and documentation, and the OFL publisher's guidance were used.

### Official sources, authors and local notices

| Font / role | Creator/project and official source | License / retained notice | Local distribution |
| --- | --- | --- | --- |
| Space Grotesk / display and HTAFL wordmark | Florian Karsten / Space Grotesk Project Authors; [official project](https://github.com/floriankarsten/space-grotesk) | [Author's OFL](https://raw.githubusercontent.com/floriankarsten/space-grotesk/master/OFL.txt); [Google Fonts OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/spacegrotesk/OFL.txt); complete distribution notice retained as [Space-Grotesk-OFL.txt](../assets/fonts/Space-Grotesk-OFL.txt) | `assets/fonts/space-grotesk-*.woff2`; three unchanged official web subsets, Google Fonts service path `v22` |
| Inter / body, controls and labels | Rasmus Andersson / Inter Project Authors; [official project](https://github.com/rsms/inter) | [Author's OFL](https://raw.githubusercontent.com/rsms/inter/master/LICENSE.txt); [Google Fonts OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/inter/OFL.txt); complete distribution notice retained as [Inter-OFL.txt](../assets/fonts/Inter-OFL.txt) | `assets/fonts/inter-*.woff2`; seven unchanged official web subsets, Google Fonts service path `v20` |

The official [OFL FAQ, webfont section](https://openfontlicense.org/ofl-faq/#2-using-ofl-fonts-for-webpages-and-online-webfont-services) explicitly permits CSS webfonts hosted on the site's server. Retain the copyright and OFL notices with redistributed font software; do not sell it separately or change its license. These conditions do not make HTAFL's website or artwork OFL-licensed. Modified/subset font software can have naming obligations, so this implementation makes **no binary modifications** and retains the publisher's files and notices unchanged.

### Implementation and weight selection

The previous `main.css` imported the [official Google Fonts CSS2 response](https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap). The same WOFF2 files supplied by that response were downloaded from `fonts.gstatic.com` and copied byte-for-byte to `assets/fonts/`. No third-party mirror, conversion service, replacement family or independently rebuilt font is used. Service paths `v20`/`v22` identify Google's distributions, not upstream release numbers.

[styles/fonts.css](../styles/fonts.css) now supplies local `@font-face` declarations through `main.css`. Existing tokens, sizes, letter spacing, line heights and font-family stacks remain unchanged:

- **Inter:** actual site weights **400, 600 and 700**, upright. One variable-font face per language subset declares the bounded **400–700** range; the redundant separate 500 declaration is removed. Intermediate weights remain available in the same file, with no additional download. No unused thin/black/italic faces are declared.
- **Space Grotesk:** retain the existing **600–700** display mapping. Both weights share one file per subset. No new display weight or italic style is introduced; existing inherited weight matching is preserved.
- **Font display:** `swap` on every face keeps fallback text readable during loading and failure. Existing Arial/sans-serif fallback stacks remain available. No JavaScript font gate, invisible text or font-dependent interaction is added.

### Subsets, payload and preload

The original publisher `unicode-range` descriptors are retained. This preserves coverage while allowing the browser to load only the subsets needed by page text. Inter supplies Latin, Latin extended, Vietnamese, Greek/Greek extended and Cyrillic/Cyrillic extended; Space Grotesk supplies Latin, Latin extended and Vietnamese. Unsupported scripts use the existing system fallback rather than missing text. No page-specific `text=` subset is used: evolving copy, names, form input, punctuation and diacritics must remain usable.

All ten WOFF2 files total **266,452 bytes (260.2 KiB)** on disk. Current English pages request only:

| Font file | Size | Used for |
| --- | --- | --- |
| `inter-latin.woff2` | 48,256 bytes / 47.1 KiB | Body, labels and controls across their used weights |
| `space-grotesk-latin.woff2` | 22,288 bytes / 21.8 KiB | Initial heading, HTAFL wordmark and display text |

The normal English-page font payload is **70,544 bytes (68.9 KiB)**. Other subsets are local but not preloaded; they load only when matching text requires them. The [font manifest](../assets/fonts/manifest.json) records every original binary URL, exact local destination, SHA-256, byte size, Unicode range, family, weight mapping and license source. Font data was already WOFF2-compressed by the official publisher; no extra package or runtime dependency is installed.

**No font preload is shipped.** A single Latin Space Grotesk preload was evaluated: on HTTP it started before the font CSS finished and was reused without a duplicate transfer. However, static `crossorigin` font preloads caused CORS errors in direct `file://` previews, while normal local CSS font loading worked. The site supports that existing preview workflow, so the preload was removed and every page head was restored. Fonts load locally on demand. For an HTTP-only deployment, reconsider preloading just the 22,288-byte Latin display file with `as="font"`, `type="font/woff2"` and `crossorigin`, after measuring LCP and bandwidth contention on real devices. Do not preload body fonts or all language subsets speculatively.

Technical references: [Google Fonts CSS2 API](https://developers.google.com/fonts/docs/css2) for precise weights/ranges and loading; [Google web.dev font-loading guide](https://web.dev/articles/optimize-webfont-loading) for limited critical preloads, subsetting and `font-display`. No documentation code was copied.

### Verification and deployment

Local HTTP Chrome checks passed on all seven routes at **375px and 1440px**: the new local distribution matches the previous official distribution's text dimensions and computed family/weight values after fonts load; the heading uses a custom Space Grotesk font; two Latin requests per page; zero duplicate font transfers, external requests, console errors or horizontal overflow. A blocked-font test kept the homepage readable without mobile overflow. The direct `file://` homepage preview also loads both local fonts with zero console errors after removal of the preload. These checks do not replace a final Safari/iOS and real-device deployment check.

Deploy `assets/fonts/`, including both OFL notices and its manifest, plus `styles/fonts.css`. Serve WOFF2 as `font/woff2`; same-origin fonts work with `font-src 'self'`. No Google Fonts connection or preconnect is needed at runtime. Cache font files, but version their names before enabling long-lived `immutable` caching because the filenames are descriptive rather than content-hashed. Configure HTTP compression for CSS; keep correct CORS headers if fonts are ever served from another origin. The unchanged fonts also remain usable offline when the local site files are available.

## HTAFL three-room environment

Reference inspection and implementation: **6 October 2026**. The current website
uses one shared environment with Overcome, Create and Connect rooms. The previous
homepage-only open installation/hero presentation is superseded. Existing logo,
fonts, palette, licensed photography and content records retain their sources.
See [the implementation guide](immersive-world.md).

| Reference/resource | Original URL / creator | Useful for | Type, rights and actual usage |
| --- | --- | --- | --- |
| Miu Miu immersive experience | [Official experience](https://immersivebags.miumiu.com/en/) / Miu Miu | Browser-observed enclosed rooms, controlled entry/camera travel and object prompts revealing readable content. | **Inspiration only.** Asset/code reuse rights are unverified. No model, texture, photograph, architecture design, interface composition, exact camera path, animation, brand identity, code or audio was copied/downloaded. Sound remained disabled. HTAFL geometry is original. |
| Rendering on Demand | [Official Three.js manual](https://threejs.org/manual/pages/rendering-on-demand.html) / Three.js | Draw after changes and stop when settled. | Technical reference only; original native WebGL scheduling. No Three.js code/package/utility is shipped by the room implementation. |
| Responsive Design | [Official Three.js manual](https://threejs.org/manual/pages/responsive.html) / Three.js | Separate CSS size from backing-buffer resolution and maintain projection aspect. | Technical reference only; original capped native-buffer resizing. |
| PerspectiveCamera | [Official Three.js API](https://threejs.org/docs/pages/PerspectiveCamera.html) / Three.js | Field of view, aspect and clipping concepts. | Technical reference only; original camera matrices. |
| WebGL best practices | [MDN guide](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices) / MDN contributors | Batched work, bounded pixel cost, resource lifecycle. | Technical reference only; no documentation code copied. |
| Matrix math | [MDN guide](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Matrix_math_for_the_web) / MDN contributors | Camera/projected HTML coordinate spaces. | Technical reference only; original math helpers and object prompts. |
| Visibility and motion | [Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API), [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), [reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) / MDN contributors | Hidden/offscreen pause and completed static views. | Technical references only; original event handlers. |
| Native content dialogs | [HTML dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) / MDN contributors | Browser modal semantics, background inertness and keyboard behavior. | Technical reference; no third-party dialog dependency. |

### Local production resources

| Resource / creator | License status | Local location and use |
| --- | --- | --- |
| Original procedural room geometry / HTAFL project implementation | Project-authored; no new third-party license. Does not change ownership of HTAFL identity. | `immersive/worlds.js`: connected walls, ceilings, floor, portals, art/textile studies, rising platforms, gathering structures and junction linework. |
| Native renderer, camera and shader / HTAFL project implementation | Project-authored; no reference code copied. | `immersive/scene.js`: one canvas, two buffers/passes, matte/satin lighting, fog, shadows and restrained authored movement. |
| Existing HTAFL Five-Path Mark | Existing brand asset; permissions unchanged. | Existing `assets/htafl-mark.svg`, `assets/htafl-mark-mono.svg`, `assets/htafl-favicon.svg`; unchanged logo/fallback and sampled contour linework. |
| Existing Space Grotesk and Inter | SIL OFL 1.1; official notices retained above. | Existing self-hosted `assets/fonts/`; no new font or weight. |

**No external production resource was downloaded for this change.** No model,
HDRI, texture, image, icon set, package, CDN or audio is added. Previously documented
optional environment maps remain disconnected. Previously licensed photography
remains illustrative within reading panels and never represents HTAFL members.

The renderer reuses one scene across three unnumbered destinations. DPR/pixel
budgets, on-demand entered rendering, low-detail mobile geometry, hidden/offscreen
and open-panel pauses, static reduced motion and full CSS/HTML fallback keep the
experience bounded. See [the room guide](immersive-world.md) for implementation,
verification and remaining real-device checks. No asset hotlinking is introduced.


## Historical hosted-payment reference — superseded 7 October 2026

The former Stripe reference and implementation have been removed at the owner's
request. No Stripe dependency or downloaded asset was used. Current Support
instructions use owner-supplied public bank details; no bank or cryptocurrency
resource has been downloaded. Crypto remains unavailable pending its currency,
network and public address. See [contribution instructions](support-contributions.md).

## Owner-directed fashion refresh — 6 October 2026

This entry supersedes the historical three-room presentation above for the
current homepage. The owner's supplied letter-wordmark replaces the public
Five-Path identity. A single set of photo entrances leads to Create, Overcome
and Community; the interactive fashion object is a small draped cloth study.
The existing palette and self-hosted fonts remain unchanged.

### Downloaded photography

| Resource / creator | Original source and rights | Local files, placement and alt text |
| --- | --- | --- |
| Fashion studio / Gustavo Fring | [Original photograph on Pexels](https://www.pexels.com/photo/woman-working-at-a-desk-in-a-sewing-studio-8769327/). [Pexels License](https://www.pexels.com/license/) reviewed for website use and modification; attribution is provided voluntarily. No endorsement, diagnosis or HTAFL membership is implied. | `assets/photography/illustrative/illustrative-fashion-studio-{640,960,1280}.webp`, 162,826 bytes across all variants; homepage hero. Alt: “A fashion designer works at a cutting table surrounded by fabric and studio tools.” |

The downloaded image URL, original SHA-256, dimensions and individual sizes are
in `assets/photography/illustrative/manifest.json`. The source was downloaded
from Pexels' own image service and converted locally to WebP; metadata was
removed. Responsive image selection requests one suitable variant. Production
does not hotlink the source. The visible caption identifies the photography as
illustrative. Existing licensed sewing, textiles, sketchbook, workshop and
walking photos retain the source records above and in the same manifest.
Their placement follows the activity shown; stock subjects are never gallery
members or consent-approved community submissions. The existing sewing photo
also appears beneath the partnership section's readable navy overlay.

### Three individual social icons

| Resource | Pinned original download | License and usage |
| --- | --- | --- |
| Instagram SVG / Fonticons, Inc. | [Font Awesome Free 6.7.2 original](https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.7.2/svgs/brands/instagram.svg) | CC BY 4.0 for SVG icons; `assets/icons/social/instagram.svg`, identifying HTAFL's Instagram profile in the footer. |
| X SVG / Fonticons, Inc. | [Font Awesome Free 6.7.2 original](https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.7.2/svgs/brands/x-twitter.svg) | CC BY 4.0; `assets/icons/social/x-twitter.svg`, identifying HTAFL's X profile. |
| TikTok SVG / Fonticons, Inc. | [Font Awesome Free 6.7.2 original](https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.7.2/svgs/brands/tiktok.svg) | CC BY 4.0; `assets/icons/social/tiktok.svg`, identifying HTAFL's TikTok profile. |

[Official Font Awesome license](https://github.com/FortAwesome/Font-Awesome/blob/6.7.2/LICENSE.txt)
is retained locally as `assets/icons/social/LICENSE.txt`; creator, source and
license are also credited publicly at `/credits/`. These SVG files are
unmodified; there is no icon font, package or runtime library. Accessible link
names identify each platform and @htaflco. The code license does not transfer
platform trademark ownership. Marks identify the actual linked profiles and do
not imply sponsorship. [X's official brand toolkit](https://about.x.com/en/who-we-are/brand-toolkit)
and [TikTok developer design guidelines](https://developers.tiktok.com/docs/en/getting-started-design-guidelines)
were consulted. No blanket trademark permission is claimed from the icon license.

### Downloaded fashion geometry and material

| Resource / creator | Source and verified license | Local derivatives and actual use |
| --- | --- | --- |
| Sheen Cloth / Microsoft, 2020; distributed by Khronos | [Official glTF Sample Assets directory](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/SheenCloth). [Asset README explicitly grants CC0](https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/SheenCloth/README.md). | Homepage textile sculpture, rendered by `scripts/fashion-cloth.js`. `assets/materials/sheen-cloth/cloth-mesh.json` contains the resampled geometry; three `technicalFabricSmall_*_256.webp` files contain optimized 128px material maps. The filename's 256 denotes the original map name, not the optimized dimensions. |

Original files were downloaded from the official repository's
[glTF folder](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/SheenCloth/glTF).
`assets/materials/sheen-cloth/manifest.json` records each exact raw source URL,
source and optimized map hashes, local destination, byte size, dimensions,
creator, license and usage. The original README is retained as
`assets/materials/sheen-cloth/LICENSE.md`; optional public credit is supplied
although CC0 does not require attribution.

The original simulation mesh has 115,200 triangles. Its positions, normals,
tangents and UVs were sampled on a 40×40 UV grid, centered and uniformly scaled:
1,681 vertices / 3,200 triangles. The 99,888-byte vertex/index buffer is encoded
once in a 133,215-byte JSON file for reliable browser delivery. Three locally
converted 128px WebP maps total 37,848 bytes. **Total production mesh and maps:
171,063 bytes (167.1 KiB)** before transfer compression. Original large geometry
and PNG files are not production dependencies. No glTF loader, Three.js package,
HDRI, proprietary fashion model, luxury-brand asset or additional dependency was
added. The custom restrained material uses the existing ivory token; it is a
lightweight interpretation of the licensed fabric, not a complete glTF PBR loader.

The implementation follows the already recorded official rendering-on-demand,
resize and visibility references. It initializes when visible, limits DPR and
backing-buffer pixels, renders only after changes, and stops offscreen/hidden.
Reduced motion and unavailable WebGL retain a static CSS cloth plane with
ordinary HTML content. Its local `cloth-poster.webp` is a 6,026-byte still
generated from the same CC0 mesh and the site's own renderer, not another
downloaded asset. The manifest records its dimensions, hash and derivation.
See [current implementation safeguards](site-refresh.md).
No audio, continuous spin or idle render loop is added.

Poly Haven's CC0 crepe-satin resource was considered, but its download service
was unavailable in this environment. **No Poly Haven texture was downloaded or
used in this pass.** No unclear-license fallback was substituted.

### Evidence and statistics: references, not downloadable assets

| Source | Claim used / scope | Where used |
| --- | --- | --- |
| [UNESCO: Violence and bullying in schools](https://www.unesco.org/en/articles/violence-and-bullying-schools-unesco-calls-better-protection-students), November 2024 | Around one pupil in three worldwide experiences bullying each month. This is a bullying indicator, not a numerical measure of hate or HTAFL's audience. | Homepage evidence section; `content/research.json`. |
| [WHO: Adolescent mental health](https://www.who.int/news-room/fact-sheets/detail/adolescent-mental-health), September 2025 | Anxiety disorders: 5.3%; depression: 3.4%, ages 15–19 worldwide. Separate prevalence estimates, not a combined count. | Homepage evidence section. |
| [WHO Europe: Evidence on the role of the arts in improving health and well-being](https://www.who.int/europe/publications/i/item/9789289054553), 2019 | Scoping review synthesizing more than 3,000 studies, with varied designs and activities across the lifespan. Study count is not a treatment-success rate, and broad arts evidence is not fashion-specific clinical evidence. | Homepage evidence section and limitations text. |
| [Body Image fashion study, indexed in PubMed](https://pubmed.ncbi.nlm.nih.gov/40889434/), 2025; DOI 10.1016/j.bodyim.2025.101955 | Abstract reports 710 Brazilian women and both positive and negative associations between fashion clothing involvement and mental health. Cross-sectional associations do not establish causality or treatment efficacy; no generalization to all young people. Abstract reviewed, not the full text. | Homepage “Fashion and wellbeing” note. |

These sources were checked on 6 October 2026. Only brief original summaries
and links are used; no publication images, PDFs or protected text were downloaded
for production. The figures provide context, not HTAFL outcomes. No claim says
fashion cures anxiety/depression, and no universal “hate” prevalence is invented.
The user's own founder story and screenshot copy are stored separately from
these external references. User-supplied logo artwork is also separate from
licensed stock material. Preserve all local notices and `/credits/` when deploying.

## Shared background atmosphere — 7 October 2026

The background update reuses the already downloaded, licensed illustrative
sketchbook, design-board, sewing, walking and workshop Pexels photographs above.
Their exact creator/source/license records remain in the photo manifest and public
Credits. They now also appear as decorative introduction backgrounds on the
corresponding activity pages. No photograph represents a member or founder.
The CSS weave is project-authored using existing brand colors. No external
asset, code, font, library, audio or new dependency was downloaded for this pass.
See [implementation and motion safeguards](site-atmosphere.md).

## Email delivery setup — 7 October 2026

| Official reference | Use | Resource/license status |
| --- | --- | --- |
| [Google App Passwords](https://support.google.com/accounts/answer/185833) | Owner-selected dyrctkm@gmail.com sender with two-step verification; destination remains htafl@africamail.com. | Technical reference only; no provider asset or code downloaded. The credential is entered privately. |
| [Nodemailer SMTP transport](https://nodemailer.com/smtp) | TLS on port 465, bounded timeouts and `verify()` for connection/authentication without sending a message. | Official technical reference; original local-only setup helper reuses the already installed Nodemailer dependency. No new package or copied documentation code. |

See [private configuration and deployment instructions](email-delivery.md).
The helper prepares email delivery; successful activation depends on a genuine
verified Gmail App Password and restarting the site with its private SMTP settings.

## Owner-selected resource application — 7 October 2026

The owner selected **Apply selected resources** from the supplied shortlist.
Official resource pages and current licenses were checked before downloading.
The existing layout, typography, logo, palette, copy and native WebGL cloth stay
intact. No dependency, HDRI, audio or external SVG generator output was added.

### Applied photography

These are illustrative photographs under the [Pexels License](https://www.pexels.com/license/),
which permits website use and modification. This is a custom license, **not CC0**.
Keep the existing neutral context: subjects are not HTAFL members, founders,
testimonials, patients or endorsements. Do not use the images as submitted work
in the consent-approved gallery. Photographer credits remain on the site and
in `/credits/`.

| Creator / original page | Local basename | Intended use | Alt text |
| --- | --- | --- | --- |
| [Vitaly Gariev — pattern-making studio](https://www.pexels.com/photo/fashion-designer-working-with-patterns-in-studio-36731169/) | `illustrative-pattern-studio` | Homepage hero | A designer measures a paper garment pattern on a studio worktable. |
| [Ron Lach — sewing atelier](https://www.pexels.com/photo/fashion-designer-sewing-in-atelier-9850072/) | `illustrative-atelier-collaboration` | Homepage Create entrance; Create atelier and decorative opening | A person guides orange fabric through a sewing machine with another person working behind them. |
| [Anna Shvets — artists reviewing sketches](https://www.pexels.com/photo/young-focused-artists-working-together-with-sketches-5641891/) | `illustrative-artists-collaboration` | Homepage Connect entrance; Community photograph and decorative opening | Two people review drawings together on the floor of a creative workspace. |
| [mücahit peker — industrial staircase](https://www.pexels.com/photo/stairs-light-city-sunset-12428455/) | `illustrative-progress-staircase` | Homepage Overcome entrance; Overcome photograph and decorative opening | People on an industrial staircase with warm light falling across the surrounding walls. |

All four are stored in `assets/photography/illustrative/` as WebP variants at
640, 960 and 1280 pixels wide, preserving aspect ratio and removing metadata.
Quality: 78. Individual 1280-pixel versions: 53,848 / 34,936 / 103,764 / 229,586
bytes respectively. Responsive HTML selects an appropriate size; the hero is
eager/high priority and section images lazy-load. Decorative openings use 640px.
The existing photographic frames are retained; the shared-sketches photograph
uses a right-aligned crop so both collaborators stay visible. The staircase is an
illustrative spatial metaphor; no diagnosis or recovery story is attributed to
the people in it.

`assets/photography/illustrative/manifest.json` records each exact download URL,
original checksum/dimensions, local variant checksum/size, creator, license,
alt text and placement. Originals are review working files, not public assets.
No hotlinking is used in production.

### Applied textile resource

| Resource | Source / license | Creator | Local use |
| --- | --- | --- | --- |
| Terlenka diffuse photograph | [Official resource](https://polyhaven.com/a/terlenka); [Poly Haven CC0 license](https://polyhaven.com/license); [CC0 dedication](https://creativecommons.org/publicdomain/zero/1.0/) | Photography: colormass. Processing: Rico Cilliers. | `assets/materials/terlenka/terlenka-diffuse-512.webp`; shared decorative CSS background. |

Downloaded from `https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/terlenka/terlenka_diff_1k.jpg`.
Only the diffuse map is needed: resized to 512 × 513, WebP quality 78, **838 bytes**.
A paper-token overlay keeps the existing palette and reading contrast. No normal,
roughness, displacement, HDRI or environment loader is required. Exact original
and local hashes are in `assets/materials/terlenka/manifest.json`; its `LICENSE.md`
and public Credits preserve creator/source information even though CC0 does not
require attribution. This later successful Terlenka download does not change
the earlier record that crepe-satin was unavailable.

### Considered but not applied

| Reference from the supplied shortlist | Decision / status |
| --- | --- |
| [Vitaly Gariev — alternate studio sewing](https://www.pexels.com/photo/fashion-designer-sewing-in-studio-workspace-36731281/) | Pexels page/license checked; no download. The selected atelier photograph already covers sewing. |
| [Jersey Melange](https://polyhaven.com/a/jersey_melange), [Denim Fabric 03](https://polyhaven.com/a/denim_fabric_03), [Fabric Pattern 05](https://polyhaven.com/a/fabric_pattern_05) | Official CC0 pages checked; no downloads. One quiet textile is sufficient. |
| [Story Studio 02](https://polyhaven.com/a/story_studio_02), [Ferndale Studio 08](https://polyhaven.com/a/ferndale_studio_08), [Studio Small 04](https://polyhaven.com/a/studio_small_04) | Official CC0 pages checked; no downloads. Existing cloth uses a lightweight procedural lighting shader; an environment loader and map would add unnecessary weight. |
| [Haikei](https://app.haikei.app/), [BGJar](https://bgjar.com/) | Generator references only. Export-specific rights were not verified; no generated assets are used. |

No third-party composition or brand identity was copied. No commercial fashion
campaign assets or random models were downloaded.

## Retail color reference and merchandise — 7 October 2026

| Reference | URL | Use | Asset / license status |
| --- | --- | --- | --- |
| ASOS homepage and owner's supplied footer screenshot | https://www.asos.com/ | Inspiration for a black footer, white foregrounds/header, deep-blue CTA accents and colored social badges. Official page inspected; screenshot colors sampled as black `#000000`, white `#FFFFFF`, blue `#051A6E`. These samples are not asserted to be ASOS's official brand guidelines. | Visual reference only. No ASOS logo, code, photography, payment badges, fonts or icons downloaded or reused. |

The HTAFL logo, typefaces, existing content and page structure remain. Retail
accent values are added centrally in `styles/tokens.css` and `styles/tokens.json`;
the existing core colors are retained. The website's white header, primary blue
buttons and black footer use these accents. Social presentation applies original
CSS to the existing locally licensed Font Awesome Instagram, X and TikTok glyphs:
an Instagram gradient, white-on-black X, and small cyan/pink TikTok offsets.
No extra icon download or dependency is needed. Glyph SVG files remain unchanged;
their CC BY 4.0 source credit/license remains in `/credits/` and
`assets/icons/social/LICENSE.txt`. New-tab behavior and accessible names remain.
Only HTAFL's previously supplied social accounts are linked.

The owner confirmed merchandise is **Coming soon for now**. `/merchandise/` uses
the already licensed Ron Lach atelier photograph as illustration, clearly labeled
as not an HTAFL product. It also reuses the existing decorative sewing photograph
for its opening; neither represents merchandise for sale. No products, prices,
stock, delivery promises, checkout or payment methods are fabricated. Product
data and an official purchase destination can be supplied before selling begins.

## Free deployment and updated email — 7 October 2026

| Resource | Official source | Use / license status |
| --- | --- | --- |
| Netlify Free | https://www.netlify.com/pricing/ | Hosting service reference: current 300-credit monthly free limit, not unlimited. No paid upgrade or deployment made. |
| Modern Functions | https://docs.netlify.com/build/functions/api/ | Request/Response adapter in netlify/functions/backend.mjs. Documentation reference, no copied website assets. |
| Private Blobs | https://docs.netlify.com/build/data-and-storage/netlify-blobs/ | Persistent uploads, shared sessions/limits and conditional writes. Actual managed storage still needs deployment verification. |
| @netlify/blobs 11.1.3 | https://github.com/netlify/blobs | MIT package installed locally for the server only; distributed license remains in package. |
| serverless-http 4.0.0 | https://github.com/dougmoscrop/serverless-http | MIT package installed locally to preserve Express backend logic. |
| Managed HTTPS | https://docs.netlify.com/manage/domains/secure-domains-with-https/https-ssl/ | Deployment reference; certificate not verified until a site exists. |
| mail.com domains and SMTP | https://www.mail.com/mail/domains/ ; https://support.mail.com/premium/imap/server.html ; https://www.mail.com/blog/posts/what-is-imap-pop3/86/ | africamail.com is a mail.com domain; SMTP requires Premium and is currently not enabled. The recipient remains htafl@africamail.com; sending now uses the separately authorized dyrctkm@gmail.com account. Technical references only. |
| Nigeria privacy principles | https://ndpc.gov.ng/our-data-privacy-policy/ ; https://ndpc.gov.ng/wp-content/uploads/2025/03/NDP-ACT-GAID-2025-MARCH-20TH.pdf | Purpose-based retention and rights reference for content/privacy-policy.json. No fixed legal duration invented; legal compliance not certified. |

No new visual/audio asset was downloaded for deployment or email configuration.

## Owner-selected Gmail sender — 7 October 2026

The owner selected dyrctkm@gmail.com for sending, while retaining
htafl@africamail.com for public contact and receipt.
[Google's official App Password guide](https://support.google.com/accounts/answer/185833)
was checked for two-step verification, credential format and account restrictions.
Only the existing SMTP setup is changed; no new package, asset or subscription.
The prior mail.com SMTP-only configuration is superseded. Actual authentication
and inbox receipt still require the owner's private credential and a real test.
