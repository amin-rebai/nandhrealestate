import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface ServiceItem {
  _id: string;
  title: string | { en: string; ar: string; fr?: string };
  description?: string | { en: string; ar: string; fr?: string };
  image?: string;
  backgroundImage?: string;
  isActive: boolean;
  order?: number;
}

const OurServices: React.FC = () => {
  const { i18n } = useTranslation();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const BASE_URL = API_URL;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_URL}/content/section/services?active=true`);
        if (response.data && response.data.data) {
            const data = response.data.data as ServiceItem[];
            setServices(data);

            // Find a page-level services content item that can act as a hero background (active preferred)
            const activeBg = data.find(d => d.isActive && (d.backgroundImage || d.image)) || data.find(d => d.backgroundImage || d.image);
            if (activeBg) {
              const image = (activeBg.backgroundImage || activeBg.image) || '';
              if (image) setHeroImage(image.startsWith('http') ? image : `${BASE_URL}${image}`);
            }
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [API_URL]);

  const getText = (value: string | { en: string; ar: string; fr?: string } | undefined): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    const lang = i18n.language === 'ar' ? 'ar' : i18n.language === 'fr' ? 'fr' : 'en';
    return (value as any)[lang] || value.en || (value as any).fr || '';
  };

  const getImageUrl = (image: string | undefined): string => {
    if (!image) return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    return image.startsWith('http') ? image : `${API_URL}${image}`;
  };

  // Service icons
  const getServiceIcon = (index: number) => {
    const icons = ['🏢', '📈', '🏠', '🏗️', '💼', '🌍'];
    return icons[index % icons.length];
  };

  return (
    <div className="our-services-page">
      {/* Enhanced Hero Section */}
      <section className="about-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <img
            src={heroImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'}
            alt="Our Services"
            className="hero-bg-image"
          />
        </div>
        <div className="hero-content">
          <div className="container">
            <h1 className="hero-title">{getText({
              en: 'Our Services',
              ar: 'خدماتنا',
              fr: 'Nos services'
            })}</h1>
            <p className="hero-subtitle">{getText({
              en: 'Comprehensive Real Estate Solutions',
              ar: 'حلول عقارية شاملة',
              fr: 'Solutions immobilières complètes'
            })}</p>
            <p className="hero-description">
              {getText({
                en: 'From sales and leasing to property management and development, we provide end-to-end real estate services tailored to your needs.',
                ar: 'من البيع والإيجار إلى إدارة الممتلكات والتطوير، نقدم خدمات عقارية شاملة مصممة خصيصاً لاحتياجاتك.',
                fr: 'De la vente et la location à la gestion immobilière et au développement, nous fournissons des services immobiliers complets adaptés à vos besoins.'
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2>{getText({
              en: 'Complete Real Estate Solutions',
              ar: 'حلول عقارية كاملة',
              fr: 'Solutions immobilières complètes'
            })}</h2>
            <p>{getText({
              en: 'We offer a comprehensive range of services designed to meet all your real estate needs',
              ar: 'نقدم مجموعة شاملة من الخدمات المصممة لتلبية جميع احتياجاتك العقارية',
              fr: 'Nous offrons une gamme complète de services conçus pour répondre à tous vos besoins immobiliers'
            })}</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Loading services...</p>
            </div>
          ) : (
            <div className="services-enhanced-grid">
              {services.map((service, index) => (
                <div className="service-card visual-enhanced" key={service._id}>
                  <div className="service-image">
                    <img
                      src={getImageUrl(service.image)}
                      alt={getText(service.title)}
                      className="service-img"
                    />
                    <div className="service-icon">{getServiceIcon(index)}</div>
                  </div>
                  <div className="service-content">
                    <h3>{getText(service.title)}</h3>
                    <p className="service-description">
                      {getText(service.description)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section section-dark">
        <div className="container">
          <div className="cta-content" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem' }}>{getText({
              en: 'Ready to Get Started?',
              ar: 'هل أنت مستعد للبدء؟',
              fr: 'Prêt à commencer?'
            })}</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', marginBottom: '2rem' }}>
              {getText({
                en: 'Contact our expert team to discuss your real estate needs and discover how we can help you achieve your goals.',
                ar: 'اتصل بفريقنا الخبير لمناقشة احتياجاتك العقارية واكتشف كيف يمكننا مساعدتك في تحقيق أهدافك.',
                fr: 'Contactez notre équipe d\'experts pour discuter de vos besoins immobiliers et découvrez comment nous pouvons vous aider à atteindre vos objectifs.'
              })}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn-primary-enhanced">
                {getText({
                  en: 'Contact Us Today',
                  ar: 'اتصل بنا اليوم',
                  fr: 'Contactez-nous aujourd\'hui'
                })}
              </Link>
              <Link to="/our-process" className="btn-secondary-enhanced">
                {getText({
                  en: 'Learn Our Process',
                  ar: 'تعرف على عمليتنا',
                  fr: 'Découvrez notre processus'
                })}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurServices;
