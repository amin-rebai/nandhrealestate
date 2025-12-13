import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface PortfolioItem {
  _id: string;
  title: string | { en: string; ar: string; fr?: string };
  subtitle?: string | { en: string; ar: string; fr?: string };
  description?: string | { en: string; ar: string; fr?: string };
  backgroundImage?: string;
  image?: string;
  ctaText?: string | { en: string; ar: string; fr?: string };
  ctaLink?: string;
  propertyType?: 'villa' | 'apartment' | 'penthouse' | 'commercial' | 'office' | 'retail';
  isActive: boolean;
  order?: number;
}

const PortfolioShowcase: React.FC = () => {
  const { i18n } = useTranslation();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to display multilingual content
  const displayMultilingual = (value: string | { en: string; ar: string; fr?: string } | undefined): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    const lang = i18n.language === 'ar' ? 'ar' : i18n.language === 'fr' ? 'fr' : 'en';
    return (value as any)[lang] || value.en || (value as any).fr || '';
  };

  // Fetch portfolio data from API - first try properties marked for portfolio, then fall back to content
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

        // First try to fetch properties marked for portfolio
        const propertiesResponse = await axios.get(`${API_URL}/properties/portfolio?limit=6`);
        if (propertiesResponse.data.success && propertiesResponse.data.data.length > 0) {
          // Convert properties to portfolio item format
          const portfolioFromProperties = propertiesResponse.data.data.map((property: any, index: number) => ({
            _id: property._id,
            title: property.title,
            description: property.description,
            backgroundImage: property.images?.[0]?.startsWith('http')
              ? property.images[0]
              : `${API_URL}${property.images?.[0] || ''}`,
            ctaText: { en: 'View Property', ar: 'عرض العقار', fr: 'Voir la propriété' },
            ctaLink: `/property/${property._id}`,
            propertyType: property.propertyType?.toLowerCase() || 'villa',
            isActive: true,
            order: index + 1
          }));
          setPortfolioItems(portfolioFromProperties);
          setLoading(false);
          return;
        }

        // Fall back to content-based portfolio
        const response = await axios.get(`${API_URL}/content/section/portfolio?active=true`);

        if (response.data.success && response.data.data.length > 0) {
          // Sort by order
          const sortedItems = response.data.data.sort((a: PortfolioItem, b: PortfolioItem) => (a.order || 0) - (b.order || 0));
          setPortfolioItems(sortedItems);
        } else {
          // Fallback to default portfolio items if no content found
          setPortfolioItems([
            {
              _id: '1',
              title: { en: "Luxury Villas", ar: "الفيلات الفاخرة", fr: 'Villas de luxe' },
              description: { en: "Exclusive waterfront properties with premium amenities", ar: "عقارات حصرية على الواجهة البحرية مع وسائل الراحة المميزة", fr: "Propriétés exclusives en bord de mer avec équipements haut de gamme" },
              backgroundImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
              ctaText: { en: "Explore Villas", ar: "استكشف الفيلات" },
              ctaLink: "/properties",
              propertyType: 'villa',
              isActive: true,
              order: 1
            },
            {
              _id: '2',
              title: { en: "Modern Apartments", ar: "الشقق الحديثة", fr: 'Appartements modernes' },
              description: { en: "Contemporary living in prime locations", ar: "الحياة العصرية في المواقع المميزة", fr: "Vivre contemporain dans des emplacements privilégiés" },
              backgroundImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
              ctaText: { en: "View Apartments", ar: "عرض الشقق" },
              ctaLink: "/properties",
              propertyType: 'apartment',
              isActive: true,
              order: 2
            },
            {
              _id: '3',
              title: { en: "Penthouse Collection", ar: "مجموعة البنتهاوس", fr: 'Collection Penthouse' },
              description: { en: "Sky-high luxury with panoramic views", ar: "الفخامة العالية مع الإطلالات البانورامية", fr: "Luxe en altitude avec vues panoramiques" },
              backgroundImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
              ctaText: { en: "View Penthouses", ar: "عرض البنتهاوس" },
              ctaLink: "/properties",
              propertyType: 'penthouse',
              isActive: true,
              order: 3
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        // Fallback to default items on error
          setPortfolioItems([
          {
            _id: '1',
            title: { en: "Luxury Properties", ar: "العقارات الفاخرة", fr: 'Biens de luxe' },
            description: { en: "Discover exceptional real estate opportunities", ar: "اكتشف الفرص العقارية الاستثنائية", fr: "Découvrez des opportunités immobilières exceptionnelles" },
            backgroundImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            ctaText: { en: "Explore Properties", ar: "استكشف العقارات" },
            ctaLink: "/properties",
            propertyType: 'villa',
            isActive: true,
            order: 1
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  if (loading) {
    return (
      <section className="visual-showcase-section">
        <div className="container">
          <div className="section-header-modern">
            <div className="section-badge">Our Portfolio</div>
            <h2 className="section-title-modern">Loading...</h2>
          </div>
        </div>
      </section>
    );
  }

  if (portfolioItems.length === 0) {
    return (
      <section className="visual-showcase-section">
        <div className="container">
          <div className="section-header-modern">
            <div className="section-badge">Our Portfolio</div>
            <h2 className="section-title-modern">No Portfolio Items Available</h2>
          </div>
        </div>
      </section>
    );
  }

  // Determine grid layout based on number of items
  const getGridLayout = () => {
    if (portfolioItems.length === 1) {
      return 'single-item';
    } else if (portfolioItems.length === 2) {
      return 'two-items';
    } else if (portfolioItems.length === 3) {
      return 'three-items';
    } else {
      return 'multiple-items';
    }
  };

  return (
    <section className="visual-showcase-section">
      <div className="container">
        <div className="section-header-modern">
          <div className="section-badge">Our Portfolio</div>
          <h2 className="section-title-modern">Luxury Living Redefined</h2>
          <p className="section-subtitle-modern">
            Experience the finest properties across our global network
          </p>
        </div>

        <div className={`showcase-grid ${getGridLayout()}`}>
          {portfolioItems.map((item, index) => (
            <div 
              key={item._id} 
              className={`showcase-item ${index === 0 && portfolioItems.length >= 3 ? 'large' : ''}`}
            >
              <img
                src={item.backgroundImage || item.image}
                alt={displayMultilingual(item.title)}
                className="showcase-image"
              />
              <div className="showcase-overlay">
                <div className="showcase-content">
                  <h3>{displayMultilingual(item.title)}</h3>
                  <p>{displayMultilingual(item.description)}</p>
                  {item.ctaLink && item.ctaText && (
                    <Link to={item.ctaLink} className="showcase-link">
                      {displayMultilingual(item.ctaText)} →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioShowcase;
