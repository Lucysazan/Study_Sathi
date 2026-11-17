import { mkdir, writeFile } from 'node:fs/promises';
import { gameNarrationScripts } from '../src/lib/study/narration';
async function main() {
  const scripts = gameNarrationScripts();
  let text =
    '# StudySathi team voice recording kit\n\nRecord these short scripts in your own voice. No account or API key is needed.\n\n## How to record\n\n1. Use a quiet room and a phone recorder. Speak warmly and clearly, with a short pause between the question and each choice.\n2. Record each script as a separate clip. Use the exact name below, ending in `.mp3` or `.wav`. Renaming a different format does not convert it. If your phone saves M4A, export it as MP3 or WAV first.\n3. One person can read English and another Nepali. Listen back together and correct pronunciation or missing words. Record only voices your team agrees to publish.\n4. Put finished files in a folder, then tell the developer where it is. Partial batches are fine. Never send passwords or API keys.\n\n## Developer import\n\nPreview: `npm.cmd run import:game-audio -- --from "C:\\path\\to\\recordings"`\n\nImport after listening: `npm.cmd run import:game-audio -- --from "C:\\path\\to\\recordings" --import`\n\nThe importer accepts only known script names and MP3/WAV media, copies content-hashed files into public/audio/games, and labels them Voice: StudySathi team. No API requests, subscriptions or third-party generation. Rebuild and publish after import. Text remains available when no recording exists.\n\n## Scripts\n\n26 clips:13 English and13 Nepali. Each game round has a question and three choices. Do not read the filename aloud.\n\n';
  for (const script of scripts)
    text += `### ${script.id}.mp3\n\nLanguage: ${script.language === 'ne' ? 'Nepali' : 'English'}\n\n${script.text}\n\n`;
  await mkdir('docs/audio', { recursive: true });
  await writeFile('docs/audio/RECORDING_SCRIPT.md', text);
  console.log('Prepared26 scripts in docs/audio/RECORDING_SCRIPT.md. No audio has been recorded.');
}
main().catch(() => {
  console.error('Could not prepare recording kit.');
  process.exitCode = 1;
});
