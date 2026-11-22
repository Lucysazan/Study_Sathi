/**
 * Shared SVG filters that make flat shapes look printed / painted on paper.
 * `prefix` keeps ids unique when several illustrations share a page.
 */
export function PaperFilters({ prefix }: { prefix: string }) {
  return (
    <defs>
      {/* Watercolour wash: wobbly edge + speckled pigment */}
      <filter id={`${prefix}-wash`} x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.022"
          numOctaves="3"
          seed="4"
          result="edge"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="edge"
          scale="13"
          xChannelSelector="R"
          yChannelSelector="G"
          result="shape"
        />
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.75"
          numOctaves="2"
          seed="9"
          result="grain"
        />
        <feColorMatrix
          in="grain"
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 1.4"
          result="grainAlpha"
        />
        <feComposite in="shape" in2="grainAlpha" operator="in" />
      </filter>
      {/* Hand-inked line: small wobble only */}
      <filter id={`${prefix}-ink`} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.06"
          numOctaves="2"
          seed="2"
          result="wob"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="wob"
          scale="3.5"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
      {/* Soft blush for cheeks */}
      <filter id={`${prefix}-blush`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="7" />
      </filter>
    </defs>
  );
}
