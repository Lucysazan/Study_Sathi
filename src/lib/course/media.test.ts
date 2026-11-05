import { describe, expect, it } from 'vitest';
import { safeMediaUrl, videoEmbedUrl } from './media';

describe('lesson media', () => {
  it('blocks script and insecure links', () => {
    for (const url of [
      'javascript:alert(1)',
      'data:text/html,bad',
      'http://example.com',
      'https://user:pass@example.com',
    ])
      expect(safeMediaUrl(url)).toBeNull();
  });
  it('uses privacy-enhanced embeds', () => {
    expect(videoEmbedUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    );
    expect(videoEmbedUrl('https://vimeo.com/123456')).toBe(
      'https://player.vimeo.com/video/123456?dnt=1',
    );
  });
  it('rejects lookalike providers and malformed ids', () => {
    expect(videoEmbedUrl('https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ')).toBeNull();
    expect(videoEmbedUrl('https://youtube.com/watch?v=bad')).toBeNull();
  });
});
