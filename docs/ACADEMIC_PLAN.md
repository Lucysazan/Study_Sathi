# Academic learning pivot

User requested the existing site move from resource discovery toward academic learning on 2026-11-06. Reuse accounts, hosting, course tools and review infrastructure; pause additional nonacademic features. Do not claim the entire plan is delivered.

## Implemented pilot

- Public `/study` → `/study/9` → `/study/9/mathematics` → topic routes.
- Three original English topic units: Sets, Real numbers, Algebra foundations. Six skills, explanations, worked examples, 12 check questions and 12 different follow-up questions.
- Server grading; feedback and skill-linked revision suggestions. No AI provider or content API required. Full scores mean success on that small set, not mastery.
- Visit-only guest feedback. Students save latest check and follow-up summaries per topic; no XP or changes to course completion. One-day review is a provisional transparent rule.
- Existing Firebase student sessions and privateData storage. Matching expected UID prevents saving an old page's result into a switched account. Linked-parent summaries use current parent ownership guards.
- Administrator source manager at `/admin/academic`: approved official HTTPS hosts, source/edition/permission record, publish/withdraw, audit and cache invalidation.
- Lazy provider-hosted PDF iframe with original link fallback. No proxy, copied PDFs, automatic scraping or unverified source deployment. Reader activates only after administrator verification.
- Homepage prioritizes academic study; other tools remain accessible. Public sources and About pages state the pilot's limits.

## Content/source status

Verified catalog reference: https://lib.moecdc.gov.np/catalog/opac_css/index.php?id=13786&lvl=notice_display identifies CDC's Mathematics Grade 9 English Translation, 2022. It does not establish the current edition, permission to embed, or our topic-to-page mapping.

Old PDF URL https://moecdc.gov.np/storage/gallery/1708861009.pdf could not be verified in the browsing tool. E-library lookup timed out. Neither was imported or represented as working.

The source catalog is metadata only; no actual PDF is enabled by default. Teacher review, current curriculum verification and page mapping remain open. Original topic ordering is not claimed to be CDC chapter numbering.

OLE contact: https://olenepal.org/ole-contact-us/ (info@olenepal.org). No supported public API or key-issuance flow was verified. No message has been sent. Ask for API/feed documentation, grade coverage, metadata reuse, embed/hosting permissions, attribution and limits. Do not use private site endpoints as an API or copy the library. E-Paath and E-Pustakalaya have different content/terms; verify each item.

## Remaining phases and acceptance

1. Teacher checks original examples/answers and confirms a current Grade 9 textbook/curriculum. Record exact outcomes and page ranges; correct pilot content as needed.
2. Obtain a working official PDF and its allowed display terms; admin connects it. Test actual file on phone/desktop, including download/blank-reader fallback. Approved-source fixtures in automated tests do not establish real permissions.
3. Extend existing creator/review tools with validated academic subject/chapter/skill authoring. Current pilot content is code-reviewed data, not yet a general curriculum CMS. Version questions so later changes do not misrepresent earlier attempts.
4. Expand to the complete reviewed subject, then Science and Grade 10. Grades 11-12 need their own subject/stream scope. Do not publish empty grade tiles.
5. Evaluate recommendation usefulness using new questions and teacher/learner observation. Current fixed follow-up sets are reusable practice, not adaptive testing or a validated diagnostic.
6. Conduct real-device, screen-reader, language and learner pilot acceptance. No measured-impact claim before evaluation.

## Data and access

`users/{uid}/privateData/academic.results` holds bounded latest results keyed by topic and phase. Server verifies sessions, derives scores from trusted question definitions, and writes transactionally. GET sends only current student's data with private/no-store. Parent reads follow existing role + parentUid verification. Existing default-deny Firestore rules block direct client academic reads/writes; no rules or index deployment is needed.

`academicSources/grade9-mathematics` is administered only through guarded server actions. Atomic audit records accompany publish/withdraw. Public access is through a cached sanitized server reader, never arbitrary remote fetch. PDF navigation can contact the source provider; no student results are sent to it.

No new packages, API secrets, environments, Firebase projects or production fixture data are required. Existing untracked admin helper and all credentials remain excluded.
