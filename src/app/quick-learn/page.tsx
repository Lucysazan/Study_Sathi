import type { Metadata } from 'next';
import { Suspense } from 'react';
import { quickVideos } from '@/data/quick-learn';
import { QuickLearn } from '@/components/quick-learn/QuickLearn';
export const metadata: Metadata = {
  title: 'Quick Learn',
  description:
    'A little learning in Nepali and English: selected educational YouTube Shorts, optional questions and links to explore further.',
};
export default function QuickLearnPage() {
  return (
    <section className="site-container section quick-home">
      <div className="eyebrow">ONE LITTLE IDEA AT A TIME</div>
      <h1>
        Quick Learn{' '}
        <span lang="ne">/ {'\u091b\u094b\u091f\u094b \u0938\u093f\u0915\u093e\u0907'}</span>
      </h1>
      <p>Watch a short. Try a question. Find a bigger adventure.</p>
      <Suspense fallback={<p role="status">Getting your learning feed ready...</p>}>
        <QuickLearn videos={quickVideos} />
      </Suspense>
      <details className="quick-parent-info">
        <summary>For families: sources, privacy and playback</summary>
        <p>
          This is a fixed selection, not YouTube&apos;s general Shorts or trending feed. Videos are
          individually checked for our catalogue; age suggestions are guidance. Content and
          availability can change.
        </p>
        <p>
          YouTube provides the player, ads, controls and recommendations. We cannot control or
          remove these. We use privacy-enhanced embeds and do not send account names or quiz answers
          to YouTube. YouTube may process playback data under its own policies.
        </p>
        <p>
          Bookmarks and completed-video/practice records use StudySathi&apos;s existing private
          library. Guests save in this browser; signed-in accounts sync privately. Watching or
          answering here does not award XP or competitive streaks.
        </p>
        <p>
          <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">
            YouTube Terms
          </a>{' '}
          /{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google Privacy Policy
          </a>
        </p>
      </details>
    </section>
  );
}
