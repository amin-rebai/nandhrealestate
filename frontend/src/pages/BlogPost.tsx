import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface BlogPostData {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  gallery?: string[];
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt: string;
  readingTime: number;
  views: number;
  likes: number;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    tiktokTitle?: string;
    tiktokDescription?: string;
    tiktokImage?: string;
  };
}

// Mock blog post data
const mockBlogPosts: { [key: string]: BlogPostData } = {
  "qatar-real-estate-market-trends-2024": {
    _id: "1",
    title: "Qatar Real Estate Market Trends 2024: What Investors Need to Know",
    slug: "qatar-real-estate-market-trends-2024",
    excerpt: "Discover the latest trends shaping Qatar's real estate market in 2024, from luxury developments to investment opportunities in key districts.",
    content: `
      <p>Qatar's real estate market continues to evolve rapidly in 2024, driven by the country's ambitious Vision 2030 and the lasting impact of hosting the FIFA World Cup. As we navigate through this transformative period, several key trends are reshaping the landscape for investors, developers, and homebuyers alike.</p>

      <h2>Market Overview</h2>
      <p>The Qatar real estate market has shown remarkable resilience and growth potential throughout 2024. With government initiatives supporting foreign investment and new mega-projects coming online, the market presents unique opportunities across residential, commercial, and mixed-use developments.</p>

      <h2>Key Growth Areas</h2>
      <h3>Lusail City</h3>
      <p>Lusail continues to be the crown jewel of Qatar's urban development. The smart city has attracted significant investment, with luxury residential towers, commercial complexes, and entertainment districts creating a vibrant ecosystem. Property values in Lusail have appreciated by an average of 15% year-over-year.</p>

      <h3>The Pearl-Qatar</h3>
      <p>The Pearl remains one of the most sought-after addresses in Qatar. The artificial island's unique blend of luxury living, marina lifestyle, and international community continues to drive demand, particularly among expatriate professionals and high-net-worth individuals.</p>

      <h3>West Bay</h3>
      <p>Qatar's financial district has seen increased demand for both commercial office spaces and luxury residential properties. The area's proximity to major corporations and government institutions makes it a prime location for investment.</p>

      <h2>Investment Opportunities</h2>
      <p>Several factors make 2024 an attractive year for real estate investment in Qatar:</p>
      <ul>
        <li><strong>Foreign Ownership Laws:</strong> Continued liberalization of property ownership laws for non-Qataris</li>
        <li><strong>Infrastructure Development:</strong> Ongoing improvements to transportation and utilities</li>
        <li><strong>Economic Diversification:</strong> Qatar's move away from oil dependency creates new business opportunities</li>
        <li><strong>Population Growth:</strong> Steady increase in expatriate population driving rental demand</li>
      </ul>

      <h2>Market Challenges</h2>
      <p>While opportunities abound, investors should be aware of certain challenges:</p>
      <ul>
        <li>Supply and demand imbalances in certain segments</li>
        <li>Regulatory changes affecting foreign investment</li>
        <li>Economic volatility in the global market</li>
      </ul>

      <h2>Future Outlook</h2>
      <p>Looking ahead, Qatar's real estate market is positioned for continued growth. The country's commitment to sustainable development, smart city initiatives, and economic diversification creates a solid foundation for long-term investment success.</p>

      <p>For investors considering Qatar's real estate market, 2024 presents a unique window of opportunity. With proper due diligence and strategic planning, the market offers potential for significant returns while contributing to Qatar's vision of becoming a global hub for business and innovation.</p>
    `,
    featuredImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    ],
    author: {
      name: "Sarah Al-Mahmoud",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      bio: "Sarah is a senior real estate analyst with over 10 years of experience in the Qatar market. She specializes in market trends analysis and investment strategy development."
    },
    category: "Market Analysis",
    tags: ["Qatar", "Real Estate", "Investment", "Market Trends", "Lusail", "The Pearl"],
    status: "published",
    publishedAt: "2024-01-15T00:00:00.000Z",
    readingTime: 8,
    views: 1250,
    likes: 45,
    seo: {
      metaTitle: "Qatar Real Estate Market Trends 2024 - Investment Guide",
      metaDescription: "Comprehensive analysis of Qatar's real estate market trends in 2024. Discover investment opportunities in Lusail, The Pearl, and West Bay.",
      keywords: "Qatar real estate, market trends 2024, property investment, Lusail City, The Pearl Qatar, West Bay",
      ogTitle: "Qatar Real Estate Market Trends 2024: What Investors Need to Know",
      ogDescription: "Discover the latest trends shaping Qatar's real estate market in 2024, from luxury developments to investment opportunities in key districts.",
      ogImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    }
  },
  "lusail-city-future-modern-living-qatar": {
    _id: "2",
    title: "Lusail City: The Future of Modern Living in Qatar",
    slug: "lusail-city-future-modern-living-qatar",
    excerpt: "Explore Lusail City's revolutionary urban planning and discover why it's becoming Qatar's most sought-after residential destination.",
    content: `
      <p>Lusail City stands as a testament to Qatar's vision of the future. This meticulously planned smart city represents the pinnacle of modern urban development, combining cutting-edge technology, sustainable design, and luxurious living spaces to create an unparalleled residential experience.</p>

      <h2>A Vision Realized</h2>
      <p>Spanning 38 square kilometers along Qatar's eastern coast, Lusail City is designed to accommodate 450,000 residents and 150,000 workers. The city's master plan integrates residential, commercial, entertainment, and recreational facilities, creating a self-contained urban ecosystem that redefines modern living.</p>

      <h2>Smart City Infrastructure</h2>
      <p>Lusail City leverages advanced technology to enhance the quality of life for its residents:</p>
      <ul>
        <li><strong>Integrated Transportation:</strong> The Lusail Light Rail Transit system connects all major districts</li>
        <li><strong>Smart Utilities:</strong> Advanced water, electricity, and waste management systems</li>
        <li><strong>Digital Connectivity:</strong> City-wide fiber optic network and 5G coverage</li>
        <li><strong>Environmental Monitoring:</strong> Real-time air quality and environmental data</li>
      </ul>

      <h2>Residential Excellence</h2>
      <p>The city offers diverse housing options to suit various lifestyles and preferences:</p>

      <h3>Marina District</h3>
      <p>Waterfront living at its finest, with luxury apartments and penthouses offering stunning marina views. The district features world-class amenities including private beaches, yacht clubs, and waterfront dining.</p>

      <h3>Energy City</h3>
      <p>A mixed-use development combining residential towers with commercial spaces, perfect for professionals seeking work-life balance.</p>

      <h3>Entertainment District</h3>
      <p>Home to the iconic Lusail Stadium and numerous entertainment venues, this area offers vibrant urban living with easy access to cultural and recreational activities.</p>

      <h2>Sustainability Focus</h2>
      <p>Lusail City is committed to environmental sustainability:</p>
      <ul>
        <li>LEED-certified buildings throughout the city</li>
        <li>Extensive green spaces and parks</li>
        <li>Renewable energy integration</li>
        <li>Water conservation and recycling systems</li>
        <li>Sustainable transportation options</li>
      </ul>

      <h2>Investment Potential</h2>
      <p>The city's strategic location, world-class infrastructure, and growing population make it an attractive investment destination. Property values have shown consistent growth, with rental yields remaining competitive in the regional market.</p>

      <h2>Living in Lusail</h2>
      <p>Residents of Lusail City enjoy:</p>
      <ul>
        <li>International schools and healthcare facilities</li>
        <li>Shopping malls and retail centers</li>
        <li>Parks, beaches, and recreational facilities</li>
        <li>Cultural venues and entertainment options</li>
        <li>Easy access to Doha and Hamad International Airport</li>
      </ul>

      <p>Lusail City represents more than just a place to live – it's a lifestyle choice that embraces the future while respecting Qatar's cultural heritage. As the city continues to develop and mature, it stands as a model for sustainable urban development in the region.</p>
    `,
    featuredImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    author: {
      name: "Ahmed Hassan",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      bio: "Ahmed is an urban planning specialist and real estate consultant with extensive experience in Qatar's development projects."
    },
    category: "City Development",
    tags: ["Lusail", "Modern Living", "Urban Planning", "Qatar", "Smart City"],
    status: "published",
    publishedAt: "2024-01-12T00:00:00.000Z",
    readingTime: 6,
    views: 980,
    likes: 32,
    seo: {
      metaTitle: "Lusail City: The Future of Modern Living in Qatar",
      metaDescription: "Explore Lusail City's revolutionary urban planning and discover why it's becoming Qatar's most sought-after residential destination.",
      keywords: "Lusail City, Qatar smart city, modern living, urban planning, residential Qatar"
    }
  },
  "investment-guide-buying-property-pearl-qatar": {
    _id: "3",
    title: "Investment Guide: Buying Property in The Pearl-Qatar",
    slug: "investment-guide-buying-property-pearl-qatar",
    excerpt: "A comprehensive guide to investing in The Pearl-Qatar, covering market insights, legal requirements, and investment strategies.",
    content: `
      <p>The Pearl-Qatar stands as one of the most prestigious and sought-after residential destinations in the Middle East. This artificial island development offers unique investment opportunities for both local and international investors. This comprehensive guide will walk you through everything you need to know about investing in The Pearl-Qatar.</p>

      <h2>Why Invest in The Pearl-Qatar?</h2>
      <p>The Pearl-Qatar offers several compelling reasons for property investment:</p>
      <ul>
        <li><strong>Freehold Ownership:</strong> One of the few areas in Qatar where foreigners can own property outright</li>
        <li><strong>Premium Location:</strong> Strategic location with easy access to Doha's business district</li>
        <li><strong>Luxury Lifestyle:</strong> World-class amenities, marinas, and beachfront living</li>
        <li><strong>Strong Rental Yields:</strong> Consistent demand from expatriate professionals</li>
        <li><strong>Capital Appreciation:</strong> Steady property value growth over the years</li>
      </ul>

      <h2>Market Overview</h2>
      <p>The Pearl-Qatar property market has shown remarkable resilience and growth potential. With over 40,000 residents and continuing development phases, the island maintains strong demand across all property types.</p>

      <h3>Property Types Available</h3>
      <ul>
        <li><strong>Apartments:</strong> From 1-bedroom units to luxury penthouses</li>
        <li><strong>Townhouses:</strong> Multi-level homes with private gardens</li>
        <li><strong>Villas:</strong> Waterfront properties with private beaches</li>
        <li><strong>Commercial Spaces:</strong> Retail and office opportunities</li>
      </ul>

      <h2>Investment Strategies</h2>
      <h3>Buy-to-Let Strategy</h3>
      <p>The Pearl-Qatar offers excellent rental yields, particularly for:</p>
      <ul>
        <li>1-2 bedroom apartments: 6-8% annual yield</li>
        <li>3-4 bedroom apartments: 5-7% annual yield</li>
        <li>Townhouses and villas: 4-6% annual yield</li>
      </ul>

      <h3>Capital Growth Strategy</h3>
      <p>Long-term investors can benefit from steady capital appreciation, with properties showing consistent growth over the past decade.</p>

      <h2>Legal Requirements</h2>
      <p>Foreign investors should be aware of the following legal requirements:</p>
      <ul>
        <li>Valid Qatar ID or passport</li>
        <li>No-objection certificate from employer (for residents)</li>
        <li>Bank financing pre-approval (if applicable)</li>
        <li>Legal representation for contract review</li>
      </ul>

      <h2>Financing Options</h2>
      <p>Several financing options are available for property purchases:</p>
      <ul>
        <li><strong>Local Banks:</strong> Competitive mortgage rates for residents</li>
        <li><strong>Developer Financing:</strong> Flexible payment plans</li>
        <li><strong>International Financing:</strong> Options for non-residents</li>
      </ul>

      <h2>Due Diligence Checklist</h2>
      <p>Before making an investment, ensure you:</p>
      <ul>
        <li>Verify property ownership and title deeds</li>
        <li>Check for any outstanding service charges</li>
        <li>Review building management and maintenance standards</li>
        <li>Understand community rules and regulations</li>
        <li>Assess rental potential and market comparables</li>
      </ul>

      <p>The Pearl-Qatar represents a unique opportunity to invest in one of Qatar's most prestigious developments. With proper due diligence and strategic planning, investors can benefit from both rental income and long-term capital appreciation in this world-class destination.</p>
    `,
    featuredImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    author: {
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      bio: "Michael is a real estate investment advisor specializing in Qatar's luxury property market with over 8 years of experience."
    },
    category: "Investment Guide",
    tags: ["Investment", "The Pearl Qatar", "Property Guide", "Real Estate", "Buying Guide"],
    status: "published",
    publishedAt: "2024-01-10T00:00:00.000Z",
    readingTime: 10,
    views: 1580,
    likes: 67,
    seo: {
      metaTitle: "Investment Guide: Buying Property in The Pearl-Qatar",
      metaDescription: "Comprehensive guide to investing in The Pearl-Qatar, covering market insights, legal requirements, and investment strategies.",
      keywords: "The Pearl Qatar investment, property buying guide, Qatar real estate investment, freehold property Qatar"
    }
  },
  "smart-home-technology-qatar-luxury-properties": {
    _id: "4",
    title: "Smart Home Technology in Qatar's Luxury Properties",
    slug: "smart-home-technology-qatar-luxury-properties",
    excerpt: "Discover how smart home technology is revolutionizing luxury living in Qatar's premium residential developments.",
    content: `
      <p>Qatar's luxury real estate market is embracing the future with cutting-edge smart home technology. From automated climate control to advanced security systems, today's premium properties offer unprecedented levels of comfort, convenience, and efficiency.</p>

      <h2>The Smart Home Revolution</h2>
      <p>Smart home technology has transformed from a luxury novelty to an essential feature in Qatar's high-end properties. Modern developments integrate sophisticated systems that enhance security, comfort, and energy efficiency while providing residents with seamless control over their living environment.</p>

      <h2>Key Smart Home Features</h2>
      <h3>Climate Control Systems</h3>
      <p>Advanced HVAC systems with smart thermostats that:</p>
      <ul>
        <li>Learn resident preferences and adjust automatically</li>
        <li>Optimize energy consumption based on occupancy</li>
        <li>Provide zone-based temperature control</li>
        <li>Integrate with weather forecasting for proactive adjustments</li>
      </ul>

      <h3>Security and Access Control</h3>
      <p>Comprehensive security solutions including:</p>
      <ul>
        <li>Biometric access control systems</li>
        <li>Smart surveillance cameras with AI recognition</li>
        <li>Automated gate and door controls</li>
        <li>Integration with building security systems</li>
        <li>Remote monitoring capabilities</li>
      </ul>

      <h3>Lighting and Ambiance</h3>
      <p>Intelligent lighting systems that offer:</p>
      <ul>
        <li>Automated scheduling based on daily routines</li>
        <li>Mood-based lighting scenes</li>
        <li>Energy-efficient LED technology</li>
        <li>Integration with natural light sensors</li>
        <li>Voice and app-based control</li>
      </ul>

      <h2>Popular Smart Home Platforms</h2>
      <h3>Integrated Building Management</h3>
      <p>Many luxury developments in Qatar feature centralized building management systems that integrate:</p>
      <ul>
        <li>Individual apartment controls</li>
        <li>Common area management</li>
        <li>Energy monitoring and optimization</li>
        <li>Maintenance scheduling and alerts</li>
      </ul>

      <h3>Mobile Applications</h3>
      <p>Residents can control their homes through dedicated mobile apps that provide:</p>
      <ul>
        <li>Real-time system monitoring</li>
        <li>Remote control capabilities</li>
        <li>Energy usage analytics</li>
        <li>Maintenance request submission</li>
        <li>Community communication features</li>
      </ul>

      <h2>Benefits for Residents</h2>
      <h3>Enhanced Comfort</h3>
      <p>Smart home technology creates personalized living environments that adapt to individual preferences and daily routines.</p>

      <h3>Improved Security</h3>
      <p>Advanced security systems provide peace of mind with 24/7 monitoring and instant alerts for any unusual activity.</p>

      <h3>Energy Efficiency</h3>
      <p>Intelligent systems optimize energy consumption, reducing utility costs and environmental impact.</p>

      <h3>Convenience</h3>
      <p>Automated systems handle routine tasks, allowing residents to focus on what matters most to them.</p>

      <h2>Investment Perspective</h2>
      <p>Properties with advanced smart home technology command premium prices and rental rates in Qatar's luxury market. These features are increasingly becoming standard expectations rather than luxury additions.</p>

      <h3>Market Trends</h3>
      <ul>
        <li>15-20% premium for smart-enabled properties</li>
        <li>Higher rental yields due to increased demand</li>
        <li>Faster property sales and rentals</li>
        <li>Lower long-term maintenance costs</li>
      </ul>

      <h2>Future Developments</h2>
      <p>The integration of smart home technology in Qatar's luxury properties continues to evolve, with upcoming developments featuring:</p>
      <ul>
        <li>AI-powered predictive maintenance</li>
        <li>Advanced health monitoring systems</li>
        <li>Sustainable energy management</li>
        <li>Enhanced connectivity and IoT integration</li>
      </ul>

      <p>Smart home technology is no longer the future – it's the present reality of luxury living in Qatar. As technology continues to advance, these systems will become even more sophisticated, making smart-enabled properties an essential consideration for discerning buyers and investors.</p>
    `,
    featuredImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    author: {
      name: "Fatima Al-Zahra",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      bio: "Fatima is a technology consultant specializing in smart building solutions and IoT integration for luxury residential developments."
    },
    category: "Technology",
    tags: ["Smart Home", "Technology", "Luxury Properties", "Qatar", "Innovation"],
    status: "published",
    publishedAt: "2024-01-08T00:00:00.000Z",
    readingTime: 7,
    views: 890,
    likes: 28,
    seo: {
      metaTitle: "Smart Home Technology in Qatar's Luxury Properties",
      metaDescription: "Discover how smart home technology is revolutionizing luxury living in Qatar's premium residential developments.",
      keywords: "smart home Qatar, luxury properties technology, home automation Qatar, smart building systems"
    }
  }
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Simulate API loading delay
    setLoading(true);
    setError(null);

    setTimeout(() => {
      if (slug && mockBlogPosts[slug]) {
        setPost(mockBlogPosts[slug]);
        setLoading(false);
      } else {
        setPost(null);
        setError("Blog post not found");
        setLoading(false);
      }
    }, 500); // Simulate 500ms loading time

    return () => {
      setPost(null);
    };
  }, [slug]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLike = () => {
    if (post && !liked) {
      setLiked(true);
      // In a real app, this would make an API call
    }
  };

  const sharePost = (platform: string) => {
    if (!post) return;

    const url = window.location.href;
    const title = post.title;

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'tiktok':
        shareUrl = `https://tiktok.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
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
          borderTop: '3px solid var(--champagne-taupe)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--gray)' }}>
          Loading article...
        </p>
      </div>
    );
  }

  if (error || !post) {
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
        <h2 style={{ color: 'var(--champagne-taupe)', marginBottom: '1rem' }}>
          Article Not Found
        </h2>
        <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>
          {error || "The article you're looking for doesn't exist or has been removed."}
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/blog')}
          style={{
            padding: '12px 24px',
            background: 'var(--champagne-taupe)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{post.seo.metaTitle || post.title} - N&H Homes Real Estate</title>
        <meta name="description" content={post.seo.metaDescription || post.excerpt} />
        <meta name="keywords" content={post.seo.keywords} />
        {post.seo.canonicalUrl && <link rel="canonical" href={post.seo.canonicalUrl} />}

        {/* Open Graph Tags */}
        <meta property="og:title" content={post.seo.ogTitle || post.title} />
        <meta property="og:description" content={post.seo.ogDescription || post.excerpt} />
        <meta property="og:image" content={post.seo.ogImage || post.featuredImage} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />

        {/* Twitter Card Tags */}
        <meta name="tiktok:card" content="summary_large_image" />
        <meta name="tiktok:title" content={post.seo.tiktokTitle || post.title} />
        <meta name="tiktok:description" content={post.seo.tiktokDescription || post.excerpt} />
        <meta name="tiktok:image" content={post.seo.tiktokImage || post.featuredImage} />

        {/* Article Meta */}
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:author" content={post.author.name} />
        <meta property="article:section" content={post.category} />
        {post.tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
      </Helmet>

      <article className="blog-post">
        {/* Hero Section with Same Style as Other Pages */}
        <section className="blog-post-hero visual-enhanced">
          <div className="hero-background">
            <div className="hero-overlay"></div>
            <img
              src={post.featuredImage}
              alt={post.title}
              className="hero-bg-image"
            />
          </div>

          <div className="hero-content">
            <div className="container">
              {/* Breadcrumb */}
              <nav className="breadcrumb-hero">
                <Link to="/">Home</Link>
                <span className="separator">›</span>
                <Link to="/blog">Blog</Link>
                <span className="separator">›</span>
                <span className="current">{post.title}</span>
              </nav>

              <div className="hero-text">
                <div className="post-category-hero">
                  {post.category}
                </div>
                <h1 className="hero-title">{post.title}</h1>
                <p className="hero-subtitle">{post.excerpt}</p>

                <div className="post-meta-hero">
                  <div className="author-info">
                    {post.author.avatar && (
                      <img src={post.author.avatar} alt={post.author.name} className="author-avatar" />
                    )}
                    <div className="author-details">
                      <span className="author-name">{post.author.name}</span>
                      <div className="post-stats">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span>•</span>
                        <span>{post.readingTime} min read</span>
                        <span>•</span>
                        <span>{post.views} views</span>
                      </div>
                    </div>
                  </div>

                  <div className="social-share">
                    <button onClick={() => sharePost('facebook')} className="share-button facebook">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                    <button onClick={() => sharePost('tiktok')} className="share-button tiktok">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </button>
                    <button onClick={() => sharePost('linkedin')} className="share-button linkedin">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </button>
                    <button onClick={() => sharePost('whatsapp')} className="share-button whatsapp">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Post Content */}
        <div className="post-content">
          <div className="container">
            <div className="content-wrapper">
              <div className="post-body">
                <div
                  className="content-text"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="post-tags">
                    <h4>Tags:</h4>
                    <div className="tags-list">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Like Button */}
                <div className="post-actions">
                  <button
                    onClick={handleLike}
                    className={`like-button ${liked ? 'liked' : ''}`}
                    disabled={liked}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor">
                      <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.1208 20.84 4.61V4.61Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{post.likes + (liked ? 1 : 0)} likes</span>
                  </button>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="post-sidebar">
                {/* Author Bio */}
                <div className="author-bio">
                  <h4>About the Author</h4>
                  <div className="author-card">
                    {post.author.avatar && (
                      <img src={post.author.avatar} alt={post.author.name} className="author-avatar-large" />
                    )}
                    <h5>{post.author.name}</h5>
                    {post.author.bio && (
                      <p>{post.author.bio}</p>
                    )}
                  </div>
                </div>

                {/* Share Again */}
                <div className="share-widget">
                  <h4>Share this Article</h4>
                  <div className="share-buttons">
                    <button onClick={() => sharePost('facebook')} className="share-button facebook">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </button>
                    <button onClick={() => sharePost('tiktok')} className="share-button tiktok">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                      Twitter
                    </button>
                    <button onClick={() => sharePost('linkedin')} className="share-button linkedin">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </button>
                    <button onClick={() => sharePost('whatsapp')} className="share-button whatsapp">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      WhatsApp
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* Back to Blog */}
        <div className="back-to-blog-section">
          <div className="container">
            <button
              onClick={() => navigate('/blog')}
              className="back-to-blog"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 18L9 12L15 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Blog
            </button>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPost;

// Add CSS styles for the BlogPost page
const blogPostStyles = `
  .blog-post {
    background: #f8f9fa;
    min-height: 100vh;
  }

  .blog-post-hero.visual-enhanced {
    position: relative;
    height: 70vh;
    min-height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .blog-post-hero .hero-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }

  .blog-post-hero .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5));
    z-index: 2;
  }

  .blog-post-hero .hero-bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .blog-post-hero .hero-content {
    position: relative;
    z-index: 3;
    text-align: center;
    color: white;
    width: 100%;
  }

  .breadcrumb-hero {
    margin-bottom: 2rem;
    font-size: 14px;
    opacity: 0.8;
  }

  .breadcrumb-hero a {
    color: var(--champagne-taupe);
    text-decoration: none;
  }

  .breadcrumb-hero a:hover {
    text-decoration: underline;
  }

  .breadcrumb-hero .separator {
    margin: 0 10px;
    color: rgba(255, 255, 255, 0.6);
  }

  .breadcrumb-hero .current {
    color: rgba(255, 255, 255, 0.8);
  }

  .post-category-hero {
    display: inline-block;
    background: var(--champagne-taupe);
    color: white;
    padding: 8px 16px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 1.5rem;
  }

  .blog-post-hero .hero-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    line-height: 1.2;
  }

  .blog-post-hero .hero-subtitle {
    font-size: 1.3rem;
    line-height: 1.6;
    max-width: 800px;
    margin: 0 auto 2rem;
    color: rgba(255, 255, 255, 0.9);
  }

  .post-meta-hero {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .author-info {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .author-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid rgba(255, 255, 255, 0.3);
  }

  .author-details {
    text-align: left;
  }

  .author-name {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 4px;
    color: white;
  }

  .post-stats {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
  }

  .social-share {
    display: flex;
    gap: 10px;
  }

  .share-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    color: white;
  }

  .share-button.facebook {
    background: #1877F2;
  }

  .share-button.tiktok {
    background: #1DA1F2;
  }

  .share-button.linkedin {
    background: #0A66C2;
  }

  .share-button.whatsapp {
    background: #25D366;
  }

  .share-button:hover {
    transform: scale(1.1);
  }

  .post-content {
    background: white;
    padding: 4rem 0;
  }

  .content-wrapper {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 4rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .post-body {
    background: white;
    border-radius: 15px;
    padding: 3rem;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  }

  .content-text {
    line-height: 1.8;
    color: #333;
    font-size: 16px;
  }

  .content-text h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--black);
    margin: 2rem 0 1rem 0;
  }

  .content-text h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--black);
    margin: 1.5rem 0 1rem 0;
  }

  .content-text p {
    margin-bottom: 1.5rem;
  }

  .content-text ul, .content-text ol {
    margin: 1.5rem 0;
    padding-left: 2rem;
  }

  .content-text li {
    margin-bottom: 0.5rem;
  }

  .content-text strong {
    color: var(--champagne-taupe);
    font-weight: 600;
  }

  .post-tags {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid #e0e0e0;
  }

  .post-tags h4 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--black);
    margin-bottom: 1rem;
  }

  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .tag {
    background: rgba(193, 168, 138, 0.1);
    color: var(--champagne-taupe);
    padding: 6px 12px;
    border-radius: 15px;
    font-size: 14px;
    font-weight: 500;
  }

  .post-actions {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e0e0e0;
    text-align: center;
  }

  .like-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 25px;
    color: var(--gray);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .like-button:hover:not(:disabled) {
    border-color: #ff6b6b;
    color: #ff6b6b;
  }

  .like-button.liked {
    border-color: #ff6b6b;
    color: #ff6b6b;
    background: rgba(255, 107, 107, 0.1);
  }

  .like-button:disabled {
    cursor: not-allowed;
  }

  .post-sidebar {
    position: sticky;
    top: 2rem;
    height: fit-content;
  }

  .author-bio, .share-widget {
    background: white;
    border-radius: 15px;
    padding: 2rem;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
    margin-bottom: 2rem;
  }

  .author-bio h4, .share-widget h4 {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--black);
    margin-bottom: 1.5rem;
  }

  .author-card {
    text-align: center;
  }

  .author-avatar-large {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1rem;
  }

  .author-card h5 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--black);
    margin-bottom: 0.5rem;
  }

  .author-card p {
    color: var(--gray);
    line-height: 1.6;
    font-size: 14px;
  }

  .share-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .share-widget .share-button {
    width: 100%;
    height: auto;
    border-radius: 8px;
    padding: 12px;
    justify-content: flex-start;
    gap: 12px;
    font-weight: 600;
    color: white;
  }

  .back-to-blog-section {
    background: white;
    padding: 2rem 0;
    border-top: 1px solid #e0e0e0;
  }

  .back-to-blog {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: var(--champagne-taupe);
    color: white;
    border: none;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
  }

  .back-to-blog:hover {
    background: #A89070;
    transform: translateY(-2px);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .blog-post-hero .hero-title {
      font-size: 2.2rem;
    }

    .blog-post-hero .hero-subtitle {
      font-size: 1.1rem;
    }

    .post-meta-hero {
      flex-direction: column;
      gap: 1rem;
    }

    .content-wrapper {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .post-body {
      padding: 2rem;
    }

    .content-text h2 {
      font-size: 1.5rem;
    }

    .content-text h3 {
      font-size: 1.3rem;
    }

    .post-sidebar {
      position: static;
    }

    .social-share {
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .blog-post-hero .hero-title {
      font-size: 1.8rem;
    }

    .post-body {
      padding: 1.5rem;
    }

    .content-wrapper {
      padding: 0 1rem;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = blogPostStyles;
  document.head.appendChild(styleElement);
}
