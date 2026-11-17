'use client';
/** Local visual feedback only; no points, sounds, flashing screens or blocking overlays. */
export function AnswerEffect({ success, attempt }: { success: boolean; attempt: number }) {
  if (!attempt) return null;
  return (
    <div
      key={attempt}
      className={'answer-effect ' + (success ? 'answer-party' : 'answer-retry')}
      aria-hidden="true"
    >
      {success ? (
        Array.from({ length: 12 }, (_, i) => (
          <i key={i} style={{ '--piece': i } as React.CSSProperties} />
        ))
      ) : (
        <span>↻</span>
      )}
    </div>
  );
}
