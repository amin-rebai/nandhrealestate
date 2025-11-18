import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface ProcessStep {
  _id: string;
  title: string | { en: string; ar: string };
  description: string | { en: string; ar: string };
  image?: string;
  order?: number;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const OurProcess: React.FC = () => {
  const { i18n } = useTranslation();
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get text from multilingual field
  const getText = (value: string | { en: string; ar: string } | undefined): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[i18n.language as 'en' | 'ar'] || value.en || '';
  };

  // Helper function to get image URL
  const getImageUrl = (image: string | undefined): string => {
    if (!image) return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    if (image.startsWith('http')) return image;
    return `${API_URL}${image}`;
  };

  // Helper function to get step icon
  const getStepIcon = (index: number): string => {
    const icons = ['🤝', '📋', '⚡', '📊', '🎯', '✅'];
    return icons[index % icons.length];
  };

  // Default process steps
  const defaultSteps: ProcessStep[] = [
    {
      _id: '1',
      title: { en: 'Initial Consultation', ar: 'الاستشارة الأولية' },
      description: { en: 'We begin with a comprehensive consultation to understand your specific needs, goals, and preferences.', ar: 'نبدأ باستشارة شاملة لفهم احتياجاتك وأهدافك وتفضيلاتك المحددة.' },
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      order: 1
    },
    {
      _id: '2',
      title: { en: 'Strategy Development', ar: 'تطوير الاستراتيجية' },
      description: { en: 'Based on your consultation, we develop a customized strategy that aligns with your objectives.', ar: 'بناءً على استشارتك، نطور استراتيجية مخصصة تتماشى مع أهدافك.' },
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      order: 2
    },
    {
      _id: '3',
      title: { en: 'Implementation & Execution', ar: 'التنفيذ والتطبيق' },
      description: { en: 'Our experienced team executes the strategy with precision and attention to detail.', ar: 'ينفذ فريقنا ذو الخبرة الاستراتيجية بدقة واهتمام بالتفاصيل.' },
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      order: 3
    },
    {
      _id: '4',
      title: { en: 'Monitoring & Ongoing Support', ar: 'المراقبة والدعم المستمر' },
      description: { en: 'We provide continuous monitoring and support throughout the process and beyond.', ar: 'نقدم المراقبة والدعم المستمر طوال العملية وما بعدها.' },
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      order: 4
    }
  ];

  useEffect(() => {
    const fetchProcessSteps = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/content/section/goals?active=true`);
        if (response.data && response.data.length > 0) {
          setProcessSteps(response.data.sort((a: ProcessStep, b: ProcessStep) => (a.order || 0) - (b.order || 0)));
        } else {
          setProcessSteps(defaultSteps);
        }
      } catch (error) {
        console.error('Error fetching process steps:', error);
        setProcessSteps(defaultSteps);
      } finally {
        setLoading(false);
      }
    };

    fetchProcessSteps();
  }, []);

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

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Loading process steps...</p>
            </div>
          ) : (
            <div className="process-timeline">
              {processSteps.map((step, index) => (
                <div className="process-step visual-enhanced" key={step._id}>
                  <div className="step-number">{String(index + 1).padStart(2, '0')}</div>
                  <div className="step-image">
                    <img
                      src={getImageUrl(step.image)}
                      alt={getText(step.title)}
                      className="step-img"
                    />
                    <div className="step-icon">{getStepIcon(index)}</div>
                  </div>
                  <div className="step-content">
                    <h3>{getText(step.title)}</h3>
                    <p className="step-description">
                      {getText(step.description)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
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
