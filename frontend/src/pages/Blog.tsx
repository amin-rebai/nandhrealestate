import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchBlogs } from '../store/slices/blogSlice';
import './Blog.css';

interface BlogPostData {
  _id: string;
  title: string | { en: string; ar: string };
  slug: string | { en: string; ar: string };
  excerpt: string | { en: string; ar: string };
  content: string | { en: string; ar: string };
  featuredImage: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string | { en: string; ar: string };
  tags: Array<string | { en: string; ar: string }>;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  readingTime?: number;
  views: number;
  likes: number;
  isFeatured: boolean;
}

const Blog: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error } = useSelector((state: RootState) => state.blog);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  useEffect(() => {
    dispatch(fetchBlogs({
      status: 'published',
      language: i18n.language,
      page: currentPage,
      limit: postsPerPage,
      search: searchTerm,
      category: selectedCategory
    }));
  }, [dispatch, i18n.language, currentPage, searchTerm, selectedCategory]);

  const displayText = (value: string | { en: string; ar: string } | undefined): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[i18n.language as 'en' | 'ar'] || value.en || '';
  };

  const getSlug = (slug: string | { en: string; ar: string }): string => {
    if (typeof slug === 'string') return slug;
    return slug[i18n.language as 'en' | 'ar'] || slug.en || '';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    // The useEffect will trigger the search
  };

  const featuredPosts = posts.filter(post => post.isFeatured).slice(0, 3);
  const regularPosts = posts.filter(post => !post.isFeatured);

  if (loading) {
    return (
      <div className="blog-loading">
        <div className="loading-spinner"></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-error">
        <h2>{t('common.error')}</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="container">
          <div className="hero-content">
            <h1>{t('blog.title')}</h1>
            <p>{t('blog.subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="blog-filters">
        <div className="container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                placeholder={t('blog.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                {t('common.search')}
              </button>
            </div>
          </form>
          
          <div className="category-filter">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="">{t('blog.allCategories')}</option>
              {/* Categories would be populated from API */}
            </select>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="featured-posts">
          <div className="container">
            <h2>{t('blog.featuredPosts')}</h2>
            <div className="featured-grid">
              {featuredPosts.map((post) => (
                <article key={post._id} className="featured-post-card">
                  <Link to={`/blog/${getSlug(post.slug)}`} className="post-link">
                    <div className="post-image">
                      <img src={post.featuredImage} alt={displayText(post.title)} />
                      <div className="post-category">
                        {displayText(post.category)}
                      </div>
                    </div>
                    <div className="post-content">
                      <h3>{displayText(post.title)}</h3>
                      <p>{displayText(post.excerpt)}</p>
                      <div className="post-meta">
                        <div className="author">
                          {post.author.avatar && (
                            <img src={post.author.avatar} alt={post.author.name} className="author-avatar" />
                          )}
                          <span>{post.author.name}</span>
                        </div>
                        <div className="post-stats">
                          <span>{formatDate(post.publishedAt!)}</span>
                          <span>{post.readingTime} {t('blog.minRead')}</span>
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
          <div className="posts-grid">
            {regularPosts.map((post) => (
              <article key={post._id} className="post-card">
                <Link to={`/blog/${getSlug(post.slug)}`} className="post-link">
                  <div className="post-image">
                    <img src={post.featuredImage} alt={displayText(post.title)} />
                  </div>
                  <div className="post-content">
                    <div className="post-category">
                      {displayText(post.category)}
                    </div>
                    <h3>{displayText(post.title)}</h3>
                    <p>{displayText(post.excerpt)}</p>
                    <div className="post-meta">
                      <div className="author">
                        {post.author.avatar && (
                          <img src={post.author.avatar} alt={post.author.name} className="author-avatar" />
                        )}
                        <span>{post.author.name}</span>
                      </div>
                      <div className="post-stats">
                        <span>{formatDate(post.publishedAt!)}</span>
                        <span>{post.views} {t('blog.views')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {posts.length > postsPerPage && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                {t('common.previous')}
              </button>
              <span className="pagination-info">
                {t('blog.pageInfo', { current: currentPage, total: Math.ceil(posts.length / postsPerPage) })}
              </span>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage * postsPerPage >= posts.length}
                className="pagination-button"
              >
                {t('common.next')}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
