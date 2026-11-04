import { ArrowRight, ArrowUpRight, BookOpen, Compass, Leaf, Search, Users } from 'lucide-react';
import Link from 'next/link';
import { HomeHero } from '@/components/home/HomeHero';
import { PathCard } from '@/components/paths/PathCard';
import { CategoryIcon } from '@/components/resources/CategoryIcon';
import { ResourceGrid } from '@/components/resources/ResourceGrid';
import { MissionBanner } from '@/components/ui/MissionBanner';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { featuredResourceIds, getResource, paths, resources } from '@/data/catalog';
import { categoryMeta } from '@/lib/categories';
import { filtersToQueryString, emptyFilters } from '@/lib/filters';

const howSteps = [
  {
    Icon: Search,
    title: 'Discover your next interest',
    text: 'Find the right resources by topic, age, language or learning style.',
  },
  {
    Icon: Compass,
    title: 'Follow a learning pathway',
    text: 'Explore a short sequence of activities, one small step at a time.',
  },
  {
    Icon: Users,
    title: 'Learn your way, together',
    text: 'Learn independently or with a parent, teacher or volunteer.',
  },
];

export default function HomePage() {
  const featured = featuredResourceIds.map(getResource).filter((r) => r !== undefined);

  return (
    <>
      <HomeHero />

      <div className="intro-strip">
        <div className="site-container">
          <span>
            <BookOpen aria-hidden="true" />
            {resources.length} curated resources
          </span>
          <span>
            <Compass aria-hidden="true" />
            {categoryMeta.length} ways to explore
          </span>
          <span>
            <Users aria-hidden="true" />
            For learners ages 10–16
          </span>
          <span>
            <Leaf aria-hidden="true" />
            Supporting SDG 4
          </span>
        </div>
      </div>

      <section className="site-container section">
        <SectionHeading
          eyebrow="FOLLOW YOUR CURIOSITY"
          title="What would you like to learn?"
          intro="A world of possibilities. Find your place to start."
          link={{ href: '/resources', label: 'Explore all resources' }}
        />
        <div className="categories">
          {categoryMeta.map((c) => (
            <Link
              key={c.name}
              href={`/resources${filtersToQueryString({ ...emptyFilters, category: c.name })}`}
              className={`category-card ${c.className}`}
            >
              <span className="category-icon">
                <CategoryIcon category={c.name} size={25} />
              </span>
              <h3>{c.name}</h3>
              <p>{c.description}</p>
              <ArrowUpRight className="category-arrow" size={20} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="soft-section">
        <div className="site-container section">
          <SectionHeading
            eyebrow="HANDPICKED FOR YOU TO EXPLORE"
            title="A good place to start"
            intro="Free learning materials from established educational providers."
            link={{ href: '/resources', label: 'View all resources' }}
          />
          <ResourceGrid resources={featured} featured />
        </div>
      </section>

      <section className="site-container section">
        <SectionHeading
          eyebrow="ONE SMALL STEP AT A TIME"
          title="A little direction. A lot to discover."
          intro="Follow a simple learning path, at your own pace."
          link={{ href: '/learning-paths', label: 'All learning paths' }}
        />
        <div className="path-grid">
          {paths.map((p, i) => (
            <PathCard key={p.id} path={p} index={i} />
          ))}
        </div>
      </section>

      <section className="how-section">
        <div className="site-container section">
          <div className="center">
            <div className="eyebrow">SIMPLE BY DESIGN</div>
            <h2>Your next discovery is three steps away</h2>
          </div>
          <div className="how-grid">
            {howSteps.map(({ Icon, title, text }, i) => (
              <div key={title}>
                <span className="how-icon" aria-hidden="true">
                  <Icon size={25} />
                  <b>0{i + 1}</b>
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="site-container section">
        <MissionBanner
          eyebrow="SMALL STEPS TOWARD QUALITY EDUCATION"
          title="More access. More opportunity."
          action={
            <Link className="button light" href="/about">
              Our story <ArrowRight size={18} aria-hidden="true" />
            </Link>
          }
        >
          StudySathi supports SDG 4 by helping children and community educators discover free
          learning materials and practical skills resources.
        </MissionBanner>
      </section>
    </>
  );
}
