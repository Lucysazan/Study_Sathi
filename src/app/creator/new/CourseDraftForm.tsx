'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { readCourseMetadata } from '@/lib/course/metadata';
import { CourseMetadataFields } from '@/components/course/CourseMetadataFields';
import { saveCourseDraft } from './actions';

export function CourseDraftForm() {
  const router = useRouter();
  const [details, setDetails] = useState(() =>
    readCourseMetadata({ ageRange: '12-15', budget: '2-3 hours' }),
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors([]);
    setBusy(true);
    try {
      const result = await saveCourseDraft(details);
      if (!result.ok) {
        setErrors(result.fieldErrors ? Object.values(result.fieldErrors) : [result.error]);
        return;
      }
      router.push('/creator/drafts/' + encodeURIComponent(result.data.id));
    } catch {
      setErrors(['We could not save your draft. Please try again.']);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="auth-form" style={{ maxWidth: 700 }} onSubmit={onSubmit} noValidate>
      {errors.length > 0 && (
        <ul className="form-error" role="alert">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
      <CourseMetadataFields value={details} onChange={setDetails} />
      <p>
        New courses are saved as drafts. Add lessons and complete the checklist before submitting
        for review.
      </p>
      <div className="portal-actions" style={{ flexWrap: 'wrap' }}>
        <button className="button primary" type="submit" disabled={busy}>
          {busy ? 'Saving?' : 'Save draft and add lessons'}
        </button>
        <Link href="/creator" className="button secondary">
          Back to studio
        </Link>
      </div>
    </form>
  );
}
