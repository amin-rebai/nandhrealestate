import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { fetchProperties } from '../store/slices/propertySlice';

const Properties: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const { properties, loading, error } = useSelector((state: RootState) => state.properties);

  // API URL for images
  const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
  const [heroImage, setHeroImage] = useState<string | null>(null);

  // Helper functions for property images
  const getPropertyImage = (property: any) => {
    if (property.images && property.images.length > 0) {
      // If image starts with http, use it directly, otherwise prepend API_URL
      const imageUrl = property.images[0];
      return imageUrl.startsWith('http') ? imageUrl : `${API_URL}${imageUrl}`;
    }
    return getDefaultPropertyImage(property.propertyType);
  };

  const getDefaultPropertyImage = (propertyType: string) => {
    const defaultImages: { [key: string]: string } = {
      // Residential
      "Apartment": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Villa": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Penthouse": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Studio": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Townhouse": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Duplex": "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Hotel Apartment": "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Chalet": "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Compound Villa": "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Standalone Villa": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      // Commercial
      "Office": "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Shop": "https://images.unsplash.com/photo-1555636222-cae831e670b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Showroom": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Retail Shop": "https://images.unsplash.com/photo-1555636222-cae831e670b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Commercial Villa": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Restaurant": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Whole Building": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Hotel": "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      // Industrial
      "Warehouse": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Factory": "https://images.unsplash.com/photo-1513828583688-c52646db42da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Labor Camp": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Industrial Land": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      // Land
      "Land": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Land Plot": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Residential Land": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Commercial Land": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    };
    return defaultImages[propertyType] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  };

  // Helper function to get text from multilingual field
  const getText = (field: any, defaultValue: string = '') => {
    if (typeof field === 'string') return field;
    if (field && typeof field === 'object') return field.en || field.ar || defaultValue;
    return defaultValue;
  };

  // Helper function to get array from multilingual field
  const getArray = (field: any): string[] => {
    if (Array.isArray(field)) return field;
    if (field && typeof field === 'object') return field.en || field.ar || [];
    return [];
  };

  // Filter states
  const [activeTab, setActiveTab] = useState<'sale' | 'rent' | 'off-plan'>('sale');
  const [filters, setFilters] = useState({
    location: 'all',
    category: 'all',
    propertyType: 'all',
    bedrooms: 'all',
    priceRange: 'all',
    sortBy: 'newest'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Transform backend properties to match frontend format - ONLY Qatar properties
  const allProperties = properties
    .filter((property: any) => {
      const country = (property.country || '').toLowerCase();
      return country === 'qatar' || country === '';
    })
    .map((property: any) => ({
      ...property,
      title: getText(property.title),
      description: getText(property.description),
      location: getText(property.location),
      features: getArray(property.features),
      listingType: property.type, // Map 'type' to 'listingType' for filtering (sale, rent, off-plan)
      propertyCategory: property.category || 'residential', // Property category (residential, commercial, industrial, land)
      priceText: `QAR ${property.price.toLocaleString()}`,
      dateAdded: property.createdAt,
      agent: typeof property.agent === 'string' ? 'Agent' : property.agent?.name || 'Agent',
      agentPhone: typeof property.agent === 'string' ? '' : property.agent?.phone || ''
    }));

  // Handle URL search parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category') as 'sale' | 'rent' | 'off-plan' | null;
    const locationParam = searchParams.get('location');

    if (category && ['sale', 'rent', 'off-plan'].includes(category)) {
      setActiveTab(category);
    }

    if (locationParam) {
      setFilters(prev => ({
        ...prev,
        location: locationParam
      }));
    }

    dispatch(fetchProperties({}));

    // Try to fetch a page-level hero image for the properties page (portfolio section)
    const fetchPortfolioHero = async () => {
      try {
        const res = await fetch(`${API_URL}/api/content/section/portfolio?active=true`);
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const item = data[0];
          const image = item.backgroundImage || item.image || '';
          if (image) setHeroImage(image.startsWith('http') ? image : `${API_URL}${image}`);
        }
      } catch (e) {
        // ignore
      }
    };

    fetchPortfolioHero();
  }, [dispatch, location.search]);

  // Filter properties based on active tab and filters
  const filteredProperties = allProperties.filter(property => {
    if (property.listingType !== activeTab) return false;

    // Location filtering for Qatar areas
    if (filters.location !== 'all') {
      const searchLocation = filters.location.toLowerCase();
      const propertyLocation = property.location.toLowerCase();

      if (!propertyLocation.includes(searchLocation)) return false;
    }

    // Filter by property category (residential, commercial, industrial, land)
    if (filters.category !== 'all' && property.propertyCategory !== filters.category) return false;

    if (filters.propertyType !== 'all' && property.propertyType !== filters.propertyType) return false;
    if (filters.bedrooms !== 'all') {
      const bedroomFilter = parseInt(filters.bedrooms);
      if (bedroomFilter === 4 && property.bedrooms < 4) return false;
      if (bedroomFilter !== 4 && property.bedrooms !== bedroomFilter) return false;
    }

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      case 'oldest':
        return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
      default:
        return 0;
    }
  });

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="properties-page">
      {/* Enhanced Hero Section */}
      <section className="properties-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <img
            src={heroImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'}
            alt="Properties"
            className="hero-bg-image"
          />
        </div>
        <div className="hero-content">
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '2.5rem' }}>🇶🇦</span>
              <h1 className="hero-title" style={{ margin: 0 }}>Qatar Properties</h1>
            </div>
            <p className="hero-subtitle">
              Discover exceptional real estate opportunities in Qatar
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section section-light">
        <div className="container">
          {/* Property Type Tabs */}
          <div className="property-tabs" style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '2rem',
            borderBottom: '2px solid var(--border-light)'
          }}>
            <button
              className={`tab-button ${activeTab === 'sale' ? 'active' : ''}`}
              onClick={() => setActiveTab('sale')}
              style={{
                padding: '1rem 2rem',
                border: 'none',
                background: 'transparent',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: activeTab === 'sale' ? 'var(--luxury-burgundy)' : 'var(--text-light)',
                borderBottom: activeTab === 'sale' ? '3px solid var(--matte-gold)' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              For Sale ({allProperties.filter(p => p.category === 'sale').length})
            </button>
            <button
              className={`tab-button ${activeTab === 'rent' ? 'active' : ''}`}
              onClick={() => setActiveTab('rent')}
              style={{
                padding: '1rem 2rem',
                border: 'none',
                background: 'transparent',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: activeTab === 'rent' ? 'var(--luxury-burgundy)' : 'var(--text-light)',
                borderBottom: activeTab === 'rent' ? '3px solid var(--matte-gold)' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              For Rent ({allProperties.filter(p => p.category === 'rent').length})
            </button>
            <button
              className={`tab-button ${activeTab === 'off-plan' ? 'active' : ''}`}
              onClick={() => setActiveTab('off-plan')}
              style={{
                padding: '1rem 2rem',
                border: 'none',
                background: 'transparent',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: activeTab === 'off-plan' ? 'var(--luxury-burgundy)' : 'var(--text-light)',
                borderBottom: activeTab === 'off-plan' ? '3px solid var(--matte-gold)' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Off-Plan ({allProperties.filter(p => p.category === 'off-plan').length})
            </button>
          </div>

          {/* Filters Bar */}
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
              <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--luxury-burgundy)', marginBottom: '0.5rem', display: 'block' }}>Location</label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                style={{
                  padding: '0.7rem',
                  border: '2px solid var(--border-light)',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  minWidth: '160px'
                }}
              >
                <option value="all">All Qatar Locations</option>
                <option value="Lusail">Lusail</option>
                <option value="The Pearl">The Pearl</option>
                <option value="West Bay">West Bay</option>
                <option value="Downtown Doha">Downtown Doha</option>
                <option value="Al Wakrah">Al Wakrah</option>
                <option value="Al Khor">Al Khor</option>
                <option value="Duhail">Duhail</option>
                <option value="Al Sadd">Al Sadd</option>
                <option value="Bin Mahmoud">Bin Mahmoud</option>
                <option value="Old Airport">Old Airport</option>
                <option value="Msheireb">Msheireb</option>
                <option value="Fox Hills">Fox Hills</option>
              </select>
            </div>

            <div className="filter-group">
              <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--luxury-burgundy)', marginBottom: '0.5rem', display: 'block' }}>Category</label>
              <select
                value={filters.category}
                onChange={(e) => {
                  handleFilterChange('category', e.target.value);
                  handleFilterChange('propertyType', 'all'); // Reset property type when category changes
                }}
                style={{
                  padding: '0.7rem',
                  border: '2px solid var(--border-light)',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  minWidth: '140px'
                }}
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
                style={{
                  padding: '0.7rem',
                  border: '2px solid var(--border-light)',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  minWidth: '140px'
                }}
              >
                <option value="all">All Types</option>
                {(filters.category === 'all' || filters.category === 'residential') && (
                  <>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Studio">Studio</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Duplex">Duplex</option>
                    <option value="Hotel Apartment">Hotel Apartment</option>
                    <option value="Chalet">Chalet</option>
                    <option value="Compound Villa">Compound Villa</option>
                    <option value="Standalone Villa">Standalone Villa</option>
                  </>
                )}
                {(filters.category === 'all' || filters.category === 'commercial') && (
                  <>
                    <option value="Office">Office</option>
                    <option value="Shop">Shop</option>
                    <option value="Showroom">Showroom</option>
                    <option value="Retail Shop">Retail Shop</option>
                    <option value="Commercial Villa">Commercial Villa</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Whole Building">Whole Building</option>
                    <option value="Hotel">Hotel</option>
                  </>
                )}
                {(filters.category === 'all' || filters.category === 'industrial') && (
                  <>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Factory">Factory</option>
                    <option value="Labor Camp">Labor Camp</option>
                    <option value="Industrial Land">Industrial Land</option>
                  </>
                )}
                {(filters.category === 'all' || filters.category === 'land') && (
                  <>
                    <option value="Land">Land</option>
                    <option value="Land Plot">Land Plot</option>
                    <option value="Residential Land">Residential Land</option>
                    <option value="Commercial Land">Commercial Land</option>
                  </>
                )}
              </select>
            </div>

            <div className="filter-group">
              <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--luxury-burgundy)', marginBottom: '0.5rem', display: 'block' }}>Bedrooms</label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                style={{
                  padding: '0.7rem',
                  border: '2px solid var(--border-light)',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  minWidth: '120px'
                }}
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
              <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--luxury-burgundy)', marginBottom: '0.5rem', display: 'block' }}>Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                style={{
                  padding: '0.7rem',
                  border: '2px solid var(--border-light)',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  minWidth: '140px'
                }}
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
          <div className="results-summary" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            padding: '1rem 0',
            borderBottom: '1px solid var(--border-light)'
          }}>
            <h3 style={{ color: 'var(--luxury-burgundy)', margin: 0 }}>
              {filteredProperties.length} Properties {activeTab === 'sale' ? 'for Sale' : activeTab === 'rent' ? 'for Rent' : 'Off-Plan'}
            </h3>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
              Showing {filteredProperties.length} of {allProperties.filter(p => p.category === activeTab).length} properties
            </div>
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
              <div style={{ fontSize: '1.5rem', color: 'var(--luxury-burgundy)', marginBottom: '1rem' }}>No properties found</div>
              <div style={{ fontSize: '1rem', color: 'var(--text-light)' }}>Try adjusting your filters or check back later for new listings.</div>
            </div>
          )}

          {/* Properties Grid/List */}
          {!loading && !error && filteredProperties.length > 0 && (
            <div className={`properties-container ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
              {viewMode === 'grid' ? (
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
                      <div className={`property-badge ${property.verified ? 'verified' : 'pending'}`}>
                        {property.verified ? '✓ Verified' : 'Pending'}
                      </div>
                      <div className={`property-category-badge ${property.listingType}`}>
                        {property.listingType === 'off-plan' ? 'Off-Plan' : `For ${property.listingType}`}
                      </div>
                      {property.listingType === 'off-plan' && (
                        <div style={{
                          position: 'absolute',
                          bottom: '1rem',
                          left: '1rem',
                          background: 'var(--luxury-burgundy)',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: '500'
                        }}>
                          Ready: {property.completionDate}
                        </div>
                      )}
                    </div>
                    <div className="property-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.3rem' }}>{property.title}</h3>
                        <button style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '1.2rem',
                          cursor: 'pointer',
                          color: 'var(--text-light)'
                        }}>
                          ♡
                        </button>
                      </div>

                      <div className="property-location" style={{ marginBottom: '1rem' }}>
                        📍 {property.location}, {property.country}
                      </div>

                      <div className="property-price" style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--matte-gold)', marginBottom: '1rem' }}>
                        {property.priceText}
                      </div>

                      <div className="property-details" style={{ marginBottom: '1rem' }}>
                        <span>🛏️ {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bed`}</span>
                        <span>🚿 {property.bathrooms} bath</span>
                        <span>📐 {property.area} sqm</span>
                        <span>📅 {property.yearBuilt}</span>
                      </div>

                      <p style={{ color: 'var(--text-light)', marginBottom: '1rem', lineHeight: '1.5', fontSize: '0.95rem' }}>
                        {property.description}
                      </p>

                      <div className="property-features" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {property.features.slice(0, 4).map((feature: string, index: number) => (
                            <span
                              key={index}
                              style={{
                                background: 'var(--off-white)',
                                color: 'var(--luxury-burgundy)',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '15px',
                                fontSize: '0.8rem',
                                border: '1px solid var(--border-light)'
                              }}
                            >
                              {feature}
                            </span>
                          ))}
                          {property.features.length > 4 && (
                            <span style={{
                              color: 'var(--text-light)',
                              fontSize: '0.8rem',
                              padding: '0.2rem 0.6rem'
                            }}>
                              +{property.features.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      {property.listingType === 'off-plan' && (
                        <div style={{
                          background: 'var(--off-white)',
                          padding: '1rem',
                          borderRadius: '8px',
                          marginBottom: '1rem',
                          border: '1px solid var(--border-light)'
                        }}>
                          <div style={{ fontSize: '0.9rem', color: 'var(--luxury-burgundy)', fontWeight: '600', marginBottom: '0.5rem' }}>
                            Payment Plan
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                            {property.paymentPlan}
                          </div>
                        </div>
                      )}

                      <div className="agent-info" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem 0',
                        borderTop: '1px solid var(--border-light)',
                        marginBottom: '1rem'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--luxury-burgundy)' }}>
                            {property.agent}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                            {property.agentPhone}
                          </div>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                          Listed: {new Date(property.dateAdded).toLocaleDateString()}
                        </div>
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
            ) : (
              // List View
              <div className="properties-list">
                {filteredProperties.map((property) => (
                  <div key={property._id} className="property-list-item" style={{
                    display: 'flex',
                    background: 'var(--pure-white)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '1.5rem',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                    border: '1px solid var(--border-light)',
                    transition: 'all 0.3s ease'
                  }}>
                    <div className="list-property-image" style={{
                      width: '300px',
                      height: '200px',
                      background: 'linear-gradient(135deg, var(--luxury-burgundy), var(--matte-gold))',
                      position: 'relative',
                      flexShrink: 0
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        background: property.verified ? 'var(--matte-gold)' : 'var(--charcoal-gray)',
                        color: property.verified ? 'var(--luxury-burgundy)' : 'white',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {property.verified ? '✓ Verified' : 'Pending'}
                      </div>
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        textTransform: 'capitalize'
                      }}>
                        {property.listingType === 'off-plan' ? 'Off-Plan' : `For ${property.listingType}`}
                      </div>
                    </div>

                    <div className="list-property-content" style={{
                      flex: 1,
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--luxury-burgundy)' }}>{property.title}</h3>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            color: 'var(--text-light)'
                          }}>
                            ♡
                          </button>
                          <button style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            color: 'var(--text-light)'
                          }}>
                            ⋯
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div className="property-location" style={{ color: 'var(--text-light)' }}>
                          📍 {property.location}, {property.country}
                        </div>
                        <div className="property-price" style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--matte-gold)' }}>
                          {property.priceText}
                        </div>
                      </div>

                      <div className="property-details" style={{ marginBottom: '1rem', gap: '1.5rem' }}>
                        <span>🛏️ {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bed`}</span>
                        <span>🚿 {property.bathrooms} bath</span>
                        <span>📐 {property.area} sqm</span>
                        <span>📅 Built {property.yearBuilt}</span>
                      </div>

                      <p style={{ color: 'var(--text-light)', marginBottom: '1rem', lineHeight: '1.6', flex: 1 }}>
                        {property.description}
                      </p>

                      <div className="property-features" style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {property.features.slice(0, 6).map((feature: string, index: number) => (
                            <span
                              key={index}
                              style={{
                                background: 'var(--off-white)',
                                color: 'var(--luxury-burgundy)',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '15px',
                                fontSize: '0.8rem',
                                border: '1px solid var(--border-light)'
                              }}
                            >
                              {feature}
                            </span>
                          ))}
                          {property.features.length > 6 && (
                            <span style={{
                              color: 'var(--text-light)',
                              fontSize: '0.8rem',
                              padding: '0.2rem 0.6rem'
                            }}>
                              +{property.features.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="agent-info">
                          <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--luxury-burgundy)' }}>
                            {property.agent}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                            Listed: {new Date(property.dateAdded).toLocaleDateString()}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-primary"
                            style={{ padding: '0.7rem 1.5rem', fontSize: '0.9rem' }}
                            onClick={() => navigate(`/property/${property._id}`)}
                          >
                            View Details
                          </button>
                          <button className="btn btn-secondary" style={{ padding: '0.7rem 1.5rem', fontSize: '0.9rem' }}>
                            Contact
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Properties;
