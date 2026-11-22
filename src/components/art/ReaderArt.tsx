import { PaperFilters } from './PaperFilters';

/** One eye: white, pupil that follows the pointer (CSS vars), upper lid line. Blinks via CSS. */
function Eye({ cx, cy, clip }: { cx: number; cy: number; clip: string }) {
  return (
    <g className="art-eye">
      <clipPath id={clip}>
        <ellipse cx={cx} cy={cy} rx="17" ry="12.5" />
      </clipPath>
      <ellipse cx={cx} cy={cy} rx="17" ry="12.5" fill="#fffcf4" />
      <g clipPath={`url(#${clip})`}>
        <g className="art-pupil">
          <circle cx={cx} cy={cy + 1} r="9.5" fill="var(--ink)" />
          <circle cx={cx + 3.2} cy={cy - 2.4} r="2.8" fill="#fffcf4" />
        </g>
      </g>
      <path
        d={`M${cx - 19} ${cy + 1} Q${cx} ${cy - 18} ${cx + 19} ${cy - 1}`}
        fill="none"
        stroke="var(--ink)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </g>
  );
}

/**
 * Hero illustration (original): a child in a dhaka topi peeking over an open book,
 * a cobalt sun behind. Eyes follow the pointer (`data-eyes` on the wrapper).
 */
export function ReaderArt() {
  const p = 'reader';
  return (
    <svg
      className="reader-art"
      viewBox="0 0 560 480"
      role="img"
      aria-label="Illustration of a child in a Nepali dhaka topi peeking over an open book"
    >
      <PaperFilters prefix={p} />
      <defs>
        <pattern
          id={`${p}-dhaka`}
          width="26"
          height="22"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-3)"
        >
          <rect width="26" height="22" fill="var(--ink)" />
          <path d="M0 22 6.5 11 13 22Z" fill="var(--marigold)" />
          <path d="M13 0 19.5 11 26 0Z" fill="var(--blush)" />
          <path d="M13 22 19.5 11 26 22Z" fill="#6fa3ec" />
          <path d="M0 0 6.5 11 13 0Z" fill="var(--grass)" />
          <path d="M13 7.5 16 11 13 14.5 10 11Z" fill="#fffcf4" />
        </pattern>
      </defs>

      {/* Cobalt sun */}
      <g className="art-sun">
        <path
          d="M118 214C96 112 206 38 322 46c120 8 182 104 152 206-22 80-96 106-176 100C200 346 132 300 118 214Z"
          fill="var(--cobalt)"
          filter={`url(#${p}-wash)`}
        />
      </g>

      <g className="art-body">
        {/* Shirt */}
        <path
          d="M140 480c10-62 62-90 140-92 78 2 130 30 140 92Z"
          fill="var(--marigold)"
          filter={`url(#${p}-wash)`}
        />
        {/* Neck */}
        <path d="M252 352h56l3 52c-18 12-44 12-62 0Z" fill="#e7b48b" />
      </g>

      <g className="art-head">
        <ellipse cx="170" cy="282" rx="17" ry="25" fill="#efbf95" />
        <ellipse cx="390" cy="280" rx="17" ry="25" fill="#efbf95" />
        <ellipse cx="280" cy="270" rx="113" ry="118" fill="#f3c9a1" filter={`url(#${p}-ink)`} />

        {/* Hair with a jagged fringe */}
        <path
          d="M166 274c-8-72 22-114 114-122 90-2 122 48 114 122-6-26-12-44-20-56l-12 8-8-16-14 12-12-14-14 12-14-14-14 12-14-14-14 12-14-14-14 12-14-12-12 14-10-10c-10 16-18 34-22 60Z"
          fill="var(--ink)"
          filter={`url(#${p}-ink)`}
        />

        {/* Dhaka topi */}
        <g className="art-topi">
          <path d="M176 184 386 172 366 96c-38-14-128-12-172 8Z" fill={`url(#${p}-dhaka)`} />
          <path d="M176 184 386 172l-3-12-205 12Z" fill="var(--ink)" filter={`url(#${p}-ink)`} />
          <path
            d="M176 184 386 172 366 96c-38-14-128-12-172 8Z"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="3"
            filter={`url(#${p}-ink)`}
          />
        </g>

        {/* Brows lift a little when the eyes look up */}
        <g
          className="art-brows"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="4"
          strokeLinecap="round"
        >
          <path d="M214 236q22-12 42-2" />
          <path d="M304 232q22-10 42 2" />
        </g>

        <Eye cx={236} cy={266} clip={`${p}-eye-l`} />
        <Eye cx={324} cy={264} clip={`${p}-eye-r`} />

        <ellipse
          cx="214"
          cy="316"
          rx="30"
          ry="19"
          fill="var(--blush)"
          opacity=".55"
          filter={`url(#${p}-blush)`}
        />
        <ellipse
          cx="348"
          cy="314"
          rx="30"
          ry="19"
          fill="var(--blush)"
          opacity=".55"
          filter={`url(#${p}-blush)`}
        />
        <ellipse cx="281" cy="300" rx="11" ry="8" fill="var(--blush)" opacity=".85" />
        <path
          d="M260 332q22 16 44-2"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </g>

      {/* Open book held up to the chin */}
      <g className="art-book">
        <path
          d="M108 480 130 394c52-14 104-6 150 18 46-24 98-32 150-18l22 86Z"
          fill="var(--grass)"
          filter={`url(#${p}-wash)`}
        />
        <path
          d="M124 480 144 400c48-12 96-4 136 22v58Z"
          fill="#fffcf4"
          stroke="var(--ink)"
          strokeWidth="2.6"
          filter={`url(#${p}-ink)`}
        />
        <path
          d="M436 480 416 400c-48-12-96-4-136 22v58Z"
          fill="#fffcf4"
          stroke="var(--ink)"
          strokeWidth="2.6"
          filter={`url(#${p}-ink)`}
        />
        <g stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" opacity=".55">
          <path d="M168 428q40-8 90 10M164 446q42-8 94 10M160 464q44-6 98 10" />
          <path d="M302 438q50-18 90-10M302 456q52-16 94-10M302 474q54-14 98-8" />
        </g>
        <ellipse cx="138" cy="446" rx="17" ry="22" fill="#efbf95" />
        <ellipse cx="422" cy="446" rx="17" ry="22" fill="#efbf95" />
      </g>

      {/* Little sparks of an idea */}
      <g className="art-sparks" fill="var(--marigold)">
        <path className="spark s1" d="M470 76l6 16 16 6-16 6-6 16-6-16-16-6 16-6Z" />
        <path
          className="spark s2"
          d="M510 150l4 10 10 4-10 4-4 10-4-10-10-4 10-4Z"
          fill="var(--ink)"
        />
        <path
          className="spark s3"
          d="M86 126l4 11 11 4-11 4-4 11-4-11-11-4 11-4Z"
          fill="var(--grass)"
        />
      </g>
    </svg>
  );
}
