import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <img
                src="/images/logo/logo.png"
                alt="N&H Real Estate"
                className="footer-logo-image"
              />
            </div>
            <p>
              {t('footer.description')}
            </p>
            <p style={{ marginTop: '1rem' }}>
              <strong>{t('contact.address')}:</strong><br />
              Doha, Qatar
            </p>
            <p>
              <strong>{t('contact.emailUs')}:</strong> info@nhrealestate.qa<br />
              <strong>{t('contact.callUs')}:</strong> +974 7070 4504
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3>{t('footer.quickLinks')}</h3>
            <ul>
              <li><Link to="/">{t('navigation.home')}</Link></li>
              <li><Link to="/about">{t('navigation.about')}</Link></li>
              <li><Link to="/properties">{t('navigation.properties')}</Link></li>
              <li><Link to="/services">{t('navigation.services')}</Link></li>
              <li><Link to="/contact">{t('navigation.contact')}</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h3>{t('footer.services')}</h3>
            <ul>
              <li><a href="#sales">{t('services.salesLeasing')}</a></li>
              <li><a href="#management">{t('services.propertyManagement')}</a></li>
              <li><a href="#development">{t('services.developmentManagement')}</a></li>
              <li><a href="#investment">{t('services.investmentConsulting')}</a></li>
              <li><a href="#valuation">{t('services.marketAnalysis')}</a></li>
            </ul>
          </div>

          {/* Global Presence */}
          <div className="footer-section">
            <h3>Global Presence</h3>
            <ul>
              <li>🇶🇦 Qatar - Doha</li>
              {/* <li>🇦🇪 UAE - Dubai, Abu Dhabi</li>
              <li>🇸🇦 Saudi Arabia - Riyadh</li>
              <li>🇪🇬 Egypt - Cairo</li>
              <li>🇫🇷 France - Paris</li>
              <li>🇲🇦 Morocco - Casablanca</li>
              <li>🇴🇲 Oman - Muscat</li>
              <li>🇹🇷 Turkey - Istanbul</li> */}
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="footer-bottom">
          <div className="social-links">
            <a href="#" aria-label="LinkedIn">💼</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="YouTube">📺</a>
          </div>
          <p>&copy; 2025 N&H Real Estate. All rights reserved.</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Licensed Real Estate Company | Regulated by Qatar Financial Centre Authority
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
