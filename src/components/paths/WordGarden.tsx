'use client';
import { useState } from 'react';
const rounds = [
  { word: 'CAT', letters: ['T', 'C', 'A'], hint: 'A little friend that says meow', kind: 'cat' },
  { word: 'SUN', letters: ['N', 'U', 'S'], hint: 'It shines in the sky', kind: 'sun' },
  { word: 'BIRD', letters: ['R', 'B', 'D', 'I'], hint: 'A little friend with wings', kind: 'bird' },
];
export function WordGarden() {
  const [round, setRound] = useState(0),
    [picked, setPicked] = useState<number[]>([]);
  const item = rounds[round % rounds.length]!;
  const answer = picked.map((i) => item.letters[i]).join('');
  const done = answer === item.word;
  return (
    <section className="trail-game word-garden" aria-label="Word garden game">
      <div className="game-kicker">WORD GARDEN - {(round % rounds.length) + 1} / 3</div>
      <div className="word-stage">
        <svg viewBox="0 0 300 160" role="img" aria-label={item.hint}>
          <path d="M0 145Q80 100 160 145T300 140V160H0" fill="#a9db97" />
          {item.kind === 'cat' ? (
            <g fill="#efaa63" stroke="#784e3b" strokeWidth="3">
              <path d="M90 80L85 25L125 55Q150 40 175 55L215 25L210 80V110Q150 170 90 110Z" />
              <ellipse cx="128" cy="84" rx="4" ry="8" fill="#172b4d" />
              <ellipse cx="175" cy="84" rx="4" ry="8" fill="#172b4d" />
              <path d="M145 105L155 105L150 112Z" fill="#ed748b" />
              <path
                d="M150 112Q136 130 125 115M150 112Q164 130 175 115M115 103L70 96M115 113L70 119M185 103L230 96M185 113L230 119"
                fill="none"
              />
            </g>
          ) : item.kind === 'sun' ? (
            <g stroke="#e5aa27" strokeWidth="9" strokeLinecap="round">
              <path d="M150 10V28M150 128V145M80 78H95M205 78H225M100 25L112 39M190 25L179 39M100 130L112 116M190 130L179 116" />
              <circle cx="150" cy="78" r="44" fill="#f7ce50" />
              <path d="M131 82Q150 109 170 82" stroke="#9f6a25" strokeWidth="3" fill="none" />
              <circle cx="133" cy="65" r="3" fill="#172b4d" />
              <circle cx="168" cy="65" r="3" fill="#172b4d" />
            </g>
          ) : (
            <g>
              <path d="M70 110L225 140" stroke="#9b704c" strokeWidth="8" />
              <ellipse cx="150" cy="80" rx="48" ry="38" fill="#65b5d5" />
              <path d="M120 70Q150 135 177 76" fill="#318da9" />
              <circle cx="175" cy="64" r="5" fill="#172b4d" />
              <path d="M196 74L226 84L196 91" fill="#f3bc46" />
              <path d="M112 80L76 53L86 104" fill="#65b5d5" />
            </g>
          )}
        </svg>
      </div>
      <h3>{item.hint}</h3>
      <p>Tap the letters in order to spell the word.</p>
      <div className="word-slots" aria-label="Your word">
        {item.word.split('').map((_, i) => (
          <span key={i}>{answer[i] || '_'}</span>
        ))}
      </div>
      <div className="letter-pool">
        {item.letters.map((letter, i) => (
          <button
            key={i}
            disabled={picked.includes(i) || done}
            onClick={() => setPicked([...picked, i])}
            aria-label={`Letter ${letter}`}
          >
            {letter}
          </button>
        ))}
      </div>
      <p role="status">
        {done
          ? `You grew the word ${item.word.toLowerCase()}!`
          : picked.length === item.word.length
            ? 'Almost! Clear the tiles and try a different order.'
            : 'Which letter comes next?'}
      </p>
      <div className="game-controls">
        <button className="button secondary" onClick={() => setPicked([])}>
          Clear tiles
        </button>
        {done && (
          <button
            className="button"
            onClick={() => {
              setRound(round + 1);
              setPicked([]);
            }}
          >
            Next word
          </button>
        )}
      </div>
    </section>
  );
}
