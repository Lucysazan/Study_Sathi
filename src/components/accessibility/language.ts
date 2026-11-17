'use client';
import { createContext, useContext } from 'react';
export type GameLocale = {
  audioTarget: HTMLElement | null;
  language: 'en' | 'ne';
  setLanguage: (language: 'en' | 'ne') => void;
};
export const GameLanguageContext = createContext<GameLocale>({
  language: 'en',
  audioTarget: null,
  setLanguage: () => {},
});
/** Local to one game route. No storage, global events or site-wide side effects. */
export function useLanguage() {
  return useContext(GameLanguageContext);
}
