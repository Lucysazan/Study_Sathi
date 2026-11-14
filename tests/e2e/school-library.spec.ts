import { test, expect } from '@playwright/test';

test('school library browses classes, reads a government PDF and selects full-playlist lessons', async ({
  page,
}, testInfo) => {
  page.on('pageerror', (error) => console.log(`Library browser error: ${error.message}`));
  // UI regression is deterministic: external playback/files are checked separately, not downloaded by tests.
  await page.route('**/*', (route) => {
    const host = new URL(route.request().url()).hostname;
    return ['localhost', '127.0.0.1'].includes(host) ? route.continue() : route.abort();
  });
  await page.goto('/study');
  await expect(page.locator('.grade-tile')).toHaveCount(12);
  await page.getByRole('link', { name: 'Choose Grade 6', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Class 6');
  await page.screenshot({ path: testInfo.outputPath('class-six-subjects.png'), fullPage: true });
  await page.getByRole('link', { name: 'Study Mathematics', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Read textbooks', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Read textbook', exact: true }).first().click();
  await expect(page.locator('.library-pdf')).toHaveAttribute(
    'src',
    /^https:\/\/giwmscdnone.gov.np\/.*\.pdf#page=1$/,
  );
  await expect(page.getByRole('heading', { name: 'PDF not loading?', exact: true })).toHaveCount(0);
  await page.getByLabel('PDF page', { exact: true }).fill('4');
  await page.getByRole('button', { name: 'Go to page', exact: true }).click();
  await expect(page.locator('.library-pdf')).toHaveAttribute('src', /#page=4$/);
  await expect(
    page.getByRole('link', { name: 'Download / open PDF', exact: true }),
  ).toHaveAttribute('href', /^https:\/\/giwmscdnone.gov.np\//);
  await page.goto('/study/6/mathematics');
  await page.getByRole('link', { name: 'Watch playlist', exact: true }).first().click();
  await expect(page.locator('.video-stage iframe')).toHaveCount(0);
  await page.getByRole('button', { name: 'Load video player', exact: true }).click();
  await expect(page.locator('.video-stage iframe')).toHaveAttribute(
    'src',
    /^https:\/\/www.youtube-nocookie.com\/embed\/[^?]+\?list=PL/,
  );
  const firstSrc = await page.locator('.video-stage iframe').getAttribute('src');
  await page.locator('.playlist-lessons button').nth(1).click();
  await expect(page.locator('.video-stage iframe')).not.toHaveAttribute('src', firstSrc || '');
  const nextSrc = await page.locator('.video-stage iframe').getAttribute('src');
  expect(new URL(nextSrc || '').searchParams.get('list')).toBe(
    new URL(firstSrc || '').searchParams.get('list'),
  );
  await page
    .getByLabel('Search lesson or chapter title', { exact: true })
    .fill('no-such-lesson-xyz');
  await expect(page.locator('.playlist-lessons button')).toHaveCount(0);
  await expect(
    page.getByText('No matching lesson. Try another word or clear the search.', { exact: true }),
  ).toBeVisible();
  await page.getByLabel('Search lesson or chapter title', { exact: true }).fill('');
  expect(await page.locator('.playlist-lessons button').count()).toBeGreaterThan(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const grade of [1, 3, 8, 10, 11, 12]) {
    await page.goto(`/study/${grade}`);
    await expect(page.locator('.subject-tile').first()).toBeVisible();
  }
  await page.goto('/study/13');
  await expect(
    page.getByRole('heading', { name: "Let's find another way", exact: true }),
  ).toBeVisible();
});
