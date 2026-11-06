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
        StudySathi is developing an academic learning space for students in Nepal. Our first
        academic pilot focuses on Grade 9 Mathematics.
      </p>
      <h2>The problem we are addressing</h2>
      <p>
        Access to materials is only a starting point. Learners also need explanations, opportunities
        to practise, and guidance on what to revise.
      </p>
      <h2>Our approach</h2>
      <p>
        Choose a topic, read an explanation, follow worked examples, and answer practice questions.
        Feedback links missed questions to a relevant skill so the learner has a clear next step.
      </p>
      <h2>What is available</h2>
      <p>
        Three original mathematics topic units, chapter checks and different follow-up sets,
        student-account result saving, parent progress views, and a permission-controlled textbook
        reader. Existing resources and course tools remain available.
      </p>
      <h2>What still needs review</h2>
      <p>
        Teacher review, current-edition curriculum mapping, verified textbook display permissions
        and real learner evaluation remain pending. The pilot is not a complete syllabus, an
        official government course, or a validated mastery assessment.
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
