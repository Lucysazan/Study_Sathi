'use client';
import { useState } from 'react';
import { LearningCheck } from './LearningCheck';
export function OptionalLearningCheck(props: {
  activityId: string;
  questions: { id: string; prompt: string; options: string[] }[];
}) {
  const [opened, setOpened] = useState(false),
    [visible, setVisible] = useState(false);
  return (
    <section className="optional-check" id="learning-check">
      <p>Play first. When you are ready, try three short questions.</p>
      <button
        className="button"
        aria-expanded={visible}
        aria-controls="optional-questions"
        onClick={() => {
          setOpened(true);
          setVisible(!visible);
        }}
      >
        {visible ? 'Hide questions' : 'Check what I learned'}
      </button>
      <div id="optional-questions" hidden={!visible}>
        {opened && <LearningCheck {...props} />}
      </div>
    </section>
  );
}
