import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Property } from '../store/slices/propertySlice';

// Mock property data
const mockProperties: { [key: string]: Property } = {
  "1": {
    _id: "1",
    title: "Lusail Marina Heights - Luxury Waterfront Apartment",
    description: "Experience unparalleled luxury in this stunning 3-bedroom apartment at Lusail Marina Heights. This smart home features panoramic marina views, premium finishes, and access to world-class amenities including private beach access, concierge service, and state-of-the-art fitness facilities. Located in Qatar's most prestigious waterfront development.",
    price: 3100000,
    location: "Lusail Marina, Lusail City",
    country: "Qatar",
    bedrooms: 3,
    bathrooms: 3,
    area: 180,
    yearBuilt: 2023,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2053&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    ],
    type: "sale",
    status: "available",
    propertyType: "Apartment",
    features: ["Marina Views", "Smart Home Technology", "Concierge Service", "Private Beach Access", "Gym", "Swimming Pool", "24/7 Security", "Covered Parking", "Balcony", "Built-in Wardrobes"],
    agent: "Sarah Al-Mahmoud",
    agentPhone: "+974 5555 1234",
    verified: true,
    createdAt: "2024-01-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z"
  },
  "2": {
    _id: "2",
    title: "West Bay Executive Office Space",
    description: "Prime commercial office space in the heart of West Bay's financial district. This modern office features floor-to-ceiling windows with stunning city and sea views, premium finishes, and flexible layout options. Perfect for multinational corporations and growing businesses seeking a prestigious address in Doha's business hub.",
    price: 15000,
    location: "West Bay, Doha",
    country: "Qatar",
    bedrooms: 0,
    bathrooms: 2,
    area: 250,
    yearBuilt: 2022,
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
    ],
    type: "rent",
    status: "available",
    propertyType: "Office",
    features: ["City Views", "Sea Views", "24/7 Access", "High-Speed Internet", "Conference Rooms", "Reception Area", "Parking Spaces", "Security System"],
    agent: "Ahmed Hassan",
    agentPhone: "+974 5555 5678",
    verified: true,
    createdAt: "2024-01-10T00:00:00.000Z",
    updatedAt: "2024-01-10T00:00:00.000Z"
  },
  "3": {
    _id: "3",
    title: "The Pearl Penthouse - Ultimate Luxury Living",
    description: "Discover the pinnacle of luxury living in this extraordinary penthouse at The Pearl-Qatar. This magnificent 4-bedroom residence spans two levels and features a private rooftop terrace with 360-degree views, private elevator access, and the finest imported materials throughout. An exclusive lifestyle awaits in Qatar's most coveted address.",
    price: 8500000,
    location: "The Pearl-Qatar, Doha",
    country: "Qatar",
    bedrooms: 4,
    bathrooms: 5,
    area: 450,
    yearBuilt: 2021,
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    ],
    type: "sale",
    status: "available",
    propertyType: "Penthouse",
    features: ["Rooftop Terrace", "Private Elevator", "360° Views", "Imported Materials", "Smart Home", "Wine Cellar", "Home Theater", "Maid's Room", "Driver's Room", "Private Pool"],
    agent: "Fatima Al-Zahra",
    agentPhone: "+974 5555 9012",
    verified: true,
    createdAt: "2024-01-05T00:00:00.000Z",
    updatedAt: "2024-01-05T00:00:00.000Z"
  },
  "4": {
    _id: "4",
    title: "Al Rayyan Family Villa - Modern Comfort",
    description: "Spacious family villa in the prestigious Al Rayyan district. This contemporary 5-bedroom home features an open-plan design, private garden, swimming pool, and maid's quarters. Perfect for families seeking comfort and privacy in a well-established neighborhood with excellent schools and amenities nearby.",
    price: 4200000,
    location: "Al Rayyan, Doha",
    country: "Qatar",
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    yearBuilt: 2020,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2053&q=80"
    ],
    type: "sale",
    status: "available",
    propertyType: "Villa",
    features: ["Private Garden", "Swimming Pool", "Maid's Room", "Driver's Room", "Covered Parking", "Security System", "Central AC", "Built-in Kitchen"],
    agent: "Mohammed Al-Thani",
    agentPhone: "+974 5555 3456",
    verified: true,
    createdAt: "2024-01-12T00:00:00.000Z",
    updatedAt: "2024-01-12T00:00:00.000Z"
  },
  "5": {
    _id: "5",
    title: "Msheireb Downtown Studio - Modern Living",
    description: "Contemporary studio apartment in the heart of Msheireb Downtown Doha. This smart home features premium finishes, integrated appliances, and access to world-class amenities. Walking distance to museums, restaurants, and the Doha Metro. Perfect for young professionals and investors.",
    price: 8500,
    location: "Msheireb Downtown, Doha",
    country: "Qatar",
    bedrooms: 0,
    bathrooms: 1,
    area: 45,
    yearBuilt: 2023,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    ],
    type: "rent",
    status: "available",
    propertyType: "Studio",
    features: ["Smart Home", "Premium Finishes", "Integrated Appliances", "Metro Access", "24/7 Concierge", "Gym", "Rooftop Terrace"],
    agent: "Layla Ibrahim",
    agentPhone: "+974 5555 7890",
    verified: true,
    createdAt: "2024-01-08T00:00:00.000Z",
    updatedAt: "2024-01-08T00:00:00.000Z"
  }
};

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Use mock data instead of Redux state
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Simulate API loading delay
    setLoading(true);
    setError(null);

    setTimeout(() => {
      if (id && mockProperties[id]) {
        setProperty(mockProperties[id]);
        setLoading(false);
      } else {
        setProperty(null);
        setError("Property not found");
        setLoading(false);
      }
    }, 500); // Simulate 500ms loading time

    return () => {
      setProperty(null);
    };
  }, [id]);

  const handlePrevImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  if (loading) {
    return (
      <div className="loading-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        flexDirection: 'column'
      }}>
        <div className="loading-spinner" style={{
          width: '50px',
          height: '50px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid var(--luxury-burgundy)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-light)' }}>
          {t('common.loading')}...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <h2 style={{ color: 'var(--luxury-burgundy)', marginBottom: '1rem' }}>
          {t('errors.somethingWentWrong')}
        </h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
          {error}
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/properties')}
        >
          {t('common.back')} to Properties
        </button>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="not-found-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <h2 style={{ color: 'var(--luxury-burgundy)', marginBottom: '1rem' }}>
          Property Not Found
        </h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
          The property you're looking for doesn't exist or has been removed.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/properties')}
        >
          {t('common.back')} to Properties
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{property.title} - N&H Real Estate</title>
        <meta name="description" content={property.description} />
        <meta property="og:title" content={`${property.title} - N&H Real Estate`} />
        <meta property="og:description" content={property.description} />
        {property.images && property.images.length > 0 && (
          <meta property="og:image" content={property.images[0]} />
        )}
      </Helmet>

      <div className="property-detail-modern">
        {/* Hero Section with Same Style as Other Pages */}
        <section className="property-hero-section visual-enhanced">
          <div className="hero-background">
            <div className="hero-overlay"></div>
            {property.images && property.images.length > 0 && (
              <img
                src={property.images[currentImageIndex]}
                alt={property.title}
                className="hero-bg-image"
              />
            )}
          </div>

          <div className="hero-content">
            <div className="container">
              <div className="hero-text">
                <div className="property-status-badge">
                  {property.type === 'sale' ? 'For Sale' : property.type === 'rent' ? 'For Rent' : 'Off Plan'}
                </div>
                <h1 className="hero-title">{property.title}</h1>
                <div className="property-location-hero">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>{property.location}</span>
                </div>
                <div className="property-price-hero">
                  QAR {property.price?.toLocaleString()}
                  {property.type === 'rent' && <span className="price-period">/month</span>}
                </div>
              </div>

              {/* Image Navigation Controls */}
              {property.images && property.images.length > 1 && (
                <div className="image-navigation-controls">
                  <button className="image-nav-btn prev-btn" onClick={handlePrevImage}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <div className="image-counter">
                    {currentImageIndex + 1} / {property.images?.length || 1}
                  </div>
                  <button className="image-nav-btn next-btn" onClick={handleNextImage}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Thumbnail Gallery Section */}
        {property.images && property.images.length > 1 && (
          <section className="property-gallery-section">
            <div className="container">
              <div className="property-thumbnails">
                {property.images.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img src={image} alt={`${property.title} ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Property Information Section */}
        <section className="property-info-section">
          <div className="container">
            <div className="property-info-grid">
              {/* Left Column - Property Details */}
              <div className="property-details-column">
                {/* Breadcrumb */}
                <nav className="breadcrumb-modern">
                  <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
                  <span className="breadcrumb-separator">›</span>
                  <span onClick={() => navigate('/properties')} className="breadcrumb-link">Properties</span>
                  <span className="breadcrumb-separator">›</span>
                  <span className="breadcrumb-current">{property.title}</span>
                </nav>

                {/* Property Header */}
                <div className="property-header-modern">
                  <div className="property-title-section">
                    <h1 className="property-title-modern">{property.title}</h1>
                    <div className="property-location-modern">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span>{property.location}</span>
                    </div>
                  </div>

                  <div className="property-actions">
                    <button className="action-btn favorite-btn">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.1208 20.84 4.61V4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button className="action-btn share-btn">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="16,6 12,2 8,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="12" y1="2" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Property Price */}
                <div className="property-price-section">
                  <div className="price-main">
                    QAR {property.price?.toLocaleString()}
                    {property.type === 'rent' && <span className="price-period">/month</span>}
                  </div>
                  {property.area && (
                    <div className="price-per-sqm">
                      QAR {Math.round(property.price / property.area).toLocaleString()} per sqm
                    </div>
                  )}
                </div>

                {/* Property Features Grid */}
                <div className="property-features-grid">
                  <div className="feature-item">
                    <div className="feature-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2"/>
                        <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div className="feature-content">
                      <div className="feature-value">{property.bedrooms === 0 ? 'Studio' : property.bedrooms}</div>
                      <div className="feature-label">{property.bedrooms === 0 ? '' : property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</div>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 6L20 6C20.5523 6 21 6.44772 21 7V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6L9 6Z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M9 6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div className="feature-content">
                      <div className="feature-value">{property.bathrooms}</div>
                      <div className="feature-label">{property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</div>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M9 9H15V15H9V9Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div className="feature-content">
                      <div className="feature-value">{property.area}</div>
                      <div className="feature-label">sqm</div>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M3 21L21 21M5 21V7L13 2L21 7V21M9 9V13M15 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="feature-content">
                      <div className="feature-value">{property.propertyType || 'Apartment'}</div>
                      <div className="feature-label">Property Type</div>
                    </div>
                  </div>
                </div>

                {/* Property Description */}
                <div className="property-description-section">
                  <h2 className="section-title">Description</h2>
                  <div className="description-content">
                    <p>{property.description}</p>
                  </div>
                </div>

                {/* Property Features */}
                {property.features && property.features.length > 0 && (
                  <div className="property-amenities-section">
                    <h2 className="section-title">Features & Amenities</h2>
                    <div className="amenities-grid">
                      {property.features.map((feature, index) => (
                        <div key={index} className="amenity-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Contact & Agent Info */}
              <div className="property-sidebar">
                {/* Contact Form Card */}
                <div className="contact-card-modern">
                  <div className="contact-header">
                    <h3>Interested in this property?</h3>
                    <p>Get in touch with our expert team</p>
                  </div>

                  <div className="agent-info">
                    <div className="agent-avatar">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="agent-details">
                      <div className="agent-name">{property.agent || 'N&H Real Estate'}</div>
                      <div className="agent-title">Property Consultant</div>
                      {property.agentPhone && (
                        <div className="agent-phone">{property.agentPhone}</div>
                      )}
                    </div>
                  </div>

                  <div className="contact-form">
                    <div className="form-group">
                      <input type="text" placeholder="Your Name" className="form-input" />
                    </div>
                    <div className="form-group">
                      <input type="email" placeholder="Your Email" className="form-input" />
                    </div>
                    <div className="form-group">
                      <input type="tel" placeholder="Your Phone" className="form-input" />
                    </div>
                    <div className="form-group">
                      <textarea
                        placeholder="I'm interested in this property. Please contact me with more details."
                        className="form-textarea"
                        rows={4}
                      ></textarea>
                    </div>
                    <button className="contact-submit-btn">
                      Send Message
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polygon points="22,2 15,22 11,13 2,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                  <div className="contact-alternatives">
                    <div className="contact-divider">
                      <span>or</span>
                    </div>
                    <div className="contact-buttons">
                      <button className="contact-btn call-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Call Now
                      </button>
                      <button className="contact-btn whatsapp-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.60568 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>

                {/* Property Stats Card */}
                <div className="property-stats-card">
                  <h3>Property Details</h3>
                  <div className="stats-list">
                    <div className="stat-item">
                      <span className="stat-label">Property ID</span>
                      <span className="stat-value">#{property._id.slice(-6).toUpperCase()}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Property Type</span>
                      <span className="stat-value">{property.propertyType || 'Apartment'}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Year Built</span>
                      <span className="stat-value">{property.yearBuilt || 'N/A'}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Status</span>
                      <span className="stat-value status-available">Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modern CSS Styles */}
      <style>{`
        .property-detail-modern {
          background: #f8f9fa;
          min-height: 100vh;
        }

        .property-hero-section.visual-enhanced {
          position: relative;
          height: 70vh;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 0;
        }

        .property-hero-section .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
        }

        .property-hero-section .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4));
          z-index: 2;
        }

        .property-hero-section .hero-bg-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .property-hero-section .hero-content {
          position: relative;
          z-index: 3;
          text-align: center;
          color: white;
          width: 100%;
        }

        .property-hero-section .hero-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .property-location-hero {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: var(--champagne-taupe);
        }

        .property-price-hero {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--champagne-taupe);
          margin-bottom: 2rem;
        }

        .property-price-hero .price-period {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 400;
        }

        .image-navigation-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          margin-top: 2rem;
        }

        .image-nav-btn {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .image-nav-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: scale(1.1);
        }

        .image-counter {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          color: white;
          padding: 12px 20px;
          border-radius: 25px;
          font-size: 16px;
          font-weight: 500;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .property-status-badge {
          display: inline-block;
          background: var(--champagne-taupe);
          color: var(--black);
          padding: 8px 16px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 1rem;
        }

        .property-gallery-section {
          background: white;
          padding: 2rem 0;
          border-bottom: 1px solid #e0e0e0;
        }

        .property-thumbnails {
          display: flex;
          gap: 10px;
          padding: 20px;
          overflow-x: auto;
          background: white;
        }

        .thumbnail {
          flex-shrink: 0;
          width: 100px;
          height: 70px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 3px solid transparent;
          transition: all 0.3s ease;
        }

        .thumbnail.active {
          border-color: var(--luxury-burgundy);
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .property-info-section {
          background: white;
          padding: 40px 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .property-info-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
        }

        .breadcrumb-modern {
          margin-bottom: 30px;
          font-size: 14px;
          color: #666;
        }

        .breadcrumb-link {
          color: var(--luxury-burgundy);
          cursor: pointer;
          text-decoration: none;
        }

        .breadcrumb-link:hover {
          text-decoration: underline;
        }

        .breadcrumb-separator {
          margin: 0 10px;
          color: #ccc;
        }

        .breadcrumb-current {
          color: #333;
        }

        .property-header-modern {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
        }

        .property-title-modern {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--luxury-burgundy);
          margin: 0 0 10px 0;
          line-height: 1.2;
        }

        .property-location-modern {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 16px;
          margin-bottom: 20px;
        }

        .property-location-modern svg {
          color: var(--matte-gold);
        }

        .property-actions {
          display: flex;
          gap: 10px;
        }

        .action-btn {
          width: 50px;
          height: 50px;
          border: 2px solid #e0e0e0;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          border-color: var(--luxury-burgundy);
          color: var(--luxury-burgundy);
        }

        .property-price-section {
          margin-bottom: 30px;
        }

        .price-main {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--matte-gold);
          margin-bottom: 5px;
        }

        .price-period {
          font-size: 1.2rem;
          color: #666;
          font-weight: 400;
        }

        .price-per-sqm {
          color: #666;
          font-size: 16px;
        }

        .property-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
          padding: 30px;
          background: #f8f9fa;
          border-radius: 12px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .feature-icon {
          width: 50px;
          height: 50px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--luxury-burgundy);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .feature-content {
          flex: 1;
        }

        .feature-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--luxury-burgundy);
          margin-bottom: 2px;
        }

        .feature-label {
          color: #666;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--luxury-burgundy);
          margin-bottom: 20px;
        }

        .property-description-section {
          margin-bottom: 40px;
        }

        .description-content p {
          line-height: 1.7;
          color: #333;
          font-size: 16px;
          margin: 0;
        }

        .property-amenities-section {
          margin-bottom: 40px;
        }

        .amenities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }

        .amenity-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
        }

        .amenity-item svg {
          color: var(--matte-gold);
          flex-shrink: 0;
        }

        .property-sidebar {
          position: sticky;
          top: 20px;
          height: fit-content;
        }

        .contact-card-modern {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          padding: 30px;
          margin-bottom: 30px;
        }

        .contact-header h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--luxury-burgundy);
          margin: 0 0 5px 0;
        }

        .contact-header p {
          color: #666;
          margin: 0 0 25px 0;
        }

        .agent-info {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .agent-avatar {
          width: 60px;
          height: 60px;
          background: var(--luxury-burgundy);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .agent-name {
          font-weight: 600;
          color: var(--luxury-burgundy);
          margin-bottom: 3px;
        }

        .agent-title {
          color: #666;
          font-size: 14px;
          margin-bottom: 3px;
        }

        .agent-phone {
          color: var(--matte-gold);
          font-weight: 500;
          font-size: 14px;
        }

        .contact-form {
          margin-bottom: 25px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.3s ease;
          font-family: inherit;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--luxury-burgundy);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .contact-submit-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, var(--luxury-burgundy), #6B1423);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .contact-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(75, 14, 20, 0.3);
        }

        .contact-alternatives {
          text-align: center;
        }

        .contact-divider {
          position: relative;
          margin: 20px 0;
        }

        .contact-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e0e0e0;
        }

        .contact-divider span {
          background: white;
          padding: 0 15px;
          color: #666;
          font-size: 14px;
        }

        .contact-buttons {
          display: flex;
          gap: 10px;
        }

        .contact-btn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
        }

        .call-btn {
          background: var(--matte-gold);
          color: white;
        }

        .call-btn:hover {
          background: #B8954F;
        }

        .whatsapp-btn {
          background: #25D366;
          color: white;
        }

        .whatsapp-btn:hover {
          background: #20B858;
        }

        .property-stats-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          padding: 30px;
        }

        .property-stats-card h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--luxury-burgundy);
          margin: 0 0 20px 0;
        }

        .stats-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 15px;
          border-bottom: 1px solid #f0f0f0;
        }

        .stat-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .stat-label {
          color: #666;
          font-size: 14px;
        }

        .stat-value {
          font-weight: 600;
          color: #333;
        }

        .status-available {
          color: #10B981 !important;
          background: #D1FAE5;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .property-info-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .property-main-image {
            height: 300px;
          }

          .property-title-modern {
            font-size: 2rem;
          }

          .price-main {
            font-size: 2rem;
          }

          .property-features-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            padding: 20px;
          }

          .property-thumbnails {
            padding: 15px;
          }

          .thumbnail {
            width: 80px;
            height: 60px;
          }

          .contact-buttons {
            flex-direction: column;
          }

          .property-sidebar {
            position: static;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 0 15px;
          }

          .property-features-grid {
            grid-template-columns: 1fr;
          }

          .feature-item {
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }

          .property-header-modern {
            flex-direction: column;
            gap: 20px;
          }

          .property-actions {
            align-self: flex-start;
          }
        }
      `}</style>
    </>
  );
};

export default PropertyDetail;
