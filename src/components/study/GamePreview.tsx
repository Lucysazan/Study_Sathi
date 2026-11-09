'use client';
import { useState } from 'react';
const labels: Record<string, string> = {
  fractions: 'Add a slice',
  balance: 'Balance it',
  circuits: 'Flip the switch',
  budget: 'Save a coin',
  'digital-safety': 'Lock it',
  waste: 'Grow a leaf',
  reading: 'Turn a page',
  'study-habits': 'Finish a step',
};
export function GamePreview({ id }: { id: string }) {
  const [step, setStep] = useState(0);
  const on = step % 2 === 1,
    n = ((step + 1) % 4) + 1;
  const status =
    id === 'fractions'
      ? `${n}/4 slices`
      : id === 'balance'
        ? on
          ? 'Balanced!'
          : 'Can you balance it?'
        : id === 'circuits'
          ? on
            ? 'You lit it up!'
            : 'Make it glow'
          : id === 'budget'
            ? `Rs ${20 + (step % 9) * 10} saved`
            : id === 'digital-safety'
              ? on
                ? 'Code protected!'
                : 'Keep your code safe'
              : id === 'waste'
                ? `${3 + (step % 5)} growing leaves`
                : id === 'reading'
                  ? `Page ${1 + (step % 9)}`
                  : `${step % 5}/4 steps`;
  return (
    <button
      className={'game-preview preview-' + id}
      onClick={() => setStep(step + 1)}
      aria-label={`${labels[id]} preview`}
    >
      <svg viewBox="0 0 240 180" aria-hidden="true" className="preview-art">
        <circle cx="120" cy="90" r="76" fill="white" opacity=".4" />
        {id === 'fractions' ? (
          <>
            <circle cx="120" cy="90" r="65" fill="#cc7b32" />
            <circle cx="120" cy="90" r="57" fill="#ffda66" />
            {[0, 1, 2, 3].map((i) => (
              <path
                key={i}
                d={`M120 90 L${120 + 57 * Math.cos((i * Math.PI) / 2)} ${90 + 57 * Math.sin((i * Math.PI) / 2)} A57 57 0 0 1 ${120 + 57 * Math.cos(((i + 1) * Math.PI) / 2)} ${90 + 57 * Math.sin(((i + 1) * Math.PI) / 2)} Z`}
                fill={i < n ? '#f8b94c' : '#fff5d6'}
                stroke="#b46b2f"
                strokeWidth="3"
              />
            ))}
            {[
              [140, 65],
              [145, 110],
              [95, 115],
              [95, 65],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="8" fill={i < n ? '#df6d61' : '#f9e9bf'} />
            ))}
            <path
              d="M175 35l7-10m-2 30 13-1"
              stroke="#d59025"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </>
        ) : null}
        {id === 'balance' ? (
          <>
            <path d="M95 148l25-55 25 55z" fill="#168a86" />
            <circle cx="120" cy="112" r="9" fill="#075c54" />
            <g transform={`rotate(${on ? 0 : -12} 120 106)`}>
              <rect x="35" y="100" width="170" height="12" rx="6" fill="#1d465e" />
              <rect x="47" y="62" width="36" height="38" rx="7" fill="#f4bb44" />
              <rect x="156" y="45" width="36" height="55" rx="7" fill="#ec8b82" />
              <text x="65" y="87" textAnchor="middle" fill="#563c24" fontSize="17" fontWeight="700">
                2
              </text>
              <text
                x="174"
                y="80"
                textAnchor="middle"
                fill="#563c24"
                fontSize="17"
                fontWeight="700"
              >
                2
              </text>
            </g>
          </>
        ) : null}
        {id === 'circuits' ? (
          <>
            <path
              d="M68 52H170V130H68V105M68 75V52"
              fill="none"
              stroke={on ? '#e3ad26' : '#537d90'}
              strokeWidth="7"
              strokeLinejoin="round"
            />
            <rect x="53" y="72" width="30" height="38" rx="6" fill="#09877d" />
            <path d="M62 83h12m-6-6v12" stroke="white" strokeWidth="3" />
            <circle
              cx="170"
              cy="69"
              r={on ? 33 : 26}
              fill={on ? '#ffe27a' : '#d3e5ec'}
              opacity={on ? 1 : 0.8}
            />
            <circle
              cx="170"
              cy="69"
              r="24"
              fill={on ? '#ffce46' : '#edf4f7'}
              stroke="#c69b32"
              strokeWidth="3"
            />
            <path
              d="M161 91v10h18V91m-15-28 6 15 6-15"
              fill="none"
              stroke="#ab7b21"
              strokeWidth="3"
            />
            {on && (
              <path
                d="M170 25v-9m34 25 9-7m-75 7-9-7"
                stroke="#eab531"
                strokeWidth="4"
                strokeLinecap="round"
              />
            )}
          </>
        ) : null}
        {id === 'budget' ? (
          <>
            <ellipse cx="120" cy="103" rx="63" ry="40" fill="#e99b9a" />
            <circle cx="169" cy="92" r="25" fill="#efacab" />
            <path d="M154 72l-4-25 25 22" fill="#e99b9a" />
            <rect x="78" y="127" width="20" height="24" rx="7" fill="#cd777e" />
            <rect x="143" y="127" width="20" height="24" rx="7" fill="#cd777e" />
            <circle cx="172" cy="86" r="4" fill="#273b51" />
            <ellipse cx="189" cy="101" rx="15" ry="11" fill="#d77c84" />
            <path d="M100 73h30" stroke="#934e60" strokeWidth="4" strokeLinecap="round" />
            <g className="preview-float">
              <circle cx="116" cy="40" r="20" fill="#f8c94d" stroke="#d7a22b" strokeWidth="3" />
              <text
                x="116"
                y="46"
                textAnchor="middle"
                fontSize="16"
                fontWeight="700"
                fill="#88641e"
              >
                Rs
              </text>
            </g>
          </>
        ) : null}
        {id === 'digital-safety' ? (
          <>
            <path d="M120 25l62 22v44c0 34-34 56-62 70-28-14-62-36-62-70V47z" fill="#5b82c1" />
            <path d="M120 40l48 17v34c0 24-24 44-48 57-24-13-48-33-48-57V57z" fill="#e4efff" />
            <rect x="97" y="80" width="46" height="38" rx="8" fill={on ? '#087f75' : '#f4bd46'} />
            <path
              d={on ? 'M106 80V67a14 14 0 0 1 28 0v13' : 'M106 80V67a14 14 0 0 1 28 0'}
              fill="none"
              stroke={on ? '#087f75' : '#bd8e2c'}
              strokeWidth="7"
            />
            <circle cx="120" cy="97" r="4" fill="white" />
          </>
        ) : null}
        {id === 'waste' ? (
          <>
            <path d="M65 123h110l-13 39H78z" fill="#d99b6d" />
            <path d="M120 124V45" stroke="#348461" strokeWidth="7" strokeLinecap="round" />
            {[0, 1, 2, 3, 4, 5, 6].slice(0, 3 + (step % 5)).map((i) => (
              <ellipse
                key={i}
                cx={i % 2 ? 139 : 101}
                cy={104 - i * 10}
                rx="22"
                ry="12"
                fill={i % 2 ? '#73b885' : '#348d69'}
                transform={`rotate(${i % 2 ? -32 : 32} ${i % 2 ? 139 : 101} ${104 - i * 10})`}
              />
            ))}
            <circle cx="180" cy="38" r="16" fill="#f3cc58" className="preview-float" />
          </>
        ) : null}
        {id === 'reading' ? (
          <>
            <path
              d="M120 49C88 32 56 38 35 48v100c30-15 59-12 85 0 26-12 55-15 85 0V48c-21-10-53-16-85 1z"
              fill="#fafcf6"
              stroke="#6889b7"
              strokeWidth="4"
            />
            <path d="M120 50v96" stroke="#6889b7" strokeWidth="4" />
            {[0, 1, 2, 3].map((i) => (
              <g key={i} stroke={on ? '#e5af39' : '#9db4cf'} strokeWidth="5" strokeLinecap="round">
                <path d={`M51 ${68 + i * 17}l49 2`} />
                <path d={`M140 ${70 + i * 17}l48-2`} />
              </g>
            ))}
            <path
              d="M169 28l6-16 6 16 17 6-17 6-6 17-6-17-17-6z"
              fill="#efc34d"
              className="preview-float"
            />
          </>
        ) : null}
        {id === 'study-habits' ? (
          <>
            <rect
              x="53"
              y="32"
              width="134"
              height="128"
              rx="17"
              fill="white"
              stroke="#a59bd0"
              strokeWidth="4"
            />
            <path d="M53 68h134" stroke="#a59bd0" strokeWidth="4" />
            <path d="M83 22v24m74-24v24" stroke="#7465a5" strokeWidth="8" strokeLinecap="round" />
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <rect
                  x={76 + (i % 2) * 52}
                  y={82 + Math.floor(i / 2) * 39}
                  width="32"
                  height="27"
                  rx="6"
                  fill={i < step % 5 ? '#bde5d2' : '#eeebf8'}
                />
                {i < step % 5 && (
                  <path
                    d={`M${82 + (i % 2) * 52} ${95 + Math.floor(i / 2) * 39}l6 6 12-14`}
                    fill="none"
                    stroke="#248367"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                )}
              </g>
            ))}
          </>
        ) : null}
      </svg>
      <span className="preview-status" aria-live="polite">
        {status}
      </span>
      <span className="preview-tap">
        {labels[id]} <span aria-hidden="true">↻</span>
      </span>
    </button>
  );
}
