import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface ServiceItem {
  _id: string;
  title: string | { en: string; ar: string; fr?: string };
  description?: string | { en: string; ar: string; fr?: string };
  image?: string;
  isActive: boolean;
  order?: number;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ServicesSection: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_URL}/content/section/services?active=true`);
        if (response.data && response.data.data) {
          setServices(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getText = (value: string | { en: string; ar: string } | undefined): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
  const lang = i18n.language === 'ar' ? 'ar' : i18n.language === 'fr' ? 'fr' : 'en';
    return (value as any)[lang] || value.en || (value as any).fr || '';
  };

  const getImageUrl = (image: string | undefined): string => {
    if (!image) return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    return image.startsWith('http') ? image : `${API_URL}${image}`;
  };

  // Default services if none are loaded
  const defaultServices = [
    {
      _id: '1',
      title: { en: 'Sales & Leasing', ar: 'المبيعات والتأجير', fr: 'Ventes & Location' },
      description: { en: 'Luxury residential, commercial, and retail properties with expert guidance through every step of the transaction.', ar: 'عقارات سكنية وتجارية وتجزئة فاخرة مع إرشادات خبراء في كل خطوة من المعاملة.', fr: "Propriétés résidentielles, commerciales et de détail de luxe avec un accompagnement expert à chaque étape." },
      image: '',
      isActive: true,
      order: 1
    },
    {
      _id: '2',
      title: { en: 'Property Management', ar: 'إدارة الممتلكات', fr: 'Gestion immobilière' },
      description: { en: 'Complete property management services including tenant relations, maintenance, and financial reporting.', ar: 'خدمات إدارة الممتلكات الكاملة بما في ذلك علاقات المستأجرين والصيانة والتقارير المالية.', fr: "Services complets de gestion immobilière incluant relations avec les locataires, maintenance et reporting financier." },
      image: '',
      isActive: true,
      order: 2
    },
    {
      _id: '3',
      title: { en: 'Development Management', ar: 'إدارة التطوير', fr: 'Gestion de développement' },
      description: { en: 'End-to-end development services from feasibility studies to project delivery and handover.', ar: 'خدمات التطوير الشاملة من دراسات الجدوى إلى تسليم المشروع وتسليمه.', fr: "Services de développement de A à Z, des études de faisabilité à la livraison et la remise." },
      image: '',
      isActive: true,
      order: 3
    },
    {
      _id: '4',
      title: { en: 'Investment Advisory', ar: 'الاستشارات الاستثمارية', fr: 'Conseils en investissement' },
      description: { en: 'Strategic investment guidance and portfolio management to maximize returns and minimize risks.', ar: 'إرشادات استثمارية استراتيجية وإدارة المحافظ لتعظيم العوائد وتقليل المخاطر.', fr: "Conseils stratégiques d'investissement et gestion de portefeuille pour maximiser les rendements et minimiser les risques." },
      image: '',
      isActive: true,
      order: 4
    }
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  if (loading) {
    return (
      <section className="services-section-modern">
        <div className="container">
          <div className="section-header-modern">
            <div className="section-badge">Our Services</div>
            <h2 className="section-title-modern">Loading...</h2>
          </div>
        </div>
      </section>
    );
  }

  // Service icons mapping
  const getServiceIcon = (index: number) => {
    const icons = [
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" key={index}>
        <path d="M3 21L21 21M5 21V7L13 2L21 7V21M9 9V13M15 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>,
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" key={index}>
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>,
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" key={index}>
        <path d="M12 2L3.09 8.26L12 14L20.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3.09 8.26V15.74L12 22L20.91 15.74V8.26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>,
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" key={index}>
        <path d="M16 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H8" stroke="currentColor" strokeWidth="2"/>
        <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 10H16M8 14H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ];
    return icons[index % icons.length];
  };

  return (
    <section className="services-section-modern">
      <div className="container">
        <div className="section-header-modern">
          <div className="section-badge">{t('home.ourServices')}</div>
          <h2 className="section-title-modern">{t('home.comprehensiveSolutions')}</h2>
          <p className="section-subtitle-modern">
            {t('home.servicesDescription')}
          </p>
        </div>

        <div className="services-grid-modern">
          {displayServices.map((service, index) => (
            <div className="service-card-modern" key={service._id}>
              {service.image && (
                <div className="service-image-wrapper" style={{ marginBottom: '1rem' }}>
                  <img
                    src={getImageUrl(service.image)}
                    alt={getText(service.title)}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              )}
              <div className="service-icon">
                {getServiceIcon(index)}
              </div>
              <h3>{getText(service.title)}</h3>
              <p>{getText(service.description)}</p>
              <Link to="/services" className="service-link">{t('home.learnMore')} →</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

