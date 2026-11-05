import type { courseChecklist } from '@/lib/course/metadata';

export function CourseChecklist({ checklist }: { checklist: ReturnType<typeof courseChecklist> }) {
  const items = [
    ['Course title', checklist.title],
    ['Short summary', checklist.summary],
    ['Valid age, category and course details', checklist.details],
    ['Teaching language selected', checklist.language],
    ['Cover image and description', checklist.cover],
    ['Complete lessons, image descriptions and quiz answers', checklist.lessons],
  ] as const;
  return (
    <ul className="course-checklist">
      {items.map(([label, ready]) => (
        <li key={label}>
          <span aria-label={ready ? 'Ready' : 'Needed'}>{ready ? '✓' : '○'}</span> {label}
        </li>
      ))}
    </ul>
  );
}
