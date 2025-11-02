import React from 'react';
import { Link } from 'react-router-dom';

const OurProcess: React.FC = () => {
  return (
    <div className="our-process-page">
      {/* Enhanced Hero Section */}
      <section className="about-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Our Process"
            className="hero-bg-image"
          />
        </div>
        <div className="hero-content">
          <div className="container">
            <h1 className="hero-title">Our Process</h1>
            <p className="hero-subtitle">Streamlined Excellence in Every Step</p>
            <p className="hero-description">
              Our proven methodology ensures seamless transactions and exceptional results 
              through every phase of your real estate journey.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps Section */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2>How We Work</h2>
            <p>Our systematic approach ensures transparency, efficiency, and success in every project</p>
          </div>

          <div className="process-timeline">
            <div className="process-step visual-enhanced">
              <div className="step-number">01</div>
              <div className="step-image">
                <img 
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Initial Consultation"
                  className="step-img"
                />
                <div className="step-icon">🤝</div>
              </div>
              <div className="step-content">
                <h3>Initial Consultation</h3>
                <p className="step-description">
                  We begin with a comprehensive consultation to understand your specific needs, 
                  goals, and preferences. Our experts analyze your requirements and provide 
                  tailored recommendations.
                </p>
                <ul className="step-features">
                  <li>Needs assessment and goal setting</li>
                  <li>Market analysis and opportunity identification</li>
                  <li>Budget planning and financial consultation</li>
                  <li>Timeline establishment and milestone planning</li>
                </ul>
              </div>
            </div>

            <div className="process-step visual-enhanced">
              <div className="step-number">02</div>
              <div className="step-image">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Strategy Development"
                  className="step-img"
                />
                <div className="step-icon">📋</div>
              </div>
              <div className="step-content">
                <h3>Strategy Development</h3>
                <p className="step-description">
                  Based on your consultation, we develop a customized strategy that aligns 
                  with your objectives. This includes market positioning, pricing strategies, 
                  and action plans.
                </p>
                <ul className="step-features">
                  <li>Customized strategy formulation</li>
                  <li>Market positioning and competitive analysis</li>
                  <li>Risk assessment and mitigation planning</li>
                  <li>Resource allocation and team assignment</li>
                </ul>
              </div>
            </div>

            <div className="process-step visual-enhanced">
              <div className="step-number">03</div>
              <div className="step-image">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Implementation"
                  className="step-img"
                />
                <div className="step-icon">⚡</div>
              </div>
              <div className="step-content">
                <h3>Implementation & Execution</h3>
                <p className="step-description">
                  Our experienced team executes the strategy with precision and attention to detail. 
                  We handle all aspects of the process while keeping you informed at every step.
                </p>
                <ul className="step-features">
                  <li>Professional marketing and promotion</li>
                  <li>Client screening and qualification</li>
                  <li>Negotiation and deal structuring</li>
                  <li>Documentation and legal compliance</li>
                </ul>
              </div>
            </div>

            <div className="process-step visual-enhanced">
              <div className="step-number">04</div>
              <div className="step-image">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Monitoring & Support"
                  className="step-img"
                />
                <div className="step-icon">📊</div>
              </div>
              <div className="step-content">
                <h3>Monitoring & Ongoing Support</h3>
                <p className="step-description">
                  We provide continuous monitoring and support throughout the process and beyond. 
                  Our commitment extends well past the transaction completion.
                </p>
                <ul className="step-features">
                  <li>Progress tracking and reporting</li>
                  <li>Performance optimization</li>
                  <li>Post-transaction support</li>
                  <li>Long-term relationship management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Process Section */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <h2 style={{ color: 'white' }}>Why Our Process Works</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>
              Our methodology is built on years of experience and proven results
            </p>
          </div>

          <div className="process-benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🎯</div>
              <h3>Precision & Accuracy</h3>
              <p>Every step is carefully planned and executed with attention to detail</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⏱️</div>
              <h3>Time Efficiency</h3>
              <p>Streamlined processes that save time while maintaining quality</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🔒</div>
              <h3>Risk Mitigation</h3>
              <p>Comprehensive risk assessment and management at every stage</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📈</div>
              <h3>Proven Results</h3>
              <p>Track record of successful transactions and satisfied clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section section-light">
        <div className="container">
          <div className="cta-content" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Experience Our Process</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--gray)' }}>
              Ready to see how our proven process can work for you? Let's start your real estate journey today.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn-primary-enhanced">
                Start Your Journey
              </Link>
              <Link to="/our-partners" className="btn-secondary-enhanced">
                Meet Our Partners
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurProcess;
