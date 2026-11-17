# Game-only language and ElevenLabs narration

Language controls live inside `/play/[id]`. A fresh game starts in English; no global/localStorage preference is read or written. Authored Nepali translates the native mission/shop text and page title. Third-party simulations retain provider language, and optional assessment/hint content remains in its authored language. Header, Quick Learn and resource pages have no language or narration controls.

## Current audio status

**Zero generated recordings.** ElevenLabs credentials were not configured at implementation time. Listen displays a brief not-ready message until a recording exists. Browser speech synthesis has been removed from these controls. Real voice quality, Nepali pronunciation and actual audio playback are not verified yet.

The efficient free-tier approach is to prepare the fixed narration once, then serve MP3s from StudySathi. Replaying never calls ElevenLabs or spends credits. Only original game scripts go to the provider during preparation; no visitor text, answers or identifiers are submitted. No runtime endpoint, SDK, new dependency or deployed API key.

## Prepare recordings

1. Choose an API-accessible voice in your own ElevenLabs account. Free-tier Voice Library access may differ from the website; use a voice available to your API account.
2. Set `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` in ignored `.env.local`. Never use `NEXT_PUBLIC_`, paste keys into chat, or commit them.
3. `npm.cmd run prepare:game-audio` lists the plan without spending credits. Current set:26 scripts,3656 Unicode code points before provider metering; actual credits are determined by ElevenLabs.
4. `npm.cmd run prepare:game-audio -- --generate` generates missing clips using `eleven_v3`, which supports English/Nepali. Default per-run cap9000 characters. Optionally select `--game password` or `--language ne`. Game keys:password,recycle,reading,study-habits,budget.
5. Listen to every recording and check pronunciation/content. Commit `public/audio/games/*.mp3` and `src/data/game-audio.json`, rebuild and release.

The script uses Node fetch and MP3 44.1kHz/128kbps, stores source/voice/model-derived filenames, reuses existing files, checkpoints after every clip and never automatically retries chargeable requests. A failure can still consume provider credits; inspect account history before retrying. The local cap is per-run, not a global account spending limit.

Free-plan narration is for non-commercial use with attribution, displayed next to available playback. This project is currently a free non-commercial student project. Recheck licensing before changing use. Do not claim all voices or unlimited generation are free.

Official references checked2026-11-17:
- https://elevenlabs.io/docs/api-reference/text-to-speech/convert
- https://elevenlabs.io/docs/overview/models
- https://elevenlabs.io/text-to-speech

## Verification

Normal build, lint, typecheck and184 unit tests pass. Focused normal-build desktop1280/mobile360 browser checks verify game-local translation, client navigation to a different game resetting English, old global setting ignored, unchanged resource/home/header, missing-recording feedback and zero runtime generation requests. Actual ElevenLabs generation/playback awaits credentials and recording review.
