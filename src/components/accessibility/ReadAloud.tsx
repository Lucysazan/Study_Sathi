'use client';
import { useEffect, useRef, useState } from 'react';
import { Volume2, Square } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useLanguage } from './language';
import { gameNarrationScripts } from '@/lib/study/narration';
const scripts = new Map(gameNarrationScripts().map((script) => [script.id, script.text]));
/** Opt-in device/browser speech, scoped to the current game's question. */
export function ReadAloud({ clipId, language = 'en' }: { clipId: string; language?: 'en' | 'ne' }) {
  const { audioTarget } = useLanguage();
  const [playing, setPlaying] = useState(false),
    [notice, setNotice] = useState('');
  const generation = useRef(0);
  useEffect(
    () => () => {
      generation.current++;
      window.speechSynthesis?.cancel();
    },
    [clipId, language],
  );
  function toggle() {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setNotice(
        language === 'ne'
          ? 'यो ब्राउजरमा आवाज सुविधा छैन।'
          : 'Reading aloud is unavailable in this browser.',
      );
      return;
    }
    const engine = window.speechSynthesis;
    const current = ++generation.current;
    engine.cancel();
    if (playing) {
      setPlaying(false);
      setNotice('');
      return;
    }
    const text = scripts.get(clipId);
    if (!text) return;
    const voice = engine.getVoices().find((voice) => voice.lang.toLowerCase().startsWith(language));
    if (language === 'ne' && !voice) {
      setNotice(
        'नेपाली आवाज उपलब्ध छैन। उपकरणको भाषा सेटिङमा नेपाली आवाज थप्नुहोस् वा अङ्ग्रेजीमा सुन्नुहोस्।',
      );
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'ne' ? 'ne-NP' : 'en-US';
    if (voice) utterance.voice = voice;
    utterance.rate = 0.9;
    utterance.onend = () => {
      if (generation.current === current) setPlaying(false);
    };
    utterance.onerror = () => {
      if (generation.current === current) {
        setPlaying(false);
        setNotice(
          language === 'ne'
            ? 'आवाज चल्न सकेन। फेरि प्रयास गर्नुहोस्।'
            : 'Could not play the reading voice. Try again.',
        );
      }
    };
    try {
      setNotice('');
      setPlaying(true);
      engine.speak(utterance);
    } catch {
      setPlaying(false);
      setNotice(language === 'ne' ? 'आवाज चल्न सकेन।' : 'Reading aloud is unavailable.');
    }
  }
  if (!audioTarget) return null;
  return createPortal(
    <span className="read-aloud">
      <button type="button" onClick={toggle} aria-pressed={playing}>
        {playing ? (
          <Square size={16} aria-hidden="true" />
        ) : (
          <Volume2 size={18} aria-hidden="true" />
        )}
        {language === 'ne' ? (playing ? 'रोक्नुहोस्' : 'सुन्नुहोस्') : playing ? 'Stop' : 'Listen'}
      </button>
      {notice && <small role="status">{notice}</small>}
    </span>,
    audioTarget,
  );
}
