import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface Partner {
  _id: string;
  title: string | { en: string; ar: string; fr?: string };
  description: string | { en: string; ar: string; fr?: string };
  image?: string;
  order?: number;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const OurPartners: React.FC = () => {
  const { i18n } = useTranslation();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get text from multilingual field
  const getText = (value: string | { en: string; ar: string; fr?: string } | undefined): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    const lang = i18n.language === 'ar' ? 'ar' : i18n.language === 'fr' ? 'fr' : 'en';
    return (value as any)[lang] || value.en || (value as any).fr || '';
  };

  // Helper function to get image URL
  const getImageUrl = (image: string | undefined): string => {
    if (!image) return 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    if (image.startsWith('http')) return image;
    return `${API_URL}${image}`;
  };

  // Helper function to get partner icon
  const getPartnerIcon = (index: number): string => {
    const icons = ['🏦', '💻', '⚖️', '🏗️', '🌍', '📊'];
    return icons[index % icons.length];
  };

  // Default partners (memoized so it stays stable and doesn't trigger effect warnings)
  const defaultPartners: Partner[] = useMemo(() => [
    {
      _id: '1',
        title: { en: 'Financial Partners', ar: 'الشركاء الماليون', fr: 'Partenaires financiers' },
        description: { en: 'Leading banks and financial institutions providing mortgage and financing solutions.', ar: 'البنوك والمؤسسات المالية الرائدة التي تقدم حلول الرهن العقاري والتمويل.', fr: 'Banques et institutions financières de premier plan offrant des solutions hypothécaires et de financement.' },
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      order: 1
    },
    {
      _id: '2',
      title: { en: 'Technology Partners', ar: 'شركاء التكنولوجيا', fr: 'Partenaires technologiques' },
      description: { en: 'Cutting-edge proptech and digital solutions for modern real estate.', ar: 'حلول التكنولوجيا العقارية والرقمية المتطورة للعقارات الحديثة.', fr: 'Solutions proptech et numériques de pointe pour l’immobilier moderne.' },
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      order: 2
    },
    {
      _id: '3',
      title: { en: 'Legal & Advisory Partners', ar: 'الشركاء القانونيون والاستشاريون', fr: 'Partenaires juridiques & de conseil' },
      description: { en: 'Top-tier legal and consulting firms for comprehensive support.', ar: 'شركات قانونية واستشارية من الدرجة الأولى للدعم الشامل.', fr: "Cabinets juridiques et de conseil de premier plan pour un soutien complet." },
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      order: 3
    },
    {
      _id: '4',
      title: { en: 'Construction & Development', ar: 'البناء والتطوير', fr: 'Construction & Développement' },
      description: { en: 'Premier construction and development companies for quality projects.', ar: 'شركات البناء والتطوير الرائدة للمشاريع عالية الجودة.', fr: 'Entreprises de construction et de développement de premier ordre pour des projets de qualité.' },
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      order: 4
    }
  ], []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/content/section/clients?active=true`);
        if (response.data && response.data.length > 0) {
          setPartners(response.data.sort((a: Partner, b: Partner) => (a.order || 0) - (b.order || 0)));
        } else {
          setPartners(defaultPartners);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
        setPartners(defaultPartners);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [defaultPartners]);

  return (
    <div className="our-partners-page">
      {/* Enhanced Hero Section */}
      <section className="about-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <img
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Our Partners"
            className="hero-bg-image"
          />
        </div>
        <div className="hero-content">
          <div className="container">
            <h1 className="hero-title">Our Partners</h1>
            <p className="hero-subtitle">Building Success Through Strategic Alliances</p>
            <p className="hero-description">
              We collaborate with industry leaders, financial institutions, and technology
              partners to deliver exceptional value and comprehensive solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Partner Categories Section */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2>Strategic Partnership Network</h2>
            <p>Our carefully selected partners enable us to provide comprehensive real estate solutions</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Loading partners...</p>
            </div>
          ) : (
            <div className="partners-categories-grid">
              {partners.map((partner, index) => (
                <div className="partner-category visual-enhanced" key={partner._id}>
                  <div className="category-image">
                    <img
                      src={getImageUrl(partner.image)}
                      alt={getText(partner.title)}
                      className="category-img"
                    />
                    <div className="category-icon">{getPartnerIcon(index)}</div>
                  </div>
                  <div className="category-content">
                    <h3>{getText(partner.title)}</h3>
                    <p className="category-description">
                      {getText(partner.description)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Global Network Section */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <h2 style={{ color: 'white' }}>Global Network</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>
              Our international partnerships span across key markets worldwide
            </p>
          </div>

          <div className="global-network-grid">
            <div className="network-region">
              <div className="region-flag">🇶🇦</div>
              <h3>Qatar</h3>
              <p>Leading developers, banks, and government entities</p>
            </div>
            <div className="network-region">
              <div className="region-flag">🇦🇪</div>
              <h3>UAE</h3>
              <p>Dubai and Abu Dhabi's premier real estate networks</p>
            </div>
            <div className="network-region">
              <div className="region-flag">🇸🇦</div>
              <h3>Saudi Arabia</h3>
              <p>Vision 2030 development partners and investors</p>
            </div>
            <div className="network-region">
              <div className="region-flag">🇪🇬</div>
              <h3>Egypt</h3>
              <p>New Capital and coastal development specialists</p>
            </div>
            <div className="network-region">
              <div className="region-flag">🇫🇷</div>
              <h3>France</h3>
              <p>Luxury property and investment advisors</p>
            </div>
            <div className="network-region">
              <div className="region-flag">🇲🇦</div>
              <h3>Morocco</h3>
              <p>Emerging market development partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Benefits Section */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2>Partnership Benefits</h2>
            <p>How our strategic alliances benefit our clients</p>
          </div>

          <div className="benefits-showcase-grid">
            <div className="benefit-showcase visual-enhanced">
              <div className="benefit-image">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Comprehensive Solutions"
                  className="benefit-img"
                />
                <div className="benefit-icon">🎯</div>
              </div>
              <div className="benefit-content">
                <h3>Comprehensive Solutions</h3>
                <p>
                  Access to a complete ecosystem of real estate services through 
                  our partner network, ensuring all your needs are met under one roof.
                </p>
              </div>
            </div>

            <div className="benefit-showcase visual-enhanced">
              <div className="benefit-image">
                <img 
                  src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Competitive Advantages"
                  className="benefit-img"
                />
                <div className="benefit-icon">⚡</div>
              </div>
              <div className="benefit-content">
                <h3>Competitive Advantages</h3>
                <p>
                  Leverage our partners' expertise and resources to secure better 
                  deals, faster approvals, and exclusive opportunities.
                </p>
              </div>
            </div>

            <div className="benefit-showcase visual-enhanced">
              <div className="benefit-image">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Quality Assurance"
                  className="benefit-img"
                />
                <div className="benefit-icon">✅</div>
              </div>
              <div className="benefit-content">
                <h3>Quality Assurance</h3>
                <p>
                  All our partners are carefully vetted and selected based on their 
                  track record, expertise, and commitment to excellence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section section-dark">
        <div className="container">
          <div className="cta-content" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem' }}>Join Our Network</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', marginBottom: '2rem' }}>
              Interested in partnering with us? We're always looking for strategic alliances 
              that can enhance our service offerings and client value.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn-primary-enhanced">
                Partner With Us
              </Link>
              <Link to="/our-services" className="btn-secondary-enhanced">
                Explore Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurPartners;
