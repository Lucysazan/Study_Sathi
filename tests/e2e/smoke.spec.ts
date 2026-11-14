import { randomUUID } from 'node:crypto';
import { initializeApp, deleteApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { test as base, expect, type Page } from '@playwright/test';

// No browser request may reach a real Firebase project or external media provider.
const test = base.extend({
  context: async ({ context }, runFixture) => {
    await context.route('**/*', (route) => {
      const url = new URL(route.request().url());
      return ['127.0.0.1', 'localhost'].includes(url.hostname) ? route.continue() : route.abort();
    });
    await runFixture(context);
  },
});
const password = 'Smoke-only-password-42';
async function blockExternal(context: import('@playwright/test').BrowserContext) {
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    return ['127.0.0.1', 'localhost'].includes(url.hostname) ? route.continue() : route.abort();
  });
}
const roles = ['student', 'parent', 'creator', 'admin'] as const;
type Role = (typeof roles)[number];
let app: App;
let prefix: string;
let courseId: string;
let draftId: string;
const uid = (role: Role) => `${prefix}-${role}`;
const email = (role: Role) =>
  `${uid(role)}@${role === 'student' ? 'students.studysathi.local' : 'example.test'}`;

test.beforeAll(async () => {
  if (
    process.env.STUDYSATHI_E2E !== '1' ||
    process.env.FIRESTORE_EMULATOR_HOST !== '127.0.0.1:8080' ||
    process.env.FIREBASE_AUTH_EMULATOR_HOST !== '127.0.0.1:9099'
  )
    throw new Error('Local emulators required');
  prefix = `smoke-${randomUUID().slice(0, 8)}`;
  courseId = `${prefix}-learn`;
  draftId = `${prefix}-draft`;
  app = initializeApp({ projectId: 'demo-studysathi' }, prefix);
  const auth = getAuth(app);
  const db = getFirestore(app);
  for (const role of roles) {
    await auth.createUser({
      uid: uid(role),
      email: email(role),
      password,
      displayName: `Smoke ${role}`,
    });
    await auth.setCustomUserClaims(uid(role), { role });
    await db
      .collection('users')
      .doc(uid(role))
      .set({
        role,
        status: 'active',
        name: `Smoke ${role}`,
        nickname: 'Smoke learner',
        avatarId: 'leaf',
        username: uid(role),
        ...(role === 'student' ? { parentUid: uid('parent') } : {}),
        ...(role === 'parent' ? { childUids: [uid('student')] } : {}),
      });
  }
  const details = {
    title: 'Smoke science course',
    summary: 'Explore science with a simple learning activity.',
    category: 'science',
    language: 'English',
    ageRange: '10-16',
    budget: '10 min',
    coverImageUrl: 'https://example.test/cover.png',
    coverAlt: 'A leaf for the science lesson',
    createdBy: uid('creator'),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    outline: {
      modules: [
        {
          id: 'part',
          title: 'Part one',
          lessons: [
            {
              id: 'intro',
              title: 'Smoke introduction',
              kind: 'text',
              duration: '5 min',
              content: 'Observe a leaf and describe its shape.',
              blocks: [
                {
                  id: 'read',
                  title: 'Observe a leaf',
                  duration: '2 min',
                  kind: 'text',
                  content: 'Observe a leaf and describe its shape.',
                },
                {
                  id: 'quiz',
                  title: 'Leaf check',
                  duration: '1 min',
                  kind: 'quiz',
                  question: 'What are we observing?',
                  options: ['A leaf', 'A rock'],
                  correctAnswer: 'A leaf',
                },
              ],
            },
          ],
        },
      ],
    },
  };
  await db
    .collection('courses')
    .doc(courseId)
    .set({ ...details, status: 'published' });
  await db
    .collection('courses')
    .doc(draftId)
    .set({ ...details, title: 'Smoke draft course', status: 'draft' });
});
test.afterAll(async () => {
  if (app) await deleteApp(app);
});

