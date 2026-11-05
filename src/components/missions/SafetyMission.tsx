'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { missionCopy, safetyScenarios, type MissionLanguage } from '@/data/safety-mission';

export function SafetyMission() {
  const [language, setLanguage] = useState<MissionLanguage>('en');
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const copy = missionCopy[language];
  const scenario = safetyScenarios[step];
  const checked = answers.length > step;
  useEffect(() => {
    if (step > 0) heading.current?.focus();
  }, [step]);

  return (
    <div className="safety-mission" lang={language}>
      <div className="mission-language" role="group" aria-label="Language / भाषा">
        <button
          type="button"
          lang="en"
          aria-pressed={language === 'en'}
          onClick={() => setLanguage('en')}
        >
          English
        </button>
        <button
          type="button"
          lang="ne"
          aria-pressed={language === 'ne'}
          onClick={() => setLanguage('ne')}
        >
          नेपाली
        </button>
      </div>
      <div className="eyebrow">{copy.kicker}</div>
      <h1 className="detail-title">{copy.title}</h1>
      <p className="mission-intro">{copy.intro}</p>
      <progress
        value={Math.min(step + Number(checked), safetyScenarios.length)}
        max={safetyScenarios.length}
        aria-label={`${copy.progress} ${Math.min(step + 1, safetyScenarios.length)} ${copy.of} ${safetyScenarios.length}`}
      />
      {scenario ? (
        <article className="learning-card mission-scenario">
          <p>
            {copy.progress} {step + 1} {copy.of} {safetyScenarios.length}
          </p>
          <h2 ref={heading} tabIndex={-1}>
            {scenario.title[language]}
          </h2>
          <div className="mission-message">
            <span>
              <ShieldCheck size={17} aria-hidden="true" /> {copy.fictional}
            </span>
            <blockquote>{scenario.message[language]}</blockquote>
          </div>
          <fieldset disabled={checked}>
            <legend>{copy.question}</legend>
            {scenario.options.map((option) => (
              <label
                className="mission-option"
                key={option.id}
                data-safer={checked && option.id === scenario.safeChoice}
              >
                <input
                  type="radio"
                  name={`mission-${scenario.id}`}
                  value={option.id}
                  checked={choice === option.id}
                  onChange={() => setChoice(option.id)}
                />
                <span>{option.text[language]}</span>
              </label>
            ))}
          </fieldset>
          {!checked ? (
            <button
              type="button"
              className="button primary"
              disabled={!choice}
              onClick={() => {
                setAnswers((previous) =>
                  previous.length === step ? [...previous, choice] : previous,
                );
                requestAnimationFrame(() => feedback.current?.focus());
              }}
            >
              {copy.check}
            </button>
          ) : (
            <>
              <div className="mission-feedback" role="status" ref={feedback} tabIndex={-1}>
                <h3>
                  <CheckCircle2 size={20} aria-hidden="true" />{' '}
                  {choice === scenario.safeChoice ? copy.correct : copy.learn}
                </h3>
                <p>
                  <strong>{copy.clue}:</strong> {scenario.clue[language]}
                </p>
                <p>
                  <strong>{copy.safer}:</strong>{' '}
                  {
                    scenario.options.find((option) => option.id === scenario.safeChoice)?.text[
                      language
                    ]
                  }
                </p>
                <p>{scenario.explanation[language]}</p>
              </div>
              <button
                type="button"
                className="button primary"
                onClick={() => {
                  setStep(step + 1);
                  setChoice('');
                }}
              >
                {step === safetyScenarios.length - 1 ? copy.finish : copy.next}
              </button>
            </>
          )}
        </article>
      ) : (
        <section className="learning-card mission-result">
          <ShieldCheck size={38} aria-hidden="true" />
          <h2 ref={heading} tabIndex={-1}>
            {copy.complete}
          </h2>
          <p className="mission-plan">{copy.plan}</p>
          <p>
            {copy.result}:{' '}
            <strong>
              {
                answers.filter((answer, index) => answer === safetyScenarios[index]?.safeChoice)
                  .length
              }{' '}
              / {safetyScenarios.length}
            </strong>
          </p>
          <p>{copy.practice}</p>
          <div className="portal-actions">
            <button
              className="button primary"
              type="button"
              onClick={() => {
                setStep(0);
                setChoice('');
                setAnswers([]);
                requestAnimationFrame(() => heading.current?.focus());
              }}
            >
              {copy.retry}
            </button>
            <Link className="button secondary" href="/resources">
              {copy.resources}
            </Link>
          </div>
        </section>
      )}
      <p className="mission-note">{copy.privacy}</p>
      <p className="mission-note">
        {copy.sources}:{' '}
        <a
          href="https://www.nepalbank.com.np/cyber-security"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nepal Bank
        </a>
        {' · '}
        <a
          href="https://sudurpashchim.nepalpolice.gov.np/safety-and-security/safety-and-security-tips/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nepal Police
        </a>
      </p>
    </div>
  );
}
