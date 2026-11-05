'use client';

import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { submitCreatorApplication } from './actions';

type CreatorApplicationFormProps = {
  pending: boolean;
};

export function CreatorApplicationForm({ pending }: CreatorApplicationFormProps) {
  const router = useRouter();
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('');
  const [goals, setGoals] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(pending);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await submitCreatorApplication({ bio, experience, goals });
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSubmitted(true);
    router.refresh();
  }

  if (submitted) {
    return (
      <div className="notice">
        <Sparkles size={22} aria-hidden="true" />
        <div>
          <h3>Application received</h3>
          <p>
            Your creator application is in review. Once an admin approves it, the course studio and
            publishing tools will unlock for your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="field-group">
        <label htmlFor="bio">What kind of learning experience do you want to create?</label>
        <textarea
          id="bio"
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          rows={5}
          minLength={25}
          maxLength={1000}
          required
          placeholder="I want to create beginner-friendly learning paths on digital skills for young adults..."
        />
      </div>

      <div className="field-group">
        <label htmlFor="experience">Tell us a little about your background.</label>
        <textarea
          id="experience"
          value={experience}
          onChange={(event) => setExperience(event.target.value)}
          rows={4}
          minLength={15}
          maxLength={1000}
          required
          placeholder="I have taught community workshops and am comfortable creating guided lessons..."
        />
      </div>

      <div className="field-group">
        <label htmlFor="goals">What are you hoping to build for learners?</label>
        <textarea
          id="goals"
          value={goals}
          onChange={(event) => setGoals(event.target.value)}
          rows={4}
          minLength={15}
          maxLength={1000}
          required
          placeholder="I want to help students build confidence through structured, practical study guides..."
        />
      </div>

      <button className="button primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting…' : 'Submit application'}
      </button>
    </form>
  );
}
