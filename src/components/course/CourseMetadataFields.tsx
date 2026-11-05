'use client';

import { useId } from 'react';
import { courseCategories, courseLanguages, type CourseDraftInput } from '@/lib/course/draft';
import { CourseCover } from './CourseCover';

export function CourseMetadataFields({
  value,
  onChange,
}: {
  value: CourseDraftInput;
  onChange: (next: CourseDraftInput) => void;
}) {
  const id = useId();
  function text(
    name: 'title' | 'summary' | 'ageRange' | 'budget' | 'coverImageUrl' | 'coverAlt',
    label: string,
    maxLength: number,
    rows?: number,
  ) {
    return (
      <div className="field-group">
        <label htmlFor={`${id}-${name}`}>{label}</label>
        {rows ? (
          <textarea
            id={`${id}-${name}`}
            rows={rows}
            maxLength={maxLength}
            value={value[name]}
            onChange={(event) => onChange({ ...value, [name]: event.target.value })}
          />
        ) : (
          <input
            id={`${id}-${name}`}
            type={name === 'coverImageUrl' ? 'url' : 'text'}
            maxLength={maxLength}
            value={value[name]}
            onChange={(event) => onChange({ ...value, [name]: event.target.value })}
          />
        )}
      </div>
    );
  }
  return (
    <fieldset className="course-metadata">
      <legend>Course details</legend>
      {text('title', 'Course title', 120)}
      <div className="field-group">
        <label htmlFor={`${id}-category`}>Category</label>
        <select
          id={`${id}-category`}
          value={value.category}
          onChange={(event) =>
            onChange({ ...value, category: event.target.value as CourseDraftInput['category'] })
          }
        >
          {courseCategories.map((category) => (
            <option key={category} value={category}>
              {category.replaceAll('-', ' ')}
            </option>
          ))}
        </select>
      </div>
      {text('summary', 'Short summary', 500, 4)}
      {text('ageRange', 'Age range', 30)}
      {text('budget', 'Time or resource budget', 80)}
      <div className="field-group">
        <label htmlFor={`${id}-language`}>Teaching language</label>
        <select
          id={`${id}-language`}
          value={value.language}
          onChange={(event) =>
            onChange({ ...value, language: event.target.value as CourseDraftInput['language'] })
          }
        >
          <option value="">Choose a language</option>
          {courseLanguages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>
      {text('coverImageUrl', 'Cover image URL (HTTPS)', 500)}
      {text('coverAlt', 'Describe the cover image', 240)}
      <p>
        Use an image you have permission to share. A cover, image description and teaching language
        are needed before review.
      </p>
      <CourseCover src={value.coverImageUrl} alt={value.coverAlt || value.title} />
    </fieldset>
  );
}
