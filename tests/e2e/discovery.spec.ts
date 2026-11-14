import { test, expect } from '@playwright/test';

test('guided discovery leads from playful home to a saved learning roadmap', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.discovery-door')).toHaveCount(4);
  await page
    .locator('.discovery-spotlight')
    .getByRole('button', { name: 'Flip the switch preview', exact: true })
    .click();
  await expect(page.locator('.discovery-spotlight .preview-status')).toHaveText('You lit it up!');
  await page.locator('.discovery-door').filter({ hasText: 'Follow a trail' }).click();
  await page.locator('.path-card').first().click();
  const roadmap = page.getByRole('navigation', { name: 'Your learning roadmap', exact: true });
  await expect(roadmap.locator('a')).toHaveCount(4);
  await roadmap.locator('a').first().click();
  await expect(page.locator('#trail-step-0')).toBeInViewport();
  await page
    .locator('#trail-step-0')
    .getByRole('button', { name: 'Mark Step Complete', exact: true })
    .click();
  await expect(roadmap.locator('a').first()).toContainText('Done');
  await page.reload();
  await expect(roadmap.locator('a').first()).toContainText('Done');
  await page.goto('/resources');
  await expect(page.locator('.resource-scene').first()).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Choose how to learn' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('storybook resource art and original English and maths games stay inside the site', async ({
  page,
}) => {
  await page.goto('/resources/4');
  await expect(page.locator('.detail-visual')).toHaveCount(0);
  await expect(page.locator('.storybook-art image').first()).toHaveAttribute(
    'href',
    '/images/learning-worlds-v1.webp',
  );
  const preview = page.locator('.resource-adventure');
  await preview.getByRole('button', { name: 'Finish a step preview', exact: true }).click();
  await expect(preview.locator('.preview-status')).toHaveText('1/4 steps');
  await page.goto('/learning-paths/english-adventure');
  await expect(page.locator('.playable-trail a[target="_blank"]')).toHaveCount(0);
  const words = page.getByRole('region', { name: 'Word garden game', exact: true });
  for (const letter of ['T', 'C', 'A'])
    await words.getByRole('button', { name: `Letter ${letter}`, exact: true }).click();
  await expect(words.getByRole('status')).toContainText('Almost');
  await words.getByRole('button', { name: 'Clear tiles', exact: true }).click();
  for (const letter of ['C', 'A', 'T'])
    await words.getByRole('button', { name: `Letter ${letter}`, exact: true }).click();
  await expect(words.getByRole('status')).toContainText('You grew the word cat!');
  await words.getByRole('button', { name: 'Next word', exact: true }).click();
  await expect(words.getByRole('heading', { name: 'It shines in the sky' })).toBeVisible();
  const story = page.getByRole('region', {
    name: 'Mina and the little seed picture book',
    exact: true,
  });
  await expect(story.getByRole('heading', { name: 'A tiny seed' })).toBeVisible();
  await story.getByRole('button', { name: 'Next page', exact: true }).click();
  await expect(story.getByRole('heading', { name: 'A little care' })).toBeVisible();
  await story.getByRole('button', { name: 'Previous page', exact: true }).click();
  await expect(story.getByRole('heading', { name: 'A tiny seed' })).toBeVisible();
  await page
    .locator('#trail-step-0')
    .getByRole('button', { name: 'Mark Step Complete', exact: true })
    .click();
  await page.reload();
  await expect(page.locator('.trail-stop').first()).toContainText('Done');
  await page.goto('/learning-paths/maths-world');
  await expect(page.locator('.playable-trail a[target="_blank"]')).toHaveCount(0);
  const apples = page.getByRole('region', { name: 'Apple counting game', exact: true });
  for (let i = 1; i <= 4; i++)
    await apples.getByRole('button', { name: `Apple ${i}`, exact: true }).click();
  await expect(apples.getByRole('status')).toContainText('too many');
  await apples.getByRole('button', { name: 'Apple 4', exact: true }).click();
  await expect(apples.getByRole('status')).toContainText('Picnic ready!');
  await apples.getByRole('button', { name: 'Next picnic', exact: true }).click();
  await expect(apples.getByRole('heading')).toHaveText('Pick 5 apples for the picnic!');
  const river = page.getByRole('region', { name: 'Number river game', exact: true });
  await river.getByRole('button', { name: 'Hop +2', exact: true }).click();
  await river.getByRole('button', { name: 'Hop +2', exact: true }).click();
  await expect(river.getByRole('button', { name: 'Hop +2', exact: true })).toBeDisabled();
  await river.getByRole('button', { name: 'Hop +1', exact: true }).click();
  await expect(river.getByRole('status')).toContainText('You reached the picnic spot!');
  const pizza = page.locator('#trail-step-2');
  await pizza.getByRole('button', { name: 'Add a slice preview', exact: true }).click();
  await expect(pizza.locator('.preview-status')).toHaveText('3/4 slices');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
