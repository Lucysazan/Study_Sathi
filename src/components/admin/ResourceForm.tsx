'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useState, useTransition } from 'react';
import { saveResource } from '@/app/admin/resources/actions';
import { Field, SelectField, TextAreaField } from '@/components/ui/FormFields';
import { categories, learningPurposes, resourceFormats, resourceLanguages } from '@/lib/filters';
import { ageLabel, MAX_AGE, MIN_AGE } from '@/lib/validation/catalog';
import type { Resource } from '@/types/catalog';

type Values = {
  title: string;
  provider: string;
  category: string;
  topic: string;
  description: string;
  language: string;
  audience: 'children' | 'adults';
  minAge: string;
  maxAge: string;
  format: string;
  purpose: string;
  url: string;
  note: string;
  verification: string;
};

const blank: Values = {
  title: '',
  provider: '',
  category: '',
  topic: '',
  description: '',
  language: '',
  audience: 'children',
  minAge: '',
  maxAge: '',
  format: '',
  purpose: '',
  url: 'https://',
  note: '',
  verification: '',
};

function fromResource(r: Resource): Values {
  return {
    ...r,
    audience: r.minAge === null ? 'adults' : 'children',
    minAge: r.minAge === null ? '' : String(r.minAge),
    maxAge: r.maxAge === null ? '' : String(r.maxAge),
  };
}

/** Add or edit a curated resource. Validated again on the server (resourceInputSchema). */
export function ResourceForm({ resource }: { resource?: Resource }) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(resource ? fromResource(resource) : blank);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [pending, startTransition] = useTransition();

  const set =
    <K extends keyof Values>(key: K) =>
    (e: { target: { value: string } }) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await saveResource(resource?.id ?? null, values);
      if (result.ok) {
        router.push(`/admin/resources?saved=${encodeURIComponent(values.title.trim())}`);
        return;
      }
      setFormError(result.error);
      setErrors(result.fieldErrors ?? {});
    });
  }

  const min = Number(values.minAge);
  const max = Number(values.maxAge);
  const preview =
    values.audience === 'adults'
      ? ageLabel(null, null)
      : values.minAge && values.maxAge && min <= max
        ? `Ages ${ageLabel(min, max)}`
        : '';

  return (
    <form className="admin-form" onSubmit={onSubmit} noValidate>
      {formError && (
        <p className="form-error" role="alert">
          {formError}
        </p>
      )}

      <fieldset>
        <legend>About the resource</legend>
        <Field label="Title" value={values.title} onChange={set('title')} error={errors.title} />
        <Field
          label="Provider"
          value={values.provider}
          onChange={set('provider')}
          error={errors.provider}
          hint="Who made it. We credit providers and never claim partnerships."
        />
        <TextAreaField
          label="Description"
          rows={3}
          value={values.description}
          onChange={set('description')}
          error={errors.description}
        />
        <Field
          label="Link to the original"
          type="url"
          inputMode="url"
          value={values.url}
          onChange={set('url')}
          error={errors.url}
        />
      </fieldset>

      <fieldset>
        <legend>How it is listed</legend>
        <div className="form-grid">
          <SelectField
            label="Category"
            options={categories}
            placeholder="Choose…"
            value={values.category}
            onChange={set('category')}
            error={errors.category}
          />
          <Field label="Topic" value={values.topic} onChange={set('topic')} error={errors.topic} />
          <SelectField
            label="Language"
            options={resourceLanguages}
            placeholder="Choose…"
            value={values.language}
            onChange={set('language')}
            error={errors.language}
          />
          <SelectField
            label="Format"
            options={resourceFormats}
            placeholder="Choose…"
            value={values.format}
            onChange={set('format')}
            error={errors.format}
          />
          <SelectField
            label="Learning purpose"
            options={learningPurposes}
            placeholder="Choose…"
            value={values.purpose}
            onChange={set('purpose')}
            error={errors.purpose}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend>Who it is for</legend>
        <div className="choice-row">
          {(
            [
              ['children', 'Children (age range)'],
              ['adults', 'Parents and volunteers'],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="choice">
              <input
                type="radio"
                name="audience"
                checked={values.audience === value}
                onChange={() => setValues((v) => ({ ...v, audience: value }))}
              />
              <span>
                <strong>{label}</strong>
              </span>
            </label>
          ))}
        </div>
        {values.audience === 'children' && (
          <div className="form-grid">
            <Field
              label="Youngest age"
              type="number"
              inputMode="numeric"
              min={MIN_AGE}
              max={MAX_AGE}
              value={values.minAge}
              onChange={set('minAge')}
              error={errors.minAge}
            />
            <Field
              label="Oldest age"
              type="number"
              inputMode="numeric"
              min={MIN_AGE}
              max={MAX_AGE}
              value={values.maxAge}
              onChange={set('maxAge')}
              error={errors.maxAge}
            />
          </div>
        )}
        {preview && <p className="form-hint">Shown on the site as: {preview}</p>}
      </fieldset>

      <fieldset>
        <legend>Honesty notes</legend>
        <TextAreaField
          label="Access note (optional)"
          rows={2}
          value={values.note}
          onChange={set('note')}
          error={errors.note}
          hint="For example: “Some lessons need a free educator account.”"
        />
        <TextAreaField
          label="Verification"
          rows={3}
          value={values.verification}
          onChange={set('verification')}
          error={errors.verification}
          hint="When and how you checked the link, plus any suitability notes."
        />
      </fieldset>

      <div className="form-actions">
        <button className="button" type="submit" disabled={pending}>
          {pending ? 'Saving…' : resource ? 'Save changes' : 'Add resource'}
        </button>
        <button
          className="button secondary"
          type="button"
          onClick={() => router.push('/admin/resources')}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
