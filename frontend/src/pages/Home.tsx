import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeroSection from '../components/HeroSection';
import PropertySearchWidget from '../components/PropertySearchWidget';
import PortfolioShowcase from '../components/PortfolioShowcase';
import ServicesSection from '../components/ServicesSection';
import ProcessSection from '../components/ProcessSection';
import PartnersSection from '../components/PartnersSection';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="home">
      {/* Hero Section with Video */}
      <section className="hero-slider-section">
        <HeroSection />

        {/* Property Search Widget positioned below hero */}
        <div className="search-widget-overlay">
          <PropertySearchWidget />
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="featured-properties-section">
        <div className="container">
          <div className="section-header-modern">
            <div className="section-badge">{t('home.featuredProperties')}</div>
            <h2 className="section-title-modern">{t('home.exceptionalProperties')}</h2>
            <p className="section-subtitle-modern">
              {t('home.handpickedLuxury')}
            </p>
          </div>

          <div className="featured-properties-grid">
            <div className="featured-property-card">
              <div className="property-image">
                <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Luxury Villa" />
                <div className="property-badge">{t('home.forSale')}</div>
              </div>
              <div className="property-info">
                <h3>Luxury Marina Villa</h3>
                <p className="property-location">📍 The Pearl, Qatar</p>
                <p className="property-price">QAR 8,500,000</p>
                <div className="property-features">
                  <span>4 {t('home.beds')}</span>
                  <span>5 {t('home.baths')}</span>
                  <span>450 sqm</span>
                </div>
              </div>
            </div>

            <div className="featured-property-card">
              <div className="property-image">
                <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Modern Apartment" />
                <div className="property-badge">{t('home.forRent')}</div>
              </div>
              <div className="property-info">
                <h3>Modern Downtown Apartment</h3>
                <p className="property-location">📍 West Bay, Doha</p>
                <p className="property-price">QAR 15,000/month</p>
                <div className="property-features">
                  <span>3 {t('home.beds')}</span>
                  <span>3 {t('home.baths')}</span>
                  <span>180 sqm</span>
                </div>
              </div>
            </div>

            <div className="featured-property-card">
              <div className="property-image">
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Penthouse" />
                <div className="property-badge">{t('home.forSale')}</div>
              </div>
              <div className="property-info">
                <h3>Executive Penthouse</h3>
                <p className="property-location">📍 Lusail City, Qatar</p>
                <p className="property-price">QAR 12,000,000</p>
                <div className="property-features">
                  <span>5 {t('home.beds')}</span>
                  <span>6 {t('home.baths')}</span>
                  <span>600 sqm</span>
                </div>
              </div>
            </div>
          </div>

          <div className="section-cta">
            <Link to="/properties" className="btn-modern-primary">
              {t('home.viewAllProperties')}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Portfolio Showcase Section */}
      <PortfolioShowcase />

      {/* About Section with Modern Design */}
      <section className="about-section-modern">
        <div className="container">
          <div className="about-content-grid">
            <div className="about-text">
              <div className="section-badge">About N&H Real Estate</div>
              <h2 className="section-title-modern">Your Trusted Real Estate Partner</h2>
              <p className="about-description">
                We provide a comprehensive portfolio of services designed for individuals, families, developers,
                corporate tenants, and institutional investors. By combining local expertise with international
                standards, every transaction is managed with professionalism and integrity.
              </p>
              <p className="about-description">
                With over 15 years of experience across Qatar, UAE, Saudi Arabia, Egypt, France, Morocco,
                Oman, and Turkey, we deliver world-class real estate solutions tailored to your needs.
              </p>

              <div className="about-features">
                <div className="about-feature">
                  <div className="feature-icon">🏆</div>
                  <div>
                    <h4>Award-Winning Service</h4>
                    <p>Recognized excellence in real estate</p>
                  </div>
                </div>
                <div className="about-feature">
                  <div className="feature-icon">🌍</div>
                  <div>
                    <h4>Global Network</h4>
                    <p>Properties across 8 countries</p>
                  </div>
                </div>
                <div className="about-feature">
                  <div className="feature-icon">🤝</div>
                  <div>
                    <h4>Trusted Expertise</h4>
                    <p>15+ years of market experience</p>
                  </div>
                </div>
              </div>

              <Link to="/about" className="btn-modern-secondary">
                Learn More About Us
              </Link>
            </div>

            <div className="about-image">
              <img src="/images/about.png" alt="Modern Architecture" />
              <div className="about-image-overlay">
                <div className="about-stat">
                  <span className="stat-number">1000+</span>
                  <span className="stat-label">Happy Clients</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Dynamic from Backend */}
      <ServicesSection />

      {/* Process Section - Dynamic from Backend */}
      <ProcessSection />

      {/* Partners Section - Dynamic from Backend */}
      <PartnersSection />

      {/* Stats Section with Modern Design */}
      <section className="stats-section-modern">
        <div className="container">
          <div className="stats-grid-modern">
            <div className="stat-card-modern">
              <div className="stat-number-modern">15+</div>
              <div className="stat-label-modern">Years Experience</div>
            </div>
            <div className="stat-card-modern">
              <div className="stat-number-modern">8</div>
              <div className="stat-label-modern">Countries</div>
            </div>
            <div className="stat-card-modern">
              <div className="stat-number-modern">1000+</div>
              <div className="stat-label-modern">Properties Sold</div>
            </div>
            <div className="stat-card-modern">
              <div className="stat-number-modern">2000+</div>
              <div className="stat-label-modern">Happy Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section-modern">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Find Your Dream Property?</h2>
            <p>Let our expert team guide you through your real estate journey</p>
            <div className="cta-buttons">
              <Link to="/properties" className="btn-modern-primary">
                Browse Properties
              </Link>
              <Link to="/contact" className="btn-modern-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
