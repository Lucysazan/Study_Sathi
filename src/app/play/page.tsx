import type { Metadata } from 'next';
import { studyActivities } from '@/lib/study/catalog';
import { PlayGallery } from '@/components/study/PlayGallery';
export const metadata: Metadata = {
  title: 'Play and Learn',
  description:
    'Try colourful game previews, explore free learning activities and open questions when you are ready.',
};
export default function PlayPage() {
  return (
    <section className="site-container section play-home">
      <PlayGallery
        items={studyActivities.map(({ id, title, subject, ages, simulation, widget }) => ({
          id,
          title,
          subject,
          ages,
          simulation,
          widget,
        }))}
      />
      <details className="play-about">
        <summary>About these activities</summary>
        <p>
          Preview illustrations are original StudySathi mini interactions. Full activities include
          credited PhET simulations, original interactive activities and guided practice. Class
          ranges are guidance; teacher review is pending.
        </p>
        <p>
          First perfect optional learning checks earn XP once per activity and support existing
          badges, streaks and optional parent-consented leaderboards. Playing a preview does not
          award points.
        </p>
      </details>
    </section>
  );
}
