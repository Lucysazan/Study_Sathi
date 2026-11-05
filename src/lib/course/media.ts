export function safeMediaUrl(value: string | undefined): string | null {
  try {
    const url = new URL(value ?? '');
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

export function videoEmbedUrl(value: string | undefined): string | null {
  const safe = safeMediaUrl(value);
  if (!safe) return null;
  const url = new URL(safe);
  if (
    [
      'youtube.com',
      'www.youtube.com',
      'm.youtube.com',
      'youtube-nocookie.com',
      'www.youtube-nocookie.com',
      'youtu.be',
    ].includes(url.hostname)
  ) {
    const id =
      url.hostname === 'youtu.be'
        ? url.pathname.slice(1)
        : url.pathname.startsWith('/embed/')
          ? url.pathname.split('/')[2]
          : url.searchParams.get('v');
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id)
      ? `https://www.youtube-nocookie.com/embed/${id}`
      : null;
  }
  if (['vimeo.com', 'www.vimeo.com', 'player.vimeo.com'].includes(url.hostname)) {
    const id = url.pathname.split('/').filter(Boolean).at(-1);
    return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}?dnt=1` : null;
  }
  return null;
}
