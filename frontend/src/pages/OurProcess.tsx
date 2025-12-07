import React, { useState, useEffect } from 'react';
import './OurProcess.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface ProcessStep {
  _id: string;
  title: string | { en: string; ar: string; fr?: string };
  description: string | { en: string; ar: string; fr?: string };
  image?: string;
  order?: number;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const OurProcess: React.FC = () => {
  const { i18n } = useTranslation();
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get text from multilingual field
  const getText = (value: string | { en: string; ar: string; fr?: string } | undefined): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    const lang = i18n.language === 'ar' ? 'ar' : i18n.language === 'fr' ? 'fr' : 'en';
    return (value as any)[lang] || value.en || (value as any).fr || '';
  };

  // Helper function to get image URL
  const getImageUrl = (image: string | undefined): string => {
    if (!image) return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    if (image.startsWith('http')) return image;
    return `${API_URL}${image}`;
  };

  // (removed unused step-icon helper — layout uses images/cards)

  

  useEffect(() => {
    const fetchProcessSteps = async () => {
      // Default process steps used as a fallback when API returns no data
      const defaultSteps: ProcessStep[] = [
        {
          _id: '1',
          title: { en: 'Initial Consultation', ar: 'الاستشارة الأولية', fr: 'Consultation initiale' },
          description: { en: 'We begin with a comprehensive consultation to understand your specific needs, goals, and preferences.', ar: 'نبدأ باستشارة شاملة لفهم احتياجاتك وأهدافك وتفضيلاتك المحددة.', fr: "Nous commençons par une consultation approfondie pour comprendre vos besoins, objectifs et préférences." },
          image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          order: 1
        },
        {
          _id: '2',
          title: { en: 'Strategy Development', ar: 'تطوير الاستراتيجية', fr: 'Stratégie et planification' },
          description: { en: 'Based on your consultation, we develop a customized strategy that aligns with your objectives.', ar: 'بناءً على استشارتك، نطور استراتيجية مخصصة تتماشى مع أهدافك.', fr: "Sur la base de la consultation, nous élaborons une stratégie personnalisée adaptée à vos objectifs." },
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          order: 2
        },
        {
          _id: '3',
          title: { en: 'Implementation & Execution', ar: 'التنفيذ والتطبيق', fr: 'Mise en œuvre & Exécution' },
          description: { en: 'Our experienced team executes the strategy with precision and attention to detail.', ar: 'ينفذ فريقنا ذو الخبرة الاستراتيجية بدقة واهتمام بالتفاصيل.', fr: "Notre équipe expérimentée exécute la stratégie avec précision et souci du détail." },
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          order: 3
        },
        {
          _id: '4',
          title: { en: 'Monitoring & Ongoing Support', ar: 'المراقبة والدعم المستمر', fr: 'Suivi & Support continu' },
          description: { en: 'We provide continuous monitoring and support throughout the process and beyond.', ar: 'نقدم المراقبة والدعم المستمر طوال العملية وما بعدها.', fr: "Nous assurons un suivi continu et un support tout au long du processus et au-delà." },
          image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          order: 4
        }
      ];
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/content/section/goals?active=true`);
        if (response.data && response.data.length > 0) {
          setProcessSteps(response.data.sort((a: ProcessStep, b: ProcessStep) => (a.order || 0) - (b.order || 0)));
        } else {
          // fall back to a 3-step set that includes French strings for defaults
          const fallback: ProcessStep[] = [
            {
              _id: '1',
              title: { en: 'Initial Consultation', ar: 'الاستشارة الأولية', fr: 'Consultation initiale' },
              description: { en: "We begin with a comprehensive consultation to understand your specific needs, goals, and preferences.", ar: 'نبدأ باستشارة شاملة لفهم احتياجاتك وأهدافك وتفضيلاتك المحددة.', fr: "Nous commençons par une consultation approfondie pour comprendre vos besoins, objectifs et préférences." },
              image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              order: 1
            },
            {
              _id: '2',
              title: { en: 'Strategy & Planning', ar: 'تطوير الاستراتيجية', fr: 'Stratégie & planification' },
              description: { en: 'Based on your consultation, we develop a customized strategy that aligns with your objectives.', ar: 'بناءً على استشارتك، نطور استراتيجية مخصصة تتماشى مع أهدافك.', fr: "Sur la base de la consultation, nous élaborons une stratégie personnalisée adaptée à vos objectifs." },
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              order: 2
            },
            {
              _id: '3',
              title: { en: 'Handover & Support', ar: 'التسليم والدعم', fr: 'Remise & Support' },
              description: { en: 'From first contact through to handover, we provide guidance, data-driven recommendations and professional support.', ar: 'من الاتصال الأول وحتى التسليم، نقدم التوجيه والتوصيات القائمة على البيانات والدعم المهني.', fr: "De la première prise de contact à la remise, nous fournissons des conseils, des recommandations basées sur les données et un accompagnement professionnel." },
              image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              order: 3
            }
          ];
          setProcessSteps(fallback);
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
      {/* New hero matching the provided design */}
      <section className="our-process-hero">
        <div className="container">
          <div className="heading-row">
            <div style={{ flex: '0 1 560px' }}>
              <h1>OUR PROCESS</h1>
              <p className="gold-subtitle">HOW WE GUIDE YOU SMARTLY THROUGH EVERY STEP</p>
            </div>
            <div style={{ flex: '0 1 300px', textAlign: 'right' }}>
              <p className="lead">
                We use a hands-on, professional approach to deliver exceptional results — every step is designed to protect your investment and support your goals.
              </p>
            </div>
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
            <div className="process-cards">
              {processSteps.slice(0, 3).map((step, index) => (
                <article key={step._id} className="process-card">
                  <div className="card-media">
                    <img src={getImageUrl(step.image)} alt={getText(step.title)} />
                  </div>
                  <div className="card-body">
                    <h3>{getText(step.title)}</h3>
                    <p>{getText(step.description)}</p>
                  </div>
                </article>
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
