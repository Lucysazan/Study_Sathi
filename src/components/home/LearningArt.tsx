import { BookOpen, Check } from 'lucide-react';

/** Home hero illustration: two children learning, Nepal's mountains behind (original inline SVG). */
export function LearningArt() {
  return (
    <div className="hero-art">
      <svg
        viewBox="0 0 600 450"
        role="img"
        aria-label="Illustration of two children learning with books and a laptop, with Nepal’s mountains in the background"
      >
        <defs>
          <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1.2" fill="#b8d8cb" />
          </pattern>
        </defs>
        <rect x="40" y="0" width="520" height="440" rx="150" fill="#e3f1e7" />
        <rect x="40" y="0" width="520" height="440" rx="150" fill="url(#dots)" />
        <circle cx="460" cy="96" r="33" fill="#f5ce62" />
        <path
          d="M68 253 172 128 271 253M197 253 311 89 437 253M358 253 430 164 527 275"
          fill="#bdd6c9"
        />
        <path
          d="m145 160 27-32 32 40-29-13-16 10M281 132l30-43 38 49-28-13-11 12-13-9"
          fill="#fafbf8"
        />
        <path d="M62 333c100-92 348-100 478-8v80H62" fill="#cfe2d2" />
        <ellipse cx="304" cy="400" rx="220" ry="24" fill="#b8cebd" />
        <rect x="100" y="304" width="395" height="20" rx="9" fill="#bf825c" />
        <path d="M130 322h15v91h-15M449 322h15v91h-15" fill="#9b674e" />
        <path d="M176 271c-40 0-65 45-63 93h116c3-55-14-93-53-93" fill="#e8ae48" />
        <path d="m131 307 20-32 40 51 59-8 5 17-76 13z" fill="#b97a55" />
        <path d="M154 260v23q20 18 39-2v-25" fill="#b97a55" />
        <ellipse cx="174" cy="223" rx="40" ry="47" fill="#ce946c" />
        <path d="M133 220q-9-66 42-62 48-3 42 63l-14-20-10-17q-30 23-58 16" fill="#273d37" />
        <circle cx="160" cy="224" r="3" fill="#273d37" />
        <circle cx="188" cy="224" r="3" fill="#273d37" />
        <path
          d="M167 243q10 6 19-2"
          fill="none"
          stroke="#7a443c"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M385 271c-48 0-60 37-55 94h114c1-54-17-94-59-94" fill="#13877c" />
        <path d="M367 258v26q18 14 37-1v-27" fill="#bd7f5c" />
        <ellipse cx="386" cy="224" rx="38" ry="47" fill="#d29873" />
        <path d="M345 221q-6-64 43-62 43 0 38 62l-16-31q-30 13-63 10" fill="#273d37" />
        <path d="M351 189q-30 18-21 85l22-5-4-44M418 191q29 20 22 85l-24-4 8-46" fill="#273d37" />
        <circle cx="372" cy="225" r="3" fill="#273d37" />
        <circle cx="398" cy="225" r="3" fill="#273d37" />
        <path
          d="M377 244q10 6 19-1"
          stroke="#7a443c"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path d="m424 303-26 33-62-7-3 17 76 12 35-34" fill="#d29873" />
        <rect
          x="242"
          y="257"
          width="101"
          height="68"
          rx="6"
          fill="#f7faf5"
          stroke="#98b9aa"
          strokeWidth="3"
        />
        <path d="M229 327h127" stroke="#698b7e" strokeWidth="8" strokeLinecap="round" />
        <circle cx="293" cy="291" r="8" fill="#bfd6c9" />
        <path
          d="m165 371 33 7-4 38-41-3M208 367l23 11 5 35-26 3M351 367l20 11-2 35-31-1M401 367l22 9 11 36-32 1"
          fill="#304f4b"
        />
        <rect x="106" y="288" width="45" height="9" rx="2" fill="#fae9b9" />
        <rect x="109" y="278" width="43" height="9" rx="2" fill="#cf7855" />
        <path
          d="M465 300v-50m0 30q-28-5-24-25 26-1 24 25m0-12q25-4 25-27-27 2-25 27"
          fill="#3e8c68"
          stroke="#3e8c68"
          strokeWidth="3"
        />
        <path d="M448 282h34l-5 21h-24" fill="#e0a486" />
      </svg>
      <div className="art-pill art-pill-top">
        <span className="pill-symbol">
          <BookOpen size={20} aria-hidden="true" />
        </span>
        <span>
          Curiosity starts here<small>A little learning, every day.</small>
        </span>
      </div>
      <div className="art-pill art-pill-bottom">
        <span className="check-circle">
          <Check size={17} aria-hidden="true" />
        </span>
        Free to explore. Yours to discover.
      </div>
      <span className="hero-spark" aria-hidden="true">
        ✦
      </span>
    </div>
  );
}
