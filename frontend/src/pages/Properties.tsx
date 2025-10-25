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

  // Filter states
  const [activeTab, setActiveTab] = useState<'sale' | 'rent' | 'off-plan'>('sale');
  const [filters, setFilters] = useState({
    location: 'all',
    propertyType: 'all',
    bedrooms: 'all',
    priceRange: 'all',
    sortBy: 'newest'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Enhanced property data with rent, sale, and off-plan categories
  const allProperties = [
    // SALE PROPERTIES
    {
      _id: "1",
      title: "Lusail Marina Heights",
      location: "Lusail",
      country: "Qatar",
      price: 850000,
      priceText: "QAR 3,100,000",
      category: "sale" as const,
      propertyType: "Apartment",
      bedrooms: 3,
      bathrooms: 3,
      area: 180,
      yearBuilt: 2023,
      description: "Smart waterfront luxury residences with panoramic marina views and world-class amenities.",
      features: ["Marina Views", "Smart Home Technology", "Concierge Service", "Private Beach Access", "Gym", "Swimming Pool"],
      images: ["lusail1.jpg", "lusail2.jpg", "lusail3.jpg"],
      agent: "Sarah Al-Mahmoud",
      agentPhone: "+974 5555 1234",
      dateAdded: "2024-01-15",
      verified: true,
      type: "sale" as const,
      status: "available" as const,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z"
    },
    {
      _id: "2",
      title: "Porto Arabia Penthouse",
      location: "The Pearl",
      country: "Qatar",
      price: 1200000,
      priceText: "QAR 4,370,000",
      category: "sale" as const,
      propertyType: "Penthouse",
      bedrooms: 4,
      bathrooms: 5,
      area: 320,
      yearBuilt: 2022,
      description: "Exclusive sea-view penthouse with private elevator and rooftop terrace.",
      features: ["Sea Views", "Premium Finishes", "Private Elevator", "Rooftop Terrace", "Maid's Room", "Study Room"],
      images: ["pearl1.jpg", "pearl2.jpg", "pearl3.jpg"],
      agent: "Ahmed Hassan",
      agentPhone: "+974 5555 2345",
      dateAdded: "2024-01-10",
      verified: true
    },
    {
      _id: "3",
      title: "Palm Jumeirah Villa",
      location: "Palm Jumeirah",
      country: "UAE",
      price: 2500000,
      priceText: "AED 9,200,000",
      category: "sale" as const,
      propertyType: "Villa",
      bedrooms: 5,
      bathrooms: 6,
      area: 450,
      yearBuilt: 2021,
      description: "Iconic beachfront villa with private beach access and stunning Arabian Gulf views.",
      features: ["Beach Access", "Private Pool", "Garden", "Maid's Room", "Driver's Room", "Garage"],
      images: ["palm1.jpg", "palm2.jpg", "palm3.jpg"],
      agent: "Maria Rodriguez",
      agentPhone: "+971 50 123 4567",
      dateAdded: "2024-01-08",
      verified: true
    },
    {
      _id: "4",
      title: "New Cairo Compound Villa",
      location: "New Cairo",
      country: "Egypt",
      price: 450000,
      priceText: "EGP 13,950,000",
      category: "sale" as const,
      propertyType: "Villa",
      bedrooms: 4,
      bathrooms: 4,
      area: 380,
      yearBuilt: 2023,
      description: "Premium gated community villa with modern design and comprehensive amenities.",
      features: ["Gated Community", "Garden", "Garage", "Security", "Club House", "Kids Area"],
      images: ["cairo1.jpg", "cairo2.jpg", "cairo3.jpg"],
      agent: "Omar Farouk",
      agentPhone: "+20 100 123 4567",
      dateAdded: "2024-01-05",
      verified: true
    },

    // RENT PROPERTIES
    {
      _id: "5",
      title: "West Bay Executive Apartment",
      location: "West Bay",
      country: "Qatar",
      price: 12000,
      priceText: "QAR 12,000/month",
      category: "rent" as const,
      propertyType: "Apartment",
      bedrooms: 2,
      bathrooms: 2,
      area: 120,
      yearBuilt: 2020,
      description: "Fully furnished executive apartment in the heart of Doha's.",
      features: ["Furnished", "City Views", "Gym", "Swimming Pool", "Parking", "24/7 Security"],
      images: ["westbay1.jpg", "westbay2.jpg", "westbay3.jpg"],
      agent: "Fatima Al-Zahra",
      agentPhone: "+974 5555 3456",
      dateAdded: "2024-01-20",
      verified: true
    },
    {
      _id: "6",
      title: "Lusail Studio",
      location: "Lusail",
      country: "UAE",
      price: 4500,
      priceText: "AED 4,500/month",
      category: "rent" as const,
      propertyType: "Studio",
      bedrooms: 0,
      bathrooms: 1,
      area: 45,
      yearBuilt: 2019,
      description: "Modern studio apartment with marina views and premium amenities.",
      features: ["Marina Views", "Furnished", "Gym", "Pool", "Metro Access", "Balcony"],
      images: ["marina1.jpg", "marina2.jpg", "marina3.jpg"],
      agent: "John Smith",
      agentPhone: "+971 50 234 5678",
      dateAdded: "2024-01-18",
      verified: true
    },
    {
      _id: "7",
      title: "Zamalak Luxury Apartment",
      location: "Zamalek",
      country: "Egypt",
      price: 1200,
      priceText: "EGP 37,200/month",
      category: "rent" as const,
      propertyType: "Apartment",
      bedrooms: 3,
      bathrooms: 2,
      area: 150,
      yearBuilt: 2018,
      description: "Elegant apartment in prestigious Zamalek with Nile views.",
      features: ["Nile Views", "Balcony", "Parking", "Elevator", "Central AC", "Furnished"],
      images: ["zamalek1.jpg", "zamalek2.jpg", "zamalek3.jpg"],
      agent: "Yasmin Nour",
      agentPhone: "+20 100 234 5678",
      dateAdded: "2024-01-16",
      verified: true
    },

    // OFF-PLAN PROPERTIES
    {
      _id: "8",
      title: "Lusail City Towers",
      location: "Lusail",
      country: "Qatar",
      price: 750000,
      priceText: "Starting QAR 2,730,000",
      category: "off-plan" as const,
      propertyType: "Apartment",
      bedrooms: 2,
      bathrooms: 2,
      area: 140,
      yearBuilt: 2026,
      description: "Ultra-modern residential towers in the heart of Lusail City with smart home features.",
      features: ["Smart Home", "Gym", "Pool", "Retail", "Metro Access", "Green Spaces"],
      images: ["lusail-tower1.jpg", "lusail-tower2.jpg", "lusail-tower3.jpg"],
      agent: "Khalid Al-Thani",
      agentPhone: "+974 5555 4567",
      dateAdded: "2024-01-12",
      verified: true,
      completionDate: "Q4 2026",
      paymentPlan: "20% Down Payment, 80% on Completion"
    },
    {
      _id: "9",
      title: "Lusail Creek Harbour",
      location: "Creek Harbour",
      country: "UAE",
      price: 890000,
      priceText: "Starting AED 3,270,000",
      category: "off-plan" as const,
      propertyType: "Apartment",
      bedrooms: 1,
      bathrooms: 1,
      area: 75,
      yearBuilt: 2027,
      description: "Waterfront living with iconic Lusail skyline views and world-class amenities.",
      features: ["Creek Views", "Retail", "Marina", "Parks", "Metro", "Beach Access"],
      images: ["creek1.jpg", "creek2.jpg", "creek3.jpg"],
      agent: "Elena Petrov",
      agentPhone: "+971 50 345 6789",
      dateAdded: "2024-01-14",
      verified: true,
      completionDate: "Q2 2027",
      paymentPlan: "10% Down Payment, 90% During Construction"
    },
    {
      _id: "10",
      title: "New Administrative Capital",
      location: "New Capital",
      country: "Egypt",
      price: 320000,
      priceText: "Starting EGP 9,920,000",
      category: "off-plan" as const,
      propertyType: "Apartment",
      bedrooms: 3,
      bathrooms: 2,
      area: 165,
      yearBuilt: 2025,
      description: "Modern apartments in Egypt's new administrative capital with government district proximity.",
      features: ["Government District", "Green Spaces", "Shopping", "Schools", "Metro", "Parking"],
      images: ["newcapital1.jpg", "newcapital2.jpg", "newcapital3.jpg"],
      agent: "Amr Mostafa",
      agentPhone: "+20 100 345 6789",
      dateAdded: "2024-01-11",
      verified: true,
      completionDate: "Q3 2025",
      paymentPlan: "15% Down Payment, 85% Over 5 Years"
    }
  ];

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
  }, [dispatch, location.search]);

  // Filter properties based on active tab and filters
  const filteredProperties = allProperties.filter(property => {
    if (property.category !== activeTab) return false;

    // Enhanced location filtering - search in both location and country
    if (filters.location !== 'all') {
      const searchLocation = filters.location.toLowerCase();
      const propertyLocation = property.location.toLowerCase();
      const propertyCountry = property.country.toLowerCase();

      const locationMatch = propertyLocation.includes(searchLocation) ||
                           propertyCountry.includes(searchLocation) ||
                           searchLocation.includes(propertyLocation) ||
                           searchLocation.includes(propertyCountry);

      if (!locationMatch) return false;
    }

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

  const formatPrice = (price: number, category: string) => {
    if (category === 'rent') {
      return `${price.toLocaleString()}/month`;
    }
    return price.toLocaleString();
  };

  return (
    <div className="properties-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect Property</h1>
          <p className="tagline">Discover Premium Real Estate Opportunities</p>
          <p>
            Browse through our extensive collection of properties for sale, rent, and off-plan
            developments across Qatar, UAE, Egypt, and beyond.
          </p>
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
                  minWidth: '140px'
                }}
              >
                <option value="all">All Locations</option>
                <option value="Qatar">Qatar</option>
                <option value="UAE">UAE</option>
                <option value="Egypt">Egypt</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="France">France</option>
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
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Studio">Studio</option>
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

          {/* Properties Grid/List */}
          <div className={`properties-container ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
            {viewMode === 'grid' ? (
              <div className="properties-grid">
                {filteredProperties.map((property) => (
                  <div key={property._id} className="property-card">
                    <div className="property-image">
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
                        {property.category === 'off-plan' ? 'Off-Plan' : `For ${property.category}`}
                      </div>
                      {property.category === 'off-plan' && (
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
                          {property.features.slice(0, 4).map((feature, index) => (
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

                      {property.category === 'off-plan' && (
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

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-primary"
                          style={{ flex: 1, padding: '0.8rem', fontSize: '0.9rem' }}
                          onClick={() => navigate(`/property/${property._id}`)}
                        >
                          View Details
                        </button>
                        <button className="btn btn-secondary" style={{ flex: 1, padding: '0.8rem', fontSize: '0.9rem' }}>
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
                        {property.category === 'off-plan' ? 'Off-Plan' : `For ${property.category}`}
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
                          {property.features.slice(0, 6).map((feature, index) => (
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

          {/* No Results */}
          {filteredProperties.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'var(--pure-white)',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏠</div>
              <h3 style={{ color: 'var(--luxury-burgundy)', marginBottom: '1rem' }}>No Properties Found</h3>
              <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
                Try adjusting your filters to see more properties.
              </p>
              <button
                onClick={() => setFilters({
                  location: 'all',
                  propertyType: 'all',
                  bedrooms: 'all',
                  priceRange: 'all',
                  sortBy: 'newest'
                })}
                className="btn btn-primary"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {loading && (
            <div className="loading">
              <p>Loading additional properties...</p>
            </div>
          )}

          {error && (
            <div className="error">
              <p>Error loading properties: {error}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Properties;
