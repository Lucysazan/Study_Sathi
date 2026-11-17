'use client';
import { useEffect, useRef, useState } from 'react';
import { Volume2, Square } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useLanguage } from './language';
import clips from '@/data/game-audio.json';
import type { GameAudioClip } from '@/lib/study/audio';
const catalogue: Record<string, GameAudioClip> = clips;
/** Static, prepared game recordings only. No browser speech or runtime generation. */
export function ReadAloud({ clipId, language = 'en' }: { clipId: string; language?: 'en' | 'ne' }) {
  const { audioTarget } = useLanguage();
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false),
    [notice, setNotice] = useState('');
  const clip = catalogue[clipId];
  const src = clip?.src;
  useEffect(() => {
    const player = audio.current;
    return () => {
      player?.pause();
    };
  }, [clipId, audioTarget]);
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
  if (!audioTarget) return null;
  return createPortal(
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
          {clip?.creditUrl ? (
            <a
              href={clip.creditUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="audio-credit"
            >
              {clip.credit}
            </a>
          ) : (
            <small className="audio-credit">{clip?.credit}</small>
          )}
        </>
      )}
      {notice && <small role="status">{notice}</small>}
    </span>,
    audioTarget,
  );
}
