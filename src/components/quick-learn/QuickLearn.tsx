'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { filterQuickVideos, quickSubjects, type QuickVideo } from '@/lib/quick-learn/catalog';
import { useSavedIds } from '@/lib/storage/guest-data';
import { QuickSession } from './QuickSession';
export function QuickLearn({ videos }: { videos: readonly QuickVideo[] }) {
  const [language, setLanguage] = useState(''),
    [subject, setSubject] = useState(''),
    [age, setAge] = useState(''),
    [savedOnly, setSavedOnly] = useState(false);
  const saved = useSavedIds(),
    params = useSearchParams();
  const selected = filterQuickVideos(videos, { language, subject, age, savedOnly }, saved);
  const reset = () => {
    setLanguage('');
    setSubject('');
    setAge('');
    setSavedOnly(false);
  };
  return (
    <>
      <div className="quick-filters">
        <label>
          Spoken language
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="">All spoken languages</option>
            <option value="ne">Nepali</option>
            <option value="en">English</option>
            <option value="none">Visual / no lesson narration</option>
          </select>
        </label>
        <label>
          Subject
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">All subjects</option>
            {quickSubjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Suggested age
          <select value={age} onChange={(e) => setAge(e.target.value)}>
            <option value="">Ages 10-16</option>
            <option value="10-12">Ages 10-12</option>
            <option value="13-16">Ages 13-16</option>
          </select>
        </label>
        <label className="quick-saved-filter">
          <input
            type="checkbox"
            checked={savedOnly}
            onChange={(e) => setSavedOnly(e.target.checked)}
          />
          Saved shorts only
        </label>
        <button className="text-link" onClick={reset}>
          Clear filters
        </button>
      </div>
      <p className="quick-count" role="status">
        {selected.length} selected educational shorts. Spoken language and lesson subject are
        separate filters.
      </p>
      {selected.length ? (
        <QuickSession
          key={`${language}/${subject}/${age}/${savedOnly}/${params.get('video') || ''}`}
          videos={selected}
          initialId={params.get('video') || undefined}
        />
      ) : (
        <section className="quick-break">
          <h2>No reviewed shorts match yet.</h2>
          <p>
            Try another filter, or save a short to find it here. We only publish individually
            selected videos.
          </p>
          <button className="button" onClick={reset}>
            Show all reviewed shorts
          </button>
        </section>
      )}
    </>
  );
}
