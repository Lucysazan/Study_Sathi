'use client';
import { useEffect, useState } from 'react';
const pages = [
  {
    title: 'A tiny seed',
    text: 'Mina found a tiny seed beside her school. She put it in a pot of soil.',
    scene: 'seed',
  },
  {
    title: 'A little care',
    text: 'Every morning, Mina gave the seed a little water. She left the pot beside a sunny window.',
    scene: 'water',
  },
  {
    title: 'Hello, little leaf!',
    text: 'One morning, a green leaf appeared. Mina smiled. A tiny seed had become a little plant.',
    scene: 'leaf',
  },
  {
    title: 'Something to share',
    text: 'Mina showed her friend the plant. Together, they planted another seed. What could you help grow?',
    scene: 'garden',
  },
];
export function PictureStory() {
  const [page, setPage] = useState(0),
    [message, setMessage] = useState('');
  const item = pages[page]!;
  useEffect(
    () => () => {
      window.speechSynthesis?.cancel();
    },
    [],
  );
  function turn(next: number) {
    window.speechSynthesis?.cancel();
    setPage(next);
    setMessage('');
  }
  function speak() {
    if (!('speechSynthesis' in window)) {
      setMessage('Your browser has no reading voice. Read the story together instead.');
      return;
    }
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(item.text);
    speech.lang = 'en-GB';
    speech.rate = 0.85;
    speech.onerror = (event) => {
      if (event.error !== 'canceled' && event.error !== 'interrupted')
        setMessage('The reading voice is unavailable. You can still read every page.');
    };
    window.speechSynthesis.speak(speech);
    setMessage('Using your device reading voice. You can stop it below.');
  }
  return (
    <section
      className="trail-game picture-story"
      aria-label="Mina and the little seed picture book"
    >
      <div className="game-kicker">MINA AND THE LITTLE SEED - {page + 1} / 4</div>
      <div className={`storybook-scene story-${item.scene}`} aria-hidden="true">
        <div className="story-sun" />
        <div className="story-cloud" />
        <div className="story-plant">
          <span />
          <i />
          <i />
        </div>
        <div className="story-pot" />
        <div className="story-child">
          <span />
          <i />
        </div>
      </div>
      <h3>{item.title}</h3>
      <p className="story-sentence">{item.text}</p>
      <div className="game-controls">
        <button className="button secondary" disabled={page === 0} onClick={() => turn(page - 1)}>
          Previous page
        </button>
        <button className="button" onClick={() => turn((page + 1) % pages.length)}>
          {page === 3 ? 'Read again' : 'Next page'}
        </button>
        <button className="button secondary" onClick={speak}>
          Read aloud
        </button>
        <button
          className="button secondary"
          onClick={() => {
            window.speechSynthesis?.cancel();
            setMessage('Reading stopped.');
          }}
        >
          Stop voice
        </button>
      </div>
      <p role="status">{message}</p>
      <small>Original StudySathi story. Audio uses your device voice when available.</small>
    </section>
  );
}
