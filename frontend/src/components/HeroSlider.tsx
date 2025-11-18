import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface SlideData {
  _id: string;
  title: string | { en: string; ar: string };
  subtitle?: string | { en: string; ar: string };
  description?: string | { en: string; ar: string };
  backgroundImage?: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video';
  ctaText?: string | { en: string; ar: string };
  ctaLink?: string;
  isActive: boolean;
  order?: number;
}

const HeroSlider: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to display multilingual content
  const displayMultilingual = (value: string | { en: string; ar: string } | undefined): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[i18n.language as 'en' | 'ar'] || value.en || '';
  };

  // Fetch slider data from API
  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/content/section/slider?active=true`);

        if (response.data.success && response.data.data.length > 0) {
          // Sort by order
          const sortedSlides = response.data.data.sort((a: SlideData, b: SlideData) => (a.order || 0) - (b.order || 0));
          setSlides(sortedSlides);
        } else {
          // Fallback to default slides if no slider content found
          setSlides([
            {
              _id: '1',
              title: { en: "Find Your Perfect Apartment", ar: "ابحث عن شقتك المثالية" },
              subtitle: { en: "Luxury Living Awaits", ar: "الحياة الفاخرة في انتظارك" },
              description: { en: "Discover premium apartments in Qatar's most prestigious locations. From modern studios to spacious penthouses.", ar: "اكتشف الشقق المميزة في أرقى المواقع في قطر. من الاستوديوهات الحديثة إلى البنتهاوس الواسعة." },
              backgroundImage: "/images/hero_1.jpg",
              mediaType: 'image',
              ctaText: { en: "Search Apartments", ar: "البحث عن الشقق" },
              ctaLink: "/properties",
              isActive: true,
              order: 1
            },
            {
              _id: '2',
              title: { en: "Luxury Apartments in Prime Locations", ar: "شقق فاخرة في مواقع مميزة" },
              subtitle: { en: "Premium Real Estate", ar: "عقارات مميزة" },
              description: { en: "Experience sophisticated living in Lusail, West Bay, and Downtown Doha. Your dream apartment is just a search away.", ar: "اختبر الحياة المتطورة في لوسيل والخليج الغربي ووسط الدوحة. شقة أحلامك على بعد بحث واحد." },
              backgroundImage: "/images/hero_2.jpg",
              mediaType: 'image',
              ctaText: { en: "View Properties", ar: "عرض العقارات" },
              ctaLink: "/properties",
              isActive: true,
              order: 2
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching slider data:', error);
        // Fallback to default slides on error
        setSlides([
          {
            _id: '1',
            title: { en: "Find Your Perfect Apartment", ar: "ابحث عن شقتك المثالية" },
            subtitle: { en: "Luxury Living Awaits", ar: "الحياة الفاخرة في انتظارك" },
            description: { en: "Discover premium apartments in Qatar's most prestigious locations.", ar: "اكتشف الشقق المميزة في أرقى المواقع في قطر." },
            backgroundImage: "/images/hero_1.jpg",
            mediaType: 'image',
            ctaText: { en: "Search Apartments", ar: "البحث عن الشقق" },
            ctaLink: "/properties",
            isActive: true,
            order: 1
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSliderData();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading) {
    return (
      <div className="hero-slider" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="hero-slider" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>No slides available</div>
      </div>
    );
  }

  return (
    <div className="hero-slider">
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div
            key={slide._id}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
          >
            {/* Background Media */}
            {slide.mediaType === 'video' && slide.videoUrl ? (
              <video
                className="slide-video"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 1
                }}
              >
                <source src={slide.videoUrl.startsWith('http') ? slide.videoUrl : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${slide.videoUrl}`} type="video/mp4" />
                <source src={slide.videoUrl.startsWith('http') ? slide.videoUrl : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${slide.videoUrl}`} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div
                className="slide-background"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${slide.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  zIndex: 1
                }}
              />
            )}

            {/* Overlay */}
            <div
              className="slide-overlay"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(rgba(75, 14, 20, 0.4), rgba(75, 14, 20, 0.4))',
                zIndex: 2
              }}
            />

            {/* Content */}
            <div className="slide-content" style={{ position: 'relative', zIndex: 3 }}>
              <div className="slide-text">
                <p className="slide-subtitle">{displayMultilingual(slide.subtitle)}</p>
                <h1 className="slide-title">{displayMultilingual(slide.title)}</h1>
                <p className="slide-description">{displayMultilingual(slide.description)}</p>
                {slide.ctaLink && slide.ctaText && (
                  <a href={slide.ctaLink} className="slide-cta">
                    {displayMultilingual(slide.ctaText)}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button className="slider-nav prev" onClick={prevSlide} aria-label="Previous slide">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <button className="slider-nav next" onClick={nextSlide} aria-label="Next slide">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="slider-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
