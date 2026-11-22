import { PaperFilters } from './PaperFilters';

/**
 * Original illustration: the top of a child's face peeking up from the bottom of a
 * brushed marigold panel. Eyes follow the pointer (`data-eyes` on the wrapper).
 */
export function PeekArt() {
  const p = 'peek';
  return (
    <svg
      className="peek-art"
      viewBox="0 0 400 460"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <PaperFilters prefix={p} />
      <defs>
        <filter id={`${p}-brush`} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.09 0.004"
            numOctaves="3"
            seed="12"
            result="n"
          />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 0.11  0 0 0 0 0.37  0 0 0 0 0.78  0 0 0 -2.4 1.25"
          />
        </filter>
        <clipPath id={`${p}-eye-l`}>
          <ellipse cx="150" cy="390" rx="20" ry="11" />
        </clipPath>
        <clipPath id={`${p}-eye-r`}>
          <ellipse cx="256" cy="390" rx="20" ry="11" />
        </clipPath>
      </defs>
      <rect width="400" height="460" fill="var(--marigold)" />
      {/* Cobalt brush streaks running down the panel */}
      <rect
        className="peek-streaks"
        width="400"
        height="460"
        filter={`url(#${p}-brush)`}
        opacity=".55"
      />

      <g className="peek-face">
        <ellipse cx="203" cy="470" rx="150" ry="120" fill="#f0c29b" filter={`url(#${p}-ink)`} />
        {/* Bob haircut */}
        <path
          d="M40 470c-6-120 60-180 163-182 104 2 170 64 162 182h-22L336 340L332 336 L314 354 L296 336 L278 354 L260 336 L242 354 L224 336 L206 354 L188 336 L170 354 L152 336 L134 354 L116 336 L98 354 L80 336L72 340 64 470Z"
          fill="var(--ink)"
          filter={`url(#${p}-ink)`}
        />
        <rect
          x="280"
          y="318"
          width="34"
          height="9"
          fill="var(--cobalt)"
          transform="rotate(-18 297 322)"
        />
        <g
          fill="none"
          stroke="var(--ink)"
          strokeWidth="4"
          strokeLinecap="round"
          className="art-brows"
        >
          <path d="M124 364q26-12 50-2" />
          <path d="M232 362q26-10 50 2" />
        </g>
        {[
          { cx: 150, id: `${p}-eye-l` },
          { cx: 256, id: `${p}-eye-r` },
        ].map(({ cx, id }) => (
          <g key={id} className="art-eye">
            <ellipse cx={cx} cy="390" rx="20" ry="11" fill="#fffcf4" />
            <g clipPath={`url(#${id})`}>
              <g className="art-pupil">
                <circle cx={cx} cy="391" r="9" fill="var(--ink)" />
                <circle cx={cx + 3} cy="388" r="2.6" fill="#fffcf4" />
              </g>
            </g>
            <path
              d={`M${cx - 22} 392q22-20 44-2`}
              fill="none"
              stroke="var(--ink)"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </g>
        ))}
        <ellipse cx="203" cy="448" rx="14" ry="10" fill="var(--blush)" opacity=".8" />
        <ellipse
          cx="110"
          cy="430"
          rx="28"
          ry="16"
          fill="var(--blush)"
          opacity=".5"
          filter={`url(#${p}-blush)`}
        />
        <ellipse
          cx="296"
          cy="430"
          rx="28"
          ry="16"
          fill="var(--blush)"
          opacity=".5"
          filter={`url(#${p}-blush)`}
        />
      </g>
    </svg>
  );
}
