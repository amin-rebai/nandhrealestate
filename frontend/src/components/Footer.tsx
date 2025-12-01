import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface ContactInfo {
  phone: string;
  email: string;
  address: { en: string; ar: string; fr?: string };
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
}

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: '+974 7070 4504',
    email: 'info@nhrealestate.qa',
    address: { en: 'Doha, Qatar', ar: 'الدوحة، قطر' },
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: ''
    }
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/content/section/contact?active=true`);
        if (response.data && response.data.length > 0) {
          const data = response.data[0];
          setContactInfo({
            phone: data.metadata?.phone || '+974 7070 4504',
            email: data.metadata?.email || 'info@nhrealestate.qa',
            address: data.metadata?.address || { en: 'Doha, Qatar', ar: 'الدوحة، قطر' },
            socialMedia: data.metadata?.socialMedia || {
              facebook: '',
              instagram: '',
              twitter: '',
              linkedin: '',
              youtube: ''
            }
          });
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };

    fetchContactInfo();
  }, []);

  const getText = (field?: string | { en: string; ar: string; fr?: string }): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    // ensure we only use supported language keys that exist on the object
    const lang = i18n.language === 'ar' ? 'ar' : i18n.language === 'fr' ? 'fr' : 'en';
    // Use a safe string-index lookup so TypeScript accepts dynamic keys (fr is optional)
    const localized = (field as { [key: string]: string })[lang];
    return localized || field.en || '';
  };

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
              {getText(contactInfo.address)}
            </p>
            <p>
              <strong>{t('contact.emailUs')}:</strong> {contactInfo.email}<br />
              <strong>{t('contact.callUs')}:</strong> {contactInfo.phone}
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
            {contactInfo.socialMedia.linkedin && (
              <a href={contactInfo.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">💼</a>
            )}
            {contactInfo.socialMedia.instagram && (
              <a href={contactInfo.socialMedia.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">📷</a>
            )}
            {contactInfo.socialMedia.twitter && (
              <a href={contactInfo.socialMedia.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">🐦</a>
            )}
            {contactInfo.socialMedia.facebook && (
              <a href={contactInfo.socialMedia.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">📘</a>
            )}
            {contactInfo.socialMedia.youtube && (
              <a href={contactInfo.socialMedia.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">📺</a>
            )}
          </div>
          <p>&copy; 2025 N&H Real Estate. {t('home.allRightsReserved')}</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            {t('home.licensedCompany')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
