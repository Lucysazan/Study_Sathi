import { describe, expect, it } from 'vitest';
import {
  bookPath,
  gradeSubjects,
  officialPdfUrl,
  parseSchoolGrade,
  playlistPath,
  schoolGrades,
  schoolLibrary,
  subjectLabels,
  subjectMaterials,
} from './library';
import { playlistEmbedUrl } from './library-media';

describe('class-wise school library', () => {
  it('has real catalog material for every class 1 to 12', () => {
    expect(schoolGrades).toHaveLength(12);
    for (const grade of schoolGrades) expect(gradeSubjects(grade).length).toBeGreaterThan(0);
    expect(schoolLibrary.books).toHaveLength(137);
    expect(schoolLibrary.playlists).toHaveLength(56);
  });
  it('has unique official PDF references with grade and subject mappings', () => {
    expect(new Set(schoolLibrary.books.map((book) => book.id)).size).toBe(
      schoolLibrary.books.length,
    );
    for (const book of schoolLibrary.books) {
      expect(officialPdfUrl(book.pdfUrl)).toBe(true);
      expect(subjectLabels[book.subject]).toBeDefined();
      expect(book.grade).toBeGreaterThanOrEqual(1);
      expect(book.grade).toBeLessThanOrEqual(12);
      expect(bookPath(book)).toContain(`/study/${book.grade}/${book.subject}/read/`);
      if (book.subject === 'english') expect(book.language).toBe('English');
    }
  });
  it('indexes provider playlists and video IDs without pretending to fetch the full list', () => {
    expect(new Set(schoolLibrary.playlists.map((item) => item.id)).size).toBe(
      schoolLibrary.playlists.length,
    );
    let count = 0;
    for (const item of schoolLibrary.playlists) {
      expect(item.channelUrl).toBe('https://www.youtube.com/@NCEDVirtual');
      expect(subjectLabels[item.subject]).toBeDefined();
      expect(item.title).not.toMatch(/old/i);
      expect(playlistPath(item)).toContain(`/study/${item.grade}/${item.subject}/watch/`);
      expect(item.videos.length).toBeGreaterThan(0);
      for (const video of item.videos) {
        expect(video.id).toMatch(/^[\w-]{11}$/);
        expect(video.title).toBeTruthy();
        count++;
      }
    }
    expect(count).toBe(3270);
  });
  it('keeps grade and subject selection isolated', () => {
    const data = subjectMaterials(6, 'mathematics');
    expect(data.books.length).toBeGreaterThan(0);
    expect(data.playlists.length).toBeGreaterThan(0);
    expect(
      [...data.books, ...data.playlists].every(
        (item) => item.grade === 6 && item.subject === 'mathematics',
      ),
    ).toBe(true);
    for (const value of ['0', '13', '01', '9x', '../9']) expect(parseSchoolGrade(value)).toBeNull();
  });
  it('builds full-playlist privacy-enhanced embeds and rejects URL injection', () => {
    expect(playlistEmbedUrl('PLVOHiHZt8InJ29mBch-66uCQUmHxR6SpU', 'b2kUBO5Ncko')).toContain(
      'embed/b2kUBO5Ncko?list=PLVOHiHZt8InJ29mBch-66uCQUmHxR6SpU',
    );
    expect(playlistEmbedUrl('bad?list=other')).toBeNull();
    expect(playlistEmbedUrl('PLVOHiHZt8InJ29mBch-66uCQUmHxR6SpU', 'bad')).toBeNull();
    expect(officialPdfUrl('https://evil.test/a.pdf')).toBe(false);
  });
});
