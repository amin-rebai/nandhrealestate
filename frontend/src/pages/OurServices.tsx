import React from 'react';
import { Link } from 'react-router-dom';

const OurServices: React.FC = () => {
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

          <div className="services-enhanced-grid">
            <div className="service-card visual-enhanced">
              <div className="service-image">
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Sales & Leasing"
                  className="service-img"
                />
                <div className="service-icon">🏢</div>
              </div>
              <div className="service-content">
                <h3>Sales & Leasing</h3>
                <p className="service-description">
                  <strong>Luxury residential, commercial, and retail properties</strong>
                </p>
                <ul className="service-features">
                  <li>Pipeline curation and market analysis</li>
                  <li>Professional property viewings</li>
                  <li>Expert negotiation and closing</li>
                  <li>Legal documentation support</li>
                  <li>Post-sale customer service</li>
                </ul>
              </div>
            </div>

            <div className="service-card visual-enhanced">
              <div className="service-image">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Marketing & CRM"
                  className="service-img"
                />
                <div className="service-icon">📈</div>
              </div>
              <div className="service-content">
                <h3>Marketing & CRM-Integrated Promotion</h3>
                <p className="service-description">
                  <strong>Professional marketing through our channels</strong>
                </p>
                <ul className="service-features">
                  <li>Targeted digital campaigns</li>
                  <li>Qualified lead generation via CRM</li>
                  <li>High-quality content creation</li>
                  <li>3D visualization and virtual tours</li>
                  <li>Performance reporting and analytics</li>
                </ul>
              </div>
            </div>

            <div className="service-card visual-enhanced">
              <div className="service-image">
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Property Management"
                  className="service-img"
                />
                <div className="service-icon">🏠</div>
              </div>
              <div className="service-content">
                <h3>Property Management</h3>
                <p className="service-description">
                  <strong>Complete property lifecycle management</strong>
                </p>
                <ul className="service-features">
                  <li>Tenant screening and onboarding</li>
                  <li>Lease administration and rent collection</li>
                  <li>Financial reporting and accounting</li>
                  <li>Preventive maintenance and landscaping</li>
                  <li>24/7 helpdesk and emergency support</li>
                </ul>
              </div>
            </div>

            <div className="service-card visual-enhanced">
              <div className="service-image">
                <img 
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Asset Management"
                  className="service-img"
                />
                <div className="service-icon">📊</div>
              </div>
              <div className="service-content">
                <h3>Asset & Portfolio Management</h3>
                <p className="service-description">
                  <strong>Maximize NOI and long-term performance</strong>
                </p>
                <ul className="service-features">
                  <li>Hold/sell analysis and strategy</li>
                  <li>Property re-positioning and upgrades</li>
                  <li>Risk management and mitigation</li>
                  <li>Performance optimization</li>
                  <li>Investment portfolio diversification</li>
                </ul>
              </div>
            </div>

            <div className="service-card visual-enhanced">
              <div className="service-image">
                <img 
                  src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Development Management"
                  className="service-img"
                />
                <div className="service-icon">🏗️</div>
              </div>
              <div className="service-content">
                <h3>Development Management</h3>
                <p className="service-description">
                  <strong>End-to-end project development oversight</strong>
                </p>
                <ul className="service-features">
                  <li>Project planning and feasibility studies</li>
                  <li>Construction management and oversight</li>
                  <li>Quality control and compliance</li>
                  <li>Timeline and budget management</li>
                  <li>Stakeholder coordination</li>
                </ul>
              </div>
            </div>

            <div className="service-card visual-enhanced">
              <div className="service-image">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Investment Advisory"
                  className="service-img"
                />
                <div className="service-icon">💼</div>
              </div>
              <div className="service-content">
                <h3>Investment Advisory</h3>
                <p className="service-description">
                  <strong>Strategic investment guidance and analysis</strong>
                </p>
                <ul className="service-features">
                  <li>Market research and analysis</li>
                  <li>Investment opportunity identification</li>
                  <li>Due diligence and risk assessment</li>
                  <li>Portfolio optimization strategies</li>
                  <li>Exit strategy planning</li>
                </ul>
              </div>
            </div>
          </div>
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
