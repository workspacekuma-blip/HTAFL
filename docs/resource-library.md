# Resource library

`resources/index.html` implements `/resources/` with the shared shell, cards,
buttons and responsive layout. `resource-data` is an empty JSON array: there are
no fabricated articles, tools or health resources. The coming-soon state invites
visitors to existing Create and Community pages.

## Search and categories

`scripts/resource-library.js` filters published records by Mind, Movement, Create,
Connect or Stories, with an All categories option. Native labeled search and
radio controls support keyboard input. An inline live region announces results
without moving focus. Search matches all entered words across titles,
descriptions, sources, categories and optional tags, ignoring case.

Typing updates after a 180ms debounce. Search submission applies immediately;
category selection applies immediately. Clear resets both controls and focuses
search. Query state uses `q` and `category` URL parameters. Initial URLs and browser
Back/Forward restore controls/results. Unknown categories fall back to All;
unrelated URL parameters and fragments are preserved. Typing replaces the current
history entry; category changes, explicit submissions and clearing push changed
state. File browsers that prohibit history updates still support local filtering.

Without JavaScript, the static coming-soon message remains visible and the form
uses a normal GET request. Dynamic filtering requires JavaScript.

## Publishing actual resources

The existing card template and renderer are ready for reviewed public records:

| Field | Requirement |
| --- | --- |
| `id` | Nonempty unique string |
| `status` | Exactly `published` after editorial review |
| `title` | Nonempty resource title |
| `description` | Nonempty accurate summary |
| `category` | `mind`, `movement`, `create`, `connect` or `stories` |
| `source` | Nonempty source/publisher credit |
| `href` | Real HTTPS destination or a valid same-origin relative URL |
| `tags` | Optional array of searchable strings |

The renderer skips unpublished, incomplete and duplicate records and unsafe URL
schemes. Public text is inserted with text nodes. Each responsive resource card
shows a category, descriptive title link, summary and source credit.

These display checks do not verify factual accuracy or the authority of a source.
Review content and destinations before publication, especially health information.
Publish no seed examples merely to populate the interface. A populated library
with zero matches instead provides guidance to broaden or clear filters.
