# Browser acceptance queue

Status: pending. Source checks and passing automated tests do not establish browser or assistive-technology acceptance. Use dedicated test accounts and draft content; avoid modifying real learners' accounts.

## Keyboard and forms

- At desktop and 360px, Tab from the address bar. The skip link must become visible and move focus to main content.
- Open the mobile navigation, Tab through links, then press Escape. The menu closes and focus returns to its toggle. Closed links must not remain in the tab order. Navigation must also close after following a link.
- Submit invalid profile and parent forms. Each field must have a readable error; a screen reader must associate it with that field. Submission status must be announced and the submit button must prevent repeated submission while pending.
- Check all lesson controls, quiz choices, sorting selects, budget inputs and completion buttons without a mouse. Feedback must use text and not rely on color.
- At 200% zoom and a 360px viewport, check long nicknames/course titles, forms, toolbar, tables and action rows for clipping or inaccessible controls.
- Inspect text and focus-ring contrast and test reduced-motion preference. Do not mark the accessibility task complete from a source review alone.

## Recovery and empty states

- For each portal, simulate a failed data request using development tools. Its error boundary must offer retry and a link to the correct dashboard; retry must fetch again without exposing internal errors.
- Confirm loading messages during slow requests and that navigation remains usable. Layout-level failures may reach the root error screen.
- Open missing course, lesson, child-progress and draft records. Confirm a useful unavailable screen and return link. A parent's request for an unrelated learner must expose no learner details.
- Check empty catalog/filter results, no enrollments, exhausted discovery candidates, no linked learners, no badges, no consented leaderboard entries and empty/sparse analytics.
- Test offline form submission/reconnect feedback; do not assume an unsaved edit survived a failed request.

## Existing end-to-end flows

- Parent creates a child; student signs in, updates profile and completes a lesson; parent sees progress and resets access. Verify old sessions are revoked.
- Creator edits metadata and stacked activities, confirms autosave, submits for review; admin returns changes and publishes; student enrolls and resumes the published course.
- Replay completion and quiz submissions: progress and XP must not duplicate. Check parent consent, leaderboard withdrawal and both time windows.
- Verify private resource sync/guest merge across sessions, logout isolation and ownership. Private notes must never appear in parent progress or analytics.

Record browser/version, viewport, test account role, result and reproducible failures in SESSION_LOG. Production deployment and live Firebase checks are separate roadmap tasks.
