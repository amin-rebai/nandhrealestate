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

  // Sample slide data - in a real app, this would come from props or API
  const slides: SlideData[] = [
    {
      id: 1,
      title: "Work with trusted real estate agents in Lusail",
      subtitle: "Luxury Properties",
      description: "Speak to an area expert today and get personalized advice for your next move.",
      backgroundImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      ctaText: "About us",
      ctaLink: "/about"
    },
    {
      id: 2,
      title: "Premium Real Estate Solutions",
      subtitle: "Investment Opportunities",
      description: "Discover exclusive properties across Qatar, UAE, and beyond with our expert guidance.",
      backgroundImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      ctaText: "View Properties",
      ctaLink: "/properties"
    },
    {
      id: 3,
      title: "Your Dream Home Awaits",
      subtitle: "Residential Excellence",
      description: "From luxury villas to modern apartments, find your perfect home with N&H Real Estate.",
      backgroundImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      ctaText: "Contact Us",
      ctaLink: "/contact"
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
