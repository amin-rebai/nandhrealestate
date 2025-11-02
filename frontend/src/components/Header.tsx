import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const isServiceActive = () => {
    return ['/services', '/our-services', '/our-process', '/our-partners'].includes(location.pathname) ? 'active' : '';
  };

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleDropdownClose = () => {
    setActiveDropdown(null);
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

          {/* Services Dropdown */}
          <li
            className={`nav-item-dropdown ${isServiceActive()}`}
            onMouseEnter={() => handleDropdownToggle('services')}
            onMouseLeave={handleDropdownClose}
          >
            <Link to="/services" className={`nav-link-dropdown ${isServiceActive()}`}>
              {t('navigation.services')}
              <svg
                className={`dropdown-arrow ${activeDropdown === 'services' ? 'rotated' : ''}`}
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <div className={`dropdown-menu ${activeDropdown === 'services' ? 'show' : ''}`}>
              <Link to="/our-services" className="dropdown-item">
                <span className="dropdown-icon">🏢</span>
                <div>
                  <div className="dropdown-title">Our Services</div>
                  <div className="dropdown-desc">Complete real estate solutions</div>
                </div>
              </Link>
              <Link to="/our-process" className="dropdown-item">
                <span className="dropdown-icon">⚡</span>
                <div>
                  <div className="dropdown-title">Our Process</div>
                  <div className="dropdown-desc">Streamlined methodology</div>
                </div>
              </Link>
              <Link to="/our-partners" className="dropdown-item">
                <span className="dropdown-icon">🤝</span>
                <div>
                  <div className="dropdown-title">Our Partners</div>
                  <div className="dropdown-desc">Strategic alliances</div>
                </div>
              </Link>
            </div>
          </li>

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
