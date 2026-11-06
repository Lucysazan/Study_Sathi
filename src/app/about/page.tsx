import type { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = {
  title: 'About StudySathi',
  description:
    'Academic topic learning, original practice and targeted revision for learners in Nepal.',
};
export default function AboutPage() {
  return (
    <section className="site-container section academic-shell">
      <div className="eyebrow">OUR PURPOSE</div>
      <h1>A clearer path from reading to understanding</h1>
      <p>
        StudySathi brings together class-wise textbooks and teaching playlists for learners in
        Nepal, alongside original practice activities.
      </p>
      <h2>The problem we are addressing</h2>
      <p>
        Access to materials is only a starting point. Learners also need explanations, opportunities
        to practise, and guidance on what to revise.
      </p>
      <h2>Our approach</h2>
      <p>
        Choose a class and subject, read a government-hosted textbook or watch NCED Virtual lessons
        inside StudySathi. Our original Grade 9 Mathematics practice adds feedback and revision
        suggestions.
      </p>
      <h2>What is available</h2>
      <p>
        Class and subject browsing for Grades 1–12, in-page PDF viewing with original download
        links, full-playlist YouTube players and searchable indexed lesson lists. The mathematics
        practice pilot, student accounts, parent progress views and creator course tools remain
        available.
      </p>
      <h2>What still needs review</h2>
      <p>
        Catalog coverage varies by grade and subject. Provider materials may use different editions;
        students should match them to their school syllabus. Teacher review of our original practice
        and real learner evaluation remain pending. This is not an official government course or a
        validated mastery assessment.
      </p>
      <h2 id="sdg">Our connection to SDG 4</h2>
      <p>
        We aim to support access to learning and useful practice. We do not claim measured
        educational impact before evaluation.
      </p>
      <h2>Content and privacy</h2>
      <p>
        Official materials remain credited to their publishers. Our explanations and questions are
        labeled separately. Public practice is visit-only. Signed-in students can save practice
        results privately, and linked parents can view summaries. No public student profiles or
        messaging are provided.
      </p>
      <div className="academic-actions">
        <Link className="button" href="/study">
          Start academic study
        </Link>
        <Link className="button secondary" href="/study/sources">
          Sources and permissions
        </Link>
      </div>
    </section>
  );
}
