import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface ProcessItem {
  _id: string;
  title: string | { en: string; ar: string };
  description?: string | { en: string; ar: string };
  image?: string;
  isActive: boolean;
  order?: number;
}

const ProcessSection: React.FC = () => {
  const { i18n } = useTranslation();
  const [processSteps, setProcessSteps] = useState<ProcessItem[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProcess = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/content/section/goals?active=true`);
        if (response.data && response.data.data) {
          setProcessSteps(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching process steps:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProcess();
  }, [API_URL]);

  const getText = (value: string | { en: string; ar: string } | undefined): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[i18n.language as 'en' | 'ar'] || value.en || '';
  };

  const getImageUrl = (image: string | undefined): string => {
    if (!image) return '';
    return image.startsWith('http') ? image : `${API_URL}${image}`;
  };

  // Default process steps if none are loaded
  const defaultSteps = [
    {
      _id: '1',
      title: { en: 'Initial Consultation', ar: 'الاستشارة الأولية' },
      description: { en: 'We begin with a comprehensive consultation to understand your specific needs, goals, and preferences.', ar: 'نبدأ باستشارة شاملة لفهم احتياجاتك وأهدافك وتفضيلاتك المحددة.' },
      image: '',
      isActive: true,
      order: 1
    },
    {
      _id: '2',
      title: { en: 'Market Analysis', ar: 'تحليل السوق' },
      description: { en: 'Our experts conduct thorough market research and analysis to identify the best opportunities.', ar: 'يقوم خبراؤنا بإجراء بحث وتحليل شامل للسوق لتحديد أفضل الفرص.' },
      image: '',
      isActive: true,
      order: 2
    },
    {
      _id: '3',
      title: { en: 'Implementation', ar: 'التنفيذ' },
      description: { en: 'We execute the strategy with precision and attention to detail, keeping you informed at every step.', ar: 'ننفذ الاستراتيجية بدقة واهتمام بالتفاصيل، ونبقيك على اطلاع في كل خطوة.' },
      image: '',
      isActive: true,
      order: 3
    },
    {
      _id: '4',
      title: { en: 'Follow-up & Support', ar: 'المتابعة والدعم' },
      description: { en: 'Our commitment continues beyond the transaction with ongoing support and service.', ar: 'يستمر التزامنا بعد المعاملة مع الدعم والخدمة المستمرة.' },
      image: '',
      isActive: true,
      order: 4
    }
  ];

  const displaySteps = processSteps.length > 0 ? processSteps : defaultSteps;

  if (loading) {
    return null;
  }

  // Don't show section if no steps
  if (displaySteps.length === 0) {
    return null;
  }

  // Process step icons
  const getStepIcon = (index: number) => {
    const icons = ['🤝', '📊', '⚡', '🎯', '✅', '🚀'];
    return icons[index % icons.length];
  };

  return (
    <section className="process-section" style={{
      padding: '5rem 0',
      backgroundColor: '#f8f9fa'
    }}>
      <div className="container">
        <div className="section-header-modern">
          <div className="section-badge">Our Process</div>
          <h2 className="section-title-modern">How We Work</h2>
          <p className="section-subtitle-modern">
            A streamlined approach to delivering exceptional results
          </p>
        </div>

        <div className="process-timeline" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginTop: '3rem'
        }}>
          {displaySteps.map((step, index) => (
            <div 
              key={step._id} 
              className="process-step-card"
              style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                fontSize: '3rem',
                opacity: 0.1,
                fontWeight: 'bold',
                color: '#C1A88A'
              }}>
                {String(index + 1).padStart(2, '0')}
              </div>
              
              {step.image && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <img 
                    src={getImageUrl(step.image)} 
                    alt={getText(step.title)}
                    style={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              )}
              
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '1rem'
              }}>
                {getStepIcon(index)}
              </div>
              
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '1rem',
                color: '#2c3e50'
              }}>
                {getText(step.title)}
              </h3>
              
              <p style={{
                color: '#666',
                lineHeight: '1.6',
                fontSize: '1rem'
              }}>
                {getText(step.description)}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '3rem'
        }}>
          <Link 
            to="/our-process" 
            className="btn-modern-primary"
            style={{
              display: 'inline-block',
              padding: '1rem 2.5rem',
              backgroundColor: '#C1A88A',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '1.1rem',
              fontWeight: 600,
              transition: 'all 0.3s ease'
            }}
          >
            Learn More About Our Process
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;

