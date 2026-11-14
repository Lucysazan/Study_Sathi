'use client';
import Link from 'next/link';
import { useProgress } from '@/lib/storage/guest-data';
import { SaveButton } from '@/components/resources/SaveButton';
import { quickSaveId, type QuickVideo } from '@/lib/quick-learn/catalog';
import { ShortPlayer } from './ShortPlayer';
import { ShortQuestion } from './ShortQuestion';
export function QuickCard({
  video,
  active,
  index,
  total,
  onStarted,
  onFinished,
  onAnswer,
}: {
  video: QuickVideo;
  active: boolean;
  index: number;
  total: number;
  onStarted: () => void;
  onFinished: () => void;
  onAnswer: (correct: boolean) => void;
}) {
  const progress = useProgress();
  return (
    <article className="quick-card" aria-label={`Short ${index + 1} of ${total}: ${video.title}`}>
      <div className="quick-media">
        {active ? (
          <ShortPlayer
            key={video.videoId}
            videoId={video.videoId}
            title={video.title}
            onStarted={onStarted}
            onFinished={onFinished}
          />
        ) : (
          <div className="quick-poster">
            <span aria-hidden="true" className="quick-play-mark" />
            <p>Scroll here to load this short</p>
          </div>
        )}
      </div>
      <div className="quick-card-details">
        <div className="quick-card-top">
          <span className="eyebrow">
            {index + 1} / {total} / {video.durationSeconds}s
          </span>
          <SaveButton resourceId={quickSaveId(video.videoId)} title={video.title} />
        </div>
        <h2>{video.title}</h2>
        <p className="quick-creator">By {video.creator} / YouTube</p>
        <div className="quick-tags">
          <span>
            Spoken:{' '}
            {video.language === 'ne'
              ? 'Nepali'
              : video.language === 'en'
                ? 'English'
                : 'No lesson narration'}
          </span>
          <span>{video.subject}</span>
          <span>
            Ages {video.minAge}-{video.maxAge}
          </span>
        </div>
        <p>{video.objective}</p>
        <p className="quick-progress">
          {progress.includes(`quick-finished-${video.videoId}`)
            ? 'Finished-video record saved. '
            : ''}
          {progress.includes(`quick-check-${video.videoId}`) ? 'Practice answer recorded.' : ''}
        </p>
        <ShortQuestion video={video} onAnswer={onAnswer} />
        <div className="quick-links">
          {video.related.href.startsWith('/') ? (
            <Link className="button" href={video.related.href}>
              Learn more: {video.related.label}
            </Link>
          ) : (
            <a
              className="button"
              href={video.related.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more: {video.related.label} (YouTube playlist)
            </a>
          )}
          <a href={video.sourceUrl} target="_blank" rel="noopener noreferrer">
            Watch on YouTube<span className="sr-only"> (new tab)</span>
          </a>
        </div>
        <small>
          Selected {video.review.date}. Availability can change. Questions are practice, with no XP.
        </small>
        <details className="quick-review-scope">
          <summary>Selection notes</summary>
          <p>{video.review.basis}</p>
          <p>{video.review.notes}</p>
        </details>
      </div>
    </article>
  );
}
