import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface HeroData {
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
}

const HeroSection: React.FC = () => {
  const { i18n } = useTranslation();
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);

  // Default video URL - using an existing uploaded video as fallback
  const DEFAULT_VIDEO_URL = '/uploads/video-1763406786480-484520926.mp4';

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/content?section=hero`);
        if (response.data && response.data.length > 0) {
          const activeHero = response.data.find((item: HeroData) => item.isActive);
          setHeroData(activeHero || response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  const getText = (value: string | { en: string; ar: string } | undefined): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[i18n.language as 'en' | 'ar'] || value.en || '';
  };

  const getVideoUrl = (): string => {
    // If hero data exists and has a video URL, use it
    if (heroData?.videoUrl) {
      return heroData.videoUrl.startsWith('http') 
        ? heroData.videoUrl 
        : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${heroData.videoUrl}`;
    }
    // Otherwise, use the default video
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${DEFAULT_VIDEO_URL}`;
  };

  const getBackgroundImage = (): string => {
    if (heroData?.backgroundImage) {
      return heroData.backgroundImage.startsWith('http')
        ? heroData.backgroundImage
        : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${heroData.backgroundImage}`;
    }
    return '';
  };

  if (loading) {
    return (
      <div className="hero-slider" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Use video by default if no hero data exists or if mediaType is video
  const useVideo = !heroData || heroData.mediaType === 'video' || !heroData.backgroundImage;

  return (
    <div className="hero-slider">
      <div className="slider-container">
        <div className="slide active">
          {/* Background Media */}
          {useVideo ? (
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
              <source src={getVideoUrl()} type="video/mp4" />
              <source src={getVideoUrl()} type="video/webm" />
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
                backgroundImage: `url(${getBackgroundImage()})`,
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
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 100%)',
              zIndex: 2
            }}
          />

          {/* Content */}
          <div
            className="slide-content"
            style={{
              position: 'relative',
              zIndex: 3,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '0 2rem'
            }}
          >
            <div style={{ maxWidth: '800px' }}>
              <h1 className="slide-title" style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 700,
                color: 'white',
                marginBottom: '1.5rem',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)'
              }}>
                {getText(heroData?.title) || 'Welcome to N&H Real Estate'}
              </h1>
              <p className="slide-subtitle" style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                color: 'white',
                marginBottom: '1rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {getText(heroData?.subtitle) || 'Your Gateway to Luxury Properties'}
              </p>
              {heroData?.description && (
                <p className="slide-description" style={{
                  fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                  color: 'rgba(255,255,255,0.9)',
                  marginBottom: '2rem',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  {getText(heroData.description)}
                </p>
              )}
              {heroData?.ctaText && (
                <Link
                  to={heroData.ctaLink || '/properties'}
                  className="slide-cta"
                  style={{
                    display: 'inline-block',
                    padding: '1rem 2.5rem',
                    backgroundColor: '#C1A88A',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(193, 168, 138, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#a08970';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(193, 168, 138, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#C1A88A';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(193, 168, 138, 0.3)';
                  }}
                >
                  {getText(heroData.ctaText)}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

