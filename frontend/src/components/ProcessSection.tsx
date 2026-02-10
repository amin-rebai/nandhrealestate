import React, { useState, useEffect } from 'react';
import './ProcessSection.css';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface ProcessItem {
  _id: string;
  title: string | { en: string; ar: string; fr?: string };
  description?: string | { en: string; ar: string; fr?: string };
  image?: string;
  isActive: boolean;
  order?: number;
}

const ProcessSection: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [processSteps, setProcessSteps] = useState<ProcessItem[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProcess = async () => {
      try {
        const response = await axios.get(`${API_URL}/content/section/goals?active=true`);
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
  }, []);

  const getText = (value: string | { en: string; ar: string } | undefined): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    const lang = i18n.language === 'ar' ? 'ar' : i18n.language === 'fr' ? 'fr' : 'en';
    return (value as any)[lang] || value.en || (value as any).fr || '';
  };

  const getImageUrl = (image: string | undefined): string => {
    if (!image) return '';
    return image.startsWith('http') ? image : `${API_URL}${image}`;
  };

  // Default process steps if none are loaded
  const defaultSteps = [
    {
      _id: '1',
      title: { en: 'Initial Consultation', ar: 'الاستشارة الأولية', fr: 'Consultation initiale' },
      description: { en: 'We begin with a comprehensive consultation to understand your specific needs, goals, and preferences.', ar: 'نبدأ باستشارة شاملة لفهم احتياجاتك وأهدافك وتفضيلاتك المحددة.', fr: "Nous commençons par une consultation approfondie pour comprendre vos besoins, objectifs et préférences." },
      image: '',
      isActive: true,
      order: 1
    },
    {
      _id: '2',
      title: { en: 'Market Analysis', ar: 'تحليل السوق', fr: 'Analyse du marché' },
      description: { en: 'Our experts conduct thorough market research and analysis to identify the best opportunities.', ar: 'يقوم خبراؤنا بإجراء بحث وتحليل شامل للسوق لتحديد أفضل الفرص.', fr: "Nos experts effectuent des recherches et une analyse approfondies pour identifier les meilleures opportunités." },
      image: '',
      isActive: true,
      order: 2
    },
    {
      _id: '3',
      title: { en: 'Implementation', ar: 'التنفيذ', fr: 'Mise en œuvre' },
      description: { en: 'We execute the strategy with precision and attention to detail, keeping you informed at every step.', ar: 'ننفذ الاستراتيجية بدقة واهتمام بالتفاصيل، ونبقيك على اطلاع في كل خطوة.', fr: "Nous exécutons la stratégie avec précision et souci du détail, en vous tenant informé à chaque étape." },
      image: '',
      isActive: true,
      order: 3
    },
    {
      _id: '4',
      title: { en: 'Follow-up & Support', ar: 'المتابعة والدعم', fr: 'Suivi & Support' },
      description: { en: 'Our commitment continues beyond the transaction with ongoing support and service.', ar: 'يستمر التزامنا بعد المعاملة مع الدعم والخدمة المستمرة.', fr: "Notre engagement continue au-delà de la transaction avec un support et des services continus." },
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
          <div className="section-badge">{t('home.ourProcess')}</div>
          <h2 className="section-title-modern">{t('home.howWeWork')}</h2>
          <p className="section-subtitle-modern">
            {t('home.streamlinedApproach')}
          </p>
        </div>

        <div className="process-timeline" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginTop: '3rem'
        }}>
          {displaySteps.map((step, index) => (
            <div key={step._id} className="process-step-card">
              {/* <div className="step-number">{String(index + 1).padStart(2, '0')}</div> */}
              
              {step.image && (
                <div>
                  <img src={getImageUrl(step.image)} alt={getText(step.title)} />
                </div>
              )}
              
              <div className="step-icon">{getStepIcon(index)}</div>
              
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
              backgroundColor: '#B89C4C',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '1.1rem',
              fontWeight: 600,
              transition: 'all 0.3s ease'
            }}
          >
            {t('home.learnMoreProcess')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;

