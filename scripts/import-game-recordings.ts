import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import { gameNarrationScripts } from '../src/lib/study/narration';
import type { GameAudioClip } from '../src/lib/study/audio';
async function main() {
  const args = process.argv.slice(2),
    position = args.indexOf('--from'),
    folder = args[position + 1];
  if (position < 0 || !folder)
    throw Error('Use --from "your recording folder". Add --import after reviewing your clips.');
  const root = resolve(folder),
    manifestFile = 'src/data/game-audio.json';
  const manifest: Record<string, GameAudioClip> = JSON.parse(await readFile(manifestFile, 'utf8'));
  let found = 0;
  for (const script of gameNarrationScripts()) {
    const candidates = ['mp3', 'wav']
      .map((extension) => ({ extension, file: join(root, script.id + '.' + extension) }))
      .filter((item) => existsSync(item.file));
    if (candidates.length > 1) throw Error('Keep only one format for ' + script.id);
    const candidate = candidates[0];
    if (!candidate) continue;
    const bytes = await readFile(candidate.file);
    if (bytes.length < 100 || bytes.length > 10 * 1024 * 1024)
      throw Error('Clip must be100 bytes to10 MB: ' + script.id);
    const valid =
      candidate.extension === 'wav'
        ? bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WAVE'
        : bytes.subarray(0, 3).toString() === 'ID3' ||
          (bytes[0] === 255 && ((bytes[1] ?? 0) & 224) === 224);
    if (!valid)
      throw Error('File does not look like valid ' + candidate.extension + ' audio: ' + script.id);
    found++;
    console.log((args.includes('--import') ? 'Importing ' : 'Ready: ') + script.id);
    if (args.includes('--import')) {
      const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 20),
        src = `/audio/games/${script.id}-${hash}.${candidate.extension}`;
      await mkdir('public/audio/games', { recursive: true });
      await writeFile('public' + src, bytes);
      manifest[script.id] = { src, credit: 'Voice: StudySathi team' };
    }
  }
  if (!found)
    throw Error('No matching MP3/WAV files found. See docs/audio/RECORDING_SCRIPT.md for names.');
  if (args.includes('--import'))
    await writeFile(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
  console.log(
    `${found} clips ${args.includes('--import') ? 'imported' : 'checked; dry run only'}.`,
  );
}
main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Import failed.');
  process.exitCode = 1;
});
