import Link from 'next/link';
import type { Metadata } from 'next';
import { studyActivities } from '@/lib/study/catalog';
export const metadata: Metadata = {
  title: 'Play and Learn',
  description:
    'Simple explanations, interactive activities and learning checks with progress and rewards.',
};
export default function PlayPage() {
  return (
    <section className="site-container section">
      <div className="eyebrow">LEARN BY DOING</div>
      <h1 className="detail-title">Play and Learn</h1>
      <p className="large-copy">Understand the idea. Try an activity. Check what you learned.</p>
      <p>
        Free learning journeys with simple original explanations, three PhET simulations and
        practical StudySathi activities. Class ranges are guidance, not verified curriculum mapping.
        Teacher review is pending.
      </p>
      <div className="academic-actions">
        <Link href="/play/progress" className="button secondary" prefetch={false}>
          My activity progress
        </Link>
        <Link href="/learn/leaderboard" className="button secondary">
          Friendly leaderboard
        </Link>
        <Link href="/study" className="button secondary">
          Class textbooks and videos
        </Link>
      </div>
      <div className="academic-grid">
        {studyActivities.map((a) => (
          <article className="learning-card" key={a.id}>
            <span className="eyebrow">{a.subject}</span>
            <h2>{a.title}</h2>
            <p>{a.summary}</p>
            <p>
              {a.ages} ·{' '}
              {a.simulation
                ? 'PhET simulation + our learning check'
                : a.widget
                  ? 'Interactive activity + learning check'
                  : 'Guided practice + learning check'}
            </p>
            <Link className="button" href={'/play/' + a.id} prefetch={false}>
              Start {a.title}
            </Link>
          </article>
        ))}
      </div>
      <p>
        First perfect checks earn XP once per activity, supporting existing badges, daily streaks
        and optional parent-consented leaderboards. Opening media is not completion. Original school
        textbooks remain on their government host.
      </p>
    </section>
  );
}
