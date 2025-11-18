import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface PartnerItem {
  _id: string;
  title: string | { en: string; ar: string };
  description?: string | { en: string; ar: string };
  image?: string;
  isActive: boolean;
  order?: number;
}

const PartnersSection: React.FC = () => {
  const { i18n } = useTranslation();
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/content/section/clients?active=true`);
        if (response.data && response.data.data) {
          setPartners(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
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

  // Default partners if none are loaded
  const defaultPartners = [
    {
      _id: '1',
      title: { en: 'Leading Developers', ar: 'المطورون الرائدون' },
      description: { en: 'Strong alliances with leading developers in the GCC, MENA, and Europe.', ar: 'تحالفات قوية مع المطورين الرائدين في دول مجلس التعاون الخليجي ومنطقة الشرق الأوسط وشمال أفريقيا وأوروبا.' },
      image: '',
      isActive: true,
      order: 1
    },
    {
      _id: '2',
      title: { en: 'Financial Institutions', ar: 'المؤسسات المالية' },
      description: { en: 'Partnerships with banks and financial institutions for comprehensive solutions.', ar: 'شراكات مع البنوك والمؤسسات المالية للحلول الشاملة.' },
      image: '',
      isActive: true,
      order: 2
    },
    {
      _id: '3',
      title: { en: 'Technology Partners', ar: 'شركاء التكنولوجيا' },
      description: { en: 'Collaboration with leading technology providers for innovative solutions.', ar: 'التعاون مع مزودي التكنولوجيا الرائدين للحلول المبتكرة.' },
      image: '',
      isActive: true,
      order: 3
    },
    {
      _id: '4',
      title: { en: 'Industry Leaders', ar: 'قادة الصناعة' },
      description: { en: 'Strategic alliances with industry leaders across global markets.', ar: 'تحالفات استراتيجية مع قادة الصناعة عبر الأسواق العالمية.' },
      image: '',
      isActive: true,
      order: 4
    }
  ];

  const displayPartners = partners.length > 0 ? partners : defaultPartners;

  if (loading) {
    return null;
  }

  // Don't show section if no partners
  if (displayPartners.length === 0) {
    return null;
  }

  // Partner icons
  const getPartnerIcon = (index: number) => {
    const icons = ['🏗️', '🏦', '💻', '🤝', '🌍', '⭐'];
    return icons[index % icons.length];
  };

  return (
    <section className="partners-section" style={{
      padding: '5rem 0',
      backgroundColor: 'white'
    }}>
      <div className="container">
        <div className="section-header-modern">
          <div className="section-badge">Our Partners</div>
          <h2 className="section-title-modern">Strategic Alliances</h2>
          <p className="section-subtitle-modern">
            Building success through trusted partnerships across global markets
          </p>
        </div>

        <div className="partners-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginTop: '3rem'
        }}>
          {displayPartners.map((partner, index) => (
            <div 
              key={partner._id} 
              className="partner-card"
              style={{
                backgroundColor: '#f8f9fa',
                padding: '2rem',
                borderRadius: '12px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#C1A88A';
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {partner.image ? (
                <div style={{ marginBottom: '1.5rem' }}>
                  <img 
                    src={getImageUrl(partner.image)} 
                    alt={getText(partner.title)}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      padding: '1rem',
                      backgroundColor: 'white'
                    }}
                  />
                </div>
              ) : (
                <div style={{
                  fontSize: '3.5rem',
                  marginBottom: '1rem'
                }}>
                  {getPartnerIcon(index)}
                </div>
              )}
              
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                marginBottom: '1rem',
                color: '#2c3e50'
              }}>
                {getText(partner.title)}
              </h3>
              
              <p style={{
                color: '#666',
                lineHeight: '1.6',
                fontSize: '0.95rem'
              }}>
                {getText(partner.description)}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '3rem'
        }}>
          <Link 
            to="/our-partners" 
            className="btn-modern-secondary"
            style={{
              display: 'inline-block',
              padding: '1rem 2.5rem',
              backgroundColor: 'transparent',
              color: '#C1A88A',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '1.1rem',
              fontWeight: 600,
              border: '2px solid #C1A88A',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#C1A88A';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#C1A88A';
            }}
          >
            View All Partners
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;