test('learning checks save private progress, award once and appear for the linked parent', async ({
  page,
  context,
}) => {
  const learner = `${prefix}-activity`;
  await getAuth(app).createUser({
    uid: learner,
    email: `${learner}@students.studysathi.local`,
    password,
  });
  await getAuth(app).setCustomUserClaims(learner, { role: 'student' });
  const db = getFirestore(app);
  await db
    .collection('users')
    .doc(learner)
    .set({
      role: 'student',
      status: 'active',
      nickname: 'Activity learner',
      avatarId: 'leaf',
      parentUid: uid('parent'),
      stats: {},
      leaderboardOptIn: true,
    });
  await page.goto('/login');
  await page.getByLabel('Username', { exact: true }).fill(learner);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page).toHaveURL(/\/learn$/);
  await page.goto('/play/budget');
  await expect(page.locator('.learning-check fieldset')).toHaveCount(0);
  await page.getByRole('button', { name: 'Check what I learned', exact: true }).click();
  const fields = page.locator('.learning-check fieldset');
  await expect(fields.first().getByRole('radio').first()).toBeEnabled();
  for (let i = 0; i < 3; i++) await fields.nth(i).getByRole('radio').nth(i).check();
  await page.getByRole('button', { name: 'Check learning', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: '+15 XP' })).toBeVisible();
  await page.getByRole('button', { name: 'Try learning check again', exact: true }).click();
  for (let i = 0; i < 3; i++) await fields.nth(i).getByRole('radio').nth(i).check();
  await page.getByRole('button', { name: 'Check learning', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'already rewarded' })).toBeVisible();
  expect((await db.collection('users').doc(learner).get()).get('stats.xp')).toBe(15);
  expect(
    (
      await db.collection('leaderboards').doc('all-time').collection('entries').doc(learner).get()
    ).get('xp'),
  ).toBe(15);
  await page.goto('/play/progress');
  await expect(page.getByText('Best 3/3', { exact: false })).toBeVisible();
  await context.clearCookies();
  await login(page, 'parent');
  await page.goto(`/parent/children/${learner}`);
  await expect(
    page.getByText('Plan a small budget: best 3/3, latest 3/3. Completed', { exact: true }),
  ).toBeVisible();
  await context.clearCookies();
  await login(page, 'student');
  await page.goto('/play/progress');
  await expect(page.getByText('Best 3/3', { exact: false })).toHaveCount(0);
});

