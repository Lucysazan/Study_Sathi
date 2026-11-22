import { PaperFilters } from './PaperFilters';

const FLAGS = ['#1d5fc8', '#fffcf4', '#d9493a', '#26a843', '#efb43f'];

/**
 * Original landscape: Himalayan peaks, rice terraces, prayer flags and a small learner
 * walking up the trail. Layers drift with the pointer (`data-tilt` on the wrapper).
 */
export function HillsArt() {
  const p = 'hills';
  return (
    <svg
      className="hills-art"
      viewBox="0 0 420 480"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Illustration of Himalayan mountains and terraced hills with a child walking up a trail"
    >
      <PaperFilters prefix={p} />
      <rect width="420" height="480" fill="#d8e6f6" />
      <circle
        className="hills-sun"
        cx="300"
        cy="86"
        r="30"
        fill="var(--marigold)"
        filter={`url(#${p}-wash)`}
      />

      <g className="layer layer-far">
        <path
          d="M-20 250 60 120l46 58 70-112 92 138 52-64 120 140V280H-20Z"
          fill="var(--cobalt)"
          filter={`url(#${p}-wash)`}
        />
        <path
          d="M60 120 80 146l10-6 16 38-24-18-12 10ZM176 66l28 44-14-6-14 18-12-16-14 10Z"
          fill="#fffcf4"
        />
        <path d="M268 204l18 22-10-2-8 10-8-12-10 4Z" fill="#fffcf4" />
      </g>

      {/* Prayer flags strung across the sky */}
      <g className="layer layer-flags">
        <path d="M-10 30Q200 120 430 24" fill="none" stroke="var(--ink)" strokeWidth="1.6" />
        {Array.from({ length: 14 }, (_, i) => {
          const t = (i + 0.5) / 14;
          const x = -10 + t * 440;
          const y = (1 - t) * (1 - t) * 30 + 2 * (1 - t) * t * 120 + t * t * 24;
          return (
            <rect
              key={i}
              className="flag"
              x={x - 6}
              y={y + 1}
              width="12"
              height="15"
              fill={FLAGS[i % FLAGS.length]}
              stroke="var(--ink)"
              strokeWidth=".8"
              style={{ animationDelay: `${(i % 5) * -0.4}s` }}
            />
          );
        })}
      </g>

      <g className="layer layer-mid">
        <path
          d="M-20 300c80-50 170-60 240-30s140 20 220-20v240H-20Z"
          fill="var(--grass)"
          filter={`url(#${p}-wash)`}
        />
        {/* Terraces */}
        <g fill="none" strokeLinecap="round">
          <path d="M-10 330c90-36 180-40 250-14s130 14 200-14" stroke="#9fd18f" strokeWidth="7" />
          <path
            d="M-10 358c90-34 180-38 250-12s130 14 200-14"
            stroke="var(--marigold)"
            strokeWidth="9"
          />
          <path d="M-10 386c90-32 180-36 250-10s130 12 200-14" stroke="#9fd18f" strokeWidth="7" />
        </g>
        {/* A small house */}
        <path d="M92 296h36v26H92Z" fill="#fffcf4" stroke="var(--ink)" strokeWidth="2" />
        <path d="M86 298 110 278l24 20Z" fill="#d9493a" stroke="var(--ink)" strokeWidth="2" />
      </g>

      <g className="layer layer-near">
        <path
          d="M-20 410c110-30 230-36 460-6v90H-20Z"
          fill="var(--blush)"
          filter={`url(#${p}-wash)`}
        />
        {/* Hatched field */}
        <g stroke="var(--ink)" strokeWidth="1.4" opacity=".5">
          {Array.from({ length: 16 }, (_, i) => (
            <path key={i} d={`M${i * 28 - 10} 480l30-58`} />
          ))}
        </g>
        {/* Trail */}
        <path
          className="trail"
          d="M120 480c20-40 90-40 120-80s-10-60 40-96"
          fill="none"
          stroke="#fffcf4"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="2 16"
        />
        {/* Learner with a school bag */}
        <g className="walker" transform="translate(234 360)" filter={`url(#${p}-ink)`}>
          <path d="M-9 -6h18l4 26h-26Z" fill="var(--cobalt)" />
          <rect
            x="6"
            y="-4"
            width="10"
            height="16"
            rx="2"
            fill="var(--marigold)"
            stroke="var(--ink)"
            strokeWidth="1.6"
          />
          <circle cx="0" cy="-15" r="9" fill="#f3c9a1" />
          <path d="M-9 -17c0-10 18-10 18 0-6-3-12-3-18 0Z" fill="var(--ink)" />
          <path
            className="leg-a"
            d="M-4 20v14"
            stroke="var(--ink)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            className="leg-b"
            d="M5 20v14"
            stroke="var(--ink)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
}
