'use client';
import { useStudyStorage, useRequestedVideo } from './useStudyStorage';
import { useState } from 'react';
import { rememberStudy, ResourceFeedback } from './StudyTools';
import type { SchoolPlaylist } from '@/lib/academic/library';
import { playlistEmbedUrl } from '@/lib/academic/library-media';

export function PlaylistPlayer({ playlist }: { playlist: SchoolPlaylist }) {
  const saved = useStudyStorage('study-video-' + playlist.id);
  const [chosen, setSelected] = useState<string | undefined>();
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState('');
  const requested = useRequestedVideo();
  const selected =
    chosen ||
    (playlist.videos.some((v) => v.id === requested)
      ? requested
      : playlist.videos.some((v) => v.id === saved)
        ? saved
        : playlist.videos[0]?.id);
  const videos = playlist.videos.filter((video) =>
    video.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  const current = playlist.videos.find((video) => video.id === selected);
  const embed = playlistEmbedUrl(playlist.id, selected);
  return (
    <div className="playlist-layout">
      <div className="playlist-stage">
        <div className="video-stage">
          {loaded && embed ? (
            <iframe
              key={selected}
              src={embed}
              title={`${playlist.title} video player`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <div className="video-placeholder">
              <strong>Learn with NCED Virtual</strong>
              <p>
                Load the YouTube player to watch lessons here. Loading connects to YouTube; playback
                availability is controlled by the provider.
              </p>
              <button className="button" onClick={() => setLoaded(true)}>
                Load video player
              </button>
            </div>
          )}
        </div>
        <h2 className="current-lesson" aria-live="polite">
          {current?.title || playlist.title}
        </h2>
        <p>
          Full playlist enabled. Open the playlist menu inside the player for more lessons,
          including any beyond the indexed list.
        </p>
        <a href={playlist.sourceUrl} target="_blank" rel="noopener noreferrer">
          Open full playlist on YouTube
        </a>
        <p className="library-source-note">
          {playlist.provider} · {playlist.language}. Videos remain on YouTube. If a lesson is
          unavailable or embedding is disabled, use the original playlist. No videos are downloaded
          or rehosted.
        </p>
      </div>
      <ResourceFeedback title={playlist.title} />
      <aside className="lesson-browser">
        <h2>Choose a lesson</h2>
        <label htmlFor="lesson-search">Search lesson or chapter title</label>
        <input
          id="lesson-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search this playlist"
        />
        <p role="status">
          {videos.length} of {playlist.videos.length} indexed lessons
          {playlist.hasMore ? ' · more in the player' : ''}
        </p>
        <ol className="playlist-lessons">
          {videos.map((video) => (
            <li key={video.id}>
              <button
                aria-pressed={selected === video.id}
                onClick={() => {
                  setSelected(video.id);
                  rememberStudy(video.title, 'study-video-' + playlist.id, video.id);
                  setLoaded(true);
                }}
              >
                <span>{video.title}</span>
                <small>{video.duration}</small>
              </button>
            </li>
          ))}
        </ol>
        {videos.length === 0 && <p>No matching lesson. Try another word or clear the search.</p>}
      </aside>
    </div>
  );
}
