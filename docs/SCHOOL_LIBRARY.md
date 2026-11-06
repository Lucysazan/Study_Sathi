# Class-wise school library

2026-11-06: user clarified the main requirement is OLE-style class/subject organization with in-site government PDFs and teaching playlists across classes, not a Grade 9-only original-content pilot. This document supersedes the narrow public-library scope in ACADEMIC_PLAN.md; original practice remains available separately.

## What is implemented

- `/study`: twelve class tiles with actual resource counts.
- `/study/[grade]`: subjects with indexed materials; bilingual subject labels and original StudySathi icon cards.
- `/study/[grade]/[subject]`: separate Read/Watch sections with edition/language/provider labels.
- `/read/[bookId]`: provider-hosted native PDF viewer, page jump and original-file open/save option. Mobile browsers without inline support use the original link. Cross-origin links do not force browser downloads; Save uses the browser's PDF controls.
- `/watch/[playlistId]`: privacy-enhanced YouTube player configured with the entire provider playlist, searchable indexed lessons, selected-video switching, provider fallback and credits. No video download/rehosting.
- Homepage emphasizes class selection. Existing Grade 9 practice URLs, student result saving, parent views, course portals and source-manager controls remain functional.

## Catalog and provenance

`src/data/school-library.json` is a dated, version-controlled metadata snapshot. It contains 137 official-host PDF references and 56 NCED Virtual playlists with 3,270 distinct indexed video IDs. It is not a full-syllabus claim or a runtime provider API.

Textbook metadata was collected from public CDC textbook listing rows at https://moecdc.gov.np/category/textbook--g-/ and government-indexed English Grade 11/12 PDF records. All 137 file URLs answered successfully with PDF content type during link verification. No PDF body is stored in the repository. Initial listing requests returned HTTP 403 and those pages were left unavailable. A later normal request to the same URL returned 200; the remaining listings were then read sequentially and their PDF headers checked, without changing identity, credentials or bypassing access controls. Coverage by subject and edition remains explicit.

NCED playlist discovery used its public channel/playlist pages at https://www.youtube.com/@NCEDVirtual/playlists and public playlist search. Each included playlist's owner was checked as channel UCrTKRd1F1Ql_61JIEb5BOvA. Explicitly OLD-labeled playlists were excluded. Only title, video ID, displayed duration, public source links and date were retained; raw page/player/tracking data is ignored local discovery material, not committed.

The searchable lesson index can stop at the public page's first 100 entries. The supported embedded player receives the playlist ID and can navigate the full provider playlist independently. No private/undocumented YouTube API, key, scraping proxy or copied media is used at runtime. Provider availability, playback, removals and current curriculum alignment are not guaranteed by a snapshot.

Source files stay on government servers; videos stay on YouTube. This is direct display/linking of public provider files in response to the user's explicit request, not permission to mirror, modify or redistribute content. No OLE material/artwork/partnership is claimed. OLE's organization is a reference only. Original practice still awaits teacher review.

## Verification and maintenance

- Pure tests validate IDs, mappings, official PDF hosts, class coverage and safe embed URLs.
- Browser tests exercise class/subject navigation, PDF src and page controls, original links, deferred video loading, selecting lessons, search, invalid-grade UI and phone overflow. External requests are blocked in these deterministic cases; this is not proof all videos play or all PDFs render on all devices.
- Actual external checks separately verify response headers and a representative NCED player/thumbnail. A full uninterrupted playback audit is not claimed.
- `node scripts/check-school-library.mjs` prints the catalog count. Add `--online` for bounded official PDF HEAD checks, stopping on 403/429 without bypassing restrictions. It does not download file bodies, change source data or write Firebase records.
- Add new records only after checking title, grade, subject, provider, edition and allowed display mode. Recheck the browser experience and source credits. Do not convert a generic channel link into an invented subject playlist.

No Firebase schema/rules/index changes or new dependencies/secrets are required for this public expansion. Legacy admin textbook configuration affects the original practice reader, independently of the static public source index. A future unified catalog editor may combine them after a separate reviewed migration.


Regression notes: legacy custom textbook configuration now streams at request time inside Suspense, and admin mutations refresh only the admin form. Library destination links disable partial prefetch to avoid stale partial navigation responses. The mobile test explicitly waits for /study before selecting a class, preventing a race with same-named class links retained from the homepage. Global partialPrefetching remains enabled; an experimental toggle was reverted after identifying the test race.

## 2026-11-06 - Study discovery and chapter companions
- Added public /study search across all indexed book and video titles, with class, subject, material and language filters; edition text is searchable. Results cap at 30 and link to the selected video.
- Reader page jumps and selected playlist lessons persist locally with a continue link and explicit clear control. These are reading/selection preferences, not verified viewing completion or synced academic progress. Native PDF scrolling and YouTube playback timestamps cannot be observed by this implementation.
- Added English/Nepali study instructions, heading/breadcrumb/subject navigation and Read/Watch headings. This is a limited study-interface translation, not full-site translation; native-speaker review remains pending.
- Existing three original Grade 9 Maths topic pages now connect subject textbooks, title-matched videos and existing graded practice/revision. Exact official chapter/page mappings are unverified; no new all-grade chapter coverage is claimed.
- Original topic explanations/examples can be saved as small offline text files; no provider media caching, service worker or offline grading. A visual Sets activity offers immediate local feedback without points or persistence.
- Reader/player resource-help panels copy source details for sharing. They do not submit/store reports, and caption/sign-language support remains provider-dependent. Existing editions/check dates/source links remain visible.
- No dependencies, credentials, database rules/schema, production fixtures or OLE content added. Human teacher review, source permissions, native-speaker review and full assistive-technology/real-device acceptance remain external work.