async function login(page: Page, role: Role) {
  await page.goto('/login');
  if (role !== 'student')
    await page.getByRole('tab', { name: "I'm a parent / creator", exact: true }).click();
  await page
    .getByLabel(role === 'student' ? 'Username' : 'Email', { exact: true })
    .fill(role === 'student' ? uid(role) : email(role));
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/${role === 'student' ? 'learn' : role}$`));
}

test('academic student results persist and stay private across accounts', async ({
  page,
  context,
}) => {
  await login(page, 'student');
  await page.goto('/study/9/mathematics/sets');
  const fields = page.locator('.academic-practice fieldset');
  await expect(fields.first().getByRole('radio').first()).toBeEnabled();
  for (const [index, answer] of [1, 2, 0, 2].entries())
    await fields.nth(index).getByRole('radio').nth(answer).check();
  await page.getByRole('button', { name: 'Check answers', exact: true }).click();
  await expect(page.locator('.academic-feedback').getByRole('status')).toContainText(
    'Saved to your student account.',
  );
  await page.reload();
  await page.getByText('Your saved practice', { exact: true }).click();
  await expect(page.locator('.academic-practice details')).toContainText('Chapter check: 4/4');
  const record = await getFirestore(app)
    .collection('users')
    .doc(uid('student'))
    .collection('privateData')
    .doc('academic')
    .get();
  expect(record.get('results.sets_check.correct')).toBe(4);
  await context.clearCookies();
  await page.goto('/study/9/mathematics/sets');
  await expect(fields.first().getByRole('radio').first()).toBeEnabled();
  await expect(page.getByText('Your saved practice', { exact: true })).toHaveCount(0);
});

test('academic admin can publish and withdraw an approved textbook reference', async ({ page }) => {
  await login(page, 'admin');
  await page.goto('/admin/academic');
  await page.getByLabel('Book title', { exact: true }).fill('Emulator-only textbook');
  await page
    .getByLabel('Edition and language', { exact: true })
    .fill('Test fixture, not a real book');
  await page
    .getByLabel('Official source page URL', { exact: true })
    .fill('https://moecdc.gov.np/test-fixture');
  await page
    .getByLabel('Official PDF URL', { exact: true })
    .fill('https://moecdc.gov.np/test-fixture.pdf');
  await page
    .getByLabel('Permission or license reference', { exact: true })
    .fill('Emulator-only fixture, no real content imported.');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Publish textbook reference', exact: true }).click();
  await expect(
    page.getByText('Textbook published to academic pages.', { exact: true }),
  ).toBeVisible();
  await page.goto('/study/9/mathematics/sets');
  await expect(
    page.getByText('Emulator-only textbook · Test fixture, not a real book', { exact: true }),
  ).toBeVisible();
  await page.goto('/admin/academic');
  await page.getByRole('button', { name: 'Withdraw textbook reference', exact: true }).click();
  await expect(page.getByText('Textbook withdrawn.', { exact: true })).toBeVisible();
  await page.goto('/study/9/mathematics/sets');
  await expect(page.getByText('Emulator-only textbook', { exact: false })).toHaveCount(0);
  // Source edits must not invalidate the unrelated class-navigation shells.
  await page.goto('/study');
  await page.getByRole('link', { name: 'Choose Grade 6', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Class 6');
});

for (const role of roles)
  test(`${role} logs in to the correct portal`, async ({ page, context }, testInfo) => {
    await login(page, role);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Hello');
    const session = (await context.cookies()).find(
      (cookie) => cookie.name === 'studysathi_e2e_session',
    );
    expect(session?.httpOnly).toBe(true);
    await page.screenshot({ path: testInfo.outputPath('portal.png'), fullPage: true });
    if (role === 'student') {
      await page.goto('/admin');
      await expect(page).toHaveURL(/\/learn$/);
    }
  });

test('student enrolls, completes a lesson and retains progress without duplicate rewards', async ({
  page,
}) => {
  await login(page, 'student');
  await page.goto(`/learn/courses/${courseId}`);
  await page.getByRole('button', { name: 'Enroll in course', exact: true }).click();
  await page.getByRole('link', { name: 'Start course', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Smoke introduction', exact: true }),
  ).toBeVisible();
  await page.getByRole('radio', { name: 'A rock', exact: true }).check();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(
    page.getByText('Try again. Read the lesson and choose another answer.', { exact: true }),
  ).toBeVisible();
  await page.getByRole('radio', { name: 'A leaf', exact: true }).check();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: '+5 XP' })).toBeVisible();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: '+5 XP' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Mark lesson complete', exact: true }).click();
  await expect(page.getByText('1 of 1 lessons complete', { exact: true })).toBeVisible();
  const db = getFirestore(app);
  await expect
    .poll(async () =>
      (await db.collection('users').doc(uid('student')).get()).get('stats.lessonCount'),
    )
    .toBe(1);
  const xp = (await db.collection('users').doc(uid('student')).get()).get('stats.xp');
  expect(xp).toBe(70);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Saved', exact: true })).toBeDisabled();
  expect((await db.collection('users').doc(uid('student')).get()).get('stats.xp')).toBe(xp);
});

test('creator submits the current metadata and admin publishes the course', async ({
  page,
  browser,
}) => {
  await login(page, 'creator');
  await page.goto(`/creator/drafts/${draftId}`);
  await page.getByLabel('Course title', { exact: true }).fill('Smoke updated course');
  // Submit immediately: this must save the current metadata, even before debounced autosave.
  await page.getByRole('button', { name: 'Submit for review', exact: true }).click();
  await expect(
    page.getByText('This course is in review or published.', { exact: false }),
  ).toBeVisible();
  const db = getFirestore(app);
  expect((await db.collection('courses').doc(draftId).get()).get('title')).toBe(
    'Smoke updated course',
  );
  const adminContext = await browser.newContext({
    baseURL: 'http://localhost:3100',
    viewport: page.viewportSize() ?? undefined,
  });
  try {
    await adminContext.route('https://**/*', (route) => route.abort());
    const admin = await adminContext.newPage();
    await login(admin, 'admin');
    await admin.goto(`/admin/courses/${draftId}`);
    await admin.getByRole('button', { name: 'Publish course', exact: true }).click();
    await expect
      .poll(async () => (await db.collection('courses').doc(draftId).get()).get('status'))
      .toBe('published');
    await page.goto(`/creator/drafts/${draftId}`);
    await expect(
      page.getByText('This course is in review or published.', { exact: false }),
    ).toBeVisible();
  } finally {
    await adminContext.close();
  }
});

test('public navigation supports skip focus and mobile Escape without horizontal overflow', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link')
      .first()
      .focus();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Open navigation', exact: true })).toBeFocused();
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeHidden();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test('parent creates a learner, changes consent, reviews progress and resets access', async ({
  page,
  browser,
}, testInfo) => {
  await login(page, 'parent');
  await page.goto('/parent/add-child');
  const username = `${prefix}-new`;
  await page.getByLabel('Nickname', { exact: true }).fill('New smoke learner');
  await page.getByLabel('Username', { exact: true }).fill(username);
  await page.getByLabel('Password (at least 8 characters)', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Saved.' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to family', exact: true }).click();
  const child = page.getByRole('listitem').filter({ hasText: `Username: ${username}` });
  await expect(child).toBeVisible();
  await child.getByLabel('Leaderboard visibility', { exact: true }).selectOption('on');
  await child.getByRole('button', { name: 'Save leaderboard visibility', exact: true }).click();
  await expect(child.getByText('Leaderboard: On', { exact: true })).toBeVisible();
  const childRecord = await getAuth(app).getUserByEmail(`${username}@students.studysathi.local`);
  const db = getFirestore(app);
  expect((await db.collection('users').doc(childRecord.uid).get()).get('leaderboardOptIn')).toBe(
    true,
  );
  await child.getByRole('link', { name: 'View progress', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('New smoke learner');
  await expect(
    page.getByText('No current published course to show yet.', { exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: testInfo.outputPath('parent-progress.png'), fullPage: true });
  const learnerContext = await browser.newContext({
    baseURL: 'http://localhost:3100',
    viewport: page.viewportSize() ?? undefined,
  });
  try {
    await blockExternal(learnerContext);
    const learner = await learnerContext.newPage();
    async function childLogin(secret: string) {
      await learner.goto('/login');
      await learner.getByLabel('Username', { exact: true }).fill(username);
      await learner.getByLabel('Password', { exact: true }).fill(secret);
      await learner.getByRole('button', { name: 'Log in', exact: true }).click();
      await expect(learner).toHaveURL(/\/learn$/);
    }
    await childLogin(password);
    // Auth revocation timestamps use whole seconds; reset after the original sign-in second.
    await new Promise((resolve) => setTimeout(resolve, 1100));
    await page.goto('/parent');
    const row = page.getByRole('listitem').filter({ hasText: `Username: ${username}` });
    await row.getByLabel('Leaderboard visibility', { exact: true }).selectOption('off');
    await row.getByRole('button', { name: 'Save leaderboard visibility', exact: true }).click();
    await expect(row.getByText('Leaderboard: Off', { exact: true })).toBeVisible();
    await row.getByText('Reset password', { exact: true }).first().click();
    await row.getByLabel('New password', { exact: true }).fill('Reset-smoke-password-43');
    await row.getByRole('button', { name: 'Reset password', exact: true }).click();
    await expect(row.locator('details').getByRole('status')).toHaveText('Saved.');
    await learner.goto('/learn');
    await expect(learner).toHaveURL(/\/login\?next=/);
    await childLogin('Reset-smoke-password-43');
  } finally {
    await learnerContext.close();
  }
});

test('profile and logout recover after an offline request', async ({ page, context }) => {
  await login(page, 'student');
  await page.goto('/learn/profile');
  await page.getByLabel('Nickname', { exact: true }).fill('Offline learner');
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Save profile', exact: true }).click();
  await expect(
    page.getByText('Could not connect. Please check your connection and try again.', {
      exact: true,
    }),
  ).toBeVisible();
  await context.setOffline(false);
  await page.getByRole('button', { name: 'Save profile', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Saved.' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Offline learner: edit profile/ })).toBeVisible();
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Log out', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Could not log out.' })).toHaveText(
    'Could not log out. Check your connection and try again.',
  );
  await expect(page).toHaveURL(/\/learn\/profile$/);
  await context.setOffline(false);
  await page.getByRole('button', { name: 'Log out', exact: true }).click();
  await expect(page).toHaveURL('http://localhost:3100/');
  expect(
    (await context.cookies()).find((cookie) => cookie.name === 'studysathi_e2e_session'),
  ).toBeUndefined();
  await page.goto('/learn');
  await expect(page).toHaveURL(/\/login\?next=/);
});

test('guest merge syncs across browsers and keeps private notes out of parent progress', async ({
  page,
  context,
  browser,
}) => {
  await page.goto('/login');
  await page.evaluate(() => {
    localStorage.setItem('studysathi-saved', JSON.stringify(['1']));
    localStorage.setItem(
      'studysathi-notes',
      JSON.stringify({ private_smoke: 'Private smoke note' }),
    );
  });
  await login(page, 'student');
  await page.getByRole('button', { name: 'Bring my saved items', exact: true }).click();
  await expect(
    page.getByText('Bring your saved items and notes from this browser into your account?', {
      exact: true,
    }),
  ).toHaveCount(0);
  const library = getFirestore(app)
    .collection('users')
    .doc(uid('student'))
    .collection('privateData')
    .doc('library');
  await expect.poll(async () => (await library.get()).get('savedIds')).toContain('1');
  expect((await library.get()).get('notes.private_smoke')).toBe('Private smoke note');
  await expect
    .poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('studysathi-notes') ?? '{}')))
    .toEqual({});
  const second = await browser.newContext({
    baseURL: 'http://localhost:3100',
    viewport: page.viewportSize() ?? undefined,
  });
  try {
    await blockExternal(second);
    const other = await second.newPage();
    await login(other, 'student');
    await other.goto('/saved');
    await expect(
      other.getByRole('heading', { name: 'OLE Nepal E-Paath', exact: true }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Log out', exact: true }).click();
    await expect(page).toHaveURL('http://localhost:3100/');
    await page.goto('/saved');
    await expect(page.getByRole('heading', { name: 'OLE Nepal E-Paath', exact: true })).toHaveCount(
      0,
    );
    await login(page, 'parent');
    await page.goto(`/parent/children/${uid('student')}`);
    await expect(page.getByText('Private smoke note', { exact: true })).toHaveCount(0);
  } finally {
    await second.close();
    await context.setOffline(false);
  }
});

test('creator analytics shows recorded metrics and recovers from a missing course', async ({
  page,
}, testInfo) => {
  const db = getFirestore(app);
  const source = await db.collection('courses').doc(courseId).get();
  const id = `${prefix}-metrics`;
  await db
    .collection('courses')
    .doc(id)
    .set({
      ...source.data(),
      title: 'Smoke metrics course',
      stats: {
        views: 3,
        enrollments: 2,
        completions: 1,
        analyticsEnrollments: 2,
        analyticsCompletions: 1,
        lessonCompletions: { intro: 1 },
      },
    });
  await login(page, 'creator');
  await page.goto(`/creator/analytics/${id}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Smoke metrics course');
  await expect(
    page.getByText('Recorded enrollments', { exact: true }).locator('..').locator('dd'),
  ).toHaveText('2');
  await expect(
    page.getByText('New-enrollment completion rate', { exact: true }).locator('..').locator('dd'),
  ).toHaveText('50%');
  await expect(page.getByText('1 recorded completions', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: testInfo.outputPath('analytics.png'), fullPage: true });
  await page.goto(`/creator/analytics/${prefix}-missing`);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('not available');
  await page
    .getByRole('link', { name: /analytics/i })
    .last()
    .click();
  await expect(page).toHaveURL(/\/creator\/analytics$/);
});

