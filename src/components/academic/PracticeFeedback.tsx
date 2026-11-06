import type { PracticeResult } from '@/lib/academic/types';
export function PracticeFeedback({
  result,
  skills,
  saveMessage,
}: {
  result: PracticeResult;
  skills: { id: string; title: string }[];
  saveMessage: string;
}) {
  return (
    <>
      {' '}
      <h3>
        Your practice result: {result.correct}/{result.total}
      </h3>
      <p role="status">{saveMessage}</p>
      <ol>
        {result.feedback.map((item, index) => (
          <li key={item.questionId}>
            <strong>
              Question {index + 1}: {item.correct ? 'Correct' : 'Review this answer'}
            </strong>
            <p>
              Answer: {item.answer}. {item.explanation}
            </p>
          </li>
        ))}
      </ol>
      <h3>What to study next</h3>
      {result.skills.some((skill) => skill.correct < skill.total) ? (
        <ul>
          {result.skills
            .filter((skill) => skill.correct < skill.total)
            .map((skill) => (
              <li key={skill.id}>
                <a href={`#skill-${skill.id}`}>
                  Review {skills.find((s) => s.id === skill.id)?.title}
                </a>{' '}
                — {skill.correct}/{skill.total} correct. Read the worked example, then try follow-up
                practice.
              </li>
            ))}
        </ul>
      ) : (
        <p>
          You answered this set correctly. Try a different set or revisit the topic tomorrow. One
          short check does not establish mastery.
        </p>
      )}
      <p>
        Recommendations use missed question topics. The suggested one-day review interval is a pilot
        rule.
      </p>
    </>
  );
}
