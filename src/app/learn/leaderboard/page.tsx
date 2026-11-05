import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { PortalLoading } from '@/components/portal/PortalShell';
import { getLeaderboard, type LeaderboardRow } from '@/lib/gamification/leaderboard';
import { avatarGlyphs } from '@/lib/avatars';

export const metadata: Metadata = { title: 'Learning together', robots: { index: false } };
export default function Page({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  return (
    <Suspense fallback={<PortalLoading />}>
      <Leaderboard searchParams={searchParams} />
    </Suspense>
  );
}
async function Leaderboard({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const period = (await searchParams).period === 'all-time' ? 'all-time' : 'week';
  const data = await getLeaderboard(period);
  const label = (row: LeaderboardRow) => (
    <>
      <span aria-hidden="true">{avatarGlyphs[row.avatarId] ?? '🌿'}</span> {row.nickname}
      {row.isYou ? ' (You)' : ''} — {row.xp} XP
    </>
  );
  return (
    <section className="site-container section portal-welcome">
      <h1 className="detail-title">Learning together</h1>
      <p>Celebrate learning at your own pace. Taking part is optional.</p>
      <div className="portal-actions" style={{ flexWrap: 'wrap' }}>
        <Link
          href="/learn/leaderboard"
          className="button secondary"
          aria-current={period === 'week' ? 'page' : undefined}
        >
          This week
        </Link>
        <Link
          href="/learn/leaderboard?period=all-time"
          className="button secondary"
          aria-current={period === 'all-time' ? 'page' : undefined}
        >
          All time
        </Link>
      </div>
      {!data.optedIn ? (
        <div className="notice">
          <p>
            Ask a parent to turn on leaderboard visibility if you would like to join. Only your
            nickname, avatar and XP will appear.
          </p>
        </div>
      ) : (
        <>
          <h2>{period === 'week' ? 'This week’s learning' : 'All-time learning'}</h2>
          {period === 'week' && <p>A fresh week starts Sunday at midnight in Nepal.</p>}
          {data.rows.length ? (
            <>
              <ol className="leaderboard-podium">
                {data.rows.slice(0, 3).map((row, index) => (
                  <li key={index} className="learning-card" value={row.rank}>
                    <strong>Place {row.rank}</strong>
                    <p>{label(row)}</p>
                  </li>
                ))}
              </ol>
              <ol start={4} className="leaderboard-list">
                {data.rows.slice(3).map((row, index) => (
                  <li key={index} value={row.rank}>
                    {label(row)}
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <p>Your learning group is just getting started.</p>
          )}
          <div className="learning-card">
            <h2>Your learning</h2>
            {data.you ? (
              <p>
                Place {data.you.rank} · {data.you.xp} XP. Every lesson is a step forward.
              </p>
            ) : (
              <p>Your place will appear when your parent turns this on or you earn your next XP.</p>
            )}
          </div>
        </>
      )}
      <Link href="/learn" className="button secondary">
        Back to my learning
      </Link>
    </section>
  );
}
