import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface MultilingualText {
  en: string;
  ar: string;
  fr?: string;
}

interface ProcessSectionData {
  title: MultilingualText;
  subtitle: MultilingualText;
  backgroundImage: string;
}

const Services: React.FC = () => {
  const { i18n } = useTranslation();
  const [processSectionData, setProcessSectionData] = useState<ProcessSectionData | null>(null);

  useEffect(() => {
    const fetchProcessSection = async () => {
      try {
        const response = await axios.get(`${API_URL}/content/section/process-section`);
        const data = response.data?.data || response.data;
        if (data && data.length > 0) {
          const item = data[0];
          setProcessSectionData({
            title: item.title || { en: 'Our Process', ar: 'عمليتنا', fr: 'Notre processus' },
            subtitle: item.description || { en: 'A systematic approach to delivering exceptional results', ar: '', fr: '' },
            backgroundImage: item.image || item.backgroundImage || ''
          });
        }
      } catch (error) {
        console.error('Error fetching process section:', error);
      }
    };
    fetchProcessSection();
  }, []);

  // Get text based on current language
  const getText = (text: MultilingualText | string | undefined): string => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    const lang = i18n.language as 'en' | 'ar' | 'fr';
    return text[lang] || text.en || text.ar || text.fr || '';
  };
  return (
    <div className="services-page">
      {/* Enhanced Hero Section */}
      {/* <section className="about-hero">
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
            <h1 className="hero-title">Services Overview</h1>
            <p className="hero-subtitle">Your Complete Real Estate Partner</p>
            <p className="hero-description">
              Discover our comprehensive range of services, proven processes, and strategic partnerships
              that make us the preferred choice for real estate excellence.
            </p>
          </div>
        </div>
      </section> */}

      {/* Service Categories Navigation */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2>Explore Our Expertise</h2>
            <p>Navigate through our comprehensive service offerings</p>
          </div>

          <div className="service-navigation-grid">
            <Link to="/our-services" className="service-nav-card visual-enhanced">
              <div className="service-image">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Our Services"
                  className="service-img"
                />
                <div className="service-icon">🏢</div>
              </div>
              <div className="service-content">
                <h3>Our Services</h3>
                <p className="service-description">
                  <strong>Complete Real Estate Solutions</strong>
                </p>
                <p className="service-summary">
                  Discover our comprehensive range of services including sales & leasing,
                  property management, marketing, and investment advisory.
                </p>
                <div className="service-cta">
                  <span>Explore Services →</span>
                </div>
              </div>
            </Link>

            <Link to="/our-process" className="service-nav-card visual-enhanced">
              <div className="service-image">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Our Process"
                  className="service-img"
                />
                <div className="service-icon">⚡</div>
              </div>
              <div className="service-content">
                <h3>Our Process</h3>
                <p className="service-description">
                  <strong>Streamlined Excellence in Every Step</strong>
                </p>
                <p className="service-summary">
                  Learn about our proven methodology that ensures seamless transactions
                  and exceptional results through every phase of your real estate journey.
                </p>
                <div className="service-cta">
                  <span>Discover Process →</span>
                </div>
              </div>
            </Link>

            <Link to="/our-partners" className="service-nav-card visual-enhanced">
              <div className="service-image">
                <img
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Our Partners"
                  className="service-img"
                />
                <div className="service-icon">🤝</div>
              </div>
              <div className="service-content">
                <h3>Our Partners</h3>
                <p className="service-description">
                  <strong>Strategic Alliances for Success</strong>
                </p>
                <p className="service-summary">
                  Explore our network of strategic partners including financial institutions,
                  technology providers, and industry leaders across global markets.
                </p>
                <div className="service-cta">
                  <span>Meet Partners →</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Our Approach */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <h2 style={{ color: 'white' }}>Why Choose Our Approach</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>
              Our integrated approach delivers exceptional results through expertise, innovation, and partnerships
            </p>
          </div>
          <div className="approach-benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🎯</div>
              <h3>Comprehensive Solutions</h3>
              <p>End-to-end services covering every aspect of real estate</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h3>Proven Process</h3>
              <p>Streamlined methodology ensuring consistent excellence</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🤝</div>
              <h3>Strategic Partnerships</h3>
              <p>Global network of trusted industry leaders</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🌍</div>
              <h3>International Reach</h3>
              <p>Expertise across multiple markets and regions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section section-light">
        <div className="container">
          <div className="cta-content" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Ready to Get Started?</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--gray)' }}>
              Explore our detailed service offerings, learn about our proven process,
              or discover our strategic partnerships.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/our-services" className="btn-primary-enhanced">
                Explore All Services
              </Link>
              <Link to="/contact" className="btn-secondary-enhanced">
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section with Background Image */}
      <section
        className="process-section-bg"
        style={{
          backgroundImage: processSectionData?.backgroundImage
            ? `linear-gradient(rgba(75, 14, 20, 0.85), rgba(75, 14, 20, 0.9)), url(${processSectionData.backgroundImage.startsWith('http') ? processSectionData.backgroundImage : `${API_URL}${processSectionData.backgroundImage}`})`
            : 'linear-gradient(rgba(75, 14, 20, 0.95), rgba(75, 14, 20, 0.95))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          padding: '6rem 0',
          color: 'white'
        }}
      >
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ color: 'var(--matte-gold)', fontSize: '2.5rem', marginBottom: '1rem' }}>
              {processSectionData ? getText(processSectionData.title) : 'Our Process'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem' }}>
              {processSectionData ? getText(processSectionData.subtitle) : 'A systematic approach to delivering exceptional results'}
            </p>
          </div>
          <div className="process-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            <div className="process-step" style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--matte-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: 'var(--luxury-burgundy)', fontWeight: 'bold' }}>1</div>
              <h3 style={{ color: 'var(--matte-gold)', marginBottom: '1rem' }}>Consultation & Discovery</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Understanding client goals, requirements, and investment objectives</p>
            </div>
            <div className="process-step" style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--matte-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: 'var(--luxury-burgundy)', fontWeight: 'bold' }}>2</div>
              <h3 style={{ color: 'var(--matte-gold)', marginBottom: '1rem' }}>Market Research & Feasibility</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Conducting in-depth analysis of opportunities and market conditions</p>
            </div>
            <div className="process-step" style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--matte-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: 'var(--luxury-burgundy)', fontWeight: 'bold' }}>3</div>
              <h3 style={{ color: 'var(--matte-gold)', marginBottom: '1rem' }}>Strategy Development</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Designing tailored solutions and implementation roadmaps</p>
            </div>
            <div className="process-step" style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--matte-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: 'var(--luxury-burgundy)', fontWeight: 'bold' }}>4</div>
              <h3 style={{ color: 'var(--matte-gold)', marginBottom: '1rem' }}>Execution & Delivery</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Managing the transaction or project with precision and care</p>
            </div>
            <div className="process-step" style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--matte-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: 'var(--luxury-burgundy)', fontWeight: 'bold' }}>5</div>
              <h3 style={{ color: 'var(--matte-gold)', marginBottom: '1rem' }}>Reporting & Transparency</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Keeping clients informed at every step with detailed updates</p>
            </div>
            <div className="process-step" style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--matte-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: 'var(--luxury-burgundy)', fontWeight: 'bold' }}>6</div>
              <h3 style={{ color: 'var(--matte-gold)', marginBottom: '1rem' }}>Continuous Support</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Ensuring long-term satisfaction and ongoing value creation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnerships */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2>Our Partnerships</h2>
            <p>Strategic alliances that enhance our service delivery</p>
          </div>
          <div className="partnerships-grid services-grid">
            <div className="service-card">
              <h3>🏗️ Leading Developers</h3>
              <p>
                Strong alliances with leading developers in the GCC, MENA, and Europe, 
                providing access to premium projects and exclusive opportunities.
              </p>
            </div>
            <div className="service-card">
              <h3>🏦 Financial Institutions</h3>
              <p>
                Partnerships with banks and financial institutions to provide comprehensive 
                mortgage and investment solutions for our clients.
              </p>
            </div>
            <div className="service-card">
              <h3>🎨 Design & Management</h3>
              <p>
                Collaboration with interior design and facility management providers to 
                enhance property value and client satisfaction.
              </p>
            </div>
            <div className="service-card">
              <h3>⚖️ Legal Consultants</h3>
              <p>
                Working with experienced legal consultants to ensure compliance and 
                smooth transactions in every market we operate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <h2>Ready to Get Started?</h2>
            <p>Let us help you achieve your real estate goals with our comprehensive services</p>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <div className="cta-buttons">
              <a href="/contact" className="btn btn-primary">
                Schedule Consultation
              </a>
              <a href="/properties" className="btn btn-secondary">
                View Properties
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
