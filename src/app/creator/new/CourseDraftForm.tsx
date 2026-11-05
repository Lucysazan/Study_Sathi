'use client';

import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { courseCategories } from '@/lib/course/draft';
import { saveCourseDraft } from './actions';

export function CourseDraftForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<(typeof courseCategories)[number]>('digital-skills');
  const [summary, setSummary] = useState('');
  const [ageRange, setAgeRange] = useState('12-15');
  const [budget, setBudget] = useState('2-3 hours');
  const [status, setStatus] = useState<'draft' | 'review'>('draft');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setBusy(true);

    const result = await saveCourseDraft({ title, category, summary, ageRange, budget, status });
    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSaved(true);
    router.refresh();
  }

  if (saved) {
    return (
      <div className="notice">
        <CheckCircle2 size={22} aria-hidden="true" />
        <div>
          <h3>Course draft saved</h3>
          <p>
            Your course draft has been created. You can keep editing it from the creator dashboard
            and submit it for review when it is ready.
          </p>
          <div className="portal-actions" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
            <Link href="/creator" className="button primary">
              Back to studio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="auth-form" style={{ maxWidth: 700 }} onSubmit={onSubmit} noValidate>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="field-group">
        <label htmlFor="course-title">Course title</label>
        <input
          id="course-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Foundations of Digital Skills"
          required
        />
      </div>

      <div className="field-group">
        <label htmlFor="course-category">Category</label>
        <select
          id="course-category"
          value={category}
          onChange={(event) => setCategory(event.target.value as (typeof courseCategories)[number])}
        >
          {courseCategories.map((item) => (
            <option key={item} value={item}>
              {item.replace('-', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="field-group">
        <label htmlFor="course-age">Age range</label>
        <input
          id="course-age"
          value={ageRange}
          onChange={(event) => setAgeRange(event.target.value)}
          placeholder="12-15"
          required
        />
      </div>

      <div className="field-group">
        <label htmlFor="course-budget">Time or resource budget</label>
        <input
          id="course-budget"
          value={budget}
          onChange={(event) => setBudget(event.target.value)}
          placeholder="2-3 hours"
        />
      </div>

      <div className="field-group">
        <label htmlFor="course-status">Draft status</label>
        <select
          id="course-status"
          value={status}
          onChange={(event) => setStatus(event.target.value as 'draft' | 'review')}
        >
          <option value="draft">Draft</option>
          <option value="review">Ready for review</option>
        </select>
      </div>

      <div className="field-group">
        <label htmlFor="course-summary">Short summary</label>
        <textarea
          id="course-summary"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          rows={5}
          placeholder="This course helps learners build confidence with digital tools, study habits and safe online practices."
          required
        />
      </div>

      <div className="portal-actions" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
        <button className="button primary" type="submit" disabled={busy}>
          {busy ? 'Saving…' : 'Save draft'}
        </button>
        <Link href="/creator" className="button secondary" aria-label="Back to creator dashboard">
          <ArrowLeft size={18} aria-hidden="true" />
          Back
        </Link>
      </div>
    </form>
  );
}
