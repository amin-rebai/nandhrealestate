import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    setIsOpen(false);
  };

  const currentLanguage = i18n.language === 'ar' ? 'arabic' : i18n.language === 'fr' ? 'french' : 'english';

  const languages = [
    { code: 'en', name: 'english', flag: '🇺🇸' },
    { code: 'ar', name: 'arabic', flag: '🇸🇦' },
    { code: 'fr', name: 'french', flag: '🇫🇷' }
  ];

  return (
    <div className="language-switcher-container">
      <button
        className="language-switcher"
        onClick={() => setIsOpen(!isOpen)}
        title={t('navigation.language')}
        aria-label={t('navigation.language')}
        aria-expanded={isOpen}
      >
        <span className="language-icon">🌐</span>
        <span className="language-text">
          {t(`language.${currentLanguage}`)}
        </span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-option ${i18n.language === lang.code ? 'selected' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="language-flag">{lang.flag}</span>
              <span className="language-name">{t(`language.${lang.name}`)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
