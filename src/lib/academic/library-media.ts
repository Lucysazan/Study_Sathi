export function playlistEmbedUrl(id: string, videoId?: string) {
  if (!/^PL[A-Za-z0-9_-]{10,80}$/.test(id) || (videoId && !/^[A-Za-z0-9_-]{11}$/.test(videoId)))
    return null;
  return `https://www.youtube-nocookie.com/embed/${videoId || 'videoseries'}?list=${encodeURIComponent(id)}&rel=0&playsinline=1`;
}
