'use client';
import { useState } from 'react';
export function NumberGarden() {
  const [picked, setPicked] = useState<number[]>([]),
    [round, setRound] = useState(0);
  const target = [3, 5, 7][round % 3]!;
  const done = picked.length === target;
  return (
    <section className="trail-game number-garden" aria-label="Apple counting game">
      <div className="game-kicker">APPLE ORCHARD</div>
      <h3>Pick {target} apples for the picnic!</h3>
      <p>Tap an apple to put it in your basket. Tap a picked apple to put it back.</p>
      <div className="apple-tree">
        <div className="tree-trunk" aria-hidden="true" />
        <div className="apple-canopy">
          {Array.from({ length: 8 }, (_, i) => (
            <button
              key={i}
              aria-label={`Apple ${i + 1}`}
              aria-pressed={picked.includes(i)}
              onClick={() =>
                setPicked(picked.includes(i) ? picked.filter((n) => n !== i) : [...picked, i])
              }
              className={picked.includes(i) ? 'picked' : ''}
            >
              <svg viewBox="0 0 60 65" aria-hidden="true">
                <path d="M30 17Q36 3 45 5Q44 19 30 17" fill="#43874d" />
                <path
                  d="M30 22Q12 9 7 29Q1 53 23 59Q30 54 37 59Q59 54 54 29Q50 10 30 22"
                  fill="#f17061"
                />
                <path
                  d="M18 27Q12 35 16 42"
                  fill="none"
                  stroke="#ffcec1"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ))}
        </div>
      </div>
      <div className="picnic-basket" aria-label={`${picked.length} apples in basket`}>
        {picked.map((i) => (
          <span key={i} aria-hidden="true" className="basket-apple" />
        ))}
        <strong>
          {picked.length} / {target}
        </strong>
      </div>
      <p role="status">
        {done
          ? 'Picnic ready! You counted the apples.'
          : picked.length > target
            ? 'A few too many! Put some apples back.'
            : `Keep picking: ${target - picked.length} more to find.`}
      </p>
      <div className="game-controls">
        <button className="button secondary" onClick={() => setPicked([])}>
          Empty basket
        </button>
        {done && (
          <button
            className="button"
            onClick={() => {
              setRound(round + 1);
              setPicked([]);
            }}
          >
            Next picnic
          </button>
        )}
      </div>
    </section>
  );
}
export function RiverHops() {
  const [position, setPosition] = useState(0),
    [round, setRound] = useState(0);
  const target = [5, 8, 10][round % 3]!;
  return (
    <section className="trail-game river-hops" aria-label="Number river game">
      <div className="game-kicker">FROG RIVER</div>
      <h3>Help the frog reach {target}</h3>
      <p>Choose a hop. Watch the number grow!</p>
      <div className="river-stones">
        {Array.from({ length: 11 }, (_, i) => (
          <div className={position === i ? 'river-stone current' : 'river-stone'} key={i}>
            <span>{i}</span>
            {position === i && (
              <span className="little-frog" aria-label="Frog">
                <i />
                <i />
              </span>
            )}
          </div>
        ))}
      </div>
      <p role="status">
        {position === target
          ? 'You reached the picnic spot!'
          : `The frog is on ${position}. The goal is ${target}.`}
      </p>
      <div className="game-controls">
        <button
          className="button"
          disabled={position + 1 > target}
          onClick={() => setPosition(position + 1)}
        >
          Hop +1
        </button>
        <button
          className="button"
          disabled={position + 2 > target}
          onClick={() => setPosition(position + 2)}
        >
          Hop +2
        </button>
        <button className="button secondary" onClick={() => setPosition(0)}>
          Start again
        </button>
        {position === target && (
          <button
            className="button"
            onClick={() => {
              setRound(round + 1);
              setPosition(0);
            }}
          >
            Next river
          </button>
        )}
      </div>
    </section>
  );
}
