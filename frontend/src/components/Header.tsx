import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const isServiceActive = () => {
    return ['/services', '/our-services', '/our-process', '/our-partners'].includes(location.pathname) ? 'active' : '';
  };

  const isPropertiesActive = () => {
    return ['/properties', '/international-properties'].includes(location.pathname) ? 'active' : '';
  };

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleDropdownClose = () => {
    setActiveDropdown(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleMobileDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <header className="header">
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-backdrop"
          onClick={closeMobileMenu}
        />
      )}

      <nav className="navbar">
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <img
            src="/images/logo/logo.png"
            alt="N&H Real Estate"
            className="logo-image"
          />
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
          <li><Link to="/" className={isActive('/')} onClick={closeMobileMenu}>{t('navigation.home')}</Link></li>
          <li><Link to="/about" className={isActive('/about')} onClick={closeMobileMenu}>{t('navigation.about')}</Link></li>
          {/* Properties Dropdown */}
          <li
            className={`nav-item-dropdown ${isPropertiesActive()}`}
            onMouseEnter={() => handleDropdownToggle('properties')}
            onMouseLeave={handleDropdownClose}
          >
            <div
              className={`nav-link-dropdown ${isPropertiesActive()}`}
              onClick={() => handleMobileDropdownToggle('properties')}
            >
              <Link to="/properties" onClick={closeMobileMenu}>
                {t('navigation.properties')}
              </Link>
              <svg
                className={`dropdown-arrow ${activeDropdown === 'properties' ? 'rotated' : ''}`}
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={`dropdown-menu ${activeDropdown === 'properties' ? 'show' : ''}`}>
              <Link to="/properties" className="dropdown-item" onClick={closeMobileMenu}>
                <span className="dropdown-icon">🏠</span>
                <div>
                  <div className="dropdown-title">Qatar Properties</div>
                  <div className="dropdown-desc">Browse properties in Qatar</div>
                </div>
              </Link>
              <Link to="/international-properties" className="dropdown-item" onClick={closeMobileMenu}>
                <span className="dropdown-icon">🌍</span>
                <div>
                  <div className="dropdown-title">International Properties</div>
                  <div className="dropdown-desc">Explore global real estate markets</div>
                </div>
              </Link>
            </div>
          </li>
          <li><Link to="/agents" className={isActive('/agents')} onClick={closeMobileMenu}>Agents</Link></li>

          {/* Services Dropdown */}
          <li
            className={`nav-item-dropdown ${isServiceActive()}`}
            onMouseEnter={() => handleDropdownToggle('services')}
            onMouseLeave={handleDropdownClose}
          >
            <div
              className={`nav-link-dropdown ${isServiceActive()}`}
              onClick={() => handleMobileDropdownToggle('services')}
            >
              <Link to="/services" onClick={closeMobileMenu}>
                {t('navigation.services')}
              </Link>
              <svg
                className={`dropdown-arrow ${activeDropdown === 'services' ? 'rotated' : ''}`}
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={`dropdown-menu ${activeDropdown === 'services' ? 'show' : ''}`}>
              <Link to="/our-services" className="dropdown-item" onClick={closeMobileMenu}>
                <span className="dropdown-icon">🏢</span>
                <div>
                  <div className="dropdown-title">{t('navigation.ourServices')}</div>
                  <div className="dropdown-desc">{t('navigation.ourServicesDesc')}</div>
                </div>
              </Link>
              <Link to="/our-process" className="dropdown-item" onClick={closeMobileMenu}>
                <span className="dropdown-icon">⚡</span>
                <div>
                  <div className="dropdown-title">{t('navigation.ourProcess')}</div>
                  <div className="dropdown-desc">{t('navigation.ourProcessDesc')}</div>
                </div>
              </Link>
              <Link to="/our-partners" className="dropdown-item" onClick={closeMobileMenu}>
                <span className="dropdown-icon">🤝</span>
                <div>
                  <div className="dropdown-title">{t('navigation.ourPartners')}</div>
                  <div className="dropdown-desc">{t('navigation.ourPartnersDesc')}</div>
                </div>
              </Link>
            </div>
          </li>

          <li><Link to="/blog" className={isActive('/blog')} onClick={closeMobileMenu}>{t('navigation.blog')}</Link></li>
          <li><Link to="/contact" className={isActive('/contact')} onClick={closeMobileMenu}>{t('navigation.contact')}</Link></li>

          {/* Language Switcher in Mobile Menu */}
          <li className="mobile-language-switcher">
            <LanguageSwitcher />
          </li>
        </ul>

        <div className="header-actions">
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
};

export default Header;
