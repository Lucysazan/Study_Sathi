# Quick Learn

Additional public route: `/quick-learn`. Navigation/footer and an original homepage preview lead here. Existing school library, portals, original activities and academic pilot remain available.

## Catalogue and review

`src/data/quick-learn.json` is an explicit editorial list. At initial release it contains **12 entries: 8 English, 3 Nepali and 1 visual maths demonstration with no instructional narration**. All eleven requested subject categories are represented. Language describes the instructional/original audio, separate from subject; the visual entry is not counted as English speech. YouTube may offer dubbed tracks independently of our label.

Each record has exact source Shorts URL/video ID, source title/creator, spoken-language label, subject, suggested ages, duration, original learning objective/question/options/explanation, related local route, review status/date/reviewer/basis/limitations. `lib/quick-learn/catalog.ts` validates identities, age bounds, question options, evidence and allowed related-link forms. Only schema-valid `approved` entries reach the public viewer/Saved page. No channel imports, search API, trending/general Shorts feed, automatic publication or API key is used by the product.

Review on 2026-11-14: public source metadata and actual privacy-enhanced player playback sampled near the beginning, middle and end; visible text/captions inspected, basic objectives/questions checked against the content. All 12 title/creator records also match the live official oEmbed response. **This is assisted editorial selection, not full audiovisual, teacher or native-speaker approval.** These limits appear in the catalogue and family/selection disclosures. Suggested ages are our guidance, not provider certification.

Source observations include BBC Learning English beside/besides (17s); SciShow Kids lightning (47s), elephant seal (52s), salt/ice (54s); Raspberry Pi Foundation passwords (68s), privacy (31s); NASA eclipse (35s); Art for Kids Hub crayon box (29s); Study Guidance Nepal respiration (60s); MR.TEACHER Nepali spelling (15s); Lovely Kids Nepal illustrated money (55s); Justice Shepard visual fraction addition (12s).

Candidates not published: Madan Sir `wlrDaDPHwCE` (prominent personal-contact/class promotion); Bigyan Neupane `sjxgIcYt61k` (insufficient explanatory evidence in reviewed samples); Ai Science Lab `L8joWSi3GpI` (spoken-language evidence unresolved); Math Tricks `hg2Y48_8-YI` (audio classification unresolved); Red Ted Art `ZO4c0F3HD8c` (craft overview, narration unclear); BYJU'S `tGqPl-wfueE` (not advanced beyond initial metadata check); geography `rMLUeD-p3wU` and safety `TfjEnWdjz3M` (language/source review incomplete). These are not silently treated as approved.

To expand: verify an individual real Short, inspect its content/language/age suitability, verify embedding, write an original question and choose a real related route or reviewed YouTube playlist. Add it as pending until checks are documented; approve deliberately. Keep a pending/rejected entry out of the public selection. No fabricated sample URLs belong in the production catalogue.

Commands from repo root:

- `npm run check:quick-learn`: schema/duplicate checks.
- `npm run check:quick-learn -- --online`: official oEmbed title/creator availability check. This cannot approve content or guarantee playback. Review changed/removed videos and set pending/rejected as appropriate. Recheck periodically; metadata, recommendations and availability can change.

## Player and session

Official YouTube IFrame API, `youtube-nocookie.com`, actual site origin, native controls/branding, inline mobile playback, no crop/zoom or custom controls over the player. Portrait frame preserves provider letterboxing/proportions. Only the active card mounts a player. Cleanup pauses then destroys it when changing card/filter/route or taking a break; visibility/pagehide and less-than-half-visible checks pause it. Autoplay is off: tap the native play control. No media downloads or rehosting.

Five metadata cards plus a recap, native vertical scroll snap, keyboard arrows on the feed, labelled Previous/Next controls and internal detail-panel scrolling. Swipe outside YouTube's own gesture area; our code never intercepts gestures inside its controls. After the batch, no player remains mounted. Take a break removes the feed; Explore another five starts a new explicit batch (the final batch may contain fewer). No automatic endless advance.

Questions are optional, local practice with explanations. Recap counts videos started and questions tried, never claims all were watched or mastered. API end events and correct practice answers use existing private-library progress keys `quick-finished-ID`/`quick-check-ID`; they are self-reported, not trusted assessment results. No XP, leaderboard, badge, competitive streak, comments, followers or custom popularity counters are added. YouTube's own player UI can display its own social features; we do not modify or hide native UI.

Loading has a status message; API/script timeout or video error presents retry plus existing Watch on YouTube/Next choices. This does not recover a removed, region-restricted or connection-blocked video.

## Saves and privacy

`quick-ID` bookmark keys reuse existing guest/account storage. `/saved` displays these and retains them during guest resource-pruning. Guest state is browser-local; student state follows existing private sync/merge/account boundaries. No new Firestore collections, security rules, indexes, user data exposure or production seed is needed. Source URLs/origin are sent to YouTube for playback; learner names, notes and answers are not. No advertising or analytics SDK added.

Owner explicitly confirmed **already tagged as child-directed** in this conversation on 2026-11-14. This is owner attestation; the agent did not access Google's private designation setting. If the domain changes, the owner must confirm the new domain's designation before embedding there. Privacy-enhanced embeds do not replace this requirement.

Official policies checked:

- https://support.google.com/youtube/answer/171780 (privacy-enhanced embeds and required designation)
- https://support.google.com/policies/answer/9664901 (owner designation tools)
- https://developers.google.com/youtube/terms/developer-policies (child-directed clients, no API write actions)
- https://developers.google.com/youtube/terms/developer-policies-guide (native controls, ads, source identity)
- https://developers.google.com/youtube/iframe_api_reference (player lifecycle/errors)

We do not promise control over YouTube ads, links or recommendations. Families get a clear disclosure and YouTube Terms/Google Privacy links. Our fixed selection is not an endorsement or partnership.

## Validation and remaining limits

Initial 184 unit tests, lint/typecheck and normal production build pass. Browser suite covers filters, one-player lifecycle/pause, save/refresh/global Saved, questions/progress, recap/break/new batch, retry/unavailable player/script failure, private account sync and no-XP behavior. Initial test selector failures were nested-label/ambiguous-status locators, corrected to accessible combobox and scoped question status. Final focused run: 14 production-build desktop/mobile cases pass, including buffering timeout and persistent failure/retry, private account sync/no-XP and existing navigation/guest-merge regression. Build now fails malformed/duplicate catalogue records; public filtering still excludes non-approved entries.

Real local YouTube English and Nepali playback verified, plus source-language switching and old-player pause events. Nine unique related routes return HTTP 200. Desktop/mobile screenshots inspected without outer overflow/page errors. Rapid-return probes also exposed intermittent third-party buffering; running-only/ready-guarded pause handling and a 20-second persistent buffering fallback were added. A failed player is destroyed, not left playing behind the fallback. Native touch-device and assistive-technology acceptance, full audiovisual/native-speaker/teacher review and broader catalogue expansion remain outstanding. No full prior LMS suite rerun is implied by the focused checks.


Production evidence: main9f9ea8a deployed; anonymous live360px test passes actual English/Nepali playback, one-player lifecycle, practice feedback, guest Saved/deep link and five-card recap/break with no page errors/overflow. Signed-in private sync/no-XP is verified against isolated local emulators, not live account fixtures.
