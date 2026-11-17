'use client';
import { useEffect, useState } from 'react';
import { Volume2, Square } from 'lucide-react';
/** Explicit browser speech only. Never starts on load; unmount cancels route/round speech. */
export function ReadAloud({ text, language = 'en' }: { text?: string; language?: 'en' | 'ne' }) {
  const [speaking, setSpeaking] = useState(false),
    [notice, setNotice] = useState('');
  useEffect(
    () => () => {
      window.speechSynthesis?.cancel();
    },
    [text, language],
  );
  function read() {
    if (!('speechSynthesis' in window)) {
      setNotice(
        language === 'ne'
          ? 'यो ब्राउजरमा आवाज सुविधा छैन।'
          : 'Reading aloud is unavailable in this browser.',
      );
      return;
    }
    const engine = window.speechSynthesis;
    engine.cancel();
    if (speaking) {
      setSpeaking(false);
      return;
    }
    const content = (text ?? document.querySelector('main')?.innerText ?? '').slice(0, 14000);
    if (!content.trim()) return;
    const voice = engine.getVoices().find((v) => v.lang.toLowerCase().startsWith(language));
    if (language === 'ne' && !voice) {
      setNotice('नेपाली आवाज उपलब्ध छैन। उपकरणको भाषा सेटिङमा नेपाली आवाज थप्नुहोस्।');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = language === 'ne' ? 'ne-NP' : 'en-US';
    if (voice) utterance.voice = voice;
    utterance.rate = 0.9;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => {
      setSpeaking(false);
      setNotice(
        language === 'ne'
          ? 'आवाज चल्न सकेन। फेरि प्रयास गर्नुहोस्।'
          : 'Could not play the reading voice. Try again.',
      );
    };
    setNotice('');
    engine.speak(utterance);
  }
  return (
    <span className="read-aloud">
      <button type="button" onClick={read} aria-pressed={speaking}>
        {speaking ? (
          <Square size={16} aria-hidden="true" />
        ) : (
          <Volume2 size={18} aria-hidden="true" />
        )}
        {language === 'ne'
          ? speaking
            ? 'रोक्नुहोस्'
            : 'सुन्नुहोस्'
          : speaking
            ? 'Stop'
            : 'Listen'}
      </button>
      {notice && <small role="status">{notice}</small>}
    </span>
  );
}
