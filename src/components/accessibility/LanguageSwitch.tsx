'use client';
import { useLanguage } from './language';
export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();
  return (
    <button
      className="language-switch"
      type="button"
      title="Nepali: menus, mission games, shop and resource introductions. Other pages and provider content keep their original language."
      aria-label={
        language === 'en' ? 'Switch menus and available activities to Nepali' : 'Switch to English'
      }
      onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
      lang={language === 'en' ? 'ne' : 'en'}
    >
      {language === 'en' ? 'नेपाली' : 'English'}
    </button>
  );
}
