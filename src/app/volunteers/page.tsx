import { Clock, Leaf, Users } from 'lucide-react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ResourceLibrary, ResourceLibraryFallback } from '@/components/resources/ResourceLibrary';

export const metadata: Metadata = {
  title: 'For Volunteers',
  description:
    'Teaching-friendly resources and an example session plan for parents, teachers and volunteers.',
};

const sessionPlan = [
  { time: '5 min', title: 'Introduction', text: 'Ask children what they enjoy doing online.' },
  {
    time: '10 min',
    title: 'Explore together',
    text: 'Choose an online safety resource from the library.',
  },
  {
    time: '10 min',
    title: 'Guided discussion',
    text: 'Talk about privacy, passwords and asking for help.',
  },
  { time: '5 min', title: 'Reflection', text: 'Share one safety habit to try this week.' },
];

export default function VolunteersPage() {
  return (
    <>
      <Suspense fallback={<ResourceLibraryFallback teaching />}>
        <ResourceLibrary teaching />
      </Suspense>

      <section className="site-container section volunteer-bottom">
        <div className="session">
          <div>
            <div className="eyebrow">TRY LEARNING TOGETHER</div>
            <h2>Online Safety Awareness</h2>
            <p>
              An example session plan for parents, teachers and volunteers. This is a suggested
              activity, not a workshop conducted by StudySathi.
            </p>
            <div className="session-chips">
              <span>
                <Users size={16} aria-hidden="true" /> Ages 10–14
              </span>
              <span>
                <Clock size={16} aria-hidden="true" /> About 30 minutes
              </span>
            </div>
          </div>
          <ol>
            {sessionPlan.map(({ time, title, text }) => (
              <li key={title}>
                <b>{time}</b>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="future-callout">
          <Leaf size={30} aria-hidden="true" />
          <div>
            <h2>A future built with communities</h2>
            <p>
              Our future vision includes potential collaboration with schools, NGOs, INGOs, student
              volunteers and community educators. These are future possibilities; StudySathi has no
              official partners to announce.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
