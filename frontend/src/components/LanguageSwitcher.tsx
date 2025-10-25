import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  const currentLanguage = i18n.language === 'ar' ? 'arabic' : 'english';
  const targetLanguage = i18n.language === 'ar' ? 'english' : 'arabic';

  return (
    <button 
      className="language-switcher"
      onClick={toggleLanguage}
      title={t('language.switchTo', { language: t(`language.${targetLanguage}`) })}
      aria-label={t('language.switchTo', { language: t(`language.${targetLanguage}`) })}
    >
      <span className="language-icon">🌐</span>
      <span className="language-text">
        {t(`language.${targetLanguage}`)}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
