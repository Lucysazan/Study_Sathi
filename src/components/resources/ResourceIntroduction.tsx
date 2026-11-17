'use client';
import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { ResourceScene } from './ResourceScene';
export function ResourceIntroduction({
  title,
  provider,
  category,
  id,
  url,
  lines,
}: {
  title: string;
  provider: string;
  category: string;
  id: string;
  url: string;
  lines: readonly string[];
}) {
  const [step, setStep] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  function move(next: number) {
    setStep(next);
    heading.current?.focus();
  }
  return (
    <section className="resource-story" aria-label={'Meet ' + title}>
      <div className="resource-story-picture">
        <ResourceScene category={category} resourceId={id} />
        <span className="story-sticker" aria-hidden="true">
          {['?', '!', '\u2605'][step]}
        </span>
      </div>
      <div className="resource-story-copy">
        <div
          className="story-chapters"
          aria-label={'Introduction ' + (step + 1) + ' of ' + lines.length}
        >
          {lines.map((_, i) => (
            <span key={i} className={i <= step ? 'lit' : ''} />
          ))}
        </div>
        <span className="eyebrow">
          {['A LITTLE CURIOSITY', 'WHAT YOU CAN DISCOVER', 'YOUR FIRST LITTLE STEP'][step]}
        </span>
        <h2 ref={heading} tabIndex={-1}>
          {lines[step]}
        </h2>
        <div className="story-turns">
          {step > 0 && (
            <button
              className="story-back"
              aria-label="Previous introduction"
              onClick={() => move(step - 1)}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          {step < lines.length - 1 ? (
            <button className="button" onClick={() => move(step + 1)}>
              {step === 0 ? 'Tell me more' : 'Where do I start?'}
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          ) : (
            <a className="button" href={url} target="_blank" rel="noopener noreferrer">
              Explore with {provider}
              <ExternalLink size={18} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
        <p className="story-page-count">
          {step + 1} / {lines.length} · Take your time
        </p>
      </div>
    </section>
  );
}
