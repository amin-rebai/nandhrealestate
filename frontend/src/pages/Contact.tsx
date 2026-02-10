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
    title: { en: 'Contact N&H Homes Real Estate', ar: 'اتصل بـ N&H العقارية', fr: 'Contactez N&H Immobilier' },
    description: { en: 'Get in touch with our expert team', ar: 'تواصل مع فريقنا المتخصص', fr: "Contactez notre équipe d'experts" },
    phone: '+974 7070 4504',
    email: 'info@nhrealestate.qa',
    address: { en: 'Doha, Qatar', ar: 'الدوحة، قطر' },
    businessHours: { en: 'Sun - Thu: 8:00 AM - 6:00 PM', ar: 'الأحد - الخميس: 8:00 صباحاً - 6:00 مساءً' }
  });
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}content/section/contact?active=true`);
        if (response.data && response.data.length > 0) {
          const data = response.data[0];
          // Page-level hero image configuration may come as backgroundImage or image
          const bg = data.backgroundImage || data.image || data.metadata?.backgroundImage || data.metadata?.image || '';
          if (bg) setHeroImage(bg.startsWith('http') ? bg : `${API_URL}${bg}`);
          setContactInfo({
            title: data.title || { en: 'Contact N&H Homes Real Estate', ar: 'اتصل بـ N&H العقارية' },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await axios.post(`${API_URL}/contact-requests`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        propertyType: formData.propertyType,
        budget: formData.budget
      });

      if (response.data.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for your inquiry! We will contact you soon. Check your email and WhatsApp for confirmation.'
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          propertyType: '',
          budget: ''
        });
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus({ type: null, message: '' });
        }, 5000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: response.data.error || 'Failed to send message. Please try again.'
        });
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.error || 'Failed to send message. Please try again.';
      setSubmitStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Contact Us - N&H Homes Real Estate | Get in Touch</title>
        <meta name="description" content="Contact N&H Homes Real Estate for personalized real estate solutions across Qatar, UAE, Saudi Arabia, and beyond. Expert consultation available." />
        <meta name="keywords" content="contact N&H Homes Real Estate, Qatar real estate contact, property consultation, real estate inquiry" />
      </Helmet>

      {/* Hero Section with Same Style as Other Pages */}
      <section className="contact-hero visual-enhanced">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <img
            src={heroImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'}
            alt="Contact N&H Homes Real Estate"
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
                <h3 className="section-title">{getText({
                  en: 'Get in Touch',
                  ar: 'تواصل معنا',
                  fr: 'Contactez-nous'
                })}</h3>
                <p className="section-subtitle">{getText({
                  en: "We're here to help you with all your real estate needs",
                  ar: 'نحن هنا لمساعدتك في جميع احتياجاتك العقارية',
                  fr: 'Nous sommes là pour vous aider dans tous vos besoins immobiliers'
                })}</p>
              </div>

              <div className="contact-items">
                <div className="contact-item visual-enhanced">
                  <div className="contact-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <div className="contact-details">
                    <h4>{getText({
                      en: 'Head Office',
                      ar: 'المقر الرئيسي',
                      fr: 'Siège social'
                    })}</h4>
                    <p>{getText(contactInfo.address)}</p>
                    <span className="contact-description">{getText({
                      en: 'Visit our main office for in-person consultations',
                      ar: 'قم بزيارة مكتبنا الرئيسي للاستشارات الشخصية',
                      fr: 'Visitez notre bureau principal pour des consultations en personne'
                    })}</span>
                  </div>
                </div>

                <div className="contact-item visual-enhanced">
                  <div className="contact-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                  </div>
                  <div className="contact-details">
                    <h4>{getText({
                      en: 'Phone',
                      ar: 'الهاتف',
                      fr: 'Téléphone'
                    })}</h4>
                    <p>{contactInfo.phone}</p>
                    <span className="contact-description">{getText({
                      en: 'Call us for immediate assistance',
                      ar: 'اتصل بنا للحصول على مساعدة فورية',
                      fr: 'Appelez-nous pour une assistance immédiate'
                    })}</span>
                  </div>
                </div>

                <div className="contact-item visual-enhanced">
                  <div className="contact-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <div className="contact-details">
                    <h4>{getText({
                      en: 'Email',
                      ar: 'البريد الإلكتروني',
                      fr: 'E-mail'
                    })}</h4>
                    <p>{contactInfo.email}</p>
                    <span className="contact-description">{getText({
                      en: 'Send us your inquiries anytime',
                      ar: 'أرسل لنا استفساراتك في أي وقت',
                      fr: 'Envoyez-nous vos demandes à tout moment'
                    })}</span>
                  </div>
                </div>

                <div className="contact-item visual-enhanced">
                  <div className="contact-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="contact-details">
                    <h4>{getText({
                      en: 'Business Hours',
                      ar: 'ساعات العمل',
                      fr: 'Heures d\'ouverture'
                    })}</h4>
                    <p>{getText(contactInfo.businessHours)}</p>
                    <span className="contact-description">{getText({
                      en: "We're available during business hours",
                      ar: 'نحن متاحون خلال ساعات العمل',
                      fr: 'Nous sommes disponibles pendant les heures de bureau'
                    })}</span>
                  </div>
                </div>
              </div>

              <div className="regional-offices">
                <h4>{getText({
                  en: 'Regional Network',
                  ar: 'الشبكة الإقليمية',
                  fr: 'Réseau régional'
                })}</h4>
                <div className="offices-grid">
                  <div className="office-item">🇸🇦 {getText({
                    en: 'Saudi Arabia',
                    ar: 'المملكة العربية السعودية',
                    fr: 'Arabie Saoudite'
                  })}</div>
                  <div className="office-item">🇦🇪 {getText({
                    en: 'UAE',
                    ar: 'الإمارات العربية المتحدة',
                    fr: 'Émirats Arabes Unis'
                  })}</div>
                  <div className="office-item">🇪🇬 {getText({
                    en: 'Egypt',
                    ar: 'مصر',
                    fr: 'Égypte'
                  })}</div>
                  <div className="office-item">🇫🇷 {getText({
                    en: 'France',
                    ar: 'فرنسا',
                    fr: 'France'
                  })}</div>
                  <div className="office-item">🇲🇦 {getText({
                    en: 'Morocco',
                    ar: 'المغرب',
                    fr: 'Maroc'
                  })}</div>
                  <div className="office-item">🇴🇲 {getText({
                    en: 'Oman',
                    ar: 'عمان',
                    fr: 'Oman'
                  })}</div>
                  <div className="office-item">🇹🇷 {getText({
                    en: 'Turkey',
                    ar: 'تركيا',
                    fr: 'Turquie'
                  })}</div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form visual-enhanced">
              <div className="section-header">
                <h3 className="section-title">{getText({
                  en: 'Send us a Message',
                  ar: 'أرسل لنا رسالة',
                  fr: 'Envoyez-nous un message'
                })}</h3>
                <p className="section-subtitle">{getText({
                  en: "Fill out the form below and we'll get back to you within 24 hours",
                  ar: 'املأ النموذج أدناه وسنرد عليك في غضون 24 ساعة',
                  fr: 'Remplissez le formulaire ci-dessous et nous vous répondrons dans les 24 heures'
                })}</p>
              </div>

              {submitStatus.type && (
                <div className={`form-status-message ${submitStatus.type}`}>
                  {submitStatus.type === 'success' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                  )}
                  <span>{submitStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form-wrapper">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">{getText({
                      en: 'Full Name *',
                      ar: 'الاسم الكامل *',
                      fr: 'Nom complet *'
                    })}</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder={getText({
                        en: 'Enter your full name',
                        ar: 'أدخل اسمك الكامل',
                        fr: 'Entrez votre nom complet'
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">{getText({
                      en: 'Email Address *',
                      ar: 'عنوان البريد الإلكتروني *',
                      fr: 'Adresse e-mail *'
                    })}</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder={getText({
                        en: 'Enter your email address',
                        ar: 'أدخل عنوان بريدك الإلكتروني',
                        fr: 'Entrez votre adresse e-mail'
                      })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">{getText({
                      en: 'Phone Number',
                      ar: 'رقم الهاتف',
                      fr: 'Numéro de téléphone'
                    })}</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={getText({
                        en: 'Enter your phone number',
                        ar: 'أدخل رقم هاتفك',
                        fr: 'Entrez votre numéro de téléphone'
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="propertyType">{getText({
                      en: 'Property Interest',
                      ar: 'اهتمام العقار',
                      fr: 'Intérêt immobilier'
                    })}</label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                    >
                      <option value="">{getText({
                        en: 'Select Property Type',
                        ar: 'اختر نوع العقار',
                        fr: 'Sélectionnez le type de propriété'
                      })}</option>
                      <option value="residential-sale">{getText({
                        en: 'Residential - Sale',
                        ar: 'سكني - بيع',
                        fr: 'Résidentiel - Vente'
                      })}</option>
                      <option value="residential-rent">{getText({
                        en: 'Residential - Rent',
                        ar: 'سكني - إيجار',
                        fr: 'Résidentiel - Location'
                      })}</option>
                      <option value="commercial-sale">{getText({
                        en: 'Commercial - Sale',
                        ar: 'تجاري - بيع',
                        fr: 'Commercial - Vente'
                      })}</option>
                      <option value="commercial-rent">{getText({
                        en: 'Commercial - Rent',
                        ar: 'تجاري - إيجار',
                        fr: 'Commercial - Location'
                      })}</option>
                      <option value="investment">{getText({
                        en: 'Investment Opportunities',
                        ar: 'فرص الاستثمار',
                        fr: 'Opportunités d\'investissement'
                      })}</option>
                      <option value="development">{getText({
                        en: 'Development Projects',
                        ar: 'مشاريع التطوير',
                        fr: 'Projets de développement'
                      })}</option>
                      <option value="property-management">{getText({
                        en: 'Property Management',
                        ar: 'إدارة الممتلكات',
                        fr: 'Gestion immobilière'
                      })}</option>
                      <option value="other">{getText({
                        en: 'Other Services',
                        ar: 'خدمات أخرى',
                        fr: 'Autres services'
                      })}</option>
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
                      <option value="under-500k">Under QAR500K</option>
                      <option value="500k-1m">QAR500K - QAR1M</option>
                      <option value="1m-2m">QAR1M - QAR2M</option>
                      <option value="2m-5m">QAR2M - QAR5M</option>
                      <option value="5m-10m">QAR5M - QAR10M</option>
                      <option value="over-10m">Over QAR10M</option>
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

                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M22 2L11 13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Send Message
                    </>
                  )}
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

  .form-status-message {
    padding: 15px 20px;
    border-radius: 10px;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 500;
    animation: slideDown 0.3s ease;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .form-status-message.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .form-status-message.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .form-status-message svg {
    flex-shrink: 0;
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

  .submit-button:hover:not(:disabled) {
    background: #A89070;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(193, 168, 138, 0.3);
  }

  .submit-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .submit-button svg {
    transition: transform 0.3s ease;
  }

  .submit-button:hover:not(:disabled) svg {
    transform: translateX(5px);
  }

  .spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
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
