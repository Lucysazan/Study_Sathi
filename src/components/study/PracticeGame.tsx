'use client';
import { useState } from 'react';
export function PracticeGame({ kind }: { kind: string }) {
  const [spend, setSpend] = useState(50),
    [feedback, setFeedback] = useState('');
  return (
    <section className="study-tools">
      <h2>Try it yourself</h2>
      {kind === 'budget' ? (
        <>
          <label htmlFor="budget-spend">Spend from Rs 100: Rs {spend}</label>
          <input
            id="budget-spend"
            type="range"
            min={0}
            max={100}
            step={5}
            value={spend}
            onChange={(e) => setSpend(Number(e.target.value))}
          />
          <div className="budget-visual" aria-hidden="true">
            <span style={{ width: spend + '%' }} />
          </div>
          <p role="status">
            Rs {100 - spend} remaining.{' '}
            {100 - spend >= 20
              ? 'You have kept at least Rs 20.'
              : 'Try spending less to keep Rs 20.'}
          </p>
        </>
      ) : (
        <>
          <p>
            {kind === 'password'
              ? 'A message says: “You won a prize! Send your login code now.” Choose your response.'
              : 'You have an empty refillable bottle. Choose an action.'}
          </p>
          <div className="academic-actions">
            {(kind === 'password'
              ? ['Send the code', 'Check with a trusted adult', 'Forward the message']
              : ['Reuse it', 'Burn it', 'Throw it anywhere']
            ).map((choice, i) => (
              <button
                className="button secondary"
                key={choice}
                onClick={() =>
                  setFeedback(
                    kind === 'password'
                      ? i === 1
                        ? 'Safer choice. Keep the code private and verify independently.'
                        : 'Keep login codes private. Unexpected prizes and urgency are warning signs.'
                      : i === 0
                        ? 'Useful choice. Reusing a suitable bottle can reduce waste.'
                        : 'Try reusing it. Burning or littering can harm people and the environment.',
                  )
                }
              >
                {choice}
              </button>
            ))}
          </div>
          <p role="status">{feedback}</p>
        </>
      )}
      <p>
        Original StudySathi exploration. No points for clicking; complete the learning check to
        record your understanding.
      </p>
    </section>
  );
}
