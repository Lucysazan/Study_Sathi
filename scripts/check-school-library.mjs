import fs from 'node:fs';
const catalog = JSON.parse(
  fs.readFileSync(new URL('../src/data/school-library.json', import.meta.url), 'utf8'),
);
if (!process.argv.includes('--online')) {
  console.log(
    `Catalog: ${catalog.books.length} PDFs, ${catalog.playlists.length} playlists. Use --online to check actual PDF response prefixes (no saved file copies).`,
  );
} else {
  let failed = 0;
  for (let index = 0; index < catalog.books.length; index += 2) {
    const checks = await Promise.all(
      catalog.books.slice(index, index + 2).map(async (book) => {
        try {
          const response = await fetch(book.pdfUrl, {
            signal: AbortSignal.timeout(15000),
          });
          const reader = response.body?.getReader();
          const first = await reader?.read();
          await reader?.cancel();
          const prefix = Buffer.from(first?.value || [])
            .subarray(0, 5)
            .toString();
          const ok =
            response.ok &&
            (response.headers.get('content-type') || '').includes('pdf') &&
            prefix === '%PDF-';
          if (!ok) failed++;
          return { id: book.id, status: response.status, ok };
        } catch {
          failed++;
          return { id: book.id, ok: false, status: 'unreachable' };
        }
      }),
    );
    console.log(JSON.stringify(checks));
    if (checks.some((result) => result.status === 403 || result.status === 429)) {
      console.log(
        'Provider restricted requests; stopping. No retries or alternate routes will be used.',
      );
      process.exitCode = 1;
      break;
    }
    if (checks.some((result) => result.status === 'unreachable')) {
      console.log(
        'Provider file request failed; stopping rather than repeating unavailable downloads.',
      );
      process.exitCode = 1;
      break;
    }
  }
  if (failed) process.exitCode = 1;
}
