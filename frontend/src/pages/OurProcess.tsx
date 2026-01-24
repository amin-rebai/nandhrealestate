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

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
        const response = await axios.get(`${API_URL}/content/section/goals?active=true`);
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
              <h1>{getText({
                en: 'OUR PROCESS',
                ar: 'عمليتنا',
                fr: 'NOTRE PROCESSUS'
              })}</h1>
              <p className="gold-subtitle">{getText({
                en: 'HOW WE GUIDE YOU SMARTLY THROUGH EVERY STEP',
                ar: 'كيف نرشدك بذكاء من خلال كل خطوة',
                fr: 'COMMENT NOUS VOUS GUIDONS INTELLIGEMMENT À CHAQUE ÉTAPE'
              })}</p>
            </div>
            <div style={{ flex: '0 1 300px', textAlign: 'right' }}>
              <p className="lead">
                {getText({
                  en: 'We use a hands-on, professional approach to deliver exceptional results — every step is designed to protect your investment and support your goals.',
                  ar: 'نستخدم نهجاً عملياً واحترافياً لتحقيق نتائج استثنائية — كل خطوة مصممة لحماية استثمارك ودعم أهدافك.',
                  fr: 'Nous utilisons une approche pratique et professionnelle pour obtenir des résultats exceptionnels — chaque étape est conçue pour protéger votre investissement et soutenir vos objectifs.'
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps Section */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2>{getText({
              en: 'How We Work',
              ar: 'كيف نعمل',
              fr: 'Comment nous travaillons'
            })}</h2>
            <p>{getText({
              en: 'Our systematic approach ensures transparency, efficiency, and success in every project',
              ar: 'يضمن نهجنا المنهجي الشفافية والكفاءة والنجاح في كل مشروع',
              fr: 'Notre approche systématique garantit la transparence, l\'efficacité et le succès dans chaque projet'
            })}</p>
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
            <h2 style={{ color: 'white' }}>{getText({
              en: 'Why Our Process Works',
              ar: 'لماذا تعمل عمليتنا',
              fr: 'Pourquoi notre processus fonctionne'
            })}</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>
              {getText({
                en: 'Our methodology is built on years of experience and proven results',
                ar: 'تم بناء منهجيتنا على سنوات من الخبرة والنتائج المثبتة',
                fr: 'Notre méthodologie est basée sur des années d\'expérience et des résultats éprouvés'
              })}
            </p>
          </div>

          <div className="process-benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🎯</div>
              <h3>{getText({
                en: 'Precision & Accuracy',
                ar: 'الدقة والصحة',
                fr: 'Précision & Exactitude'
              })}</h3>
              <p>{getText({
                en: 'Every step is carefully planned and executed with attention to detail',
                ar: 'يتم التخطيط لكل خطوة بعناية وتنفيذها مع الاهتمام بالتفاصيل',
                fr: 'Chaque étape est soigneusement planifiée et exécutée avec attention aux détails'
              })}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⏱️</div>
              <h3>{getText({
                en: 'Time Efficiency',
                ar: 'كفاءة الوقت',
                fr: 'Efficacité temporelle'
              })}</h3>
              <p>{getText({
                en: 'Streamlined processes that save time while maintaining quality',
                ar: 'عمليات مبسطة توفر الوقت مع الحفاظ على الجودة',
                fr: 'Des processus rationalisés qui économisent du temps tout en maintenant la qualité'
              })}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🔒</div>
              <h3>{getText({
                en: 'Risk Mitigation',
                ar: 'تخفيف المخاطر',
                fr: 'Atténuation des risques'
              })}</h3>
              <p>{getText({
                en: 'Comprehensive risk assessment and management at every stage',
                ar: 'تقييم شامل للمخاطر وإدارتها في كل مرحلة',
                fr: 'Évaluation et gestion complètes des risques à chaque étape'
              })}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📈</div>
              <h3>{getText({
                en: 'Proven Results',
                ar: 'نتائج مثبتة',
                fr: 'Résultats éprouvés'
              })}</h3>
              <p>{getText({
                en: 'Track record of successful transactions and satisfied clients',
                ar: 'سجل حافل بالمعاملات الناجحة والعملاء الراضين',
                fr: 'Antécédents de transactions réussies et de clients satisfaits'
              })}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section section-light">
        <div className="container">
          <div className="cta-content" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{getText({
              en: 'Experience Our Process',
              ar: 'اختبر عمليتنا',
              fr: 'Découvrez notre processus'
            })}</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--gray)' }}>
              {getText({
                en: 'Ready to see how our proven process can work for you? Let\'s start your real estate journey today.',
                ar: 'هل أنت مستعد لرؤية كيف يمكن لعمليتنا المثبتة أن تعمل من أجلك؟ دعنا نبدأ رحلتك العقارية اليوم.',
                fr: 'Prêt à voir comment notre processus éprouvé peut fonctionner pour vous? Commençons votre parcours immobilier aujourd\'hui.'
              })}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn-primary-enhanced">
                {getText({
                  en: 'Start Your Journey',
                  ar: 'ابدأ رحلتك',
                  fr: 'Commencez votre parcours'
                })}
              </Link>
              <Link to="/our-partners" className="btn-secondary-enhanced">
                {getText({
                  en: 'Meet Our Partners',
                  ar: 'تعرف على شركائنا',
                  fr: 'Rencontrez nos partenaires'
                })}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurProcess;
