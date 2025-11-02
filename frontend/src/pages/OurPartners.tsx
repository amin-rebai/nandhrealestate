import React from 'react';
import { Link } from 'react-router-dom';

const OurPartners: React.FC = () => {
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

          <div className="partners-categories-grid">
            <div className="partner-category visual-enhanced">
              <div className="category-image">
                <img 
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Financial Partners"
                  className="category-img"
                />
                <div className="category-icon">🏦</div>
              </div>
              <div className="category-content">
                <h3>Financial Partners</h3>
                <p className="category-description">
                  <strong>Leading banks and financial institutions</strong>
                </p>
                <ul className="category-features">
                  <li>Mortgage and financing solutions</li>
                  <li>Investment banking services</li>
                  <li>Insurance and risk management</li>
                  <li>International banking networks</li>
                  <li>Specialized real estate financing</li>
                </ul>
              </div>
            </div>

            <div className="partner-category visual-enhanced">
              <div className="category-image">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Technology Partners"
                  className="category-img"
                />
                <div className="category-icon">💻</div>
              </div>
              <div className="category-content">
                <h3>Technology Partners</h3>
                <p className="category-description">
                  <strong>Cutting-edge proptech and digital solutions</strong>
                </p>
                <ul className="category-features">
                  <li>CRM and lead management systems</li>
                  <li>Virtual tour and 3D visualization</li>
                  <li>Property management platforms</li>
                  <li>Digital marketing and analytics</li>
                  <li>Blockchain and smart contracts</li>
                </ul>
              </div>
            </div>

            <div className="partner-category visual-enhanced">
              <div className="category-image">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Legal Partners"
                  className="category-img"
                />
                <div className="category-icon">⚖️</div>
              </div>
              <div className="category-content">
                <h3>Legal & Advisory Partners</h3>
                <p className="category-description">
                  <strong>Top-tier legal and consulting firms</strong>
                </p>
                <ul className="category-features">
                  <li>Real estate law and compliance</li>
                  <li>Contract negotiation and drafting</li>
                  <li>Tax planning and optimization</li>
                  <li>Regulatory compliance</li>
                  <li>International legal support</li>
                </ul>
              </div>
            </div>

            <div className="partner-category visual-enhanced">
              <div className="category-image">
                <img 
                  src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Construction Partners"
                  className="category-img"
                />
                <div className="category-icon">🏗️</div>
              </div>
              <div className="category-content">
                <h3>Construction & Development</h3>
                <p className="category-description">
                  <strong>Premier construction and development companies</strong>
                </p>
                <ul className="category-features">
                  <li>Luxury residential developments</li>
                  <li>Commercial construction projects</li>
                  <li>Renovation and refurbishment</li>
                  <li>Sustainable building practices</li>
                  <li>Project management expertise</li>
                </ul>
              </div>
            </div>
          </div>
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
