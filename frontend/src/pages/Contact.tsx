import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface ContactInfo {
  title: { en: string; ar: string; fr?: string };
  description: { en: string; ar: string; fr?: string };
  phone: string;
  email: string;
  address: { en: string; ar: string };
  businessHours: { en: string; ar: string };
}

const Contact: React.FC = () => {
  const { i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    propertyType: '',
    budget: ''
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    title: { en: 'Contact N&H Real Estate', ar: 'اتصل بـ N&H العقارية', fr: 'Contactez N&H Immobilier' },
    description: { en: 'Get in touch with our expert team', ar: 'تواصل مع فريقنا المتخصص', fr: "Contactez notre équipe d'experts" },
    phone: '+974 7070 4504',
    email: 'info@nhrealestate.qa',
    address: { en: 'Doha, Qatar', ar: 'الدوحة، قطر' },
    businessHours: { en: 'Sun - Thu: 8:00 AM - 6:00 PM', ar: 'الأحد - الخميس: 8:00 صباحاً - 6:00 مساءً' }
  });
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/content/section/contact?active=true`);
        if (response.data && response.data.length > 0) {
          const data = response.data[0];
          // Page-level hero image configuration may come as backgroundImage or image
          const bg = data.backgroundImage || data.image || data.metadata?.backgroundImage || data.metadata?.image || '';
          if (bg) setHeroImage(bg.startsWith('http') ? bg : `${API_URL}${bg}`);
          setContactInfo({
            title: data.title || { en: 'Contact N&H Real Estate', ar: 'اتصل بـ N&H العقارية' },
            description: data.description || { en: 'Get in touch with our expert team', ar: 'تواصل مع فريقنا المتخصص' },
            phone: data.metadata?.phone || '+974 7070 4504',
            email: data.metadata?.email || 'info@nhrealestate.qa',
            address: data.metadata?.address || { en: 'Doha, Qatar', ar: 'الدوحة، قطر' },
            businessHours: data.metadata?.businessHours || { en: 'Sun - Thu: 8:00 AM - 6:00 PM', ar: 'الأحد - الخميس: 8:00 صباحاً - 6:00 مساءً' }
          });
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };

    fetchContactInfo();
  }, []);

  const getText = (field: string | { en: string; ar: string; fr?: string } | undefined): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[i18n.language as 'en' | 'ar' | 'fr'] || field.en || field.fr || '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry! We will contact you soon.');
  };

  return (
    <div className="contact-page">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Contact Us - N&H Real Estate | Get in Touch</title>
        <meta name="description" content="Contact N&H Real Estate for personalized real estate solutions across Qatar, UAE, Saudi Arabia, and beyond. Expert consultation available." />
        <meta name="keywords" content="contact N&H Real Estate, Qatar real estate contact, property consultation, real estate inquiry" />
      </Helmet>

      {/* Hero Section with Same Style as Other Pages */}
      <section className="contact-hero visual-enhanced">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <img
            src={heroImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'}
            alt="Contact N&H Real Estate"
            className="hero-bg-image"
          />
        </div>

        <div className="hero-content">
          <div className="container">
            <div className="hero-text">
              <h1 className="hero-title">{getText(contactInfo.title)}</h1>
              <p className="hero-subtitle">
                {getText(contactInfo.description)}
              </p>
              <div className="hero-cta">
                <div className="contact-quick-info">
                  <div className="quick-contact-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    <span>{contactInfo.phone}</span>
                  </div>
                  <div className="quick-contact-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    <span>{contactInfo.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Information */}
            <div className="contact-info visual-enhanced">
              <div className="section-header">
                <h3 className="section-title">Get in Touch</h3>
                <p className="section-subtitle">We're here to help you with all your real estate needs</p>
              </div>

              <div className="contact-items">
                <div className="contact-item visual-enhanced">
                  <div className="contact-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <div className="contact-details">
                    <h4>Head Office</h4>
                    <p>{getText(contactInfo.address)}</p>
                    <span className="contact-description">Visit our main office for in-person consultations</span>
                  </div>
                </div>

                <div className="contact-item visual-enhanced">
                  <div className="contact-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                  </div>
                  <div className="contact-details">
                    <h4>Phone</h4>
                    <p>{contactInfo.phone}</p>
                    <span className="contact-description">Call us for immediate assistance</span>
                  </div>
                </div>

                <div className="contact-item visual-enhanced">
                  <div className="contact-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <div className="contact-details">
                    <h4>Email</h4>
                    <p>{contactInfo.email}</p>
                    <span className="contact-description">Send us your inquiries anytime</span>
                  </div>
                </div>

                <div className="contact-item visual-enhanced">
                  <div className="contact-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="contact-details">
                    <h4>Business Hours</h4>
                    <p>{getText(contactInfo.businessHours)}</p>
                    <span className="contact-description">We're available during business hours</span>
                  </div>
                </div>
              </div>

              <div className="regional-offices">
                <h4>Regional Network</h4>
                <div className="offices-grid">
                  <div className="office-item">🇸🇦 Saudi Arabia</div>
                  <div className="office-item">🇦🇪 UAE</div>
                  <div className="office-item">🇪🇬 Egypt</div>
                  <div className="office-item">🇫🇷 France</div>
                  <div className="office-item">🇲🇦 Morocco</div>
                  <div className="office-item">🇴🇲 Oman</div>
                  <div className="office-item">🇹🇷 Turkey</div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form visual-enhanced">
              <div className="section-header">
                <h3 className="section-title">Send us a Message</h3>
                <p className="section-subtitle">Fill out the form below and we'll get back to you within 24 hours</p>
              </div>

              <form onSubmit={handleSubmit} className="contact-form-wrapper">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="propertyType">Property Interest</label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                    >
                      <option value="">Select Property Type</option>
                      <option value="residential-sale">Residential - Sale</option>
                      <option value="residential-rent">Residential - Rent</option>
                      <option value="commercial-sale">Commercial - Sale</option>
                      <option value="commercial-rent">Commercial - Rent</option>
                      <option value="investment">Investment Opportunities</option>
                      <option value="development">Development Projects</option>
                      <option value="property-management">Property Management</option>
                      <option value="other">Other Services</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="budget">Budget Range</label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                    >
                      <option value="">Select Budget Range</option>
                      <option value="under-500k">Under $500K</option>
                      <option value="500k-1m">$500K - $1M</option>
                      <option value="1m-2m">$1M - $2M</option>
                      <option value="2m-5m">$2M - $5M</option>
                      <option value="5m-10m">$5M - $10M</option>
                      <option value="over-10m">Over $10M</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Brief subject of your inquiry"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Please provide details about your real estate needs, preferred locations, timeline, and any specific requirements..."
                    rows={6}
                  ></textarea>
                </div>

                <button type="submit" className="submit-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 2L11 13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

// Add CSS styles for the Contact page
const contactStyles = `
  .contact-page {
    background: #f8f9fa;
    min-height: 100vh;
  }

  .contact-hero.visual-enhanced {
    position: relative;
    height: 60vh;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .contact-hero .hero-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }

  .contact-hero .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4));
    z-index: 2;
  }

  .contact-hero .hero-bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .contact-hero .hero-content {
    position: relative;
    z-index: 3;
    text-align: center;
    color: white;
    width: 100%;
  }

  .contact-hero .hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  .contact-hero .hero-title-accent {
    color: var(--champagne-taupe);
  }

  .contact-hero .hero-subtitle {
    font-size: 1.3rem;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto 2rem;
    color: rgba(255, 255, 255, 0.9);
  }

  .hero-cta {
    margin-top: 2rem;
  }

  .contact-quick-info {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
  }

  .quick-contact-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 12px 20px;
    border-radius: 25px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .quick-contact-item svg {
    color: var(--champagne-taupe);
  }

  .contact-content {
    padding: 4rem 0;
    background: white;
  }

  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .contact-info.visual-enhanced {
    background: white;
    border-radius: 20px;
    padding: 3rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    height: fit-content;
  }

  .section-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .section-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--black);
    margin-bottom: 1rem;
  }

  .section-subtitle {
    font-size: 1.1rem;
    color: var(--gray);
    line-height: 1.6;
  }

  .contact-items {
    margin-bottom: 3rem;
  }

  .contact-item.visual-enhanced {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    background: #f8f9fa;
    border-radius: 15px;
    transition: all 0.3s ease;
  }

  .contact-item.visual-enhanced:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  .contact-icon {
    width: 50px;
    height: 50px;
    background: var(--champagne-taupe);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }

  .contact-details h4 {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--black);
    margin-bottom: 0.5rem;
  }

  .contact-details p {
    font-size: 1rem;
    color: var(--champagne-taupe);
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .contact-description {
    font-size: 14px;
    color: var(--gray);
    line-height: 1.4;
  }

  .regional-offices {
    padding-top: 2rem;
    border-top: 1px solid #e0e0e0;
  }

  .regional-offices h4 {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--black);
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .offices-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 10px;
  }

  .office-item {
    background: rgba(193, 168, 138, 0.1);
    color: var(--champagne-taupe);
    padding: 8px 12px;
    border-radius: 20px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
  }

  .contact-form.visual-enhanced {
    background: white;
    border-radius: 20px;
    padding: 3rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  .contact-form-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-group.full-width {
    grid-column: 1 / -1;
  }

  .form-group label {
    font-weight: 600;
    color: var(--black);
    margin-bottom: 0.5rem;
    font-size: 14px;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 15px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 16px;
    transition: all 0.3s ease;
    background: white;
  }

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--champagne-taupe);
    box-shadow: 0 0 0 3px rgba(193, 168, 138, 0.1);
  }

  .form-group textarea {
    resize: vertical;
    min-height: 120px;
    font-family: inherit;
  }

  .submit-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 18px 40px;
    background: var(--champagne-taupe);
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
  }

  .submit-button:hover {
    background: #A89070;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(193, 168, 138, 0.3);
  }

  .submit-button svg {
    transition: transform 0.3s ease;
  }

  .submit-button:hover svg {
    transform: translateX(5px);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .contact-hero .hero-title {
      font-size: 2.5rem;
    }

    .contact-hero .hero-subtitle {
      font-size: 1.1rem;
    }

    .contact-quick-info {
      flex-direction: column;
      gap: 1rem;
    }

    .contact-grid {
      grid-template-columns: 1fr;
      gap: 2rem;
      padding: 0 1rem;
    }

    .contact-info.visual-enhanced,
    .contact-form.visual-enhanced {
      padding: 2rem;
    }

    .form-row {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .offices-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .contact-hero .hero-title {
      font-size: 2rem;
    }

    .contact-info.visual-enhanced,
    .contact-form.visual-enhanced {
      padding: 1.5rem;
    }

    .contact-item.visual-enhanced {
      padding: 1rem;
    }

    .offices-grid {
      grid-template-columns: 1fr;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = contactStyles;
  document.head.appendChild(styleElement);
}
