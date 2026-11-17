'use client';
import { useLanguage } from './language';
export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();
  return (
    <button
      className="language-switch"
      type="button"
      aria-label={language === 'en' ? 'Translate this game to Nepali' : 'Show this game in English'}
      onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
      lang={language === 'en' ? 'ne' : 'en'}
    >
      {language === 'en' ? 'नेपाली' : 'English'}
    </button>
  );
}
