import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="logo">
          <img
            src="/images/logo/logo.png"
            alt="N&H Real Estate"
            className="logo-image"
          />
        </Link>
        <ul className="nav-links">
          <li><Link to="/" className={isActive('/')}>{t('navigation.home')}</Link></li>
          <li><Link to="/about" className={isActive('/about')}>{t('navigation.about')}</Link></li>
          <li><Link to="/properties" className={isActive('/properties')}>{t('navigation.properties')}</Link></li>
          <li><Link to="/services" className={isActive('/services')}>{t('navigation.services')}</Link></li>
          <li><Link to="/blog" className={isActive('/blog')}>{t('navigation.blog')}</Link></li>
          <li><Link to="/contact" className={isActive('/contact')}>{t('navigation.contact')}</Link></li>
        </ul>
        <div className="header-actions">
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
};

export default Header;
