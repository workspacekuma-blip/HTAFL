# Community participation and gallery

**Current implementation:** The Figma fashion-site pass adds private artwork
uploads, a server-backed consent-approved gallery and operator review commands.
See [current implementation and deployment setup](fashion-implementation.md).
The historical embedded-data and unconnected-upload descriptions below are
superseded. Existing Pexels workshop photography is illustrative and stays
outside the public submissions gallery.

`community/index.html` implements `/community/` using the shared design system.
Challenges point to real example prompts; sharing, conversations, collaborations
and events explicitly describe their availability. No enrollment, upload or
discussion service is implied. Encouragement offers an action people can take now.

## Illustrative atmosphere photography

The [Community resource shortlist](web-resources.md#community-illustrative-imagery-and-visual-references)
records verified stock-photo licenses, creators, original URLs, alt-text suggestions
and proposed placements, plus official workshop references for a future photo brief.
This research pass adds no photographs to the page. If integrated later, illustrative
stock belongs in a separately captioned atmosphere figure outside the gallery:
**“Illustrative photography — not HTAFL members or an HTAFL event.”**
It must never become a gallery record, named profile, testimonial, community story
or evidence of an existing event. Keep the consent-approved gallery empty until
real approved content is available.

## Gallery connection

No public records currently exist: `community-gallery-data` contains `[]`.
The visible invitation is the default, including with disabled JavaScript.
`community-gallery-card` is the reusable card template; `data-community-gallery`
is its list container. `scripts/community-gallery.js` reads the embedded JSON and
renders eligible records using text nodes, not HTML from the data.

Future records require:

| Field | Requirement |
| --- | --- |
| `status` | Exactly `approved`, after editorial review |
| `publicationConsent` | Boolean `true`, verified for the published work and fields |
| `title` | Nonempty public title |
| `credit` | Nonempty creator-approved credit; a chosen pseudonym is acceptable |
| `summary` | Nonempty approved public description or story |
| `image` | Optional; if present, requires `src`, descriptive `alt`, and positive integer `width`/`height` |

The adapter rejects unapproved, incomplete and malformed records and invalid image
URL schemes. All cards show title, credit and summary without a hover interaction;
images are lazy-loaded and have explicit dimensions. The invitation remains when
no eligible records exist. The adapter makes no API requests.

Consent must be explicit and separate from general participation. Approval flags
must come from a trusted publishing workflow, not unreviewed visitor submissions.
They are a display guard, not proof of consent or a moderation service. Keep
consent evidence, email addresses and other private records out of this public JSON.
Only publish reviewed fields and imagery with permission and credit. Withdrawn
work must be removed from the published data and media as appropriate.

When connecting a real provider, generate the same public record structure from
reviewed content. Do not add placeholder people, stories, attendance or schedules.
