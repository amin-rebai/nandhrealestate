import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState, AppDispatch } from '../store/store';
import { fetchContentBySection } from '../store/slices/contentSlice';

const About: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { i18n } = useTranslation();
  const { aboutSection, heroSection } = useSelector((state: RootState) => state.content);

  useEffect(() => {
    // Fetch both hero and about sections (active only) - fetches all languages once
    dispatch(fetchContentBySection({ section: 'hero', active: true }));
    dispatch(fetchContentBySection({ section: 'about', active: true }));
  }, [dispatch]); // No language dependency - fetch once, switch language client-side

  // Safe access helpers
  const getMeta = (path: string, fallback: any = '') => {
    try {
      // support dot paths like 'ceo.photo' inside aboutSection.metadata
      if (!aboutSection?.metadata) return fallback;
      const parts = path.split('.');
      let node: any = aboutSection.metadata;
      for (const p of parts) {
        node = node?.[p];
      }
      return node ?? fallback;
    } catch (e) {
      return fallback;
    }
  };

  // Display multilingual content based on current language (uses i18n.language directly)
  const displayML = (value: any) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    // multilingual object { en, ar, fr }
    if (typeof value === 'object') {
      const lang = i18n.language as 'en' | 'ar' | 'fr';
      return value[lang] ?? value.en ?? value.ar ?? value.fr ?? '';
    }
    return '';
  };

  const hero = heroSection || null;

  return (
    <div className="about-page">
      {/* Enhanced Hero Section - Fetched from Backend */}
      <section className="about-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <img
            src={
              hero?.backgroundImage?.startsWith('http')
                ? hero.backgroundImage
                : hero?.backgroundImage
                ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${hero.backgroundImage}`
                : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
            }
            alt={displayML(hero?.title) || 'About N&H Real Estate'}
            className="hero-bg-image"
          />
        </div>
        <div className="hero-content hero-left">
          <div className="container hero-inner">
            <div className="hero-pretitle">{displayML(hero?.metadata?.pretitle) || "Who's Redefining the..."}</div>
            <h1 className="hero-title big">{displayML(hero?.title) || 'Future of Real Estate ?'}</h1>

            <div className="hero-description-block">
              <p className="hero-description">
                {displayML(hero?.description) || 'N&H Homes Real Estate is reshaping how people discover, invest, and experience property. We combine human expertise with smart technology to deliver faster decisions, clearer insights, and exceptional client journeys.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section - Full Width */}
      <section
        className="vision-fullwidth-section"
        style={{
          backgroundImage: `url(${getMeta('visionImage')?.startsWith('http') ? getMeta('visionImage') : getMeta('visionImage') ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${getMeta('visionImage')}` : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80'})`
        }}
      >
        <div className="vision-fullwidth-overlay"></div>
        <div className="vision-fullwidth-content">
          <div className="vision-icon">🎯</div>
          <h2>Our Vision</h2>
          <p>{displayML(getMeta('vision', 'To be the region\'s most trusted and innovative real estate partner, delivering excellence and sustainable growth through professionalism, technology, and client-focused solutions.'))}</p>
        </div>
      </section>

      {/* Mission Section - Full Width */}
      <section
        className="mission-fullwidth-section"
        style={{
          backgroundImage: `url(${getMeta('missionImage')?.startsWith('http') ? getMeta('missionImage') : getMeta('missionImage') ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${getMeta('missionImage')}` : 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80'})`
        }}
      >
        <div className="mission-fullwidth-overlay"></div>
        <div className="mission-fullwidth-content">
          <div className="mission-icon">🚀</div>
          <h2>Our Mission</h2>
          <p>{displayML(getMeta('mission', 'Our mission is to simplify the real estate journey through end-to-end services, delivering measurable value powered by market insights and modern tools.'))}</p>
        </div>
      </section>

      {/* CEO Section - Diagonal Design */}
      <section className="ceo-section">
        <div className="ceo-diagonal-container">
          {/* Left Panel - Title */}
          <div className="ceo-left-panel">
            <div className="ceo-left-content">
              <h2 className="ceo-section-title">
                {displayML(getMeta('ceo.sectionTitle', 'The Vision Behind')) || 'The Vision Behind'}
              </h2>
              <h3 className="ceo-company-name">N&H Homes<br />Real Estate</h3>
            </div>
          </div>

          {/* Center - CEO Image */}
          <div className="ceo-center-panel">
            <div className="ceo-image-wrapper">
              {getMeta('ceo.photo') ? (
                <img
                  src={getMeta('ceo.photo').startsWith('http') ? getMeta('ceo.photo') : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${getMeta('ceo.photo')}`}
                  alt={displayML(getMeta('ceo.name', 'CEO'))}
                  className="ceo-photo"
                />
              ) : (
                <div className="ceo-photo-placeholder">
                  <span>CEO Photo</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Quote and Name */}
          <div className="ceo-right-panel">
            <div className="ceo-right-content">
              <p className="ceo-quote">
                {displayML(getMeta('ceo.message', 'Behind every success, there is a team of thinkers, creators, and strategists who share one belief: excellence is crafted, not claimed.'))}
              </p>
              <div className="ceo-signature">
                <h4 className="ceo-name">{displayML(getMeta('ceo.name', 'Nesrine Gharbi'))}</h4>
                <p className="ceo-title">{displayML(getMeta('ceo.title', 'Chairman of Board of Directors'))}</p>
              </div>
            </div>
          </div>

          {/* Diagonal Overlays */}
          <div className="ceo-diagonal-left"></div>
          <div className="ceo-diagonal-right"></div>
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
            {Array.isArray(aboutSection?.metadata?.worldwideNetwork) && aboutSection?.metadata?.worldwideNetwork.map((item: any, idx: number) => (
              <div className="network-card service-card" key={idx}>
                <h3>{displayML(item.label) || 'Country'}</h3>
                <p>{displayML(item.value) || ''}</p>
              </div>
            ))}
            
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
            {Array.isArray(aboutSection?.metadata?.whyChoose) && aboutSection?.metadata?.whyChoose.map((item: any, idx: number) => (
              <div className="value-card" key={idx}>
                <div className="value-icon">🌍</div>
                <h3>{displayML(item.title) || 'Title'}</h3>
                <p>{displayML(item.description) || ''}</p>
              </div>
            ))}
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
