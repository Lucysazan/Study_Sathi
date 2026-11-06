import { expect, it } from 'vitest';
import { officialUrl, textbookSchema } from './source';
it('accepts only explicit official HTTPS hosts', () => {
  expect(officialUrl.safeParse('https://moecdc.gov.np/book.pdf').success).toBe(true);
  for (const url of [
    'http://moecdc.gov.np/a',
    'https://moecdc.gov.np.evil.test/a',
    'https://user@moecdc.gov.np/a',
    'https://127.0.0.1/a',
    'https://pustakalaya.org/a',
  ])
    expect(officialUrl.safeParse(url).success).toBe(false);
});
it('requires an explicit permission reference and approval', () => {
  const data = {
    title: 'Grade 9 Mathematics',
    edition: 'English 2022',
    sourceUrl: 'https://moecdc.gov.np/a',
    pdfUrl: 'https://moecdc.gov.np/a.pdf',
    permissionReference: 'Verified provider permission reference',
    approvedForEmbed: true,
  };
  expect(textbookSchema.safeParse(data).success).toBe(true);
  expect(textbookSchema.safeParse({ ...data, approvedForEmbed: false }).success).toBe(false);
  expect(textbookSchema.safeParse({ ...data, permissionReference: '' }).success).toBe(false);
});
