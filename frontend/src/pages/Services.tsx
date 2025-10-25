import React from 'react';

const Services: React.FC = () => {
  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Our Services</h1>
          <p className="tagline">Comprehensive Real Estate Solutions</p>
          <p>
            We deliver a full range of real estate solutions designed to meet the diverse 
            needs of our clients across residential, commercial, and investment properties.
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2>Core Services</h2>
            <p>End-to-end real estate solutions tailored to your needs</p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <h3>Sales & Leasing</h3>
              <p>
                <strong>Luxury residential, commercial, and retail properties</strong><br/>
                • Pipeline curation and market analysis<br/>
                • Professional property viewings<br/>
                • Expert negotiation and closing<br/>
                • Legal documentation support<br/>
                • Post-sale customer service
              </p>
            </div>
            
            <div className="service-card">
              <h3>Marketing & CRM-Integrated Promotion</h3>
              <p>
                <strong>Professional marketing through our channels</strong><br/>
                • Targeted digital campaigns<br/>
                • Qualified lead generation via CRM<br/>
                • High-quality content creation<br/>
                • 3D visualization and virtual tours<br/>
                • Performance reporting and analytics
              </p>
            </div>

            <div className="service-card">
              <h3>Property Management</h3>
              <p>
                <strong>Complete property lifecycle management</strong><br/>
                • Tenant screening and onboarding<br/>
                • Lease administration and rent collection<br/>
                • Financial reporting and accounting<br/>
                • Preventive maintenance and landscaping<br/>
                • 24/7 helpdesk and emergency support
              </p>
            </div>

            <div className="service-card">
              <h3>Asset & Portfolio Management</h3>
              <p>
                <strong>Maximize NOI and long-term performance</strong><br/>
                • Hold/sell analysis and strategy<br/>
                • Property re-positioning and upgrades<br/>
                • Risk management and mitigation<br/>
                • Performance optimization<br/>
                • Investment portfolio diversification
              </p>
            </div>

            <div className="service-card">
              <h3>Development Management</h3>
              <p>
                <strong>End-to-end project development</strong><br/>
                • Feasibility studies and business plans<br/>
                • Design coordination and planning<br/>
                • Procurement and contractor selection<br/>
                • Program and cost control<br/>
                • Quality assurance and delivery oversight
              </p>
            </div>

            <div className="service-card">
              <h3>Turnkey Furnishing & Interiors</h3>
              <p>
                <strong>Ready-to-live or ready-to-rent setups</strong><br/>
                • Interior design consultation<br/>
                • Furniture selection and procurement<br/>
                • Complete setup and styling<br/>
                • Enhanced market appeal<br/>
                • Improved rental potential and absorption
              </p>
            </div>

            <div className="service-card">
              <h3>Finance & Mortgage Support</h3>
              <p>
                <strong>Comprehensive financing solutions</strong><br/>
                • Mortgage advisory and applications<br/>
                • Refinancing options and strategies<br/>
                • Project funding guidance<br/>
                • Coordination with lending partners<br/>
                • Investment financing structures
              </p>
            </div>

            <div className="service-card">
              <h3>Valuation & Advisory</h3>
              <p>
                <strong>Market-driven property valuations</strong><br/>
                • Sales and acquisition valuations<br/>
                • Financing and insurance assessments<br/>
                • Transparent assumptions and methodology<br/>
                • Evidence-based comparables<br/>
                • Investment advisory services
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <h2>Our Process</h2>
            <p>A systematic approach to delivering exceptional results</p>
          </div>
          <div className="process-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            <div className="process-step" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--matte-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: 'var(--luxury-burgundy)', fontWeight: 'bold' }}>1</div>
              <h3 style={{ color: 'var(--matte-gold)', marginBottom: '1rem' }}>Consultation & Discovery</h3>
              <p>Understanding client goals, requirements, and investment objectives</p>
            </div>
            <div className="process-step" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--matte-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: 'var(--luxury-burgundy)', fontWeight: 'bold' }}>2</div>
              <h3 style={{ color: 'var(--matte-gold)', marginBottom: '1rem' }}>Market Research & Feasibility</h3>
              <p>Conducting in-depth analysis of opportunities and market conditions</p>
            </div>
            <div className="process-step" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--matte-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: 'var(--luxury-burgundy)', fontWeight: 'bold' }}>3</div>
              <h3 style={{ color: 'var(--matte-gold)', marginBottom: '1rem' }}>Strategy Development</h3>
              <p>Designing tailored solutions and implementation roadmaps</p>
            </div>
            <div className="process-step" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--matte-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: 'var(--luxury-burgundy)', fontWeight: 'bold' }}>4</div>
              <h3 style={{ color: 'var(--matte-gold)', marginBottom: '1rem' }}>Execution & Delivery</h3>
              <p>Managing the transaction or project with precision and care</p>
            </div>
            <div className="process-step" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--matte-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: 'var(--luxury-burgundy)', fontWeight: 'bold' }}>5</div>
              <h3 style={{ color: 'var(--matte-gold)', marginBottom: '1rem' }}>Reporting & Transparency</h3>
              <p>Keeping clients informed at every step with detailed updates</p>
            </div>
            <div className="process-step" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--matte-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: 'var(--luxury-burgundy)', fontWeight: 'bold' }}>6</div>
              <h3 style={{ color: 'var(--matte-gold)', marginBottom: '1rem' }}>Continuous Support</h3>
              <p>Ensuring long-term satisfaction and ongoing value creation</p>
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
