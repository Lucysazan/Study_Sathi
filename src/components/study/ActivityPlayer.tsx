'use client';
import { useRef, useState } from 'react';
export function ActivityPlayer({ url, title }: { url: string; title: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [help, setHelp] = useState('');
  return (
    <section className="study-tools">
      <iframe
        ref={frame}
        className="study-simulation"
        title={title + ' simulation'}
        src={url}
        loading="eager"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <button
        className="button secondary"
        onClick={async () => {
          try {
            if (!frame.current?.requestFullscreen) throw Error();
            await frame.current.requestFullscreen();
            setHelp('');
          } catch {
            setHelp('Turn your phone sideways or open the original game for more space.');
          }
        }}
      >
        Full screen game
      </button>
      {help && <p role="status">{help}</p>}
      <p>
        Simulation by PhET Interactive Simulations, University of Colorado Boulder, licensed under
        CC BY-NC 4.0 (
        <a href="https://phet.colorado.edu" target="_blank" rel="noopener noreferrer">
          https://phet.colorado.edu
        </a>
        ).
      </p>
      <details>
        <summary>Game help and source</summary>
        <p>
          <a href={url} target="_blank" rel="noopener noreferrer">
            Open original simulation
          </a>{' '}
          if your browser cannot run it here.
        </p>

        <p>
          Used on this free, non-commercial learning site.{' '}
          <a
            href="https://phet.colorado.edu/en/licensing/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Provider licence
          </a>
          . Availability, language options and accessibility vary by simulation.
        </p>
        <p>
          The game loads from PhET automatically. Its score stays in the simulation. Open the
          optional questions below to check your learning.
        </p>
      </details>
    </section>
  );
}
