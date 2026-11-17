'use client';
import { useState, type ReactNode } from 'react';
import { GameLanguageContext } from './language';
import { LanguageSwitch } from './LanguageSwitch';
export function GameLanguage({ children, gameId }: { children: ReactNode; gameId: string }) {
  const [language, setLanguage] = useState<'en' | 'ne'>('en');
  const [audioTarget, setAudioTarget] = useState<HTMLDivElement | null>(null);
  return (
    <GameLanguageContext value={{ language, setLanguage, audioTarget }}>
      <div className="game-language-scope game-with-tools" data-game={gameId}>
        <div className="game-main-content">{children}</div>
        <aside className="game-controls-panel" aria-label="Controls for this game">
          <h2 lang={language}>{language === 'ne' ? 'यो खेलका विकल्प' : 'Game tools'}</h2>
          <LanguageSwitch />
          <div ref={setAudioTarget} className="game-panel-audio" />
        </aside>
      </div>
    </GameLanguageContext>
  );
}