test('Quick Learn bookmarks and practice sync privately without awarding XP', async ({
  page,
  browser,
}) => {
  await login(page, 'student');
  const db = getFirestore(app),
    user = db.collection('users').doc(uid('student'));
  const xp = (await user.get()).get('stats.xp');
  await page.goto('/quick-learn');
  const card = page.locator('.quick-card').first();
  await card.getByRole('button', { name: /^Save / }).click();
  await card.getByText('Try one question (optional)', { exact: true }).click();
  await card.getByRole('radio').first().check();
  await card.getByRole('button', { name: 'Check my answer', exact: true }).click();
  await expect(card.locator('.quick-question').getByRole('status')).toContainText('You got it!');
  const library = user.collection('privateData').doc('library');
  await expect
    .poll(async () => (await library.get()).get('savedIds'))
    .toContain('quick-0oedpy8mqWg');
  await expect
    .poll(async () => (await library.get()).get('progress'))
    .toContain('quick-check-0oedpy8mqWg');
  expect((await user.get()).get('stats.xp')).toBe(xp);
  await page.reload();
  await expect(
    page
      .locator('.quick-card')
      .first()
      .getByRole('button', { name: /^Unsave / }),
  ).toHaveAttribute('aria-pressed', 'true');
  const second = await browser.newContext({
    baseURL: 'http://localhost:3100',
    viewport: page.viewportSize() ?? undefined,
  });
  try {
    await blockExternal(second);
    const parent = await second.newPage();
    await login(parent, 'parent');
    await parent.goto('/saved');
    await expect(
      parent.getByRole('heading', { name: 'Your saved Quick Learn shorts', exact: true }),
    ).toHaveCount(0);
  } finally {
    await second.close();
  }
});
