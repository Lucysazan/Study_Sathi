import { BookOpen, Compass, Search } from 'lucide-react';
import type { Metadata } from 'next';
import { MissionBanner } from '@/components/ui/MissionBanner';
import { PageTitle } from '@/components/ui/PageTitle';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Why StudySathi exists, how it organizes free learning resources, and how it supports SDG 4.',
};

const roadmap = [
  {
    title: 'Functional resource directory',
    label: 'Available now',
    text: '15 resources, search and filters, saved materials and learning paths.',
  },
  {
    title: 'More resources, better Nepali accessibility',
    label: 'Future phase',
    text: 'Expand the reviewed collection and improve access in Nepali.',
  },
  {
    title: 'User testing and content improvements',
    label: 'Future phase',
    text: 'Learn from children, parents and educators to improve usability.',
  },
  {
    title: 'Potential NGO and INGO collaboration',
    label: 'Future phase',
    text: 'Explore opportunities without assuming or claiming partnerships.',
  },
  {
    title: 'Community and offline learning support',
    label: 'Future phase',
    text: 'Investigate practical ways to support learning with limited connectivity.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageTitle
        eyebrow="OUR PURPOSE"
        title={
          <>
            Learning opens possibilities.
            <br />
            <span>Let&apos;s make it easier to find.</span>
          </>
        }
        intro="StudySathi is a free educational resource discovery platform for children and community educators in Nepal."
      />
      <section className="site-container section about-content">
        <div className="about-grid">
          <div>
            <span className="path-icon academic" aria-hidden="true">
              <Search />
            </span>
            <h2>The problem</h2>
            <p>
              Free learning resources exist across many websites. Finding materials that suit a
              child&apos;s age, language and interests can take time and guidance.
            </p>
          </div>
          <div>
            <span className="path-icon environment" aria-hidden="true">
              <Compass />
            </span>
            <h2>Our approach</h2>
            <p>
              Bring selected resources into one simple directory, organized by category, age,
              language and purpose. Add short learning paths and tools to save useful materials.
            </p>
          </div>
        </div>

        <MissionBanner
          id="sdg"
          eyebrow="SDG 4 · QUALITY EDUCATION"
          title="Easier access can support inclusive learning."
        >
          StudySathi aims to help learners and educators discover free materials, including
          resources in Nepali. It focuses on resource discovery and organized learning; it does not
          claim measured educational impact.
        </MissionBanner>

        <SectionHeading
          className="related"
          eyebrow="WHERE WE GO FROM HERE"
          title="A thoughtful path forward"
          intro="The directory is the beginning. Future phases depend on testing and available support."
        />
        <ol className="roadmap">
          {roadmap.map(({ title, label, text }, i) => (
            <li key={title}>
              <b>{String(i + 1).padStart(2, '0')}</b>
              <div>
                <span className="eyebrow">{label}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="notice">
          <BookOpen size={25} aria-hidden="true" />
          <div>
            <h3>Built to help people find learning</h3>
            <p>
              StudySathi organizes links. Learning materials remain on the providers&apos; websites
              and belong to them. The interface is in English for now; individual resource languages
              are clearly labeled. No accounts or personal profiles are needed. Saved items, notes
              and progress stay in your browser and may be lost if browser data is cleared.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
