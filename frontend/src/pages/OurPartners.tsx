import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface Partner {
  _id: string;
  title: string | { en: string; ar: string; fr?: string };
  description: string | { en: string; ar: string; fr?: string };
  image?: string;
  order?: number;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const OurPartners: React.FC = () => {
  const { i18n } = useTranslation();
  const [partners, setPartners] = useState<Partner[]>([]);
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
    if (!image) return 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    if (image.startsWith('http')) return image;
    return `${API_URL}${image}`;
  };

  // Helper function to get partner icon
  const getPartnerIcon = (index: number): string => {
    const icons = ['🏦', '💻', '⚖️', '🏗️', '🌍', '📊'];
    return icons[index % icons.length];
  };

  // Default partners (memoized so it stays stable and doesn't trigger effect warnings)
  const defaultPartners: Partner[] = useMemo(() => [
    {
      _id: '1',
        title: { en: 'Financial Partners', ar: 'الشركاء الماليون', fr: 'Partenaires financiers' },
        description: { en: 'Leading banks and financial institutions providing mortgage and financing solutions.', ar: 'البنوك والمؤسسات المالية الرائدة التي تقدم حلول الرهن العقاري والتمويل.', fr: 'Banques et institutions financières de premier plan offrant des solutions hypothécaires et de financement.' },
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      order: 1
    },
    {
      _id: '2',
      title: { en: 'Technology Partners', ar: 'شركاء التكنولوجيا', fr: 'Partenaires technologiques' },
      description: { en: 'Cutting-edge proptech and digital solutions for modern real estate.', ar: 'حلول التكنولوجيا العقارية والرقمية المتطورة للعقارات الحديثة.', fr: 'Solutions proptech et numériques de pointe pour l’immobilier moderne.' },
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      order: 2
    },
    {
      _id: '3',
      title: { en: 'Legal & Advisory Partners', ar: 'الشركاء القانونيون والاستشاريون', fr: 'Partenaires juridiques & de conseil' },
      description: { en: 'Top-tier legal and consulting firms for comprehensive support.', ar: 'شركات قانونية واستشارية من الدرجة الأولى للدعم الشامل.', fr: "Cabinets juridiques et de conseil de premier plan pour un soutien complet." },
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      order: 3
    },
    {
      _id: '4',
      title: { en: 'Construction & Development', ar: 'البناء والتطوير', fr: 'Construction & Développement' },
      description: { en: 'Premier construction and development companies for quality projects.', ar: 'شركات البناء والتطوير الرائدة للمشاريع عالية الجودة.', fr: 'Entreprises de construction et de développement de premier ordre pour des projets de qualité.' },
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      order: 4
    }
  ], []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/content/section/clients?active=true`);
        if (response.data && response.data.length > 0) {
          setPartners(response.data.sort((a: Partner, b: Partner) => (a.order || 0) - (b.order || 0)));
        } else {
          setPartners(defaultPartners);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
        setPartners(defaultPartners);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [defaultPartners]);

  return (
    <div className="our-partners-page">
      {/* Enhanced Hero Section */}
      <section className="about-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <img
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Our Partners"
            className="hero-bg-image"
          />
        </div>
        <div className="hero-content">
          <div className="container">
            <h1 className="hero-title">{getText({
              en: 'Our Partners',
              ar: 'شركاؤنا',
              fr: 'Nos partenaires'
            })}</h1>
            <p className="hero-subtitle">{getText({
              en: 'Building Success Through Strategic Alliances',
              ar: 'بناء النجاح من خلال التحالفات الاستراتيجية',
              fr: 'Construire le succès par des alliances stratégiques'
            })}</p>
            <p className="hero-description">
              {getText({
                en: 'We collaborate with industry leaders, financial institutions, and technology partners to deliver exceptional value and comprehensive solutions.',
                ar: 'نتعاون مع قادة الصناعة والمؤسسات المالية وشركاء التكنولوجيا لتقديم قيمة استثنائية وحلول شاملة.',
                fr: 'Nous collaborons avec les leaders de l\'industrie, les institutions financières et les partenaires technologiques pour offrir une valeur exceptionnelle et des solutions complètes.'
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Partner Categories Section */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2>{getText({
              en: 'Strategic Partnership Network',
              ar: 'شبكة الشراكة الاستراتيجية',
              fr: 'Réseau de partenariat stratégique'
            })}</h2>
            <p>{getText({
              en: 'Our carefully selected partners enable us to provide comprehensive real estate solutions',
              ar: 'يمكّننا شركاؤنا المختارون بعناية من تقديم حلول عقارية شاملة',
              fr: 'Nos partenaires soigneusement sélectionnés nous permettent de fournir des solutions immobilières complètes'
            })}</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Loading partners...</p>
            </div>
          ) : (
            <div className="partners-categories-grid">
              {partners.map((partner, index) => (
                <div className="partner-category visual-enhanced" key={partner._id}>
                  <div className="category-image">
                    <img
                      src={getImageUrl(partner.image)}
                      alt={getText(partner.title)}
                      className="category-img"
                    />
                    <div className="category-icon">{getPartnerIcon(index)}</div>
                  </div>
                  <div className="category-content">
                    <h3>{getText(partner.title)}</h3>
                    <p className="category-description">
                      {getText(partner.description)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Global Network Section */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <h2 style={{ color: 'white' }}>{getText({
              en: 'Global Network',
              ar: 'الشبكة العالمية',
              fr: 'Réseau mondial'
            })}</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>
              {getText({
                en: 'Our international partnerships span across key markets worldwide',
                ar: 'تمتد شراكاتنا الدولية عبر الأسواق الرئيسية في جميع أنحاء العالم',
                fr: 'Nos partenariats internationaux s\'étendent sur les marchés clés du monde entier'
              })}
            </p>
          </div>

          <div className="global-network-grid">
            <div className="network-region">
              <div className="region-flag">🇶🇦</div>
              <h3>{getText({
                en: 'Qatar',
                ar: 'قطر',
                fr: 'Qatar'
              })}</h3>
              <p>{getText({
                en: 'Leading developers, banks, and government entities',
                ar: 'المطورون والبنوك والجهات الحكومية الرائدة',
                fr: 'Promoteurs, banques et entités gouvernementales de premier plan'
              })}</p>
            </div>
            <div className="network-region">
              <div className="region-flag">🇦🇪</div>
              <h3>{getText({
                en: 'UAE',
                ar: 'الإمارات العربية المتحدة',
                fr: 'EAU'
              })}</h3>
              <p>{getText({
                en: 'Dubai and Abu Dhabi\'s premier real estate networks',
                ar: 'شبكات العقارات الرائدة في دبي وأبو ظبي',
                fr: 'Réseaux immobiliers de premier plan de Dubaï et Abu Dhabi'
              })}</p>
            </div>
            <div className="network-region">
              <div className="region-flag">🇸🇦</div>
              <h3>{getText({
                en: 'Saudi Arabia',
                ar: 'المملكة العربية السعودية',
                fr: 'Arabie Saoudite'
              })}</h3>
              <p>{getText({
                en: 'Vision 2030 development partners and investors',
                ar: 'شركاء التطوير والمستثمرون في رؤية 2030',
                fr: 'Partenaires de développement et investisseurs Vision 2030'
              })}</p>
            </div>
            <div className="network-region">
              <div className="region-flag">🇪🇬</div>
              <h3>{getText({
                en: 'Egypt',
                ar: 'مصر',
                fr: 'Égypte'
              })}</h3>
              <p>{getText({
                en: 'New Capital and coastal development specialists',
                ar: 'متخصصو العاصمة الجديدة والتطوير الساحلي',
                fr: 'Spécialistes de la nouvelle capitale et du développement côtier'
              })}</p>
            </div>
            <div className="network-region">
              <div className="region-flag">🇫🇷</div>
              <h3>{getText({
                en: 'France',
                ar: 'فرنسا',
                fr: 'France'
              })}</h3>
              <p>{getText({
                en: 'Luxury property and investment advisors',
                ar: 'مستشارو الممتلكات الفاخرة والاستثمار',
                fr: 'Conseillers en propriété de luxe et investissement'
              })}</p>
            </div>
            <div className="network-region">
              <div className="region-flag">🇲🇦</div>
              <h3>{getText({
                en: 'Morocco',
                ar: 'المغرب',
                fr: 'Maroc'
              })}</h3>
              <p>{getText({
                en: 'Emerging market development partners',
                ar: 'شركاء تطوير الأسواق الناشئة',
                fr: 'Partenaires de développement des marchés émergents'
              })}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Benefits Section */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2>{getText({
              en: 'Partnership Benefits',
              ar: 'فوائد الشراكة',
              fr: 'Avantages du partenariat'
            })}</h2>
            <p>{getText({
              en: 'How our strategic alliances benefit our clients',
              ar: 'كيف تفيد تحالفاتنا الاستراتيجية عملاءنا',
              fr: 'Comment nos alliances stratégiques bénéficient à nos clients'
            })}</p>
          </div>

          <div className="benefits-showcase-grid">
            <div className="benefit-showcase visual-enhanced">
              <div className="benefit-image">
                <img
                  src="https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Comprehensive Solutions"
                  className="benefit-img"
                />
                <div className="benefit-icon">🎯</div>
              </div>
              <div className="benefit-content">
                <h3>{getText({
                  en: 'Comprehensive Solutions',
                  ar: 'حلول شاملة',
                  fr: 'Solutions complètes'
                })}</h3>
                <p>
                  {getText({
                    en: 'Access to a complete ecosystem of real estate services through our partner network, ensuring all your needs are met under one roof.',
                    ar: 'الوصول إلى نظام بيئي كامل لخدمات العقارات من خلال شبكة شركائنا، مما يضمن تلبية جميع احتياجاتك تحت سقف واحد.',
                    fr: 'Accès à un écosystème complet de services immobiliers via notre réseau de partenaires, garantissant que tous vos besoins sont satisfaits sous un même toit.'
                  })}
                </p>
              </div>
            </div>

            <div className="benefit-showcase visual-enhanced">
              <div className="benefit-image">
                <img
                  src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Competitive Advantages"
                  className="benefit-img"
                />
                <div className="benefit-icon">⚡</div>
              </div>
              <div className="benefit-content">
                <h3>{getText({
                  en: 'Competitive Advantages',
                  ar: 'مزايا تنافسية',
                  fr: 'Avantages concurrentiels'
                })}</h3>
                <p>
                  {getText({
                    en: 'Leverage our partners\' expertise and resources to secure better deals, faster approvals, and exclusive opportunities.',
                    ar: 'استفد من خبرة شركائنا ومواردهم للحصول على صفقات أفضل وموافقات أسرع وفرص حصرية.',
                    fr: 'Tirez parti de l\'expertise et des ressources de nos partenaires pour obtenir de meilleures offres, des approbations plus rapides et des opportunités exclusives.'
                  })}
                </p>
              </div>
            </div>

            <div className="benefit-showcase visual-enhanced">
              <div className="benefit-image">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Quality Assurance"
                  className="benefit-img"
                />
                <div className="benefit-icon">✅</div>
              </div>
              <div className="benefit-content">
                <h3>{getText({
                  en: 'Quality Assurance',
                  ar: 'ضمان الجودة',
                  fr: 'Assurance qualité'
                })}</h3>
                <p>
                  {getText({
                    en: 'All our partners are carefully vetted and selected based on their track record, expertise, and commitment to excellence.',
                    ar: 'يتم فحص جميع شركائنا بعناية واختيارهم بناءً على سجلهم وخبرتهم والتزامهم بالتميز.',
                    fr: 'Tous nos partenaires sont soigneusement vérifiés et sélectionnés en fonction de leurs antécédents, de leur expertise et de leur engagement envers l\'excellence.'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section section-dark">
        <div className="container">
          <div className="cta-content" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem' }}>{getText({
              en: 'Join Our Network',
              ar: 'انضم إلى شبكتنا',
              fr: 'Rejoignez notre réseau'
            })}</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', marginBottom: '2rem' }}>
              {getText({
                en: 'Interested in partnering with us? We\'re always looking for strategic alliances that can enhance our service offerings and client value.',
                ar: 'هل أنت مهتم بالشراكة معنا؟ نحن نبحث دائماً عن تحالفات استراتيجية يمكنها تحسين عروض خدماتنا وقيمة العميل.',
                fr: 'Intéressé par un partenariat avec nous? Nous recherchons toujours des alliances stratégiques qui peuvent améliorer nos offres de services et la valeur client.'
              })}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn-primary-enhanced">
                {getText({
                  en: 'Partner With Us',
                  ar: 'شارك معنا',
                  fr: 'Partenaire avec nous'
                })}
              </Link>
              <Link to="/our-services" className="btn-secondary-enhanced">
                {getText({
                  en: 'Explore Our Services',
                  ar: 'استكشف خدماتنا',
                  fr: 'Explorez nos services'
                })}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurPartners;
