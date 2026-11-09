import { getCourseRecommendations } from '@/lib/course/recommendations';
import { getStudentDashboard } from '@/lib/gamification/dashboard';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { PortalLoading } from '@/components/portal/PortalShell';
import { badges } from '@/data/seed/badges';
import { avatarGlyphs } from '@/lib/avatars';

export const metadata: Metadata = { title: 'My learning', robots: { index: false } };

export default function LearnPage() {
  return (
    <Suspense fallback={<PortalLoading />}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  const [{ stats, level, streak, continuing, nickname, avatarId }, recommendations] =
    await Promise.all([getStudentDashboard(), getCourseRecommendations()]);
  const earned = badges.filter((badge) => stats.badgeIds.includes(badge.id));
  return (
    <section className="site-container section portal-welcome">
      <div className="eyebrow">MY LEARNING</div>
      <h1 className="detail-title">
        <span aria-hidden="true">{avatarGlyphs[avatarId] ?? '🌿'}</span> Hello, {nickname}!
      </h1>
      <div className="study-tools">
        <h2>Play and Learn progress</h2>
        <p>Complete learning checks to earn XP, build your streak and work toward badges.</p>
        <Link className="button" href="/play/progress" prefetch={false}>
          My activity progress
        </Link>
      </div>
      <div className="learning-dashboard">
        <div className="learning-card learning-continue">
          <h2>Academic study and revision</h2>
          <p>Study Grade 9 Mathematics topics, check your answers and save a revision plan.</p>
          <Link className="button" href="/study/9/mathematics">
            Open Mathematics
          </Link>
        </div>
        <div className="learning-card learning-continue">
          <h2>{continuing?.complete ? 'A course you finished' : 'Continue learning'}</h2>
          {continuing ? (
            <>
              <h3>{continuing.title}</h3>
              <p>
                {continuing.done} of {continuing.total} lessons complete
              </p>
              <Link className="button primary" href={continuing.path}>
                {continuing.complete ? 'Review course' : 'Continue lesson'}
              </Link>
            </>
          ) : (
            <>
              <p>Your next discovery starts here.</p>
              <Link className="button primary" href="/learn/courses">
                Explore courses
              </Link>
            </>
          )}
        </div>
        <div className="learning-card">
          <h2>
            Level {level.level}: {level.name}
          </h2>
          <div
            className="level-ring"
            aria-hidden="true"
            style={{
              background: `conic-gradient(var(--primary) ${(100 * level.earned) / (level.next - level.start)}%, var(--border) 0)`,
            }}
          >
            <span>{level.level}</span>
          </div>
          <p>
            {stats.xp} XP · {level.remaining} XP to the next level
          </p>
          <progress
            value={level.earned}
            max={level.next - level.start}
            aria-label="Progress to next level"
          />
        </div>
        <div className="learning-card">
          <h2>Your learning habit</h2>
          <p>
            {streak > 0
              ? `${streak} day${streak === 1 ? '' : 's'} of learning in a row`
              : 'Start a new streak today!'}
          </p>
          <p>
            {stats.lessonCount} learning activities finished · {stats.courseCount} courses completed
          </p>
        </div>
        <div className="learning-card learning-continue">
          <h2>Your badges</h2>
          {earned.length ? (
            <ul>
              {earned.map((badge) => (
                <li key={badge.id}>
                  <strong>{badge.name}</strong> — {badge.description}
                </li>
              ))}
            </ul>
          ) : (
            <p>Finish a lesson to earn your first badge.</p>
          )}
        </div>
      </div>
      <h2>Courses to explore</h2>
      <div className="learning-dashboard">
        {recommendations.map((course) => (
          <article className="learning-card" key={course.id}>
            <h3>
              <Link href={`/learn/courses/${encodeURIComponent(course.id)}`}>{course.title}</Link>
            </h3>
            <p>{course.summary}</p>
            <p>Teaching language: {course.language || 'Not specified'}</p>
          </article>
        ))}
      </div>
      {!recommendations.length && <p>Browse all courses to find your next lesson.</p>}
      <div className="portal-actions" style={{ flexWrap: 'wrap' }}>
        <Link href="/learn/courses" className="button secondary">
          All courses
        </Link>
        <Link href="/learn/leaderboard" className="button secondary">
          Learning together
        </Link>
        <Link href="/learn/profile" className="button secondary">
          My profile
        </Link>
        <Link href="/saved" className="button secondary">
          Saved resources
        </Link>
      </div>
    </section>
  );
}
