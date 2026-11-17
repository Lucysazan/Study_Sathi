'use client';
import { useState, type ReactNode } from 'react';
import { GameLanguageContext } from './language';
import { LanguageSwitch } from './LanguageSwitch';
export function GameLanguage({ children, gameId }: { children: ReactNode; gameId: string }) {
  const [language, setLanguage] = useState<'en' | 'ne'>('en');
  return (
    <GameLanguageContext value={{ language, setLanguage }}>
      <div className="game-language-scope" data-game={gameId}>
        <div className="game-local-tools">
          <LanguageSwitch />
        </div>
        {children}
      </div>
    </GameLanguageContext>
  );
}
