import Link from 'next/link';
import { HomeHero } from '@/components/home/HomeHero';
import { academicChapters, chapterPath } from '@/data/academic';

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <section className="site-container section">
        <div className="eyebrow">GRADE 9 MATHEMATICS PILOT</div>
        <h2>Start with a topic</h2>
        <p>
          Original explanations, worked examples and practice that points you to what to revise
          next.
        </p>
        <div className="academic-grid">
          {academicChapters.map((chapter) => (
            <article className="learning-card" key={chapter.id}>
              <h3>{chapter.title}</h3>
              <p>{chapter.summary}</p>
              <Link className="button secondary" href={chapterPath(chapter.id)}>
                Study {chapter.title}
              </Link>
            </article>
          ))}
        </div>
        <p>
          Pilot material is awaiting teacher review and mapping to the current textbook edition.{' '}
          <Link href="/study/sources">View sources and review status</Link>.
        </p>
      </section>
      <section className="soft-section">
        <div className="site-container section">
          <h2>A clear next step after practice</h2>
          <div className="academic-grid">
            <article className="learning-card">
              <h3>1. Understand</h3>
              <p>Read an explanation and follow a worked example.</p>
            </article>
            <article className="learning-card">
              <h3>2. Check</h3>
              <p>Answer four questions and see the reasoning behind each answer.</p>
            </article>
            <article className="learning-card">
              <h3>3. Revise</h3>
              <p>Return to the skills you missed, then try different follow-up questions.</p>
            </article>
          </div>
        </div>
      </section>
      <section className="site-container section">
        <h2>Your existing learning space</h2>
        <p>Student courses, parent accounts and creator tools continue to work.</p>
        <div className="academic-actions">
          <Link className="button" href="/learn">
            My learning
          </Link>
          <Link className="button secondary" href="/resources">
            Supporting resources
          </Link>
          <Link className="button secondary" href="/safety-mission">
            Digital safety practice
          </Link>
        </div>
      </section>
    </>
  );
}
