'use client';
import { useState } from 'react';
import { useStudyStorage, studyStorageChanged } from './useStudyStorage';
import Link from 'next/link';
export function StudyText({ en, ne }: { en: string; ne: string }) {
  const nepali = useStudyStorage('study-language') === 'ne';
  return <span lang={nepali ? 'ne' : 'en'}>{nepali ? ne : en}</span>;
}
export function StudyTools() {
  const ne = useStudyStorage('study-language') === 'ne';
  const raw = useStudyStorage('study-last');
  let last: { title: string; path: string } | null = null;
  try {
    const value = JSON.parse(raw || 'null');
    if (
      value &&
      typeof value.title === 'string' &&
      typeof value.path === 'string' &&
      /^\/study\//.test(value.path)
    )
      last = value;
  } catch {}
  return (
    <aside className="study-tools">
      <button
        className="button secondary"
        aria-pressed={ne}
        onClick={() => {
          try {
            localStorage.setItem('study-language', ne ? 'en' : 'ne');
            studyStorageChanged();
          } catch {}
        }}
      >
        English / नेपाली
      </button>
      <p lang={ne ? 'ne' : 'en'}>
        {ne
          ? 'कक्षा छान्नुहोस् → विषय छान्नुहोस् → पुस्तक पढ्नुहोस्, भिडियो हेर्नुहोस् र अभ्यास गर्नुहोस्।'
          : 'Choose class → choose subject → read, watch and practise.'}
      </p>
      {last && (
        <Link href={last.path} prefetch={false}>
          {ne ? 'पढाइ जारी राख्नुहोस्' : 'Continue studying'}: {last.title}
        </Link>
      )}
      <p>
        {ne
          ? 'प्रगति यही ब्राउजरमा मात्र रहन्छ।'
          : 'Reading and lesson selections stay on this browser only.'}
      </p>
      <button
        className="text-link"
        onClick={() => {
          try {
            for (let i = localStorage.length - 1; i >= 0; i--) {
              const key = localStorage.key(i);
              if (key?.startsWith('study-')) localStorage.removeItem(key);
            }
          } catch {}

          studyStorageChanged();
        }}
      >
        Clear saved study activity
      </button>
    </aside>
  );
}
export function rememberStudy(title: string, key: string, value: string) {
  try {
    localStorage.setItem(key, value);
    localStorage.setItem('study-last', JSON.stringify({ title, path: location.pathname }));
    studyStorageChanged();
  } catch {}
}
export function ResourceFeedback({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <details className="study-tools">
      <summary>Resource problem or accessibility need?</summary>
      <p>
        Check the original source if a PDF or video does not load. Captions and sign-language
        support depend on the provider. No accessibility review is implied.
      </p>
      <p>
        Copy the details to share with your teacher or the StudySathi team. This button does not
        send a report.
      </p>
      <button
        className="button secondary"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(title + '\n' + location.href);
            setCopied(true);
          } catch {
            setCopied(false);
          }
        }}
      >
        Copy resource details
      </button>
      <p role="status">{copied ? 'Copied. Share these details with your teacher.' : ''}</p>
    </details>
  );
}
