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

Breakpoints are implemented in `src/app/globals.css` (ported from the prototype's `src/style.css`). The footer becomes a two-column layout and then stacks its summary and mission areas across the available width.

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

## Implementation note (Next.js version)

The prototype's single `App.tsx` is split into route segments under `src/app/` and shared components under `src/components/`. Tokens move into CSS variables in `src/app/globals.css`. See `CLAUDE.md` and `docs/ARCHITECTURE.md` for structure. The prototype statement "No AI features, authentication system, payments, or database are included" now changes to: **no AI features, no payments**; authentication and Firestore are added for the LMS only. The public pages still work without signing in.

---

## Extension: accounts, LMS and portals

Everything below uses the tokens, fonts, radii and spacing above. Do not introduce new colors unless listed here.

### Additional tokens

| Role | Color | Use |
| --- | --- | --- |
| XP / reward | `#F7C948` (existing accent) on `#FEF6DC` | XP pills, level ring highlight, badge glow |
| Success | `#087F75` on `#DDF7ED` | Correct answers, completed lessons |
| Gentle error | `#B4533A` on `#FBEDE8` | Wrong answers, form errors (never bright red) |
| Info | `#5375B2` on `#EAF0FB` | Tips, review notes |
| Portal sidebar | `#FFFFFF` with `#E2E8DF` right border | Admin and creator navigation |

Status chips for courses: Draft (muted grey), In review (info blue), Changes requested (Financial Literacy amber `#A68130` on `#FCF1D7`), Published (success teal), Archived (muted).

### Auth pages

Centered single card (max 420px) on the off-white canvas, logo above, small illustration optional. Tabs or a simple switch for "I'm a student" (username + password) and "I'm a parent / creator" (email or Google). Plain-language errors: "That username and password don't match. Ask your parent to reset it."

### Student area (`/learn`)

Feels like the public site, with the same sticky header plus an XP pill and avatar menu.

- **Dashboard:** greeting with nickname, "Continue learning" card (biggest element), level ring with XP to next level, streak count with a leaf icon, latest badges row, recommended courses.
- **Course page:** cover, category chip, age, language, lesson outline grouped by module with completion ticks, one primary "Start" or "Continue" button.
- **Lesson player:** one column, max 720px reading width, progress bar at the top, blocks stacked with generous spacing, large tap targets (min 44px), sticky bottom "Complete lesson" button on mobile. Quiz feedback appears inline below the question with an icon and text, never color alone.
- **Celebrations:** small XP toast ("+10 XP"), a gentle confetti burst or badge card on level-up/badge earned. Disabled under `prefers-reduced-motion` (show a static badge card instead).
- **Leaderboard:** two tabs (This week / All time). Top 3 shown as podium cards with avatars, then a list to 10, then a highlighted "You" row. If not opted in: friendly explanation and "Ask a parent to turn this on."
- **Avatars:** a fixed set of 12 illustrated or icon avatars (animals, plants, mountains). No photo uploads.

### Parent area (`/parent`)

Calm dashboard: one card per child (avatar, nickname, level, lessons this week, current course), buttons for "View progress", "Reset password", "Leaderboard: On/Off". Add-child form on its own page.

### Creator portal (`/creator`) and Admin portal (`/admin`)

Shared portal layout: left sidebar (collapses to a top menu under 800px), page title row with primary action on the right, content in cards. Tables use 14px text, zebra-free rows with thin borders, and row actions in a menu.

**Course builder:** three-pane on desktop — outline (modules and lessons, reorder with up/down buttons and drag), lesson editor (block list with "Add block" picker showing each block type with icon and one-line description), and a live preview toggle that renders the student view. On mobile, panes become tabs. Autosave drafts with a visible "Saved" status. "Submit for review" button with a checklist (cover, summary, at least one lesson, every image has alt text, every quiz has a correct answer).

**Creator analytics:** simple cards (views, enrollments, completions, completion rate) and a per-lesson drop-off bar list. Use plain CSS bars; no heavy chart library unless an ADR approves it.

**Admin:** overview cards, review queue (preview course as a student, approve / request changes with a note), creator applications, users (search, change role, disable), resources (CRUD for the curated library with the same honesty fields: provider, note, verification), badges.

### Copy tone

Short sentences. Encouraging, never pressuring. Say what to do next. Avoid jargon such as "module" on student screens; use "Part 1, Part 2" instead.

## Play and Learn visual discovery
For the user-requested child-facing activity gallery, use original interactive SVG mini previews, pastel subject backgrounds, teal play actions, compact titles and native subject filter buttons. Keep the existing brand fonts/colours and 44px controls. The preview is a small original demonstration; full provider games open on their activity pages. No points for preview clicks. Decorative motion respects reduced-motion preferences. Long teaching/source details use disclosures rather than crowding the discovery screen.


## Guided discovery extension (2026-11-14)
Public home uses four pastel adventure doors, existing hero art, original letter artwork and a circuit mini preview. Resource cards use original sun/hill/book/category scenes, not provider screenshots. Paths expose numbered stops with direct anchor navigation and completion labels; preserve accessible controls and saved-state semantics. Reuse brand colours/fonts, 44px controls, 360px layouts and reduced-motion settings.


Resource details now use compact category mini activities, an action-focused provider card and collapsed adult/source details rather than an oversized static icon banner. English/maths trails use existing numbered roadmap components, visible provider credits and explicit external vs in-site action labels.


## Storybook/playable trail revision
Supersedes icon landscapes and provider-link English/maths trail presentation: use original colourful storybook scene artwork for resources and path covers. Native inline spelling/counting/number-hop games and original picture-book pages are visible without a load button or external route. Optional device narration never starts automatically; preserve quiet text fallback. Large tactile controls and visible text feedback; no points for decorative/game taps. Asset is a shared compressed six-scene sheet, not provider imagery.


## Quick Learn
Additional child-facing finite portrait-video section. Use brand mint/lavender surfaces, native unobstructed YouTube player at 9:16, one active player, external metadata/controls and large filter/select/navigation targets. Mobile has scroll snap and a scrollable detail panel; desktop places the portrait player beside learning details. Never intercept YouTube player gestures or cover controls with custom overlays. Loading text stays outside the active player; failure state replaces a failed player view. Optional questions/source notes use disclosures. No social counters or competitive visuals in StudySathi UI.
