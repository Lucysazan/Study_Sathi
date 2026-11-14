import { readFile } from 'node:fs/promises';
import { quickVideoSchema } from '../src/lib/quick-learn/catalog';
async function main() {
  const entries: unknown[] = JSON.parse(await readFile('src/data/quick-learn.json', 'utf8'));
  const ids = new Set<string>();
  let failures = 0;
  for (const entry of entries) {
    const parsed = quickVideoSchema.safeParse(entry);
    if (!parsed.success) {
      console.error(parsed.error.message);
      failures++;
      continue;
    }
    const v = parsed.data;
    if (ids.has(v.videoId)) {
      console.error('Duplicate video:', v.videoId);
      failures++;
    }
    ids.add(v.videoId);
    if (process.argv.includes('--online')) {
      try {
        const url = new URL('https://www.youtube.com/oembed');
        url.searchParams.set('url', v.sourceUrl);
        url.searchParams.set('format', 'json');
        const r = await fetch(url, { signal: AbortSignal.timeout(15000) });
        if (!r.ok) throw Error('HTTP ' + r.status);
        const data = await r.json();
        if (data.title !== v.title || data.author_name !== v.creator) {
          console.error(v.videoId, 'metadata changed; review the entry');
          failures++;
        } else console.log(v.videoId, 'source metadata matches');
      } catch (e) {
        console.error(v.videoId, e instanceof Error ? e.message : String(e));
        failures++;
      }
    }
  }
  console.log(
    `${entries.length} records checked; ${failures} issues. This does not review content or guarantee playback.`,
  );
  if (failures) process.exitCode = 1;
}
void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
