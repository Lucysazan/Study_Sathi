'use client';
import { useState } from 'react';
import Link from 'next/link';
export type SearchMaterial = {
  id: string;
  title: string;
  grade: number;
  subject: string;
  language: string;
  kind: string;
  path: string;
  edition: string;
};
export function LibrarySearch({ items }: { items: SearchMaterial[] }) {
  const [query, setQuery] = useState(''),
    [grade, setGrade] = useState(''),
    [subject, setSubject] = useState(''),
    [kind, setKind] = useState(''),
    [language, setLanguage] = useState('');
  const active = Boolean(query || grade || subject || kind || language);
  const results = items.filter(
    (i) =>
      (!grade || String(i.grade) === grade) &&
      (!subject || i.subject === subject) &&
      (!kind || i.kind === kind) &&
      (!language || i.language === language) &&
      (i.title + ' ' + i.subject + ' ' + i.edition)
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <section className="study-tools" aria-label="Search school library">
      <h2>Find a book or lesson / सामग्री खोज्नुहोस्</h2>
      <label htmlFor="catalog-query">
        Title, topic or edition
        <input
          id="catalog-query"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div className="library-filters">
        <label htmlFor="catalog-grade">
          Class
          <select id="catalog-grade" value={grade} onChange={(e) => setGrade(e.target.value)}>
            <option value="">All classes</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1}>{i + 1}</option>
            ))}
          </select>
        </label>
        <label htmlFor="catalog-subject">
          Subject
          <select id="catalog-subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">All subjects</option>
            {[...new Set(items.map((i) => i.subject))].sort().map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label htmlFor="catalog-kind">
          Material
          <select id="catalog-kind" value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="">All materials</option>
            <option>PDF</option>
            <option>Video lesson</option>
          </select>
        </label>
        <label htmlFor="catalog-language">
          Language
          <select
            id="catalog-language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">All languages</option>
            {[...new Set(items.map((i) => i.language))].sort().map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      {active && (
        <>
          <p role="status">
            {results.length} matches. Showing up to 30; refine your search for more.
          </p>
          <ul className="catalog-results" aria-label="Matching materials" tabIndex={0}>
            {results.slice(0, 30).map((i) => (
              <li key={i.id}>
                <Link prefetch={false} href={i.path}>
                  {i.title}
                </Link>
                <small>
                  {' '}
                  · Class {i.grade} · {i.subject} · {i.kind} · {i.language} {i.edition}
                </small>
              </li>
            ))}
          </ul>
          {results.length === 0 && <p>No matching material. Try fewer filters.</p>}
        </>
      )}
    </section>
  );
}
