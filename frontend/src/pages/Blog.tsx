import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

interface BlogPostData {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt: string;
  readingTime: number;
  views: number;
  likes: number;
  isFeatured: boolean;
}

// Mock blog data
const mockBlogPosts: BlogPostData[] = [
  {
    _id: "1",
    title: "Qatar Real Estate Market Trends 2024: What Investors Need to Know",
    slug: "qatar-real-estate-market-trends-2024",
    excerpt: "Discover the latest trends shaping Qatar's real estate market in 2024, from luxury developments to investment opportunities in key districts.",
    content: "Full content here...",
    featuredImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    author: {
      name: "Sarah Al-Mahmoud",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    category: "Market Analysis",
    tags: ["Qatar", "Real Estate", "Investment", "Market Trends"],
    status: "published",
    publishedAt: "2024-01-15T00:00:00.000Z",
    readingTime: 8,
    views: 1250,
    likes: 45,
    isFeatured: true
  },
  {
    _id: "2",
    title: "Lusail City: The Future of Modern Living in Qatar",
    slug: "lusail-city-future-modern-living-qatar",
    excerpt: "Explore Lusail City's revolutionary urban planning and discover why it's becoming Qatar's most sought-after residential destination.",
    content: "Full content here...",
    featuredImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    author: {
      name: "Ahmed Hassan",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    category: "City Development",
    tags: ["Lusail", "Modern Living", "Urban Planning", "Qatar"],
    status: "published",
    publishedAt: "2024-01-12T00:00:00.000Z",
    readingTime: 6,
    views: 980,
    likes: 32,
    isFeatured: true
  },
  {
    _id: "3",
    title: "Investment Guide: Buying Property in The Pearl-Qatar",
    slug: "investment-guide-buying-property-pearl-qatar",
    excerpt: "A comprehensive guide to investing in The Pearl-Qatar, covering everything from property types to financing options and ROI expectations.",
    content: "Full content here...",
    featuredImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    author: {
      name: "Fatima Al-Zahra",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    category: "Investment Guide",
    tags: ["The Pearl", "Investment", "Property Buying", "ROI"],
    status: "published",
    publishedAt: "2024-01-10T00:00:00.000Z",
    readingTime: 12,
    views: 1580,
    likes: 67,
    isFeatured: true
  },
  {
    _id: "4",
    title: "Smart Home Technology in Qatar's Luxury Properties",
    slug: "smart-home-technology-qatar-luxury-properties",
    excerpt: "Discover how smart home technology is revolutionizing luxury living in Qatar's premium residential developments.",
    content: "Full content here...",
    featuredImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    author: {
      name: "Mohammed Al-Thani",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    category: "Technology",
    tags: ["Smart Home", "Technology", "Luxury", "Innovation"],
    status: "published",
    publishedAt: "2024-01-08T00:00:00.000Z",
    readingTime: 7,
    views: 750,
    likes: 28,
    isFeatured: false
  },
  {
    _id: "5",
    title: "West Bay District: Commercial Real Estate Opportunities",
    slug: "west-bay-district-commercial-real-estate-opportunities",
    excerpt: "Analyze the commercial real estate landscape in West Bay, Qatar's premier business district, and uncover investment opportunities.",
    content: "Full content here...",
    featuredImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    author: {
      name: "Layla Ibrahim",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    category: "Commercial",
    tags: ["West Bay", "Commercial", "Business District", "Investment"],
    status: "published",
    publishedAt: "2024-01-05T00:00:00.000Z",
    readingTime: 9,
    views: 620,
    likes: 19,
    isFeatured: false
  },
  {
    _id: "6",
    title: "Sustainable Architecture in Qatar's New Developments",
    slug: "sustainable-architecture-qatar-new-developments",
    excerpt: "Explore how Qatar's new real estate developments are incorporating sustainable design principles and green building technologies.",
    content: "Full content here...",
    featuredImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    author: {
      name: "Omar Al-Rashid",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    category: "Sustainability",
    tags: ["Sustainability", "Green Building", "Architecture", "Environment"],
    status: "published",
    publishedAt: "2024-01-03T00:00:00.000Z",
    readingTime: 10,
    views: 890,
    likes: 41,
    isFeatured: false
  }
];

const Blog: React.FC = () => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<BlogPostData[]>(mockBlogPosts);
  const [loading, setLoading] = useState(false);
  const postsPerPage = 6;

  // Filter posts based on search and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(posts.map(post => post.category)));

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const featuredPosts = filteredPosts.filter(post => post.isFeatured).slice(0, 3);
  const regularPosts = filteredPosts.filter(post => !post.isFeatured);

  // Pagination
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = regularPosts.slice(startIndex, startIndex + postsPerPage);
  const totalPages = Math.ceil(regularPosts.length / postsPerPage);

  return (
    <>
      <Helmet>
        <title>Real Estate Blog - N&H Real Estate</title>
        <meta name="description" content="Stay updated with the latest trends, insights, and news from Qatar's real estate market. Expert analysis and investment guides from N&H Real Estate." />
      </Helmet>

      <div className="blog-page">
        {/* Hero Section with Same Style as Other Pages */}
        <section className="blog-hero visual-enhanced">
          <div className="hero-background">
            <div className="hero-overlay"></div>
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Real Estate Blog"
              className="hero-bg-image"
            />
          </div>

          <div className="hero-content">
            <div className="container">
              <div className="hero-text">
                <h1 className="hero-title">
                  Real Estate <span className="hero-title-accent">Insights</span>
                </h1>
                <p className="hero-subtitle">
                  Stay informed with the latest trends, market analysis, and expert insights
                  from Qatar's dynamic real estate landscape.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="blog-filters">
          <div className="container">
            <div className="filters-wrapper">
              <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-group">
                  <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search articles, topics, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <button type="submit" className="search-button">
                    Search
                  </button>
                </div>
              </form>

              <div className="category-filter">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="category-select"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="featured-posts">
            <div className="container">
              <div className="section-header">
                <h2 className="section-title">Featured Articles</h2>
                <p className="section-subtitle">Discover our most popular and insightful content</p>
              </div>
              <div className="featured-grid">
                {featuredPosts.map((post) => (
                  <article key={post._id} className="featured-post-card visual-enhanced">
                    <Link to={`/blog/${post.slug}`} className="post-link">
                      <div className="post-image">
                        <img src={post.featuredImage} alt={post.title} />
                        <div className="post-category">
                          {post.category}
                        </div>
                        <div className="post-overlay">
                          <div className="read-more">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="post-content">
                        <h3>{post.title}</h3>
                        <p>{post.excerpt}</p>
                        <div className="post-meta">
                          <div className="author">
                            {post.author.avatar && (
                              <img src={post.author.avatar} alt={post.author.name} className="author-avatar" />
                            )}
                            <span>{post.author.name}</span>
                          </div>
                          <div className="post-stats">
                            <span>{formatDate(post.publishedAt)}</span>
                            <span>•</span>
                            <span>{post.readingTime} min read</span>
                            <span>•</span>
                            <span>{post.views} views</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Regular Posts */}
        <section className="blog-posts">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Latest Articles</h2>
              <p className="section-subtitle">Stay updated with our latest insights and market analysis</p>
            </div>

            <div className="posts-grid">
              {paginatedPosts.map((post) => (
                <article key={post._id} className="post-card visual-enhanced">
                  <Link to={`/blog/${post.slug}`} className="post-link">
                    <div className="post-image">
                      <img src={post.featuredImage} alt={post.title} />
                      <div className="post-overlay">
                        <div className="read-more">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="post-content">
                      <div className="post-category">
                        {post.category}
                      </div>
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <div className="post-meta">
                        <div className="author">
                          {post.author.avatar && (
                            <img src={post.author.avatar} alt={post.author.name} className="author-avatar" />
                          )}
                          <span>{post.author.name}</span>
                        </div>
                        <div className="post-stats">
                          <span>{formatDate(post.publishedAt)}</span>
                          <span>•</span>
                          <span>{post.readingTime} min read</span>
                          <span>•</span>
                          <span>{post.views} views</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Previous
                </button>

                <div className="pagination-info">
                  <span>Page {currentPage} of {totalPages}</span>
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Blog;

// Add CSS styles for the Blog page
const blogStyles = `
  .blog-page {
    background: #f8f9fa;
    min-height: 100vh;
  }

  .blog-hero.visual-enhanced {
    position: relative;
    height: 60vh;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .blog-hero .hero-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }

  .blog-hero .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4));
    z-index: 2;
  }

  .blog-hero .hero-bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .blog-hero .hero-content {
    position: relative;
    z-index: 3;
    text-align: center;
    color: white;
    width: 100%;
  }

  .blog-hero .hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  .blog-hero .hero-title-accent {
    color: var(--champagne-taupe);
  }

  .blog-hero .hero-subtitle {
    font-size: 1.3rem;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto;
    color: rgba(255, 255, 255, 0.9);
  }

  .blog-filters {
    background: white;
    padding: 3rem 0;
    border-bottom: 1px solid #e0e0e0;
  }

  .filters-wrapper {
    display: flex;
    gap: 2rem;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  .search-form {
    flex: 1;
    max-width: 500px;
  }

  .search-input-group {
    position: relative;
    display: flex;
    align-items: center;
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 50px;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .search-input-group:focus-within {
    border-color: var(--champagne-taupe);
    box-shadow: 0 0 0 3px rgba(193, 168, 138, 0.1);
  }

  .search-icon {
    position: absolute;
    left: 20px;
    color: #666;
    z-index: 2;
  }

  .search-input {
    flex: 1;
    padding: 15px 20px 15px 50px;
    border: none;
    outline: none;
    font-size: 16px;
    background: transparent;
  }

  .search-button {
    padding: 15px 30px;
    background: var(--champagne-taupe);
    color: white;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .search-button:hover {
    background: #A89070;
  }

  .category-select {
    padding: 15px 20px;
    border: 2px solid #e0e0e0;
    border-radius: 25px;
    background: white;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 200px;
  }

  .category-select:focus {
    outline: none;
    border-color: var(--champagne-taupe);
  }

  .featured-posts {
    padding: 4rem 0;
    background: white;
  }

  .section-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .section-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--black);
    margin-bottom: 1rem;
  }

  .section-subtitle {
    font-size: 1.1rem;
    color: var(--gray);
    max-width: 600px;
    margin: 0 auto;
  }

  .featured-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }

  .featured-post-card.visual-enhanced {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .featured-post-card.visual-enhanced:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  .post-link {
    text-decoration: none;
    color: inherit;
    display: block;
  }

  .post-image {
    position: relative;
    height: 250px;
    overflow: hidden;
  }

  .post-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .featured-post-card:hover .post-image img {
    transform: scale(1.05);
  }

  .post-category {
    position: absolute;
    top: 20px;
    left: 20px;
    background: var(--champagne-taupe);
    color: white;
    padding: 6px 12px;
    border-radius: 15px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .post-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .featured-post-card:hover .post-overlay {
    opacity: 1;
  }

  .read-more {
    width: 50px;
    height: 50px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--champagne-taupe);
    transform: scale(0.8);
    transition: transform 0.3s ease;
  }

  .featured-post-card:hover .read-more {
    transform: scale(1);
  }

  .post-content {
    padding: 2rem;
  }

  .post-content h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--black);
    margin-bottom: 1rem;
    line-height: 1.3;
  }

  .post-content p {
    color: var(--gray);
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .post-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: var(--gray);
  }

  .author {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .author-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }

  .post-stats {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .blog-posts {
    padding: 4rem 0;
    background: #f8f9fa;
  }

  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .post-card.visual-enhanced {
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
  }

  .post-card.visual-enhanced:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
  }

  .post-card .post-image {
    height: 200px;
  }

  .post-card .post-content {
    padding: 1.5rem;
  }

  .post-card .post-content h3 {
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
  }

  .post-card .post-content p {
    font-size: 14px;
    margin-bottom: 1rem;
  }

  .post-card .post-category {
    position: static;
    display: inline-block;
    margin-bottom: 1rem;
    background: rgba(193, 168, 138, 0.1);
    color: var(--champagne-taupe);
    font-size: 11px;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
  }

  .pagination-button {
    display: flex;
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

  .pagination-button:hover:not(:disabled) {
    border-color: var(--champagne-taupe);
    color: var(--champagne-taupe);
  }

  .pagination-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pagination-info {
    font-weight: 600;
    color: var(--gray);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .blog-hero .hero-title {
      font-size: 2.5rem;
    }

    .blog-hero .hero-subtitle {
      font-size: 1.1rem;
    }

    .filters-wrapper {
      flex-direction: column;
      gap: 1rem;
    }

    .search-form {
      width: 100%;
    }

    .category-select {
      width: 100%;
    }

    .featured-grid {
      grid-template-columns: 1fr;
    }

    .posts-grid {
      grid-template-columns: 1fr;
    }

    .pagination {
      flex-direction: column;
      gap: 1rem;
    }

    .pagination-button {
      width: 100%;
      justify-content: center;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = blogStyles;
  document.head.appendChild(styleElement);
}
