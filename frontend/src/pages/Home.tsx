import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import HeroSection from '../components/HeroSection';
import PropertySearchWidget from '../components/PropertySearchWidget';
import PortfolioShowcase from '../components/PortfolioShowcase';
import ServicesSection from '../components/ServicesSection';
import ProcessSection from '../components/ProcessSection';
import PartnersSection from '../components/PartnersSection';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface MultilingualText {
  en: string;
  ar: string;
  fr?: string;
}

interface AboutHomeData {
  badge: MultilingualText;
  title: MultilingualText;
  description: MultilingualText;
  description2: MultilingualText;
  backgroundImage: string;
  features: Array<{
    icon: string;
    title: MultilingualText;
    description: MultilingualText;
  }>;
  statNumber: string;
  statLabel: MultilingualText;
}

interface FeaturedPropertiesConfig {
  badge: MultilingualText;
  title: MultilingualText;
  subtitle: MultilingualText;
  fetchFromDatabase: boolean;
  propertyCount: number;
}

interface Property {
  _id: string;
  title: string | MultilingualText;
  location: string | MultilingualText;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: 'sale' | 'rent' | 'off-plan';
  images: string[];
  propertyType: string;
}

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();

  const [aboutHomeData, setAboutHomeData] = useState<AboutHomeData | null>(null);
  const [featuredPropertiesConfig, setFeaturedPropertiesConfig] = useState<FeaturedPropertiesConfig | null>(null);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchAboutHome = async () => {
      try {
        // Fetch without admin=true to get data as stored in database
        const response = await axios.get(`${API_URL}/content/section/about-home`);
        const data = response.data?.data || response.data;
        if (data && data.length > 0) {
          const item = data[0];
          console.log('About Home Data from API:', item);
          console.log('Title type:', typeof item.title, 'Title value:', item.title);
          console.log('Description type:', typeof item.description, 'Description value:', item.description);
          setAboutHomeData({
            badge: item.metadata?.badge || { en: 'About N&H Homes Real Estate', ar: 'عن N&H العقارية', fr: 'À propos de N&H Immobilier' },
            title: item.title || { en: 'Your Trusted Real Estate Partner', ar: 'شريكك العقاري الموثوق', fr: 'Votre partenaire immobilier de confiance' },
            description: item.description || { en: '', ar: '', fr: '' },
            description2: item.metadata?.description2 || { en: '', ar: '', fr: '' },
            backgroundImage: item.backgroundImage || item.image || '',
            features: item.metadata?.features || [],
            statNumber: item.metadata?.statNumber || '1000+',
            statLabel: item.metadata?.statLabel || { en: 'Happy Clients', ar: 'عملاء سعداء', fr: 'Clients satisfaits' }
          });
        }
      } catch (error) {
        console.error('Error fetching about-home data:', error);
      }
    };
    fetchAboutHome();
  }, []);

  // Fetch featured properties configuration
  useEffect(() => {
    const fetchFeaturedPropertiesConfig = async () => {
      try {
        const response = await axios.get(`${API_URL}/content/section/featured-properties`);
        const data = response.data?.data || response.data;
        if (data && data.length > 0) {
          const item = data[0];
          setFeaturedPropertiesConfig({
            badge: item.metadata?.badge || { en: 'Featured Properties', ar: 'عقارات مميزة', fr: 'Propriétés en vedette' },
            title: item.title || { en: 'Exceptional Properties', ar: 'عقارات استثنائية', fr: 'Propriétés exceptionnelles' },
            subtitle: item.description || { en: 'Handpicked luxury properties that define excellence in real estate', ar: 'عقارات فاخرة مختارة بعناية', fr: 'Propriétés de luxe sélectionnées' },
            fetchFromDatabase: item.metadata?.fetchFromDatabase ?? true,
            propertyCount: item.metadata?.propertyCount || 3
          });
        } else {
          // If no config found, use defaults with fetchFromDatabase enabled
          console.log('No featured-properties config found, using defaults');
          setFeaturedPropertiesConfig({
            badge: { en: 'Featured Properties', ar: 'عقارات مميزة', fr: 'Propriétés en vedette' },
            title: { en: 'Exceptional Properties', ar: 'عقارات استثنائية', fr: 'Propriétés exceptionnelles' },
            subtitle: { en: 'Handpicked luxury properties that define excellence in real estate', ar: 'عقارات فاخرة مختارة بعناية', fr: 'Propriétés de luxe sélectionnées' },
            fetchFromDatabase: true,
            propertyCount: 3
          });
        }
      } catch (error) {
        console.error('Error fetching featured-properties config:', error);
        // Use defaults on error
        setFeaturedPropertiesConfig({
          badge: { en: 'Featured Properties', ar: 'عقارات مميزة', fr: 'Propriétés en vedette' },
          title: { en: 'Exceptional Properties', ar: 'عقارات استثنائية', fr: 'Propriétés exceptionnelles' },
          subtitle: { en: 'Handpicked luxury properties that define excellence in real estate', ar: 'عقارات فاخرة مختارة بعناية', fr: 'Propriétés de luxe sélectionnées' },
          fetchFromDatabase: true,
          propertyCount: 3
        });
      }
    };
    fetchFeaturedPropertiesConfig();
  }, []);

  // Fetch featured properties from database
  useEffect(() => {
    const fetchProperties = async () => {
      if (!featuredPropertiesConfig?.fetchFromDatabase) {
        console.log('fetchFromDatabase is disabled, skipping featured properties fetch');
        return;
      }
      try {
        console.log('Fetching featured properties with limit:', featuredPropertiesConfig.propertyCount);
        // First try to fetch properties marked as featured
        const response = await axios.get(`${API_URL}/properties/featured?limit=${featuredPropertiesConfig.propertyCount}`);
        const data = response.data?.data || response.data;
        console.log('Featured properties response:', data);

        if (data && Array.isArray(data) && data.length > 0) {
          console.log('Found featured properties:', data.length);
          setFeaturedProperties(data);
        } else {
          console.log('No featured properties found, falling back to newest properties');
          // Fallback to newest properties if no featured properties found
          const fallbackResponse = await axios.get(`${API_URL}/properties?limit=${featuredPropertiesConfig.propertyCount}&sortBy=createdAt&order=desc`);
          const fallbackData = fallbackResponse.data?.data || fallbackResponse.data;
          console.log('Fallback properties response:', fallbackData);
          if (fallbackData && Array.isArray(fallbackData)) {
            console.log('Using fallback properties:', fallbackData.length);
            setFeaturedProperties(fallbackData);
          }
        }
      } catch (error) {
        console.error('Error fetching featured properties:', error);
        // Fallback to newest properties on error
        try {
          console.log('Attempting fallback fetch due to error');
          const fallbackResponse = await axios.get(`${API_URL}/properties?limit=${featuredPropertiesConfig?.propertyCount || 3}&sortBy=createdAt&order=desc`);
          const fallbackData = fallbackResponse.data?.data || fallbackResponse.data;
          console.log('Fallback properties response:', fallbackData);
          if (fallbackData && Array.isArray(fallbackData)) {
            console.log('Using fallback properties:', fallbackData.length);
            setFeaturedProperties(fallbackData);
          }
        } catch (fallbackError) {
          console.error('Error fetching fallback properties:', fallbackError);
        }
      }
    };
    fetchProperties();

    // Set up polling to refresh featured properties every 30 seconds
    const pollInterval = setInterval(fetchProperties, 30000);

    return () => clearInterval(pollInterval);
  }, [featuredPropertiesConfig]);

  const getText = (text: MultilingualText | string | undefined): string => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    const lang = i18n.language as 'en' | 'ar' | 'fr';
    const result = (text as any)[lang] || text.en || text.ar || text.fr || '';
    console.log('getText called with:', text, 'lang:', lang, 'result:', result);
    return result;
  };

  return (
    <div className="home">
      {/* Hero Section with Video */}
      <section className="hero-slider-section">
        <HeroSection />

        {/* Property Search Widget positioned below hero */}
        <div className="search-widget-overlay">
          <PropertySearchWidget />
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="featured-properties-section">
        <div className="container">
          <div className="section-header-modern">
            <div className="section-badge">
              {featuredPropertiesConfig ? getText(featuredPropertiesConfig.badge) : t('home.featuredProperties')}
            </div>
            <h2 className="section-title-modern">
              {featuredPropertiesConfig ? getText(featuredPropertiesConfig.title) : t('home.exceptionalProperties')}
            </h2>
            <p className="section-subtitle-modern">
              {featuredPropertiesConfig ? getText(featuredPropertiesConfig.subtitle) : t('home.handpickedLuxury')}
            </p>
          </div>

          <div className="featured-properties-grid">
            {featuredProperties && featuredProperties.length > 0 ? (
              featuredProperties.map((property) => (
                <Link to={`/property/${property._id}`} key={property._id} className="featured-property-card" style={{ textDecoration: 'none' }}>
                  <div className="property-image">
                    <img
                      src={property.images?.[0]?.startsWith('http') ? property.images[0] : `${API_URL}${property.images?.[0] || ''}`}
                      alt={getText(property.title)}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="property-badge">
                      {property.type === 'sale' ? t('home.forSale') : property.type === 'rent' ? t('home.forRent') : 'Off Plan'}
                    </div>
                  </div>
                  <div className="property-info">
                    <h3 style={{ textDecoration: 'none' }}>{getText(property.title)}</h3>
                    <p className="property-location">📍 {getText(property.location)}</p>
                    <p className="property-price">
                      QAR {property.price?.toLocaleString()}{property.type === 'rent' ? '/month' : ''}
                    </p>
                    <div className="property-features">
                      <span>{property.bedrooms} {t('home.beds')}</span>
                      <span>{property.bathrooms} {t('home.baths')}</span>
                      <span>{property.area} sqm</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <>
                <div className="featured-property-card">
                  <div className="property-image">
                    <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Luxury Villa" />
                    <div className="property-badge">{t('home.forSale')}</div>
                  </div>
                  <div className="property-info">
                    <h3>{t('home.luxuryMarinaVilla', 'Luxury Marina Villa')}</h3>
                    <p className="property-location">📍 {t('home.thePearl', 'The Pearl, Qatar')}</p>
                    <p className="property-price">QAR 8,500,000</p>
                    <div className="property-features">
                      <span>4 {t('home.beds')}</span>
                      <span>5 {t('home.baths')}</span>
                      <span>450 sqm</span>
                    </div>
                  </div>
                </div>

                <div className="featured-property-card">
                  <div className="property-image">
                    <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Modern Apartment" />
                    <div className="property-badge">{t('home.forRent')}</div>
                  </div>
                  <div className="property-info">
                    <h3>{t('home.modernDowntownApartment', 'Modern Downtown Apartment')}</h3>
                    <p className="property-location">📍 {t('home.westBay', 'West Bay, Doha')}</p>
                    <p className="property-price">QAR 15,000/month</p>
                    <div className="property-features">
                      <span>3 {t('home.beds')}</span>
                      <span>3 {t('home.baths')}</span>
                      <span>180 sqm</span>
                    </div>
                  </div>
                </div>

                <div className="featured-property-card">
                  <div className="property-image">
                    <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Penthouse" />
                    <div className="property-badge">{t('home.forSale')}</div>
                  </div>
                  <div className="property-info">
                    <h3>{t('home.executivePenthouse', 'Executive Penthouse')}</h3>
                    <p className="property-location">📍 {t('home.lusailCity', 'Lusail City, Qatar')}</p>
                    <p className="property-price">QAR 12,000,000</p>
                    <div className="property-features">
                      <span>5 {t('home.beds')}</span>
                      <span>6 {t('home.baths')}</span>
                      <span>600 sqm</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="section-cta">
            <Link to="/properties" className="btn-modern-primary">
              {t('home.viewAllProperties')}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Portfolio Showcase Section */}
      <PortfolioShowcase />

      {/* About Section with Background Image */}
      <section
        className="about-section-bg"
        style={{
          backgroundImage: aboutHomeData?.backgroundImage
            ? `url(${aboutHomeData.backgroundImage.startsWith('http') ? aboutHomeData.backgroundImage : `${API_URL}${aboutHomeData.backgroundImage}`})`
            : 'url(/images/about.png)'
        }}
      >
        <div className="about-section-overlay">
          <div className="container">
            <div className="about-content-centered">
              <div className="section-badge">
                {aboutHomeData ? getText(aboutHomeData.badge) : getText({
                  en: 'ABOUT N&H HOMES REAL ESTATE',
                  ar: 'عن N&H العقارية',
                  fr: 'À PROPOS DE N&H IMMOBILIER'
                })}
              </div>
              <h2 className="section-title-modern">
                {aboutHomeData ? getText(aboutHomeData.title) : getText({
                  en: 'Your Trusted Real Estate Partner',
                  ar: 'شريكك العقاري الموثوق',
                  fr: 'Votre partenaire immobilier de confiance'
                })}
              </h2>
              <p className="about-description">
                {aboutHomeData ? getText(aboutHomeData.description) : getText({
                  en: 'We provide a comprehensive portfolio of services designed for individuals, families, developers, corporate tenants, and institutional investors. By combining local expertise with international standards, every transaction is managed with professionalism and integrity.',
                  ar: 'نحن نقدم محفظة شاملة من الخدمات مصممة للأفراد والعائلات والمطورين والمستأجرين الشركات والمستثمرين المؤسسيين. من خلال الجمع بين الخبرة المحلية والمعايير الدولية، يتم إدارة كل معاملة بمهنية وسلامة.',
                  fr: 'Nous fournissons un portefeuille complet de services conçus pour les particuliers, les familles, les promoteurs, les locataires d\'entreprises et les investisseurs institutionnels. En combinant l\'expertise locale et les normes internationales, chaque transaction est gérée avec professionnalisme et intégrité.'
                })}
              </p>
              {aboutHomeData?.description2 && getText(aboutHomeData.description2) && (
                <p className="about-description">
                  {getText(aboutHomeData.description2)}
                </p>
              )}

              <div className="about-features-row">
                {(aboutHomeData?.features && aboutHomeData.features.length > 0 ? aboutHomeData.features : [
                  { icon: '🏆', title: { en: 'Award-Winning Service', ar: 'خدمة حائزة على جوائز', fr: 'Service primé' }, description: { en: 'Recognized excellence in real estate', ar: 'تميز معترف به في العقارات', fr: 'Excellence reconnue dans l\'immobilier' } },
                  { icon: '🌍', title: { en: 'Global Network', ar: 'شبكة عالمية', fr: 'Réseau mondial' }, description: { en: 'Properties across 8 countries', ar: 'عقارات في 8 دول', fr: 'Propriétés dans 8 pays' } },
                  { icon: '🤝', title: { en: 'Trusted Expertise', ar: 'خبرة موثوقة', fr: 'Expertise de confiance' }, description: { en: '15+ years of market experience', ar: 'أكثر من 15 عامًا من الخبرة في السوق', fr: 'Plus de 15 ans d\'expérience du marché' } }
                ]).map((feature, index) => (
                  <div className="about-feature-card" key={index}>
                    <div className="feature-icon">{feature.icon}</div>
                    <h4>{getText(feature.title)}</h4>
                    <p>{getText(feature.description)}</p>
                  </div>
                ))}
              </div>

              <div className="about-stat-badge">
                <span className="stat-number">{aboutHomeData?.statNumber || '1000+'}</span>
                <span className="stat-label">{aboutHomeData ? getText(aboutHomeData.statLabel) : getText({
                  en: 'Happy Clients',
                  ar: 'عملاء سعداء',
                  fr: 'Clients satisfaits'
                })}</span>
              </div>

              <Link to="/about" className="btn-modern-light">
                {t('home.learnMore', 'Learn More About Us')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Dynamic from Backend */}
      <ServicesSection />

      {/* Process Section - Dynamic from Backend */}
      <ProcessSection />

      {/* Partners Section - Dynamic from Backend */}
      <PartnersSection />

      {/* Stats Section with Modern Design */}
      <section className="stats-section-modern">
        <div className="container">
          <div className="stats-grid-modern">
            <div className="stat-card-modern">
              <div className="stat-number-modern">6+</div>
              <div className="stat-label-modern">{t('home.yearsExperience', 'Years Experience')}</div>
            </div>
            <div className="stat-card-modern">
              <div className="stat-number-modern">8</div>
              <div className="stat-label-modern">{t('home.countries', 'Countries')}</div>
            </div>
            <div className="stat-card-modern">
              <div className="stat-number-modern">1000+</div>
              <div className="stat-label-modern">{t('home.propertiesSold', 'Properties Sold')}</div>
            </div>
            <div className="stat-card-modern">
              <div className="stat-number-modern">2000+</div>
              <div className="stat-label-modern">{t('home.happyClients', 'Happy Clients')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section-modern">
        <div className="container">
          <div className="cta-content">
            <h2>{t('home.readyToFind', 'Ready to Find Your Dream Property?')}</h2>
            <p>{t('home.letOurTeamGuide', 'Let our expert team guide you through your real estate journey')}</p>
            <div className="cta-buttons">
              <Link to="/properties" className="btn-modern-primary">
                {t('home.browseProperties', 'Browse Properties')}
              </Link>
              <Link to="/contact" className="btn-modern-secondary">
                {t('home.contactUs', 'Contact Us')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
