'use client';
import { useEffect, useRef, useState } from 'react';
import { Volume2, Square } from 'lucide-react';
import clips from '@/data/game-audio.json';
const catalogue: Record<string, string> = clips;
/** Static, prepared ElevenLabs recordings only. No browser speech or runtime generation. */
export function ReadAloud({ clipId, language = 'en' }: { clipId: string; language?: 'en' | 'ne' }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false),
    [notice, setNotice] = useState('');
  const src = catalogue[clipId];
  useEffect(() => {
    const player = audio.current;
    return () => {
      player?.pause();
    };
  }, [clipId]);
  async function toggle() {
    if (!src) {
      setNotice(
        language === 'ne'
          ? 'यो खेलको आवाज तयार हुँदै छ।'
          : 'This game’s narration is not ready yet.',
      );
      return;
    }
    const player = audio.current;
    if (!player) return;
    if (!player.paused) {
      player.pause();
      setPlaying(false);
      return;
    }
    try {
      document.querySelectorAll('audio[data-game-narration]').forEach((other) => {
        if (other !== player) (other as HTMLAudioElement).pause();
      });
      setNotice('');
      await player.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
      setNotice(
        language === 'ne'
          ? 'आवाज चल्न सकेन। फेरि प्रयास गर्नुहोस्।'
          : 'Could not play audio. Please try again.',
      );
    }
  }
  return (
    <span className="read-aloud">
      <button type="button" onClick={() => void toggle()} aria-pressed={playing}>
        {playing ? (
          <Square size={16} aria-hidden="true" />
        ) : (
          <Volume2 size={18} aria-hidden="true" />
        )}
        {language === 'ne' ? (playing ? 'रोक्नुहोस्' : 'सुन्नुहोस्') : playing ? 'Stop' : 'Listen'}
      </button>
      {src && (
        <>
          <audio
            ref={audio}
            data-game-narration
            src={src}
            preload="none"
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onError={() => {
              setPlaying(false);
              setNotice(language === 'ne' ? 'आवाज उपलब्ध छैन।' : 'Audio is unavailable.');
            }}
          />
          <a
            href="https://elevenlabs.io/text-to-speech"
            target="_blank"
            rel="noopener noreferrer"
            className="audio-credit"
          >
            Voice by ElevenLabs
          </a>
        </>
      )}
      {notice && <small role="status">{notice}</small>}
    </span>
  );
}
