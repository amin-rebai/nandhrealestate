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
    tiktok: string;
    linkedin: string;
    youtube: string;
    snapchat: string;
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
      instagram: 'https://www.instagram.com/nandhhomes/?igsh=MXhvNDR6b3FyOGkwNA%3D%3D&utm_source=qr#',
      tiktok: 'https://www.tiktok.com/@nh.homes1?_r=1&_t=ZS-91smVmSx6Dk',
      linkedin: 'https://www.linkedin.com/in/n-and-h-homes-ab75ba396/?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
      youtube: '',
      snapchat: 'https://www.snapchat.com/@nandhrealestate?invite_id=6gPHZc4H&locale=en_QA&share_id=Gq_b3PPNQXOeqx4EiNAuEg&sid=8120d6e5df0745a593f9da31a5a51f39'
    }
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/content/section/contact?active=true`);
        if (response.data && response.data.length > 0) {
          const data = response.data[0];
          setContactInfo({
            phone: data.metadata?.phone || '+974 7070 4504',
            email: data.metadata?.email || 'info@nhrealestate.qa',
            address: data.metadata?.address || { en: 'Doha, Qatar', ar: 'الدوحة، قطر' },
            socialMedia: data.metadata?.socialMedia || {
              facebook: '',
              instagram: '',
              tiktok: '',
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
              <li>🇦🇪 UAE - Dubai, Abu Dhabi</li>
              <li>🇸🇦 Saudi Arabia - Riyadh</li>
              <li>🇪🇬 Egypt - Cairo</li>
              <li>🇫🇷 France - Paris</li>
              <li>🇲🇦 Morocco - Casablanca</li>
              <li>🇴🇲 Oman - Muscat</li>
              <li>🇹🇷 Turkey - Istanbul</li>
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="footer-bottom">
          <div className="social-links">
            {contactInfo.socialMedia.facebook && (
              <a href={contactInfo.socialMedia.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            )}
            {contactInfo.socialMedia.instagram && (
              <a href={contactInfo.socialMedia.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
</svg>
              </a>
            )}
            {contactInfo.socialMedia.tiktok && (
              <a href={contactInfo.socialMedia.tiktok} target="_blank" rel="noopener noreferrer" aria-label="Tiktok" className="social-icon tiktok">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
                  <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
                </svg>
              </a>
            )}
            {contactInfo.socialMedia.linkedin && (
              <a href={contactInfo.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon linkedin">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.736 0-9.646h3.554v1.364c.43-.664 1.199-1.608 2.928-1.608 2.136 0 3.745 1.393 3.745 4.385v5.505zM5.337 9.433c-1.144 0-1.915-.762-1.915-1.715 0-.955.77-1.715 1.916-1.715.99 0 1.914.76 1.914 1.715 0 .953-.925 1.715-1.915 1.715zm1.946 11.019H3.391V9.956h3.892v10.496zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                </svg>
              </a>
            )}
            {contactInfo.socialMedia.youtube && (
              <a href={contactInfo.socialMedia.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-icon youtube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            )}
            {contactInfo.socialMedia.snapchat && (
              <a href={contactInfo.socialMedia.snapchat} target="_blank" rel="noopener noreferrer" aria-label="Snapchat" className="social-icon snapchat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m6.066 12.318c.331 0 .6.27.6.6 0 .33-.269.6-.6.6-.33 0-.6-.27-.6-.6 0-.33.27-.6.6-.6m-12.132 0c.331 0 .6.27.6.6 0 .33-.269.6-.6.6-.33 0-.6-.27-.6-.6 0-.33.27-.6.6-.6m6.066 6.684c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3m0-5c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2z"/>
                </svg>
              </a>
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
