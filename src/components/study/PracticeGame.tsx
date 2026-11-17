'use client';
import { useState } from 'react';
import { PocketShop } from './PocketShop';
import { useLanguage } from '@/components/accessibility/language';
import { ReadAloud } from '@/components/accessibility/ReadAloud';
import { AnswerEffect } from '@/components/accessibility/AnswerEffect';
import { nepaliMissions, gameCopy } from '@/data/play-nepali';
import { missions } from '@/data/play-missions';
export function PracticeGame({ kind }: { kind: string }) {
  const [step, setStep] = useState(0),
    [feedback, setFeedback] = useState(''),
    [solved, setSolved] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const { language } = useLanguage();
  const copy = gameCopy[language];
  if (kind === 'budget') return <PocketShop />;
  const original = missions[kind] || missions.reading!;
  const translated = language === 'ne' ? nepaliMissions[kind] || nepaliMissions.reading : null;
  const mission = translated
    ? {
        ...original,
        title: translated.title,
        intro: translated.intro,
        rounds: original.rounds.map((round, i) => ({ ...round, ...translated.rounds[i] })),
      }
    : original;
  const done = step === mission.rounds.length;
  const round = mission.rounds[Math.min(step, mission.rounds.length - 1)]!;
  return (
    <section
      lang={language}
      className={
        'mini-world mission-' + kind + (attempt ? (solved ? ' has-success' : ' has-retry') : '')
      }
      aria-label={mission.title}
    >
      <div className="mini-heading">
        <span>{copy.kicker}</span>
        <h2>{mission.title}</h2>
        <p>{mission.intro}</p>
      </div>
      <div className="mission-track" aria-label={step + ' of 3 missions complete'}>
        {mission.rounds.map((_, i) => (
          <span className={i < step ? 'collected' : ''} key={i}>
            {i < step ? '\u2605' : '\u2606'}
          </span>
        ))}
      </div>
      <div className={'mission-scene' + (solved || done ? ' scene-solved' : '')} aria-hidden="true">
        <span>{done ? '\u{1F389} \u{1F31F} \u{1F389}' : round.scene}</span>
        <div className="mission-ground" />
      </div>
      {done ? (
        <div className="mission-finish">
          <h3>{copy.done}</h3>
          <p>{copy.discoveries}</p>
          <button
            className="button"
            onClick={() => {
              setStep(0);
              setSolved(false);
              setFeedback('');
              setAttempt(0);
            }}
          >
            {copy.replay}
          </button>
        </div>
      ) : (
        <>
          <ReadAloud
            key={step + language}
            language={language}
            clipId={kind + '-' + language + '-' + step}
          />
          <AnswerEffect success={solved} attempt={attempt} />
          <h3 className="mission-clue">{round.clue}</h3>
          <div className="mission-choices">
            {round.choices.map((choice, i) => (
              <button
                key={choice}
                disabled={solved}
                onClick={() => {
                  const ok = i === round.correct;
                  setSolved(ok);
                  setAttempt(attempt + 1);
                  setFeedback(ok ? round.why : copy.retry);
                }}
              >
                <span aria-hidden="true">{['\u{1F7E1}', '\u{1F535}', '\u{1F7E2}'][i]}</span>
                {choice}
              </button>
            ))}
          </div>
          <p role="status" className={'mini-feedback' + (solved ? ' mini-win' : '')}>
            {feedback ? (solved ? round.why : copy.retry) : copy.tap}
          </p>
          {solved && (
            <button
              className="button"
              onClick={() => {
                setStep(step + 1);
                setAttempt(0);
                setSolved(false);
                setFeedback('');
              }}
            >
              {step === 2 ? copy.finish : copy.next} →
            </button>
          )}
        </>
      )}
      <small>{copy.note}</small>
    </section>
  );
}
