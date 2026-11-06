import { z } from 'zod';

export const officialUrl = z
  .url()
  .max(2000)
  .refine((value) => {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      !url.username &&
      !url.password &&
      !url.port &&
      [
        'moecdc.gov.np',
        'www.moecdc.gov.np',
        'lib.moecdc.gov.np',
        'giwmscdnone.gov.np',
        'giwmscdntwo.gov.np',
      ].includes(url.hostname)
    );
  }, 'Use an HTTPS URL on an approved government content host.');
export const textbookSchema = z
  .object({
    title: z.string().trim().min(3).max(180),
    edition: z.string().trim().min(2).max(180),
    sourceUrl: officialUrl,
    pdfUrl: officialUrl,
    permissionReference: z.string().trim().min(15).max(1000),
    approvedForEmbed: z.literal(true),
  })
  .strict();
export type Textbook = z.infer<typeof textbookSchema>;
