import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import './FAQ.css';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQData {
  meta: {
    title: string;
    description: string;
  };
  schema: object;
  breadcrumbs: object;
  faqs: FAQItem[];
}

const FAQ: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [seoData, setSeoData] = useState<FAQData | null>(null);

  useEffect(() => {
    const fetchFAQData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/seo/faq`);
        const data = await response.json();
        setSeoData(data);
        setFaqs(data.faqs || []);
      } catch (error) {
        console.error('Error fetching FAQ data:', error);
        // Fallback FAQs
        setFaqs([
          {
            question: 'How can I buy property in Qatar?',
            answer: 'Foreigners can purchase property in designated areas in Qatar. The process involves obtaining a property permit, finding a property, and registering with the Ministry of Justice. N&H Homes provides complete assistance throughout the process.'
          },
          {
            question: 'What are the requirements for renting property in Qatar?',
            answer: 'Renting in Qatar requires a valid QID (Qatar ID), proof of income, and a signed tenancy contract. Rent is typically paid annually in advance. N&H Homes can help you find the perfect rental property.'
          },
          {
            question: 'Can foreigners own property in Qatar?',
            answer: 'Yes, foreigners can own property in designated areas known as "freehold zones." These areas include parts of Lusail, The Pearl Qatar, and other developments.'
          },
          {
            question: 'What documents do I need to rent an apartment in Qatar?',
            answer: 'Required documents include passport copy, QID, proof of income (salary certificate or company letter), and bank statements.'
          },
          {
            question: 'How do I register a property in Qatar?',
            answer: 'Property registration is done at the Ministry of Justice. You need the sale agreement, passport copies, QID, and proof of payment.'
          },
          {
            question: 'What areas are best for property investment in Qatar?',
            answer: 'Popular investment areas include The Pearl Qatar, Lusail, West Bay, Msheireb Downtown, and Al Khor.'
          },
          {
            question: 'Can N&H Homes help with property management?',
            answer: 'Yes, N&H Homes offers comprehensive property management services including tenant screening, rent collection, and property inspections.'
          },
          {
            question: 'What is the process for selling property in Qatar?',
            answer: 'The selling process includes obtaining a property valuation, preparing documentation, marketing the property, and completing the transfer.'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQData();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const currentLang = i18n.language || 'en';

  return (
    <>
      {seoData && (
        <SEO
          title={seoData.meta?.title}
          description={seoData.meta?.description}
          schema={seoData.schema}
          breadcrumbs={seoData.breadcrumbs}
        />
      )}
      
      <div className="faq-page">
        <div className="faq-hero">
          <div className="container">
            <h1>{t('faq.title', 'Frequently Asked Questions')}</h1>
            <p>{t('faq.subtitle', 'Find answers to common questions about buying, selling, and renting property in Qatar')}</p>
          </div>
        </div>

        <div className="faq-content">
          <div className="container">
            {loading ? (
              <div className="faq-loading">
                <div className="spinner"></div>
                <p>{t('common.loading', 'Loading...')}</p>
              </div>
            ) : (
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    className={`faq-item ${openIndex === index ? 'active' : ''}`}
                  >
                    <button 
                      className="faq-question"
                      onClick={() => toggleFAQ(index)}
                      aria-expanded={openIndex === index}
                    >
                      <span>{faq.question}</span>
                      <span className="faq-icon">
                        {openIndex === index ? '−' : '+'}
                      </span>
                    </button>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="faq-cta">
              <h3>{t('faq.cta.title', 'Still have questions?')}</h3>
              <p>{t('faq.cta.description', 'Our team of experts is ready to help you with any questions you may have.')}</p>
              <a href="/contact" className="btn btn-primary">
                {t('faq.cta.button', 'Contact Us')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
