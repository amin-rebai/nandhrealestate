import React from 'react';

const About: React.FC = () => {
  return (
    <div className="about-page">
      {/* Enhanced Hero Section */}
      <section className="about-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="About N&H Real Estate"
            className="hero-bg-image"
          />
        </div>
        <div className="hero-content">
          <div className="container">
            <h1 className="hero-title">About N&H Real Estate</h1>
            <p className="hero-subtitle">Building Trust Through Excellence</p>
            <p className="hero-description">
              Discover our journey, vision, and commitment to transforming the real estate
              landscape across Qatar, the Gulf, MENA, and Europe.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2>Vision & Mission</h2>
          </div>
          <div className="vision-mission-grid">
            <div className="vision-card visual-enhanced">
              <div className="card-image">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Our Vision"
                  className="card-img"
                />
                <div className="card-icon">🎯</div>
              </div>
              <div className="card-content">
                <h3>Our Vision</h3>
                <p>
                  To be the region's most trusted and innovative real estate partner, delivering
                  excellence and sustainable growth through professionalism, technology, and
                  client-focused solutions.
                </p>
              </div>
            </div>
            <div className="mission-card visual-enhanced">
              <div className="card-image">
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Our Mission"
                  className="card-img"
                />
                <div className="card-icon">🚀</div>
              </div>
              <div className="card-content">
                <h3>Our Mission</h3>
                <p>
                  Our mission is to simplify the real estate journey through end-to-end services,
                  delivering measurable value powered by market insights and modern tools. We build
                  long-term partnerships grounded in trust and transparency, and we champion sustainable
                  growth aligned with Qatar National Vision 2030 and global best practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CEO Message */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <h2>Message from Our CEO</h2>
          </div>
          <div className="ceo-message" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ background: 'rgba(197, 160, 89, 0.1)', padding: '3rem', borderRadius: '12px', border: '2px solid var(--matte-gold)' }}>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '2rem', fontStyle: 'italic' }}>
                "At N&H Real Estate, we believe property is more than bricks and mortar—it represents 
                security, prosperity, and legacy. Our mission is to empower clients with the knowledge, 
                tools, and guidance they need to make confident real estate decisions."
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                "As Qatar and the wider region continue their rapid transformation, we remain committed 
                to being at the forefront of this growth. With a focus on transparency, innovation, and 
                excellence, N&H Real Estate is redefining what it means to be a full-service property 
                partner across local, regional, and international markets."
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                "At N&H Real Estate, we align strategy with execution across acquisitions, leasing, 
                marketing, asset management, and portfolio advisory. Our client-first practice integrates 
                data-driven analysis with on-the-ground expertise in Qatar and key international gateways. 
                We operate with integrity, agility, and precision—enabling investors, developers, and 
                occupiers to unlock value, de-risk decisions, and sustain long-term performance."
              </p>
              <div style={{ borderTop: '1px solid var(--matte-gold)', paddingTop: '1.5rem', marginTop: '2rem' }}>
                <p style={{ fontWeight: '600', color: 'var(--matte-gold)' }}>CEO – N&H Real Estate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Network */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2>Our Worldwide Network</h2>
            <p>
              N&H Real Estate operates across a global network of premium real estate markets, 
              connecting clients to opportunities in the Gulf, MENA, and Europe.
            </p>
          </div>
          <div className="network-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            <div className="network-card service-card">
              <h3>🇶🇦 Qatar</h3>
              <p>Doha, Lusail, The Pearl, West Bay, Msheireb Downtown, Al Waab</p>
            </div>
            
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-light)' }}>
              Through this worldwide reach, our clients gain access to exclusive off-market listings, 
              cross-border investment opportunities, and seamless transactions supported by local 
              expertise and global standards.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose N&H Real Estate</h2>
            <p>What sets us apart in the competitive real estate market</p>
          </div>
          <div className="why-choose-grid values-grid">
            <div className="value-card">
              <div className="value-icon">🌍</div>
              <h3>Global Reach with Local Expertise</h3>
              <p>Active across multiple international markets with deep local knowledge</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🔑</div>
              <h3>Exclusive Listings</h3>
              <p>Premium projects not available on the open market with early access opportunities</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🔄</div>
              <h3>Comprehensive Support</h3>
              <p>From purchase to furnishing, management, and exit strategies</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Trusted Partnerships</h3>
              <p>Strong relationships with developers, landlords, and institutions</p>
            </div>
            <div className="value-card">
              <div className="value-icon">⚡</div>
              <h3>Seamless Processes</h3>
              <p>Transparent, efficient, and client-focused service delivery</p>
            </div>
            <div className="value-card">
              <div className="value-icon">📈</div>
              <h3>Proven Track Record</h3>
              <p>Trusted by families, corporates, and global investors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2>What Our Clients Say</h2>
            <p>Real experiences from satisfied clients across our global network</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-text">
                N&H Real Estate guided us through our first investment in Qatar with professionalism 
                and transparency. Every step was clear and well-managed.
              </p>
              <div className="testimonial-author">Private Investor</div>
              <div className="testimonial-role">KSA</div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-text">
                Thanks to their international network, we were able to expand our portfolio from 
                Doha to Paris seamlessly. Their team handled everything with precision.
              </p>
              <div className="testimonial-author">Institutional Investor</div>
              <div className="testimonial-role">France</div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-text">
                N&H Real Estate manages our properties in Lusail with complete efficiency. We have 
                higher occupancy and better tenant satisfaction than ever before.
              </p>
              <div className="testimonial-author">Property Owner</div>
              <div className="testimonial-role">Qatar</div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-text">
                From market insights to after-sales support, N&H Real Estate exceeded our expectations. 
                They truly care about long-term client success.
              </p>
              <div className="testimonial-author">Developer Partner</div>
              <div className="testimonial-role">UAE</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
