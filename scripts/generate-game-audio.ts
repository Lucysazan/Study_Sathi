/** Maintainer-only, bounded generation of fixed narration. No live user text or public endpoint. */
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import type { GameAudioClip } from '../src/lib/study/audio';
import { gameNarrationScripts } from '../src/lib/study/narration';
async function main() {
  for (const file of ['.env.local', '.env']) if (existsSync(file)) process.loadEnvFile(file);
  const args = process.argv.slice(2);
  const option = (name: string) => {
    const i = args.indexOf(name);
    return i < 0 ? undefined : args[i + 1];
  };
  const game = option('--game'),
    language = option('--language');
  const max = Number(option('--max-characters') ?? 9000);
  if (!Number.isInteger(max) || max < 1 || max > 100000)
    throw Error('Set a whole --max-characters between 1 and 100000.');
  const scripts = gameNarrationScripts().filter(
    (s) => (!game || s.game === game) && (!language || s.language === language),
  );
  if (!scripts.length)
    throw Error(
      'No matching scripts. Use --game password|recycle|reading|study-habits|budget and --language en|ne.',
    );
  const voice = process.env.ELEVENLABS_VOICE_ID,
    model = process.env.ELEVENLABS_MODEL_ID || 'eleven_v3';
  if (model !== 'eleven_v3')
    throw Error('This bilingual catalogue uses eleven_v3, which supports Nepali.');
  const manifestFile = 'src/data/game-audio.json';
  const manifest: Record<string, GameAudioClip> = JSON.parse(
    (await readFile(manifestFile, 'utf8')).replace(/^\uFEFF/, ''),
  );
  const jobs = scripts
    .map((s) => {
      const hash = createHash('sha256')
        .update(JSON.stringify({ text: s.text, language: s.language, voice, model }))
        .digest('hex')
        .slice(0, 20);
      return { ...s, path: `/audio/games/${s.id}-${hash}.mp3` };
    })
    .filter((s) => !existsSync('public' + s.path));
  const characters = jobs.reduce((n, s) => n + [...s.text].length, 0);
  console.log(
    JSON.stringify({
      scripts: scripts.length,
      missingClips: jobs.length,
      characters,
      model,
      dryRun: !args.includes('--generate'),
    }),
  );
  if (!args.includes('--generate')) return;
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key || !voice || !/^[a-zA-Z0-9_-]{10,100}$/.test(voice))
    throw Error(
      'Configure ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID in .env.local. Never use NEXT_PUBLIC_ variables.',
    );
  if (characters > max)
    throw Error(
      'Generation exceeds this run’s character cap. Select a game/language or raise --max-characters after checking your credits.',
    );
  // Generation never auto-retries chargeable requests. Already completed clips survive a partial failure.
  await mkdir('public/audio/games', { recursive: true });
  for (const script of scripts) {
    const hash = createHash('sha256')
      .update(JSON.stringify({ text: script.text, language: script.language, voice, model }))
      .digest('hex')
      .slice(0, 20);
    const path = `/audio/games/${script.id}-${hash}.mp3`;
    if (!existsSync('public' + path)) {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}?output_format=mp3_44100_128`,
        {
          method: 'POST',
          headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: script.text,
            model_id: model,
            language_code: script.language,
          }),
          signal: AbortSignal.timeout(90000),
        },
      );
      if (!response.ok)
        throw Error(
          `ElevenLabs returned HTTP ${response.status}; generation stopped. Check your account credits, selected voice and key permissions.`,
        );
      if (!response.headers.get('content-type')?.includes('audio/'))
        throw Error('Provider did not return audio. Generation stopped.');
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length < 100) throw Error('Audio response was empty.');
      await writeFile('public' + path, bytes);
    }
    manifest[script.id] = {
      src: path,
      credit: 'Voice by ElevenLabs',
      creditUrl: 'https://elevenlabs.io/text-to-speech',
    };
    await writeFile(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
    console.log('Prepared ' + script.id);
  }
  console.log(
    'Review the recordings, then commit the audio and manifest. Free-plan attribution is displayed beside playback.',
  );
}
main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Audio generation stopped.');
  process.exitCode = 1;
});
