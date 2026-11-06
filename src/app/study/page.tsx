import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Academic study',
  description: 'Study a mathematics topic, practise questions and find what to revise next.',
};

export default function AcademicHome() {
  return (
    <section className="site-container section academic-shell">
      <div className="eyebrow">ACADEMIC STUDY</div>
      <h1>Learn a topic. Practise. Know what to revise.</h1>
      <p className="academic-intro">
        Choose your grade to begin. Read an explanation, work through examples and use your answers
        to plan your next step.
      </p>
      <div className="academic-grid">
        <article className="learning-card">
          <h2>Grade 9</h2>
          <p>
            Mathematics pilot · 3 topic units · 24 original practice questions across chapter checks
            and follow-up sets.
          </p>
          <Link className="button" href="/study/9">
            Choose Grade 9
          </Link>
        </article>
        <article className="learning-card">
          <h2>More grades and subjects</h2>
          <p>
            We are starting with a small, usable pilot. Additional subjects and grades will appear
            when their lessons and practice are ready.
          </p>
        </article>
      </div>
      <h2>How the learning journey works</h2>
      <ol className="academic-steps">
        <li>Choose a subject and topic.</li>
        <li>Read the explanation and worked examples.</li>
        <li>Answer a short practice set.</li>
        <li>Review the topics you missed, then try different questions.</li>
      </ol>
      <aside className="notice">
        <p>
          Pilot content: original StudySathi explanations and practice. Teacher review and mapping
          to the current CDC edition are pending. This is not an official government course.
        </p>
      </aside>
      <p>
        <Link href="/study/sources">Sources, editions and content permissions</Link> ·{' '}
        <Link href="/learn">Student dashboard</Link>
      </p>
    </section>
  );
}
