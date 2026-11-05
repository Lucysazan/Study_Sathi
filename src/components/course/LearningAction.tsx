'use client';

import { useActionState } from 'react';
import type { ActionResult } from '@/lib/actions';

export function LearningAction({
  action,
  courseId,
  lessonId,
  disabled,
  label,
}: {
  action: (data: FormData) => Promise<ActionResult>;
  courseId: string;
  lessonId?: string;
  disabled: boolean;
  label: string;
}) {
  const [state, submit, pending] = useActionState(
    async (_previous: ActionResult | null, data: FormData) => action(data),
    null,
  );
  return (
    <form action={submit} className={lessonId ? 'lesson-actions' : undefined}>
      <input type="hidden" name="courseId" value={courseId} />
      {lessonId && <input type="hidden" name="lessonId" value={lessonId} />}
      <button type="submit" className="button primary" disabled={pending || disabled || state?.ok}>
        {pending ? 'Saving…' : disabled || state?.ok ? 'Saved' : label}
      </button>
      <p aria-live="polite" className={state && !state.ok ? 'form-error' : undefined}>
        {state && !state.ok ? state.error : state?.ok ? 'Saved. You can keep learning.' : ''}
      </p>
    </form>
  );
}
