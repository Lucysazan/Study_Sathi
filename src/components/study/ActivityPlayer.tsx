'use client';
import { useState } from 'react';
export function ActivityPlayer({ url, title }: { url: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <section className="study-tools">
      <h2>Explore the simulation</h2>
      <p>
        Loading connects to PhET. Try the task above, then complete StudySathi’s check below. The
        simulation does not send us your score.
      </p>
      <button
        className="button secondary"
        onClick={() => setLoaded(!loaded)}
        aria-expanded={loaded}
      >
        {loaded ? 'Close simulation' : 'Load simulation'}
      </button>
      {loaded && (
        <iframe
          className="study-simulation"
          title={title + ' simulation'}
          src={url}
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}
      <p>
        <a href={url} target="_blank" rel="noopener noreferrer">
          Open original simulation
        </a>{' '}
        if your browser cannot run it here.
      </p>
      <p>
        Simulation by PhET Interactive Simulations, University of Colorado Boulder, licensed under
        CC BY-NC 4.0 (
        <a href="https://phet.colorado.edu" target="_blank" rel="noopener noreferrer">
          https://phet.colorado.edu
        </a>
        ).
      </p>
      <p>
        Used on this free, non-commercial learning site.{' '}
        <a href="https://phet.colorado.edu/en/licensing/" target="_blank" rel="noopener noreferrer">
          Provider licence
        </a>
        . Availability, language options and accessibility vary by simulation.
      </p>
    </section>
  );
}
