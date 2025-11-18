import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface ServiceItem {
  _id: string;
  title: string | { en: string; ar: string };
  description?: string | { en: string; ar: string };
  image?: string;
  isActive: boolean;
  order?: number;
}

const OurServices: React.FC = () => {
  const { i18n } = useTranslation();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/content/section/services?active=true`);
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
  }, [API_URL]);

  const getText = (value: string | { en: string; ar: string } | undefined): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[i18n.language as 'en' | 'ar'] || value.en || '';
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
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Our Services"
            className="hero-bg-image"
          />
        </div>
        <div className="hero-content">
          <div className="container">
            <h1 className="hero-title">Our Services</h1>
            <p className="hero-subtitle">Comprehensive Real Estate Solutions</p>
            <p className="hero-description">
              From sales and leasing to property management and development, we provide
              end-to-end real estate services tailored to your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2>Complete Real Estate Solutions</h2>
            <p>We offer a comprehensive range of services designed to meet all your real estate needs</p>
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
            <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem' }}>Ready to Get Started?</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', marginBottom: '2rem' }}>
              Contact our expert team to discuss your real estate needs and discover how we can help you achieve your goals.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn-primary-enhanced">
                Contact Us Today
              </Link>
              <Link to="/our-process" className="btn-secondary-enhanced">
                Learn Our Process
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurServices;
