import Link from 'next/link';
import type { CSSProperties } from 'react';
import { BookOpenCheck, ClipboardCheck, MonitorPlay } from 'lucide-react';
import { HillsArt } from '@/components/art/HillsArt';
import { QuickPreview } from '@/components/quick-learn/QuickPreview';
import { DiscoveryGuide } from '@/components/home/DiscoveryGuide';
import { HomeHero } from '@/components/home/HomeHero';
import { GradeGrid } from '@/components/academic/LibraryNavigation';

const STEPS = [
  {
    Icon: BookOpenCheck,
    title: 'Read your textbook',
    text: 'Open a verified textbook PDF in our reader, jump to a page, or open the original to save it.',
  },
  {
    Icon: MonitorPlay,
    title: 'Watch the subject playlist',
    text: 'Play NCED Virtual lessons here, search lesson titles and use the full playlist menu.',
  },
  {
    Icon: ClipboardCheck,
    title: 'Check your understanding',
    text: 'Try our Grade 9 mathematics practice pilot and get suggestions on what to revise.',
    link: { href: '/study/9/mathematics#practice-topics', label: 'Open practice' },
  },
];

/** Home: a deck of printed slides laid on a table. Each part is one slide. */
export default function HomePage() {
  return (
    <div className="deck">
      <HomeHero />

      <section id="choose-class" className="part" aria-labelledby="class-title">
        <div className="slide class-slide" data-reveal>
          <div className="class-art" data-tilt>
            <HillsArt />
          </div>
          <div className="class-copy">
            <p className="part-mark">
              <span>Part.</span>
              <strong>01</strong>
            </p>
            <h2 id="class-title" className="serif-title">
              Choose your class
            </h2>
            <p className="slide-text">
              Free textbooks and video lessons for classes 1 to 12, organised by subject.
            </p>
            <span className="monogram small" aria-hidden="true">
              S
            </span>
          </div>
          <div className="class-grid">
            <GradeGrid />
          </div>
        </div>
      </section>

      <DiscoveryGuide />
      <QuickPreview />

      <section className="part" aria-labelledby="steps-title">
        <div className="slide steps-slide" data-reveal>
          <div className="steps-head">
            <p className="part-mark">
              <span>Part.</span>
              <strong>04</strong>
            </p>
            <h2 id="steps-title" className="steps-title">
              Read. Watch. Practise.
            </h2>
          </div>
          <ol className="steps">
            {STEPS.map(({ Icon, title, text, link }, i) => (
              <li key={title} style={{ '--d': i } as CSSProperties}>
                <span className="step-num" aria-hidden="true">
                  {i + 1}
                </span>
                <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
                {link && (
                  <Link className="line-link" href={link.href}>
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="part" aria-labelledby="together-title">
        <div className="slide together-slide" data-reveal>
          <h2 id="together-title">Keep learning, together.</h2>
          <div className="together-links">
            <Link href="/learn">My learning</Link>
            <Link href="/resources">Supporting resources</Link>
            <Link href="/safety-mission">Digital safety practice</Link>
            <Link href="/study/sources">Sources and coverage</Link>
          </div>
          <span className="together-block" aria-hidden="true" />
        </div>
      </section>
    </div>
  );
}
