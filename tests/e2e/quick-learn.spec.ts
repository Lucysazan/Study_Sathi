import { test, expect } from '@playwright/test';
import entries from '../../src/data/quick-learn.json';
const approved = entries.filter((v) => v.review.status === 'approved');
const stub = `window.YT={Player:class{constructor(target,options){this.options=options;this.frame=document.createElement('iframe');this.frame.src='https://www.youtube-nocookie.com/embed/'+options.videoId;this.frame.dataset.videoId=options.videoId;this.frame.dataset.controls=String(options.playerVars.controls);target.replaceWith(this.frame);this.listener=e=>{if(e.detail.id===options.videoId){if(e.detail.error)options.events.onError({data:100});else options.events.onStateChange({data:e.detail.state})}};window.addEventListener('quick-fixture-event',this.listener);setTimeout(()=>options.events.onReady({target:this}),5)}getIframe(){return this.frame}pauseVideo(){document.documentElement.dataset.paused=(document.documentElement.dataset.paused||'')+this.options.videoId+','}destroy(){window.removeEventListener('quick-fixture-event',this.listener);this.frame.remove()}}};window.onYouTubeIframeAPIReady?.();`;
test.beforeEach(async ({ page }) => {
  await page.route('https://www.youtube.com/iframe_api', (route) =>
    route.fulfill({ contentType: 'application/javascript', body: stub }),
  );
  await page.route('https://www.youtube-nocookie.com/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<button>Play video</button>' }),
  );
});

test('Quick Learn filters keep spoken language separate and show only the approved catalogue', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Explore Quick Learn', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Quick Learn');
  await expect(page.locator('.quick-count')).toContainText(`${approved.length} selected`);
  await expect(page.locator('.quick-player-mount iframe')).toHaveCount(1);
  await page.getByRole('combobox', { name: 'Spoken language', exact: true }).selectOption('ne');
  await expect(page.locator('.quick-count')).toContainText(
    `${approved.filter((v) => v.language === 'ne').length} selected`,
  );
  await page.getByRole('combobox', { name: 'Subject', exact: true }).selectOption('English');
  await expect(
    page.getByRole('heading', { name: 'No reviewed shorts match yet.', exact: true }),
  ).toBeVisible();
  await expect(page.locator('.quick-player-mount iframe')).toHaveCount(0);
  await page.getByRole('button', { name: 'Show all reviewed shorts', exact: true }).click();
  await page.getByRole('combobox', { name: 'Subject', exact: true }).selectOption('Technology');
  await page.getByRole('combobox', { name: 'Suggested age', exact: true }).selectOption('10-12');
  await expect(
    page.getByRole('heading', { name: 'No reviewed shorts match yet.', exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('Quick Learn pauses old players, saves questions and bookmarks, recaps five and handles unavailable videos', async ({
  page,
}) => {
  await page.goto('/quick-learn');
  const frame = page.locator('.quick-player-mount iframe');
  await expect(frame).toHaveCount(1);
  await expect(frame).toHaveAttribute('data-controls', '1');
  const first = approved[0]!;
  const card = page.locator('.quick-card').first();
  await card.getByRole('button', { name: 'Save ' + first.title, exact: true }).click();
  await card.getByText('Try one question (optional)', { exact: true }).click();
  await card.getByRole('radio').nth(first.question.answer).check();
  await card.getByRole('button', { name: 'Check my answer', exact: true }).click();
  await expect(card.getByRole('status')).toContainText('You got it!');
  await page.evaluate(
    (id) =>
      window.dispatchEvent(new CustomEvent('quick-fixture-event', { detail: { id, state: 0 } })),
    first.videoId,
  );
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('studysathi-progress')))
    .toContain('quick-finished-' + first.videoId);
  await page.evaluate(
    (id) =>
      window.dispatchEvent(new CustomEvent('quick-fixture-event', { detail: { id, state: 1 } })),
    first.videoId,
  );
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(frame).toHaveAttribute('data-video-id', approved[1]!.videoId);
  await expect(page.locator('html')).toHaveAttribute('data-paused', new RegExp(first.videoId));
  await expect(frame).toHaveCount(1);
  await page.evaluate(
    (id) =>
      window.dispatchEvent(new CustomEvent('quick-fixture-event', { detail: { id, error: true } })),
    approved[1]!.videoId,
  );
  await expect(page.getByText('This video could not load.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Retry video', exact: true }).click();
  await expect(frame).toHaveCount(1);
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(frame).toHaveAttribute('data-video-id', approved[i + 2]!.videoId);
  }
  await page.getByRole('button', { name: 'Show recap', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Your little learning recap', exact: true }),
  ).toBeInViewport();
  await expect(frame).toHaveCount(0);
  await expect(page.locator('.quick-recap')).toContainText('1 questions tried');
  await page.getByRole('button', { name: 'Take a break', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'A little pause is part of learning.', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Explore another five', exact: true }).click();
  await expect(frame).toHaveAttribute('data-video-id', approved[5]!.videoId);
  await page.goto('/saved');
  await expect(
    page.getByRole('heading', { name: 'Your saved Quick Learn shorts', exact: true }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Watch this short in Quick Learn', exact: true }).click();
  await expect(frame).toHaveAttribute('data-video-id', first.videoId);
  await page.reload();
  await expect(
    page
      .locator('.quick-card')
      .first()
      .getByRole('button', { name: 'Unsave ' + first.title, exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(
    page
      .locator('.quick-card')
      .first()
      .getByRole('link', { name: /Learn more:/ }),
  ).toHaveAttribute('href', first.related.href);
  await expect(
    page
      .locator('.quick-card')
      .first()
      .getByRole('link', { name: /Watch on YouTube/ }),
  ).toHaveAttribute('href', first.sourceUrl);
  const feed = page.locator('.quick-feed');
  await feed.evaluate((el) => el.scrollTo({ top: el.clientHeight, behavior: 'instant' }));
  await expect(frame).toHaveAttribute('data-video-id', approved[1]!.videoId);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('Quick Learn gives a fallback when the player script cannot load', async ({ page }) => {
  await page.route('https://www.youtube.com/iframe_api', (route) => route.abort());
  await page.goto('/quick-learn');
  await expect(page.getByText('This video could not load.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Retry video', exact: true })).toBeVisible();
  await expect(
    page
      .locator('.quick-card')
      .first()
      .getByRole('link', { name: /Watch on YouTube/ }),
  ).toHaveAttribute('href', approved[0]!.sourceUrl);
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('.quick-card').nth(1).getByRole('heading')).toHaveText(
    approved[1]!.title,
  );
});

test('Quick Learn offers retry for prolonged buffering', async ({ page }) => {
  await page.clock.install();
  await page.goto('/quick-learn');
  await page.clock.runFor(20);
  await expect(page.locator('.quick-player-mount iframe')).toHaveCount(1);
  await page.evaluate(
    (id) =>
      window.dispatchEvent(new CustomEvent('quick-fixture-event', { detail: { id, state: 3 } })),
    approved[0]!.videoId,
  );
  await expect(page.getByText('Buffering YouTube...', { exact: true })).toBeVisible();
  await page.clock.fastForward(21000);
  await expect(page.getByText('This video could not load.', { exact: true })).toBeVisible();
  await page.evaluate(
    (id) =>
      window.dispatchEvent(new CustomEvent('quick-fixture-event', { detail: { id, state: 2 } })),
    approved[0]!.videoId,
  );
  await expect(page.getByText('This video could not load.', { exact: true })).toBeVisible();
});
