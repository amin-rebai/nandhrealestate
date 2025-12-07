import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { fetchPropertyById, clearSelectedProperty } from '../store/slices/propertySlice';
import { RootState, AppDispatch } from '../store/store';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  // Get property from Redux state
  const { selectedProperty: property, loading, error } = useSelector((state: RootState) => state.properties);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // API URL for images
  const API_URL = 'http://localhost:5000';

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

  // Helper function to get property image
  const getPropertyImage = (imageUrl: string) => {
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_URL}${imageUrl}`;
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchPropertyById(id));
    }

    return () => {
      dispatch(clearSelectedProperty());
    };
  }, [id, dispatch]);

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

  // Get display values
  const title = getText(property.title);
  const description = getText(property.description);
  const location = getText(property.location);
  const features = getArray(property.features);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Get reference number
  const referenceNumber = (property as any).referenceNumber || `NH-${property._id.slice(-6).toUpperCase()}`;

  return (
    <>
      <Helmet>
        <title>{title} - N&H Real Estate</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${title} - N&H Real Estate`} />
        <meta property="og:description" content={description} />
        {property.images && property.images.length > 0 && (
          <meta property="og:image" content={getPropertyImage(property.images[0])} />
        )}
      </Helmet>

      <div className="property-detail-fgrealty">
        {/* Image Gallery Section */}
        <section className="property-gallery-hero">
          <div className="gallery-main">
            {property.images && property.images.length > 0 && (
              <img
                src={getPropertyImage(property.images[currentImageIndex])}
                alt={title}
                className="gallery-main-image"
                onClick={() => {/* Could open lightbox */}}
              />
            )}
            {/* Image Navigation */}
            {property.images && property.images.length > 1 && (
              <div className="gallery-nav">
                <button className="gallery-nav-btn prev" onClick={handlePrevImage}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <span className="gallery-counter">{currentImageIndex + 1} / {property.images.length}</span>
                <button className="gallery-nav-btn next" onClick={handleNextImage}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
          {/* Thumbnail Strip */}
          {property.images && property.images.length > 1 && (
            <div className="gallery-thumbnails">
              {property.images.slice(0, 6).map((image, index) => (
                <div
                  key={index}
                  className={`gallery-thumb ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img src={getPropertyImage(image)} alt={`${title} ${index + 1}`} />
                </div>
              ))}
              {property.images.length > 6 && (
                <div className="gallery-thumb more">
                  +{property.images.length - 6}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Main Content Section - FGRealty Style */}
        <section className="property-content-section">
          <div className="container">
            <div className="property-content-grid">
              {/* Left Column - Property Details */}
              <div className="property-main-content">
                {/* Price and Reference Header */}
                <div className="property-price-header">
                  <div className="price-block">
                    <span className="price-currency">QAR</span>
                    <span className="price-amount">{property.price?.toLocaleString()}</span>
                    {property.type === 'rent' && <span className="price-period">/month</span>}
                  </div>
                  <div className="ref-number">REF NO. {referenceNumber}</div>
                </div>

                {/* Badges Row */}
                <div className="property-badges">
                  {property.type === 'off-plan' && (
                    <div className="badge badge-offplan">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M3 21L21 21M5 21V7L13 2L21 7V21" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span>Off-Plan</span>
                      {(property as any).availableFrom && (
                        <span className="badge-sub">Available from {(property as any).availableFrom}</span>
                      )}
                    </div>
                  )}
                  {property.type === 'sale' && (
                    <div className="badge badge-sale">For Sale</div>
                  )}
                  {property.type === 'rent' && (
                    <div className="badge badge-rent">For Rent</div>
                  )}
                  {(property as any).verified && (
                    <div className="badge badge-verified">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Verified Listing
                    </div>
                  )}
                </div>

                {/* Property Title */}
                <h1 className="property-title-fg">{title}</h1>

                {/* Location */}
                <div className="property-location-fg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>{location}, {(property as any).country || 'Qatar'}</span>
                </div>

                {/* Document Downloads */}
                <div className="property-documents">
                  {(property as any).propertyBrochure && (
                    <a href={getPropertyImage((property as any).propertyBrochure)} target="_blank" rel="noopener noreferrer" className="doc-btn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M14 2V8H20M12 18V12M9 15L12 18L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Property Brochure
                    </a>
                  )}
                  {(property as any).layoutImage && (
                    <a href={getPropertyImage((property as any).layoutImage)} target="_blank" rel="noopener noreferrer" className="doc-btn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M3 9H21M9 21V9" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Layout
                    </a>
                  )}
                </div>

                {/* About Section */}
                <div className="property-about-section">
                  <h2 className="section-title-fg">About</h2>
                  <div className="published-date">
                    Published at {formatDate(property.createdAt?.toString() || new Date().toISOString())}
                  </div>
                  <div className="description-text">
                    {description.split('\n').map((paragraph: string, index: number) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Property Details Grid */}
                <div className="property-details-section">
                  <h2 className="section-title-fg">Property Details</h2>
                  <div className="details-grid">
                    <div className="detail-item">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M9 9H15V15H9V9Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span className="detail-value">{property.area} m²</span>
                    </div>
                    <div className="detail-item">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span className="detail-value">{property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} Bedroom${property.bedrooms > 1 ? 's' : ''}`}</span>
                    </div>
                    <div className="detail-item">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 6L20 6C20.5523 6 21 6.44772 21 7V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6L9 6Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span className="detail-value">{property.bathrooms} Bathroom{property.bathrooms > 1 ? 's' : ''}</span>
                    </div>
                    {(property as any).serviceCharge && (
                      <div className="detail-item">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="detail-label">Service Charge</span>
                        <span className="detail-value">QAR {(property as any).serviceCharge}</span>
                      </div>
                    )}
                    {(property as any).transferFee && (
                      <div className="detail-item">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M16 3H21V8M21 3L14 10M8 21H3V16M3 21L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="detail-label">Transfer fee</span>
                        <span className="detail-value">{(property as any).transferFee}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span className="detail-label">Title deed</span>
                      <span className="detail-value">{(property as any).titleDeed ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="detail-item">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span className="detail-label">Tenanted</span>
                      <span className="detail-value">{(property as any).tenanted ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                {/* Features/Amenities */}
                {features && features.length > 0 && (
                  <div className="property-amenities-section-fg">
                    <h2 className="section-title-fg">Features & Amenities</h2>
                    <div className="amenities-grid-fg">
                      {features.map((feature, index) => (
                        <div key={index} className="amenity-item-fg">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Off-Plan Details */}
                {property.type === 'off-plan' && (
                  <div className="off-plan-details-section-fg">
                    <h2 className="section-title-fg">Off-Plan Details</h2>
                    <div className="off-plan-grid-fg">
                      {(property as any).developer && (
                        <div className="off-plan-item-fg">
                          <span className="off-plan-label-fg">Developer</span>
                          <span className="off-plan-value-fg">{(property as any).developer}</span>
                        </div>
                      )}
                      {(property as any).projectName && (
                        <div className="off-plan-item-fg">
                          <span className="off-plan-label-fg">Project Name</span>
                          <span className="off-plan-value-fg">{(property as any).projectName}</span>
                        </div>
                      )}
                      {(property as any).completionDate && (
                        <div className="off-plan-item-fg">
                          <span className="off-plan-label-fg">Completion Date</span>
                          <span className="off-plan-value-fg">{(property as any).completionDate}</span>
                        </div>
                      )}
                      {(property as any).handoverDate && (
                        <div className="off-plan-item-fg">
                          <span className="off-plan-label-fg">Handover Date</span>
                          <span className="off-plan-value-fg">{(property as any).handoverDate}</span>
                        </div>
                      )}
                      {(property as any).roi && (
                        <div className="off-plan-item-fg">
                          <span className="off-plan-label-fg">ROI</span>
                          <span className="off-plan-value-fg">{(property as any).roi}</span>
                        </div>
                      )}
                      {(property as any).downPayment && (
                        <div className="off-plan-item-fg">
                          <span className="off-plan-label-fg">Down Payment</span>
                          <span className="off-plan-value-fg">{(property as any).downPayment}</span>
                        </div>
                      )}
                      {(property as any).paymentPlan && (
                        <div className="off-plan-item-fg full-width">
                          <span className="off-plan-label-fg">Payment Plan</span>
                          <span className="off-plan-value-fg">{(property as any).paymentPlan}</span>
                        </div>
                      )}
                      {(property as any).guaranteedReturns && (
                        <div className="off-plan-item-fg full-width">
                          <span className="off-plan-label-fg">Guaranteed Returns</span>
                          <span className="off-plan-value-fg">{(property as any).guaranteedReturns}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Video Section */}
                {(property as any).video && (
                  <div className="property-video-section-fg">
                    <h2 className="section-title-fg">Property Video Tour</h2>
                    <div className="video-container-fg">
                      <video controls controlsList="nodownload">
                        <source src={getPropertyImage((property as any).video)} type="video/mp4" />
                        <source src={getPropertyImage((property as any).video)} type="video/webm" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="property-sidebar-fg">
                {/* Agent Contact Card */}
                <div className="agent-card-fg">
                  <div className="agent-header-fg">
                    <div className="agent-avatar-fg">
                      {typeof property.agent !== 'string' && property.agent?.avatar ? (
                        <img src={getPropertyImage(property.agent.avatar)} alt={property.agent.name} />
                      ) : (
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      )}
                    </div>
                    <div className="agent-info-fg">
                      <h3 className="agent-name-fg">
                        {typeof property.agent === 'string' ? 'N&H Real Estate' : property.agent?.name || 'N&H Real Estate'}
                      </h3>
                      <p className="agent-title-fg">Property Consultant</p>
                    </div>
                  </div>

                  <div className="contact-buttons-fg">
                    <a href="tel:+97444444444" className="contact-btn-fg call">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Call
                    </a>
                    <a href="https://wa.me/97444444444" target="_blank" rel="noopener noreferrer" className="contact-btn-fg whatsapp">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.60568 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      WhatsApp
                    </a>
                    <a href="mailto:info@nhrealestate.qa" className="contact-btn-fg email">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2"/>
                        <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Email
                    </a>
                  </div>

                  <div className="inquiry-form-fg">
                    <h4>Send an Inquiry</h4>
                    <form>
                      <input type="text" placeholder="Your Name" className="form-input-fg" />
                      <input type="email" placeholder="Your Email" className="form-input-fg" />
                      <input type="tel" placeholder="Your Phone" className="form-input-fg" />
                      <textarea placeholder="I'm interested in this property..." className="form-textarea-fg" rows={3}></textarea>
                      <button type="submit" className="submit-btn-fg">Send Message</button>
                    </form>
                  </div>
                </div>

                {/* Quick Stats Card */}
                <div className="quick-stats-fg">
                  <h4>Quick Facts</h4>
                  <div className="stats-list-fg">
                    <div className="stat-row-fg">
                      <span className="stat-label-fg">Reference</span>
                      <span className="stat-value-fg">{referenceNumber}</span>
                    </div>
                    <div className="stat-row-fg">
                      <span className="stat-label-fg">Property Type</span>
                      <span className="stat-value-fg">{property.propertyType || 'Apartment'}</span>
                    </div>
                    <div className="stat-row-fg">
                      <span className="stat-label-fg">Listing Type</span>
                      <span className="stat-value-fg">{property.type === 'sale' ? 'For Sale' : property.type === 'rent' ? 'For Rent' : 'Off-Plan'}</span>
                    </div>
                    {property.area && (
                      <div className="stat-row-fg">
                        <span className="stat-label-fg">Price per sqm</span>
                        <span className="stat-value-fg">QAR {Math.round(property.price / property.area).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Share & Actions */}
                <div className="share-actions-fg">
                  <button className="action-btn-fg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.1208 20.84 4.61V4.61Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Save
                  </button>
                  <button className="action-btn-fg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="2"/>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Share
                  </button>
                  <button className="action-btn-fg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* FGRealty Style CSS */}
      <style>{`
        .property-detail-fgrealty {
          background: #f5f5f5;
          min-height: 100vh;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Gallery Hero Section */
        .property-gallery-hero {
          background: #f5f5f5;
          padding: 20px;
        }

        .gallery-main {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          border-radius: 12px;
          overflow: hidden;
        }

        .gallery-main-image {
          width: 100%;
          height: 500px;
          object-fit: cover;
          cursor: pointer;
        }

        .gallery-nav {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 15px;
          background: rgba(0, 0, 0, 0.7);
          padding: 10px 20px;
          border-radius: 30px;
        }

        .gallery-nav-btn {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }

        .gallery-nav-btn:hover {
          transform: scale(1.2);
        }

        .gallery-counter {
          color: white;
          font-size: 14px;
          font-weight: 500;
        }

        .gallery-thumbnails {
          display: flex;
          gap: 10px;
          max-width: 1200px;
          margin: 15px auto 0;
          overflow-x: auto;
          padding-bottom: 10px;
        }

        .gallery-thumb {
          flex-shrink: 0;
          width: 100px;
          height: 70px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 3px solid transparent;
          transition: all 0.3s;
        }

        .gallery-thumb.active {
          border-color: var(--matte-gold);
        }

        .gallery-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gallery-thumb.more {
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
        }

        /* Main Content Section */
        .property-content-section {
          padding: 40px 0;
        }

        .property-content-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 40px;
        }

        .property-main-content {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        /* Price Header */
        .property-price-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }

        .price-block {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .price-currency {
          font-size: 1.2rem;
          color: #666;
          font-weight: 500;
        }

        .price-amount {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--luxury-burgundy);
        }

        .price-period {
          font-size: 1rem;
          color: #666;
        }

        .ref-number {
          font-size: 14px;
          color: #888;
          font-weight: 500;
        }

        /* Badges */
        .property-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
        }

        .badge-offplan {
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          color: white;
        }

        .badge-offplan .badge-sub {
          font-weight: 400;
          opacity: 0.8;
          margin-left: 5px;
        }

        .badge-sale {
          background: var(--luxury-burgundy);
          color: white;
        }

        .badge-rent {
          background: var(--matte-gold);
          color: white;
        }

        .badge-verified {
          background: #e8f5e9;
          color: #2e7d32;
        }

        /* Title & Location */
        .property-title-fg {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 15px 0;
          line-height: 1.3;
        }

        .property-location-fg {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 15px;
          margin-bottom: 25px;
        }

        .property-location-fg svg {
          color: var(--matte-gold);
        }

        /* Document Downloads */
        .property-documents {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
        }

        .doc-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          color: #333;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s;
        }

        .doc-btn:hover {
          background: var(--luxury-burgundy);
          color: white;
          border-color: var(--luxury-burgundy);
        }

        .doc-btn svg {
          color: var(--matte-gold);
        }

        .doc-btn:hover svg {
          color: white;
        }

        /* About Section */
        .property-about-section {
          margin-bottom: 30px;
        }

        .section-title-fg {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 15px 0;
          padding-bottom: 10px;
          border-bottom: 2px solid var(--matte-gold);
          display: inline-block;
        }

        .published-date {
          font-size: 13px;
          color: #888;
          margin-bottom: 15px;
        }

        .description-text {
          color: #444;
          line-height: 1.8;
          font-size: 15px;
        }

        .description-text p {
          margin: 0 0 15px 0;
        }

        /* Property Details Grid */
        .property-details-section {
          margin-bottom: 30px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 20px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 10px;
          transition: all 0.3s;
        }

        .detail-item:hover {
          background: #f0f0f0;
        }

        .detail-item svg {
          color: var(--luxury-burgundy);
          margin-bottom: 10px;
        }

        .detail-label {
          font-size: 12px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }

        .detail-value {
          font-size: 15px;
          font-weight: 600;
          color: #333;
        }

        /* Amenities */
        .property-amenities-section-fg {
          margin-bottom: 30px;
        }

        .amenities-grid-fg {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 20px;
        }

        .amenity-item-fg {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 15px;
          background: #f8f9fa;
          border-radius: 8px;
          font-size: 14px;
          color: #333;
        }

        .amenity-item-fg svg {
          color: var(--matte-gold);
          flex-shrink: 0;
        }

        /* Off-Plan Details */
        .off-plan-details-section-fg {
          margin-bottom: 30px;
          padding: 25px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 12px;
        }

        .off-plan-details-section-fg .section-title-fg {
          color: white;
          border-bottom-color: var(--matte-gold);
        }

        .off-plan-grid-fg {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-top: 20px;
        }

        .off-plan-item-fg {
          display: flex;
          justify-content: space-between;
          padding: 15px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }

        .off-plan-item-fg.full-width {
          grid-column: 1 / -1;
        }

        .off-plan-label-fg {
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
        }

        .off-plan-value-fg {
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        /* Video Section */
        .property-video-section-fg {
          margin-bottom: 30px;
        }

        .video-container-fg {
          border-radius: 12px;
          overflow: hidden;
          margin-top: 20px;
        }

        .video-container-fg video {
          width: 100%;
          max-height: 400px;
          object-fit: contain;
          background: #000;
        }

        /* Sidebar */
        .property-sidebar-fg {
          position: sticky;
          top: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Agent Card */
        .agent-card-fg {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .agent-header-fg {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .agent-avatar-fg {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--luxury-burgundy);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          overflow: hidden;
        }

        .agent-avatar-fg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .agent-name-fg {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .agent-title-fg {
          font-size: 13px;
          color: #888;
          margin: 5px 0 0 0;
        }

        .contact-buttons-fg {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }

        .contact-btn-fg {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          padding: 12px 10px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.3s;
        }

        .contact-btn-fg.call {
          background: #f0f0f0;
          color: #333;
        }

        .contact-btn-fg.call:hover {
          background: var(--matte-gold);
          color: white;
        }

        .contact-btn-fg.whatsapp {
          background: #25D366;
          color: white;
        }

        .contact-btn-fg.whatsapp:hover {
          background: #20B858;
        }

        .contact-btn-fg.email {
          background: var(--luxury-burgundy);
          color: white;
        }

        .contact-btn-fg.email:hover {
          background: #6B1423;
        }

        .inquiry-form-fg h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 15px 0;
        }

        .form-input-fg,
        .form-textarea-fg {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 12px;
          transition: border-color 0.3s;
          font-family: inherit;
          box-sizing: border-box;
        }

        .form-input-fg:focus,
        .form-textarea-fg:focus {
          outline: none;
          border-color: var(--luxury-burgundy);
        }

        .form-textarea-fg {
          resize: vertical;
          min-height: 80px;
        }

        .submit-btn-fg {
          width: 100%;
          padding: 14px;
          background: var(--luxury-burgundy);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .submit-btn-fg:hover {
          background: #6B1423;
        }

        /* Quick Stats */
        .quick-stats-fg {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .quick-stats-fg h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 15px 0;
        }

        .stats-list-fg {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .stat-row-fg {
          display: flex;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid #f0f0f0;
        }

        .stat-row-fg:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .stat-label-fg {
          color: #888;
          font-size: 13px;
        }

        .stat-value-fg {
          font-weight: 600;
          color: #333;
          font-size: 13px;
        }

        /* Share Actions */
        .share-actions-fg {
          display: flex;
          gap: 10px;
        }

        .action-btn-fg {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          padding: 15px 10px;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          font-size: 12px;
          color: #666;
          transition: all 0.3s;
        }

        .action-btn-fg:hover {
          border-color: var(--luxury-burgundy);
          color: var(--luxury-burgundy);
        }

        /* Responsive */
        @media (max-width: 992px) {
          .property-content-grid {
            grid-template-columns: 1fr;
          }

          .property-sidebar-fg {
            position: static;
          }

          .details-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .gallery-main-image {
            height: 350px;
          }

          .property-price-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .price-amount {
            font-size: 2rem;
          }

          .details-grid {
            grid-template-columns: 1fr 1fr;
          }

          .amenities-grid-fg {
            grid-template-columns: 1fr;
          }

          .off-plan-grid-fg {
            grid-template-columns: 1fr;
          }

          .property-documents {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .gallery-main-image {
            height: 280px;
          }

          .property-main-content {
            padding: 20px;
          }

          .property-title-fg {
            font-size: 1.4rem;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .contact-buttons-fg {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default PropertyDetail;
