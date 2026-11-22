import { PaperFilters } from './PaperFilters';

export type MotifName = 'books' | 'kite' | 'globe' | 'trail' | 'bookmark' | 'board' | 'shield';

/**
 * Small original painted motifs for page title slides. Decorative (aria-hidden): the page
 * heading carries the meaning. Each has one idle motion, styled in paper-deck.css.
 */
export function Motif({ name }: { name: MotifName }) {
  const p = `motif-${name}`;
  const wash = `url(#${p}-wash)`;
  const ink = `url(#${p}-ink)`;
  return (
    <svg className={`motif motif-${name}`} viewBox="0 0 240 240" aria-hidden="true">
      <PaperFilters prefix={p} />
      {name === 'books' && (
        <g>
          <ellipse cx="120" cy="212" rx="86" ry="10" fill="var(--ink)" opacity=".12" />
          <g className="m-float">
            <rect x="44" y="164" width="152" height="40" fill="var(--cobalt)" filter={wash} />
            <rect x="56" y="124" width="132" height="40" fill="var(--grass)" filter={wash} />
            <rect x="50" y="88" width="140" height="36" fill="var(--marigold)" filter={wash} />
            <g stroke="var(--ink)" strokeWidth="2.4" fill="none" filter={ink}>
              <path d="M44 164h152v40H44ZM56 124h132v40H56ZM50 88h140v36H50Z" />
              <path d="M180 164v40M68 124v40M176 88v36" />
            </g>
            <path
              d="M72 176h60M78 140h50M66 102h56"
              stroke="#fffcf4"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
          <g className="m-pencil" filter={ink}>
            <path
              d="M150 24 196 70l-12 12-46-46Z"
              fill="var(--blush)"
              stroke="var(--ink)"
              strokeWidth="2.4"
            />
            <path d="M138 36l-10 28 28-10Z" fill="#f3c9a1" stroke="var(--ink)" strokeWidth="2.4" />
            <path d="M131 55l-3 9 9-3Z" fill="var(--ink)" />
          </g>
        </g>
      )}
      {name === 'kite' && (
        <g>
          <path
            className="m-string"
            d="M120 150C110 190 150 200 128 238"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="1.6"
          />
          <g className="m-sway">
            <path d="M120 14 196 84 120 152 44 84Z" fill="var(--marigold)" filter={wash} />
            <path d="M120 14 196 84H44Z" fill="var(--blush)" filter={wash} />
            <path d="M120 14v138M44 84h152" stroke="var(--ink)" strokeWidth="2.4" filter={ink} />
            <path
              d="M120 14 196 84 120 152 44 84Z"
              fill="none"
              stroke="var(--ink)"
              strokeWidth="2.6"
              filter={ink}
            />
            <g className="m-tail">
              <path
                d="M120 152c-14 18 12 30-4 50"
                fill="none"
                stroke="var(--ink)"
                strokeWidth="1.6"
              />
              <path d="M108 168l10 4-10 4ZM128 168l-10 4 10 4Z" fill="var(--cobalt)" />
              <path d="M106 190l10 4-10 4ZM126 190l-10 4 10 4Z" fill="var(--grass)" />
            </g>
          </g>
        </g>
      )}
      {name === 'globe' && (
        <g>
          <circle cx="120" cy="124" r="78" fill="var(--cobalt)" filter={wash} />
          <g className="m-spin-land" clipPath={`url(#${p}-clip)`}>
            <g>
              <path
                id={`${p}-land`}
                d="M60 90c20-20 50-10 56 8s-14 30-4 46-20 30-40 20-30-50-12-74ZM150 70c24 4 40 30 30 48s-30 4-40 22-28-6-22-28 10-46 32-42Z"
                fill="var(--grass)"
                filter={wash}
              />
              <use href={`#${p}-land`} x="160" />
            </g>
          </g>
          <clipPath id={`${p}-clip`}>
            <circle cx="120" cy="124" r="78" />
          </clipPath>
          <g className="m-orbit">
            <ellipse
              cx="120"
              cy="124"
              rx="108"
              ry="30"
              fill="none"
              stroke="var(--ink)"
              strokeWidth="2"
              transform="rotate(-18 120 124)"
            />
            <circle
              cx="222"
              cy="92"
              r="9"
              fill="var(--marigold)"
              stroke="var(--ink)"
              strokeWidth="2"
            />
          </g>
        </g>
      )}
      {name === 'trail' && (
        <g>
          <path d="M10 210 120 46l110 164Z" fill="var(--cobalt)" filter={wash} />
          <path d="M120 46 146 85l-14-6-12 14-12-12-14 8Z" fill="#fffcf4" />
          <path
            className="m-dash"
            d="M50 210c40-10 30-40 70-50s20-40 40-60-20-30 -40-54"
            fill="none"
            stroke="var(--marigold)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="1 14"
          />
          <path d="M120 46V14" stroke="var(--ink)" strokeWidth="2.6" />
          <path
            className="m-flag"
            d="M121 14h34l-8 9 8 9h-34Z"
            fill="var(--blush)"
            stroke="var(--ink)"
            strokeWidth="2"
          />
        </g>
      )}
      {name === 'bookmark' && (
        <g>
          <g className="m-sway">
            <path d="M70 20h100v196l-50-40-50 40Z" fill="var(--marigold)" filter={wash} />
            <path
              d="M70 20h100v196l-50-40-50 40Z"
              fill="none"
              stroke="var(--ink)"
              strokeWidth="2.6"
              filter={ink}
            />
            <path
              className="m-twinkle"
              d="M120 70l9 22 22 9-22 9-9 22-9-22-22-9 22-9Z"
              fill="var(--cobalt)"
            />
          </g>
        </g>
      )}
      {name === 'board' && (
        <g>
          <path
            d="M60 210 84 150M180 210l-24-60"
            stroke="var(--ink)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <rect x="22" y="28" width="196" height="132" fill="#8a5a3c" />
          <rect x="32" y="38" width="176" height="112" fill="#2f6b45" filter={wash} />
          <text
            className="m-write"
            x="120"
            y="112"
            textAnchor="middle"
            fill="#fffcf4"
            fontSize="54"
            fontFamily="var(--font-mukta), sans-serif"
            fontWeight="500"
          >
            क ख ग
          </text>
          <path d="M150 150h30v-6h-30Z" fill="#fffcf4" />
        </g>
      )}
      {name === 'shield' && (
        <g>
          <path
            d="M120 18 196 46v62c0 54-34 92-76 114-42-22-76-60-76-114V46Z"
            fill="var(--cobalt)"
            filter={wash}
          />
          <path
            d="M120 18 196 46v62c0 54-34 92-76 114-42-22-76-60-76-114V46Z"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="2.6"
            filter={ink}
          />
          <path
            className="m-check"
            d="M84 116l26 26 48-54"
            fill="none"
            stroke="var(--marigold)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="m-shine"
            d="M150 40 170 48"
            stroke="#fffcf4"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>
      )}
    </svg>
  );
}
