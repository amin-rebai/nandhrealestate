import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface MultilingualText {
  en: string;
  ar: string;
  fr?: string;
}

interface ProcessSectionData {
  title: MultilingualText;
  subtitle: MultilingualText;
  backgroundImage: string;
}

const Services: React.FC = () => {
  const { i18n } = useTranslation();
  const [processSectionData, setProcessSectionData] = useState<ProcessSectionData | null>(null);

  useEffect(() => {
    const fetchProcessSection = async () => {
      try {
        const response = await axios.get(`${API_URL}/content/section/process-section`);
        const data = response.data?.data || response.data;
        if (data && data.length > 0) {
          const item = data[0];
          setProcessSectionData({
            title: item.title || { en: 'Our Process', ar: 'عمليتنا', fr: 'Notre processus' },
            subtitle: item.description || { en: 'A systematic approach to delivering exceptional results', ar: '', fr: '' },
            backgroundImage: item.image || item.backgroundImage || ''
          });
        }
      } catch (error) {
        console.error('Error fetching process section:', error);
      }
    };
    fetchProcessSection();
  }, []);

  // Get text based on current language
  const getText = (text: MultilingualText | string | undefined): string => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    const lang = i18n.language as 'en' | 'ar' | 'fr';
    return text[lang] || text.en || text.ar || text.fr || '';
  };
  return (
    <div className="services-page">
      {/* Enhanced Hero Section */}
      {/* <section className="about-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Our Services"
            className="hero-bg-image"
          />
        </div>
        <div className="hero-content">
          <div className="container">
            <h1 className="hero-title">Services Overview</h1>
            <p className="hero-subtitle">Your Complete Real Estate Partner</p>
            <p className="hero-description">
              Discover our comprehensive range of services, proven processes, and strategic partnerships
              that make us the preferred choice for real estate excellence.
            </p>
          </div>
        </div>
      </section> */}

      {/* Service Categories Navigation */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2>{getText({
              en: 'Explore Our Expertise',
              ar: 'استكشف خبرتنا',
              fr: 'Explorez notre expertise'
            })}</h2>
            <p>{getText({
              en: 'Navigate through our comprehensive service offerings',
              ar: 'تصفح عروضنا الخدمية الشاملة',
              fr: 'Parcourez nos offres de services complètes'
            })}</p>
          </div>

          <div className="service-navigation-grid">
            <Link to="/our-services" className="service-nav-card visual-enhanced">
              <div className="service-image">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Our Services"
                  className="service-img"
                />
                <div className="service-icon">🏢</div>
              </div>
              <div className="service-content">
                <h3>{getText({
                  en: 'Our Services',
                  ar: 'خدماتنا',
                  fr: 'Nos services'
                })}</h3>
                <p className="service-description">
                  <strong>{getText({
                    en: 'Complete Real Estate Solutions',
                    ar: 'حلول عقارية شاملة',
                    fr: 'Solutions immobilières complètes'
                  })}</strong>
                </p>
                <p className="service-summary">
                  {getText({
                    en: 'Discover our comprehensive range of services including sales & leasing, property management, marketing, and investment advisory.',
                    ar: 'اكتشف مجموعتنا الشاملة من الخدمات بما في ذلك البيع والإيجار وإدارة الممتلكات والتسويق والاستشارات الاستثمارية.',
                    fr: 'Découvrez notre gamme complète de services incluant la vente et la location, la gestion immobilière, le marketing et les conseils en investissement.'
                  })}
                </p>
                <div className="service-cta">
                  <span>{getText({
                    en: 'Explore Services →',
                    ar: 'استكشف الخدمات →',
                    fr: 'Explorer les services →'
                  })}</span>
                </div>
              </div>
            </Link>

            <Link to="/our-process" className="service-nav-card visual-enhanced">
              <div className="service-image">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Our Process"
                  className="service-img"
                />
                <div className="service-icon">⚡</div>
              </div>
              <div className="service-content">
                <h3>{getText({
                  en: 'Our Process',
                  ar: 'عمليتنا',
                  fr: 'Notre processus'
                })}</h3>
                <p className="service-description">
                  <strong>{getText({
                    en: 'Streamlined Excellence in Every Step',
                    ar: 'التميز المبسط في كل خطوة',
                    fr: 'Excellence rationalisée à chaque étape'
                  })}</strong>
                </p>
                <p className="service-summary">
                  {getText({
                    en: 'Learn about our proven methodology that ensures seamless transactions and exceptional results through every phase of your real estate journey.',
                    ar: 'تعرف على منهجيتنا المثبتة التي تضمن معاملات سلسة ونتائج استثنائية في كل مرحلة من رحلتك العقارية.',
                    fr: 'Découvrez notre méthodologie éprouvée qui garantit des transactions fluides et des résultats exceptionnels à chaque étape de votre parcours immobilier.'
                  })}
                </p>
                <div className="service-cta">
                  <span>{getText({
                    en: 'Discover Process →',
                    ar: 'اكتشف العملية →',
                    fr: 'Découvrir le processus →'
                  })}</span>
                </div>
              </div>
            </Link>

            <Link to="/our-partners" className="service-nav-card visual-enhanced">
              <div className="service-image">
                <img
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Our Partners"
                  className="service-img"
                />
                <div className="service-icon">🤝</div>
              </div>
              <div className="service-content">
                <h3>{getText({
                  en: 'Our Partners',
                  ar: 'شركاؤنا',
                  fr: 'Nos partenaires'
                })}</h3>
                <p className="service-description">
                  <strong>{getText({
                    en: 'Strategic Alliances for Success',
                    ar: 'تحالفات استراتيجية للنجاح',
                    fr: 'Alliances stratégiques pour le succès'
                  })}</strong>
                </p>
                <p className="service-summary">
                  {getText({
                    en: 'Explore our network of strategic partners including financial institutions, technology providers, and industry leaders across global markets.',
                    ar: 'استكشف شبكتنا من الشركاء الاستراتيجيين بما في ذلك المؤسسات المالية وموفري التكنولوجيا وقادة الصناعة في الأسواق العالمية.',
                    fr: 'Explorez notre réseau de partenaires stratégiques incluant les institutions financières, les fournisseurs de technologie et les leaders de l\'industrie sur les marchés mondiaux.'
                  })}
                </p>
                <div className="service-cta">
                  <span>{getText({
                    en: 'Meet Partners →',
                    ar: 'التقابل مع الشركاء →',
                    fr: 'Rencontrer les partenaires →'
                  })}</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Our Approach */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <h2 style={{ color: 'white' }}>{getText({
              en: 'Why Choose Our Approach',
              ar: 'لماذا تختار نهجنا',
              fr: 'Pourquoi choisir notre approche'
            })}</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>
              {getText({
                en: 'Our integrated approach delivers exceptional results through expertise, innovation, and partnerships',
                ar: 'يوفر نهجنا المتكامل نتائج استثنائية من خلال الخبرة والابتكار والشراكات',
                fr: 'Notre approche intégrée offre des résultats exceptionnels grâce à l\'expertise, l\'innovation et les partenariats'
              })}
            </p>
          </div>
          <div className="approach-benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🎯</div>
              <h3>{getText({
                en: 'Comprehensive Solutions',
                ar: 'حلول شاملة',
                fr: 'Solutions complètes'
              })}</h3>
              <p>{getText({
                en: 'End-to-end services covering every aspect of real estate',
                ar: 'خدمات شاملة تغطي كل جوانب العقارات',
                fr: 'Services complets couvrant tous les aspects de l\'immobilier'
              })}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h3>{getText({
                en: 'Proven Process',
                ar: 'عملية مثبتة',
                fr: 'Processus éprouvé'
              })}</h3>
              <p>{getText({
                en: 'Streamlined methodology ensuring consistent excellence',
                ar: 'منهجية مبسطة تضمن التميز المستمر',
                fr: 'Méthodologie rationalisée garantissant l\'excellence constante'
              })}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🤝</div>
              <h3>{getText({
                en: 'Strategic Partnerships',
                ar: 'شراكات استراتيجية',
                fr: 'Partenariats stratégiques'
              })}</h3>
              <p>{getText({
                en: 'Global network of trusted industry leaders',
                ar: 'شبكة عالمية من قادة الصناعة الموثوقين',
                fr: 'Réseau mondial de leaders de l\'industrie de confiance'
              })}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🌍</div>
              <h3>{getText({
                en: 'International Reach',
                ar: 'نطاق دولي',
                fr: 'Portée internationale'
              })}</h3>
              <p>{getText({
                en: 'Expertise across multiple markets and regions',
                ar: 'خبرة في أسواق ومناطق متعددة',
                fr: 'Expertise sur plusieurs marchés et régions'
              })}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section section-light">
        <div className="container">
          <div className="cta-content" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{getText({
              en: 'Ready to Get Started?',
              ar: 'هل أنت مستعد للبدء؟',
              fr: 'Prêt à commencer?'
            })}</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--gray)' }}>
              {getText({
                en: 'Explore our detailed service offerings, learn about our proven process, or discover our strategic partnerships.',
                ar: 'استكشف عروضنا الخدمية المفصلة، تعرف على عمليتنا المثبتة، أو اكتشف شراكاتنا الاستراتيجية.',
                fr: 'Explorez nos offres de services détaillées, découvrez notre processus éprouvé ou explorez nos partenariats stratégiques.'
              })}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/our-services" className="btn-primary-enhanced">
                {getText({
                  en: 'Explore All Services',
                  ar: 'استكشف جميع الخدمات',
                  fr: 'Explorer tous les services'
                })}
              </Link>
              <Link to="/contact" className="btn-secondary-enhanced">
                {getText({
                  en: 'Contact Our Team',
                  ar: 'اتصل بفريقنا',
                  fr: 'Contactez notre équipe'
                })}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section with Background Image */}
      <section
        className="process-section-bg"
        style={{
          backgroundImage: processSectionData?.backgroundImage
            ? `linear-gradient(rgba(75, 14, 20, 0.85), rgba(75, 14, 20, 0.9)), url(${processSectionData.backgroundImage.startsWith('http') ? processSectionData.backgroundImage : `${API_URL}${processSectionData.backgroundImage}`})`
            : 'linear-gradient(rgba(75, 14, 20, 0.95), rgba(75, 14, 20, 0.95))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          padding: '6rem 0',
          color: 'white'
        }}
      >
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ color: 'var(--matte-gold)', fontSize: '2.5rem', marginBottom: '1rem' }}>
              {processSectionData ? getText(processSectionData.title) : 'Our Process'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem' }}>
              {processSectionData ? getText(processSectionData.subtitle) : 'A systematic approach to delivering exceptional results'}
            </p>
          </div>
          <div className="process-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            <div className="process-step" style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--matte-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: 'var(--luxury-burgundy)', fontWeight: 'bold' }}>1</div>
              <h3 style={{ color: 'var(--matte-gold)', marginBottom: '1rem' }}>Consultation & Discovery</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Understanding client goals, requirements, and investment objectives</p>
            </div>
            <div className="process-step" style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--matte-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: 'var(--luxury-burgundy)', fontWeight: 'bold' }}>2</div>
              <h3 style={{ color: 'var(--matte-gold)', marginBottom: '1rem' }}>Market Research & Feasibility</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Conducting in-depth analysis of opportunities and market conditions</p>
            </div>
            <div className="process-step" style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--matte-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: 'var(--luxury-burgundy)', fontWeight: 'bold' }}>3</div>
              <h3 style={{ color: 'var(--matte-gold)', marginBottom: '1rem' }}>Strategy Development</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Designing tailored solutions and implementation roadmaps</p>
            </div>
            <div className="process-step" style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--matte-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: 'var(--luxury-burgundy)', fontWeight: 'bold' }}>4</div>
              <h3 style={{ color: 'var(--matte-gold)', marginBottom: '1rem' }}>Execution & Delivery</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Managing the transaction or project with precision and care</p>
            </div>
            <div className="process-step" style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--matte-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: 'var(--luxury-burgundy)', fontWeight: 'bold' }}>5</div>
              <h3 style={{ color: 'var(--matte-gold)', marginBottom: '1rem' }}>Reporting & Transparency</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Keeping clients informed at every step with detailed updates</p>
            </div>
            <div className="process-step" style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--matte-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: 'var(--luxury-burgundy)', fontWeight: 'bold' }}>6</div>
              <h3 style={{ color: 'var(--matte-gold)', marginBottom: '1rem' }}>Continuous Support</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Ensuring long-term satisfaction and ongoing value creation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnerships */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2>{getText({
              en: 'Our Partnerships',
              ar: 'شراكاتنا',
              fr: 'Nos partenariats'
            })}</h2>
            <p>{getText({
              en: 'Strategic alliances that enhance our service delivery',
              ar: 'تحالفات استراتيجية تعزز تقديم خدماتنا',
              fr: 'Alliances stratégiques qui améliorent notre prestation de services'
            })}</p>
          </div>
          <div className="partnerships-grid services-grid">
            <div className="service-card">
              <h3>{getText({
                en: '🏗️ Leading Developers',
                ar: '🏗️ المطورون الرائدون',
                fr: '🏗️ Développeurs leaders'
              })}</h3>
              <p>
                {getText({
                  en: 'Strong alliances with leading developers in the GCC, MENA, and Europe, providing access to premium projects and exclusive opportunities.',
                  ar: 'تحالفات قوية مع المطورين الرائدين في دول مجلس التعاون الخليجي والشرق الأوسط وشمال أفريقيا وأوروبا، مما يوفر الوصول إلى مشاريع فاخرة وفرص حصرية.',
                  fr: 'Alliances solides avec les développeurs leaders du CCG, du MENA et de l\'Europe, offrant un accès à des projets premium et à des opportunités exclusives.'
                })}
              </p>
            </div>
            <div className="service-card">
              <h3>{getText({
                en: '🏦 Financial Institutions',
                ar: '🏦 المؤسسات المالية',
                fr: '🏦 Institutions financières'
              })}</h3>
              <p>
                {getText({
                  en: 'Partnerships with banks and financial institutions to provide comprehensive mortgage and investment solutions for our clients.',
                  ar: 'شراكات مع البنوك والمؤسسات المالية لتقديم حلول الرهن العقاري والاستثمار الشاملة لعملائنا.',
                  fr: 'Partenariats avec les banques et les institutions financières pour fournir des solutions hypothécaires et d\'investissement complètes à nos clients.'
                })}
              </p>
            </div>
            <div className="service-card">
              <h3>{getText({
                en: '🎨 Design & Management',
                ar: '🎨 التصميم والإدارة',
                fr: '🎨 Design et gestion'
              })}</h3>
              <p>
                {getText({
                  en: 'Collaboration with interior design and facility management providers to enhance property value and client satisfaction.',
                  ar: 'التعاون مع موفري التصميم الداخلي وإدارة المرافق لتعزيز قيمة الممتلكات ورضا العملاء.',
                  fr: 'Collaboration avec les fournisseurs de design d\'intérieur et de gestion des installations pour améliorer la valeur des propriétés et la satisfaction des clients.'
                })}
              </p>
            </div>
            <div className="service-card">
              <h3>{getText({
                en: '⚖️ Legal Consultants',
                ar: '⚖️ الاستشاريون القانونيون',
                fr: '⚖️ Consultants juridiques'
              })}</h3>
              <p>
                {getText({
                  en: 'Working with experienced legal consultants to ensure compliance and smooth transactions in every market we operate.',
                  ar: 'العمل مع استشاريين قانونيين ذوي خبرة لضمان الامتثال والمعاملات السلسة في كل سوق نعمل فيه.',
                  fr: 'Travailler avec des consultants juridiques expérimentés pour assurer la conformité et des transactions fluides sur tous les marchés où nous opérons.'
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <h2>{getText({
              en: 'Ready to Get Started?',
              ar: 'هل أنت مستعد للبدء؟',
              fr: 'Prêt à commencer?'
            })}</h2>
            <p>{getText({
              en: 'Let us help you achieve your real estate goals with our comprehensive services',
              ar: 'دعنا نساعدك في تحقيق أهدافك العقارية من خلال خدماتنا الشاملة',
              fr: 'Laissez-nous vous aider à atteindre vos objectifs immobiliers avec nos services complets'
            })}</p>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <div className="cta-buttons">
              <a href="/contact" className="btn btn-primary">
                {getText({
                  en: 'Schedule Consultation',
                  ar: 'جدول استشارة',
                  fr: 'Planifier une consultation'
                })}
              </a>
              <a href="/properties" className="btn btn-secondary">
                {getText({
                  en: 'View Properties',
                  ar: 'عرض الممتلكات',
                  fr: 'Afficher les propriétés'
                })}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
