import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeroSlider from '../components/HeroSlider';
import PropertySearchWidget from '../components/PropertySearchWidget';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="home">
      {/* Hero Slider Section */}
      <section className="hero-slider-section">
        <HeroSlider />

        {/* Property Search Widget positioned below slider */}
        <div className="search-widget-overlay">
          <PropertySearchWidget />
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="featured-properties-section">
        <div className="container">
          <div className="section-header-modern">
            <div className="section-badge">Featured Properties</div>
            <h2 className="section-title-modern">Exceptional Properties</h2>
            <p className="section-subtitle-modern">
              Handpicked luxury properties that define excellence in real estate
            </p>
          </div>

          <div className="featured-properties-grid">
            <div className="featured-property-card">
              <div className="property-image">
                <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Luxury Villa" />
                <div className="property-badge">For Sale</div>
              </div>
              <div className="property-info">
                <h3>Luxury Marina Villa</h3>
                <p className="property-location">📍 The Pearl, Qatar</p>
                <p className="property-price">QAR 8,500,000</p>
                <div className="property-features">
                  <span>4 Beds</span>
                  <span>5 Baths</span>
                  <span>450 sqm</span>
                </div>
              </div>
            </div>

            <div className="featured-property-card">
              <div className="property-image">
                <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Modern Apartment" />
                <div className="property-badge">For Rent</div>
              </div>
              <div className="property-info">
                <h3>Modern Downtown Apartment</h3>
                <p className="property-location">📍 West Bay, Doha</p>
                <p className="property-price">QAR 15,000/month</p>
                <div className="property-features">
                  <span>3 Beds</span>
                  <span>3 Baths</span>
                  <span>180 sqm</span>
                </div>
              </div>
            </div>

            <div className="featured-property-card">
              <div className="property-image">
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Penthouse" />
                <div className="property-badge">For Sale</div>
              </div>
              <div className="property-info">
                <h3>Executive Penthouse</h3>
                <p className="property-location">📍 Lusail City, Qatar</p>
                <p className="property-price">QAR 12,000,000</p>
                <div className="property-features">
                  <span>5 Beds</span>
                  <span>6 Baths</span>
                  <span>600 sqm</span>
                </div>
              </div>
            </div>
          </div>

          <div className="section-cta">
            <Link to="/properties" className="btn-modern-primary">
              View All Properties
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Visual Showcase Section */}
      <section className="visual-showcase-section">
        <div className="container">
          <div className="section-header-modern">
            <div className="section-badge">Our Portfolio</div>
            <h2 className="section-title-modern">Luxury Living Redefined</h2>
            <p className="section-subtitle-modern">
              Experience the finest properties across our global network
            </p>
          </div>

          <div className="showcase-grid">
            <div className="showcase-item large">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Luxury Villa"
                className="showcase-image"
              />
              <div className="showcase-overlay">
                <div className="showcase-content">
                  <h3>Luxury Villas</h3>
                  <p>Exclusive waterfront properties with premium amenities</p>
                  <Link to="/properties" className="showcase-link">Explore Villas →</Link>
                </div>
              </div>
            </div>

            <div className="showcase-item">
              <img
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Modern Apartments"
                className="showcase-image"
              />
              <div className="showcase-overlay">
                <div className="showcase-content">
                  <h3>Modern Apartments</h3>
                  <p>Contemporary living in prime locations</p>
                  <Link to="/properties" className="showcase-link">View Apartments →</Link>
                </div>
              </div>
            </div>

            <div className="showcase-item">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Commercial Properties"
                className="showcase-image"
              />
              <div className="showcase-overlay">
                <div className="showcase-content">
                  <h3>Commercial Spaces</h3>
                  <p>Prime office and retail opportunities</p>
                  <Link to="/properties" className="showcase-link">Discover Commercial →</Link>
                </div>
              </div>
            </div>

            <div className="showcase-item">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Penthouse Living"
                className="showcase-image"
              />
              <div className="showcase-overlay">
                <div className="showcase-content">
                  <h3>Penthouse Collection</h3>
                  <p>Sky-high luxury with panoramic views</p>
                  <Link to="/properties" className="showcase-link">View Penthouses →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Services Section with Modern Cards */}
      <section className="services-section-modern">
        <div className="container">
          <div className="section-header-modern">
            <div className="section-badge">Our Services</div>
            <h2 className="section-title-modern">Comprehensive Real Estate Solutions</h2>
            <p className="section-subtitle-modern">
              From sales and leasing to property management and investment advisory
            </p>
          </div>

          <div className="services-grid-modern">
            <div className="service-card-modern">
              <div className="service-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M3 21L21 21M5 21V7L13 2L21 7V21M9 9V13M15 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Sales & Leasing</h3>
              <p>Luxury residential, commercial, and retail properties with expert guidance through every step of the transaction.</p>
              <Link to="/services" className="service-link">Learn More →</Link>
            </div>

            <div className="service-card-modern">
              <div className="service-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Property Management</h3>
              <p>Complete property management services including tenant relations, maintenance, and financial reporting.</p>
              <Link to="/services" className="service-link">Learn More →</Link>
            </div>

            <div className="service-card-modern">
              <div className="service-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L3.09 8.26L12 14L20.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.09 8.26V15.74L12 22L20.91 15.74V8.26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Development Management</h3>
              <p>End-to-end development services from feasibility studies to project delivery and handover.</p>
              <Link to="/services" className="service-link">Learn More →</Link>
            </div>

            <div className="service-card-modern">
              <div className="service-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M16 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 10H16M8 14H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Investment Advisory</h3>
              <p>Strategic investment guidance and portfolio management to maximize returns and minimize risks.</p>
              <Link to="/services" className="service-link">Learn More →</Link>
            </div>
          </div>
        </div>
      </section>

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
