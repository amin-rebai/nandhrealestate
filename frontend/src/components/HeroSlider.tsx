import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
}

const HeroSlider: React.FC = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sample slide data with apartment-focused slogans
  const slides: SlideData[] = [
    {
      id: 1,
      title: "Find Your Perfect Apartment",
      subtitle: "Luxury Living Awaits",
      description: "Discover premium apartments in Qatar's most prestigious locations. From modern studios to spacious penthouses.",
      backgroundImage: "/images/hero_1.jpg",
      ctaText: "Search Apartments",
      ctaLink: "/properties"
    },
    //  backgroundImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    {
      id: 2,
      title: "Luxury Apartments in Prime Locations",
      subtitle: "Premium Real Estate",
      description: "Experience sophisticated living in Lusail, West Bay, and Downtown Doha. Your dream apartment is just a search away.",
      backgroundImage: "/images/hero_2.jpg",
      ctaText: "View Properties",
      ctaLink: "/properties"
    },
    {
      id: 3,
      title: "Modern Living, Exceptional Value",
      subtitle: "Smart Investment",
      description: "Invest in Qatar's growing real estate market. From rental apartments to luxury penthouses - find your perfect match.",
      backgroundImage: "/images/hero_3.jpg",
      ctaText: "Start Your Search",
      ctaLink: "/properties"
    },
    {
      id: 4,
      title: "Your Home, Your Future",
      subtitle: "Apartment Living Redefined",
      description: "From cozy 1-bedroom apartments to spacious family homes. N&H Real Estate connects you with your ideal living space.",
      backgroundImage: "/images/hero_3.jpg",
      ctaText: "Explore Now",
      ctaLink: "/properties"
    }
  ];

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

  return (
    <div className="hero-slider">
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `linear-gradient(rgba(75, 14, 20, 0.4), rgba(75, 14, 20, 0.4)), url(${slide.backgroundImage})`
            }}
          >
            <div className="slide-content">
              <div className="slide-text">
                <p className="slide-subtitle">{slide.subtitle}</p>
                <h1 className="slide-title">{slide.title}</h1>
                <p className="slide-description">{slide.description}</p>
                <a href={slide.ctaLink} className="slide-cta">
                  {slide.ctaText}
                </a>
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
