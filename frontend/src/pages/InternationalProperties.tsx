import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { fetchProperties } from '../store/slices/propertySlice';

const InternationalProperties: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { properties, loading, error } = useSelector((state: RootState) => state.properties);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // International countries (outside Qatar)
  const internationalCountries = [
    { code: 'UAE', name: 'United Arab Emirates', flag: '🇦🇪' },
    { code: 'Egypt', name: 'Egypt', flag: '🇪🇬' },
    { code: 'Saudi Arabia', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'France', name: 'France', flag: '🇫🇷' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'Turkey', name: 'Turkey', flag: '🇹🇷' },
    { code: 'Spain', name: 'Spain', flag: '🇪🇸' },
    { code: 'Greece', name: 'Greece', flag: '🇬🇷' },
    { code: 'Cyprus', name: 'Cyprus', flag: '🇨🇾' },
    { code: 'Morocco', name: 'Morocco', flag: '🇲🇦' },
  ];

  // Filter states
  const [filters, setFilters] = useState({
    country: 'all',
    listingType: 'all',
    category: 'all',
    propertyType: 'all',
    priceRange: 'all',
    bedrooms: 'all',
    sortBy: 'newest'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Helper functions
  const getText = (field: any, defaultValue: string = '') => {
    if (typeof field === 'string') return field;
    if (field && typeof field === 'object') return field.en || field.ar || defaultValue;
    return defaultValue;
  };

  const getArray = (field: any): string[] => {
    if (Array.isArray(field)) return field;
    if (field && typeof field === 'object') return field.en || field.ar || [];
    return [];
  };

  const getPropertyImage = (property: any) => {
    if (property.images && property.images.length > 0) {
      const imageUrl = property.images[0];
      return imageUrl.startsWith('http') ? imageUrl : `${API_URL}${imageUrl}`;
    }
    return getDefaultPropertyImage(property.propertyType);
  };

  const getDefaultPropertyImage = (propertyType: string) => {
    const defaultImages: { [key: string]: string } = {
      "Apartment": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&q=80",
      "Villa": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80",
      "Penthouse": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80",
      "Office": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=80",
    };
    return defaultImages[propertyType] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1000&q=80";
  };

  useEffect(() => {
    dispatch(fetchProperties({}));
  }, [dispatch]);

  // Transform and filter properties - ONLY international (non-Qatar)
  const allInternationalProperties = properties
    .map((property: any) => ({
      ...property,
      title: getText(property.title),
      description: getText(property.description),
      location: getText(property.location),
      features: getArray(property.features),
      listingType: property.type,
      propertyCategory: property.category || 'residential',
      priceText: `${property.country === 'UAE' ? 'AED' : property.country === 'Egypt' ? 'EGP' : property.country === 'Saudi Arabia' ? 'SAR' : property.country === 'France' || property.country === 'Spain' || property.country === 'Greece' || property.country === 'Cyprus' ? 'EUR' : property.country === 'UK' ? 'GBP' : property.country === 'Turkey' ? 'TRY' : 'USD'} ${property.price.toLocaleString()}`,
      dateAdded: property.createdAt,
      agent: typeof property.agent === 'string' ? 'Agent' : property.agent?.name || 'Agent',
      agentPhone: typeof property.agent === 'string' ? '' : property.agent?.phone || ''
    }))
    .filter((property: any) => {
      const country = (property.country || '').toLowerCase();
      return country !== 'qatar' && country !== '';
    });

  // Apply filters
  const filteredProperties = allInternationalProperties.filter(property => {
    if (filters.country !== 'all' && property.country?.toLowerCase() !== filters.country.toLowerCase()) return false;
    if (filters.listingType !== 'all' && property.listingType !== filters.listingType) return false;
    if (filters.category !== 'all' && property.propertyCategory !== filters.category) return false;
    if (filters.propertyType !== 'all' && property.propertyType !== filters.propertyType) return false;
    if (filters.bedrooms !== 'all') {
      const bedroomFilter = parseInt(filters.bedrooms);
      if (bedroomFilter === 4 && property.bedrooms < 4) return false;
      if (bedroomFilter !== 4 && property.bedrooms !== bedroomFilter) return false;
    }
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (max && (property.price < min || property.price > max)) return false;
      if (!max && property.price < min) return false;
    }
    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'newest': return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      case 'oldest': return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
      default: return 0;
    }
  });

  // Get country statistics
  const countryStats = internationalCountries.map(country => ({
    ...country,
    count: allInternationalProperties.filter(p => p.country?.toLowerCase() === country.code.toLowerCase()).length
  })).filter(c => c.count > 0);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  return (
    <div className="international-properties-page">
      {/* Hero Section */}
      <section className="properties-hero" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        <div className="hero-background">
          <div className="hero-overlay" style={{ background: 'rgba(0,0,0,0.4)' }}></div>
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=2070&q=80"
            alt="International Properties"
            className="hero-bg-image"
          />
        </div>
        <div className="hero-content">
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2.5rem' }}>🌍</span>
              <h1 className="hero-title" style={{ margin: 0 }}>International Properties</h1>
            </div>
            <p className="hero-subtitle">
              Discover premium real estate opportunities across global markets
            </p>
          </div>
        </div>
      </section>

      {/* Country Cards Section */}
      <section style={{ padding: '3rem 0', background: 'var(--off-white)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--luxury-burgundy)' }}>
            Browse by Country
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            <div
              onClick={() => handleFilterChange('country', 'all')}
              style={{
                padding: '1.5rem',
                background: filters.country === 'all' ? 'var(--luxury-burgundy)' : 'var(--pure-white)',
                color: filters.country === 'all' ? 'white' : 'var(--charcoal-gray)',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                border: '2px solid transparent'
              }}
            >
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🌐</span>
              <div style={{ fontWeight: '600' }}>All Countries</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{allInternationalProperties.length} properties</div>
            </div>
            {countryStats.map(country => (
              <div
                key={country.code}
                onClick={() => handleFilterChange('country', country.code)}
                style={{
                  padding: '1.5rem',
                  background: filters.country.toLowerCase() === country.code.toLowerCase() ? 'var(--luxury-burgundy)' : 'var(--pure-white)',
                  color: filters.country.toLowerCase() === country.code.toLowerCase() ? 'white' : 'var(--charcoal-gray)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent'
                }}
              >
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>{country.flag}</span>
                <div style={{ fontWeight: '600' }}>{country.name}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{country.count} properties</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Filters and Properties */}
      <section className="section section-light">
        <div className="container">
          {/* Advanced Filters Bar */}
          <div className="filters-bar" style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            padding: '1.5rem',
            background: 'var(--pure-white)',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <div className="filter-group">
              <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--luxury-burgundy)', marginBottom: '0.5rem', display: 'block' }}>Listing Type</label>
              <select
                value={filters.listingType}
                onChange={(e) => handleFilterChange('listingType', e.target.value)}
                style={{ padding: '0.7rem', border: '2px solid var(--border-light)', borderRadius: '6px', fontSize: '0.95rem', minWidth: '130px' }}
              >
                <option value="all">All Types</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
                <option value="off-plan">Off-Plan</option>
              </select>
            </div>

            <div className="filter-group">
              <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--luxury-burgundy)', marginBottom: '0.5rem', display: 'block' }}>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                style={{ padding: '0.7rem', border: '2px solid var(--border-light)', borderRadius: '6px', fontSize: '0.95rem', minWidth: '130px' }}
              >
                <option value="all">All Categories</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div className="filter-group">
              <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--luxury-burgundy)', marginBottom: '0.5rem', display: 'block' }}>Property Type</label>
              <select
                value={filters.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                style={{ padding: '0.7rem', border: '2px solid var(--border-light)', borderRadius: '6px', fontSize: '0.95rem', minWidth: '140px' }}
              >
                <option value="all">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Office">Office</option>
                <option value="Shop">Shop</option>
              </select>
            </div>

            <div className="filter-group">
              <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--luxury-burgundy)', marginBottom: '0.5rem', display: 'block' }}>Bedrooms</label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                style={{ padding: '0.7rem', border: '2px solid var(--border-light)', borderRadius: '6px', fontSize: '0.95rem', minWidth: '100px' }}
              >
                <option value="all">Any</option>
                <option value="0">Studio</option>
                <option value="1">1 BR</option>
                <option value="2">2 BR</option>
                <option value="3">3 BR</option>
                <option value="4">4+ BR</option>
              </select>
            </div>

            <div className="filter-group">
              <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--luxury-burgundy)', marginBottom: '0.5rem', display: 'block' }}>Price Range</label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                style={{ padding: '0.7rem', border: '2px solid var(--border-light)', borderRadius: '6px', fontSize: '0.95rem', minWidth: '150px' }}
              >
                <option value="all">Any Price</option>
                <option value="0-500000">Under 500K</option>
                <option value="500000-1000000">500K - 1M</option>
                <option value="1000000-2000000">1M - 2M</option>
                <option value="2000000-5000000">2M - 5M</option>
                <option value="5000000-">5M+</option>
              </select>
            </div>

            <div className="filter-group">
              <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--luxury-burgundy)', marginBottom: '0.5rem', display: 'block' }}>Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                style={{ padding: '0.7rem', border: '2px solid var(--border-light)', borderRadius: '6px', fontSize: '0.95rem', minWidth: '140px' }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div className="view-toggle" style={{ marginLeft: 'auto' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '0.7rem',
                  border: '2px solid var(--border-light)',
                  background: viewMode === 'grid' ? 'var(--matte-gold)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--luxury-burgundy)' : 'var(--text-light)',
                  borderRadius: '6px 0 0 6px',
                  cursor: 'pointer'
                }}
              >
                ⊞ Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '0.7rem',
                  border: '2px solid var(--border-light)',
                  borderLeft: 'none',
                  background: viewMode === 'list' ? 'var(--matte-gold)' : 'transparent',
                  color: viewMode === 'list' ? 'var(--luxury-burgundy)' : 'var(--text-light)',
                  borderRadius: '0 6px 6px 0',
                  cursor: 'pointer'
                }}
              >
                ☰ List
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            padding: '1rem 0',
            borderBottom: '1px solid var(--border-light)'
          }}>
            <h3 style={{ color: 'var(--luxury-burgundy)', margin: 0 }}>
              🌍 {filteredProperties.length} International Properties
              {filters.country !== 'all' && ` in ${internationalCountries.find(c => c.code.toLowerCase() === filters.country.toLowerCase())?.name || filters.country}`}
            </h3>
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '1.2rem', color: 'var(--luxury-burgundy)' }}>Loading properties...</div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '1.2rem', color: '#d32f2f' }}>Error: {error}</div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredProperties.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
              <div style={{ fontSize: '1.5rem', color: 'var(--luxury-burgundy)', marginBottom: '1rem' }}>No international properties found</div>
              <div style={{ fontSize: '1rem', color: 'var(--text-light)' }}>Try adjusting your filters or check back later for new listings.</div>
            </div>
          )}

          {/* Properties Grid */}
          {!loading && !error && filteredProperties.length > 0 && (
            <div className="properties-grid">
              {filteredProperties.map((property) => (
                <div key={property._id} className="property-card enhanced-visual">
                  <div className="property-image-container">
                    <img
                      src={getPropertyImage(property)}
                      alt={property.title}
                      className="property-main-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getDefaultPropertyImage(property.propertyType);
                      }}
                    />
                    <div className="image-overlay"></div>
                    {/* Country Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      background: 'rgba(0,0,0,0.8)',
                      color: 'white',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      {internationalCountries.find(c => c.code.toLowerCase() === property.country?.toLowerCase())?.flag || '🌍'} {property.country}
                    </div>
                    <div className={`property-category-badge ${property.listingType}`} style={{ top: '1rem', right: '1rem', left: 'auto' }}>
                      {property.listingType === 'off-plan' ? 'Off-Plan' : `For ${property.listingType}`}
                    </div>
                  </div>
                  <div className="property-content">
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem' }}>{property.title}</h3>
                    <div style={{ marginBottom: '0.75rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                      📍 {property.location}, {property.country}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--matte-gold)', marginBottom: '1rem' }}>
                      {property.priceText}
                    </div>
                    <div className="property-details" style={{ marginBottom: '1rem' }}>
                      <span>🛏️ {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bed`}</span>
                      <span>🚿 {property.bathrooms} bath</span>
                      <span>📐 {property.area} sqm</span>
                    </div>
                    <div className="property-actions">
                      <button
                        className="btn-primary-enhanced"
                        onClick={() => navigate(`/property/${property._id}`)}
                      >
                        View Details
                      </button>
                      <button className="btn-secondary-enhanced">
                        Contact Agent
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default InternationalProperties;

