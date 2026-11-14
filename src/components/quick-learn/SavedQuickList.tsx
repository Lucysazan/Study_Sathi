import Link from 'next/link';
import type { QuickVideo } from '@/lib/quick-learn/catalog';
import { quickSaveId } from '@/lib/quick-learn/catalog';
import { SaveButton } from '@/components/resources/SaveButton';
export function SavedQuickList({ videos }: { videos: readonly QuickVideo[] }) {
  if (!videos.length) return null;
  return (
    <section className="saved-quick">
      <h2>Your saved Quick Learn shorts</h2>
      <div className="academic-grid">
        {videos.map((v) => (
          <article className="learning-card" key={v.videoId}>
            <SaveButton resourceId={quickSaveId(v.videoId)} title={v.title} />
            <h3>{v.title}</h3>
            <p>
              {v.creator} /{' '}
              {v.language === 'ne'
                ? 'Nepali'
                : v.language === 'en'
                  ? 'English'
                  : 'No lesson narration'}{' '}
              / {v.subject}
            </p>
            <Link href={`/quick-learn?video=${v.videoId}`}>Watch this short in Quick Learn</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
