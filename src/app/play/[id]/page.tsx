import Link from 'next/link';
import { notFound } from 'next/navigation';
import { studyActivities, findStudyActivity, simulationUrl } from '@/lib/study/catalog';
import { OptionalLearningCheck } from '@/components/study/OptionalLearningCheck';
import { ActivityPlayer } from '@/components/study/ActivityPlayer';
import { PracticeGame } from '@/components/study/PracticeGame';
export function generateStaticParams() {
  return studyActivities.map((a) => ({ id: a.id }));
}
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const a = findStudyActivity((await params).id);
  return { title: a?.title || 'Activity not found' };
}
export default async function ActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const a = findStudyActivity((await params).id);
  if (!a) notFound();
  const url = a.simulation ? simulationUrl(a.simulation) : null;
  return (
    <section className="site-container section play-activity">
      <Link href="/play" prefetch={false}>
        All Play and Learn activities
      </Link>
      <div className="eyebrow">
        {a.subject} · {a.ages}
      </div>
      <h1 className="detail-title">{a.title}</h1>
      {url && <p className="large-copy">{a.summary}</p>}
      <div id="explore">
        {url ? (
          <ActivityPlayer url={url} title={a.title} />
        ) : (
          <PracticeGame key={a.id} kind={a.widget || a.id} />
        )}
      </div>
      <OptionalLearningCheck
        activityId={a.id}
        questions={a.questions.map(({ id, prompt, options }) => ({ id, prompt, options }))}
      />
      <details className="study-tools" id="simple-explanation">
        <summary>Need a hint? Read a simple explanation</summary>
        <h2>In simple words</h2>
        {a.notes.map((n) => (
          <p key={n}>{n}</p>
        ))}
        <h3>Your task</h3>
        <p>{a.task}</p>
        <p>
          Original StudySathi guidance, not a provider textbook summary. Teacher review and exact
          curriculum alignment are pending.
        </p>
      </details>

      <div className="academic-actions">
        <Link href="/study" className="button secondary">
          Browse textbooks and videos
        </Link>
        <Link href="/resources" className="button secondary">
          Explore related resources
        </Link>
      </div>
    </section>
  );
}
