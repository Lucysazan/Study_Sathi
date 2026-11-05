'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { setCourseStatus } from './actions';

const labels = {
  draft: 'Draft',
  review: 'In review',
  published: 'Published',
} as const;

export function CourseReviewControls({
  courseId,
  status,
  title,
}: {
  courseId: string;
  status: 'draft' | 'review' | 'published';
  title: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSetStatus(nextStatus: 'draft' | 'review' | 'published') {
    setPending(true);
    setMessage(null);
    const result = await setCourseStatus(courseId, nextStatus);
    setPending(false);

    if (!result.ok) {
      setMessage(result.error);
      return;
    }

    setMessage(`${title} is now ${labels[nextStatus]}.`);
    router.refresh();
  }

  return (
    <div className="row-actions">
      <div className="row-actions-buttons">
        <Link href={`/admin/courses/${courseId}`} className="button secondary">
          Open
        </Link>
        <button type="button" className="button secondary" disabled={pending || status === 'draft'} onClick={() => handleSetStatus('draft')}>
          Draft
        </button>
        <button type="button" className="button secondary" disabled={pending || status === 'review'} onClick={() => handleSetStatus('review')}>
          Review
        </button>
        <button type="button" className="button primary" disabled={pending || status === 'published'} onClick={() => handleSetStatus('published')}>
          Publish
        </button>
      </div>
      {message && <p className="admin-row-status" role="status">{message}</p>}
    </div>
  );
}
