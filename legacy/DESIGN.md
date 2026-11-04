# StudySathi — Design Guide

## Product purpose

StudySathi is a free educational resource discovery prototype for children aged 10–16 in Nepal and the adults supporting their learning. It organizes links to existing educational materials rather than hosting or producing provider content.

The experience has three foundations:

- **Discover:** Browse and filter the 15 curated resources.
- **Learn:** Follow three fixed, four-step learning paths.
- **Teach:** Find teaching-friendly materials and an example session plan.

The prototype supports the intent of SDG 4 through easier resource discovery. It does not claim measured impact, official partnerships, or certified academic mastery. No AI features, authentication system, payments, or database are included in the application.

## Visual direction

Calm, welcoming, spacious, and practical. An off-white canvas, deep teal actions, muted botanical colors, rounded cards, and simple line icons keep the interface friendly without visual clutter. Use the existing illustrated homepage scene and category treatments when extending the site.

### Core color tokens

| Role | Color | Use |
| --- | --- | --- |
| Primary | `#087F75` | Main actions, links, active navigation, progress |
| Primary hover | `#075C54` | Hover state for main actions |
| Light green | `#DDF7ED` | Success and supporting highlights |
| Background | `#FAFBF8` | Main page canvas |
| Surface | `#FFFFFF` | Cards, inputs, navigation |
| Heading | `#172B4D` | Titles and main text |
| Muted | `#64748B` | Supporting descriptions |
| Accent | `#F7C948` | Hero underline and small warm accents |
| Border | `#E2E8DF` | Card and section boundaries |

### Category colors

| Category | Tint | Icon/text color | Lucide icon |
| --- | --- | --- | --- |
| Academic Education | `#E7F2EB` | `#397960` | GraduationCap |
| Digital Safety | `#EAF0FB` | `#5375B2` | ShieldCheck |
| Financial Literacy | `#FCF1D7` | `#A68130` | Wallet |
| Life Skills | `#F9EAE5` | `#B97F67` | Heart |
| Learning Games | `#EEEAFB` | `#8672B4` | Gamepad2 |
| Environment | `#EDF3DD` | `#789243` | Leaf |

Categories are always named in text; color is an additional cue.

### Typography

- **Headings and logo:** Plus Jakarta Sans, falling back to Inter and sans-serif.
- **Body and controls:** Inter, falling back to Arial and sans-serif.
- Hero heading: approximately 54px on desktop, 46px on narrow phones, with tight tracking and a 1.16 line height.
- Page titles: approximately 39px on desktop and 31px on phones.
- Section titles: approximately 30px on desktop and 24px on phones.
- Card headings: 15–17px, with some compact intermediate layouts.
- Supporting card copy: approximately 12px; long copy uses generous line height.
- Eyebrows: small uppercase labels with expanded letter spacing.

Fonts load from Google Fonts; local fallback fonts keep the page usable if that request fails. For production, review small metadata text with intended users and increase it where needed.

### Spacing and shape

- Centered content container: maximum 1240px.
- Desktop container width: viewport minus 96px; tablet and mobile margins shrink progressively.
- Desktop section spacing: about 68px above and below; phones about 39px.
- Card gaps: typically 16–22px.
- Cards: 10–14px radius with thin borders.
- Buttons: 8px radius, clear text labels, and optional directional icons.
- Shadows: light and restrained, primarily on hover and floating illustration labels.

## Brand and illustration

The logo combines an open book with a leaf and the name **StudySathi**. “Sathi” uses the primary teal. The brand message is **Learn, Explore, Grow Together.**

The homepage uses an original inline SVG illustration of two children learning with a laptop and books, with mountains in the background. Category illustrations use Lucide icons on tinted geometric surfaces. No provider logos are needed.

## Page and navigation map

| Route | Page | Primary purpose |
| --- | --- | --- |
| `/` | Home | Introduce the platform and offer clear starting points |
| `/resources` | Resource library | Search and combine five filters |
| `/resources/:id` | Resource details | Explain a resource and link to its original provider |
| `/learning-paths` | Learning paths | Choose one of three curated journeys |
| `/learning-paths/:id` | Path details | Follow steps, record notes, and track completion |
| `/volunteers` | For Volunteers | Find teaching-friendly resources and a session example |
| `/saved` | Saved resources | Return to bookmarked materials |
| `/about` | About | Explain the problem, approach, SDG 4 purpose, and future phases |
| Any unmatched route | Not found | Offer a way back to the library |

The sticky header contains the logo, main navigation, and bookmark collection. The active page is highlighted. Smaller screens use a hamburger menu. The footer repeats useful navigation and explains provider ownership.

## Page composition

### Home

1. Split hero with the main message, two actions, and learning illustration.
2. Information strip: 15 curated resources, six categories, intended ages, and SDG 4.
3. Six category cards linking to prefiltered library views.
4. Four featured resource cards from the actual catalog.
5. Three learning path previews.
6. Three steps explaining how the platform works.
7. SDG 4 mission banner and shared footer.

### Resource library

