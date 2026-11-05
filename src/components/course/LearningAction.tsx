'use client';

import { useActionState } from 'react';
import { badges } from '@/data/seed/badges';
import type { ActionResult } from '@/lib/actions';

export function LearningAction({
  action,
  courseId,
  lessonId,
  disabled,
  label,
}: {
  action: (data: FormData) => Promise<ActionResult<unknown>>;
  courseId: string;
  lessonId?: string;
  disabled: boolean;
  label: string;
}) {
  const [state, submit, pending] = useActionState(
    async (_previous: ActionResult<unknown> | null, data: FormData) => action(data),
    null,
  );
  const data = state?.ok && state.data && typeof state.data === 'object' ? state.data : null;
  const xp = data && 'xpAwarded' in data && typeof data.xpAwarded === 'number' ? data.xpAwarded : 0;
  const badgeIds =
    data && 'newBadges' in data && Array.isArray(data.newBadges) ? data.newBadges : [];
  const earned = badges.filter((badge) => badgeIds.includes(badge.id));
  return (
    <form action={submit} className={lessonId ? 'lesson-actions' : undefined}>
      <input type="hidden" name="courseId" value={courseId} />
      {lessonId && <input type="hidden" name="lessonId" value={lessonId} />}
      <button type="submit" className="button primary" disabled={pending || disabled || state?.ok}>
        {pending ? 'Saving…' : disabled || state?.ok ? 'Saved' : label}
      </button>
      <p aria-live="polite" className={state && !state.ok ? 'form-error' : undefined}>
        {state && !state.ok
          ? state.error
          : state?.ok
            ? xp > 0
              ? `Lesson saved. +${xp} XP!`
              : 'Saved. You can keep learning.'
            : ''}
      </p>
      {earned.map((badge) => (
        <div className="notice" role="status" key={badge.id}>
          <p>
            New badge: {badge.name}. {badge.description}
          </p>
        </div>
      ))}
    </form>
  );
}
