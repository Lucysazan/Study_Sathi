import Link from 'next/link';
import { StudyProgress } from '@/components/study/StudyProgress';
import { studyActivities } from '@/lib/study/catalog';
export const metadata = { title: 'My activity progress', robots: { index: false } };
export default function ProgressPage() {
  return (
    <section className="site-container section">
      <Link href="/play">Play and Learn</Link>
      <h1 className="detail-title">Keep your learning moving</h1>
      <p>
        Your saved checks are private to your student account. XP, badges and streaks appear on your
        learning dashboard. Leaderboards require parent consent and use nicknames.
      </p>
      <StudyProgress items={studyActivities.map(({ id, title }) => ({ id, title }))} />
      <Link href="/learn" className="button">
        My learning dashboard
      </Link>
    </section>
  );
}