Use a title and search field above a filter sidebar and resource grid. Search updates immediately. Each card shows the category, title, provider, description, age/audience, language, format, details link, and bookmark control.

Filters cover category, age, language, format, and learning purpose. They combine with search. Query-string parameters preserve the current filter view and allow category links from the homepage. Active filter chips can be removed individually. Clear-all and empty-result reset controls return to the full catalog.

Age filtering uses overlapping ranges: a resource recommended for ages 10–14 appears in the 10–12 and 13–14 groups. Adult-only guidance has no numeric age range and is excluded when a child age filter is active. Language filtering follows the explicit curated labels; “Varies” is not automatically assumed to include a particular language.

### Resource details

Show a breadcrumb, category, title, provider, description, topic visual, exploration guidance, and access notes. A summary panel contains key metadata and two actions:

- **Open Original Resource:** official provider URL, new tab, `noopener noreferrer`.
- **Save Resource:** add or remove a bookmark.

Related cards come from the same category. Materials remain on the original website. Access restrictions are explained without pretending to detect external outages in real time.

### Learning paths

Use three cards: Stay Safe Online, Learn About Money, and Explore Mathematics. Each has four fixed steps and a clear learning goal.

Path details use a numbered vertical sequence and a progress bar. Steps link to resource detail pages, provide a reflection prompt, or offer a practice activity. Completion can be toggled and undone. Notes are saved locally. The money path includes a fictional NPR 500 budget for needs, wants, and savings; feedback shows any unallocated amount or overspend.

### For Volunteers

Reuse resource discovery with only `Both` and `Teaching / Group Learning` resources. Offer category and age filters. Follow it with an explicitly labeled example 30-minute online safety session and a future collaboration statement. Do not present the example as a workshop already delivered.

### Saved resources

Display bookmarked resources using the shared cards. The bookmark removes an item. An empty collection explains how saving works and links to the library.

### About

Explain the resource-discovery problem, StudySathi's approach, its SDG 4 purpose, and a five-phase roadmap. Clearly distinguish the current prototype from future accessibility work, testing, partnerships, and offline support.

## Interaction and state

| State | Storage key | Behavior |
| --- | --- | --- |
| Saved resource IDs | `studysathi-saved` | Persist across refreshes in the same browser |
| Completed step keys | `studysathi-progress` | Persist completion and undo actions |
| Reflection/budget notes | `studysathi-notes` | Persist notes and budget entries |

Storage reads handle malformed data. Failed writes show a message rather than stopping navigation. A brief toast confirms bookmark changes. Clearing browser data removes saved state. No state syncs between devices. Notes should not include personal information.

## Responsive behavior

| Width | Layout |
| --- | --- |
| Above 1100px | Full navigation, split hero, sidebar filters, three library columns, four featured columns |
| 801–1100px | More compact spacing, two library columns, two featured columns |
| 601–800px | Hamburger navigation, compact split hero, two library columns |
| 600px and below | Stacked hero, one resource/path column, collapsible filters, two category columns |

Breakpoints are implemented in `src/style.css`. The footer becomes a two-column layout and then stacks its summary and mission areas across the available width.

## Accessibility and usability

- Semantic headings, links, buttons, labels, and progress indicators.
- Skip-to-content link and visible keyboard focus states.
- Text labels alongside icons and category colors.
- Accessible names for bookmark, search-clear, and mobile-menu controls.
- Pressed state for bookmark/completion buttons; expanded state for menus and filters.
- Status feedback for saved actions and budget changes.
- Reduced-motion preference disables transitions.
- Simple copy and honest provider/access information.

Desktop navigation, combined search and filters, bookmark persistence, and progress persistence were checked in a browser during the original build. The production build passes TypeScript validation. A dedicated mobile-device and assistive-technology audit remains future validation; do not claim one has been completed.

## Implementation guide

| File | Responsibility |
| --- | --- |
| `src/App.tsx` | Page views, shared components, routes, and browser state |
| `src/style.css` | Design tokens, components, and responsive rules |
| `src/data/resources.json` | Exactly 15 resource records and original URLs |
| `src/data/learningPaths.ts` | Three fixed learning paths |
| `src/utils/filters.ts` | Search/filter logic and category definitions |
| `src/types/resource.ts` | Resource data shape |
| `src/main.tsx` | React and router entry point |

The stack is React, TypeScript, Vite, Tailwind CSS, React Router, and Lucide React. Visual rules are primarily explicit CSS. Reusable components currently live in `App.tsx`; the component/page directories can support later refactoring.

## Running the downloaded project

```bash
npm ci
npm run dev
```

Create production output with:

```bash
npm run build
```

`dist/` contains the built static website. Serve it through a web server rather than opening its HTML as a local file. Configure production hosting to return `index.html` for client-side routes. Dependencies are not bundled in the source ZIP; `npm ci` installs the versions in the lockfile.

The downloadable project omits account-specific hosting configuration, repository history, and credentials. Configure your own host if deploying separately. Google Fonts requires connectivity; linked educational materials require access to their provider websites.
