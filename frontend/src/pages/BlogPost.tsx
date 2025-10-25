import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchBlogBySlug, likeBlog } from '../store/slices/blogSlice';
import './BlogPost.css';

interface BlogPostData {
  _id: string;
  title: string | { en: string; ar: string };
  slug: string | { en: string; ar: string };
  excerpt: string | { en: string; ar: string };
  content: string | { en: string; ar: string };
  featuredImage: string;
  gallery?: string[];
  author: {
    name: string;
    avatar?: string;
    bio?: string | { en: string; ar: string };
  };
  category: string | { en: string; ar: string };
  tags: Array<string | { en: string; ar: string }>;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  readingTime?: number;
  views: number;
  likes: number;
  seo: {
    metaTitle: string | { en: string; ar: string };
    metaDescription: string | { en: string; ar: string };
    keywords: string | { en: string; ar: string };
    canonicalUrl?: string;
    ogTitle?: string | { en: string; ar: string };
    ogDescription?: string | { en: string; ar: string };
    ogImage?: string;
    twitterTitle?: string | { en: string; ar: string };
    twitterDescription?: string | { en: string; ar: string };
    twitterImage?: string;
  };
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { currentPost: post, loading, error } = useSelector((state: RootState) => state.blog);
  
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (slug) {
      dispatch(fetchBlogBySlug({ slug, language: i18n.language }));
    }
  }, [dispatch, slug, i18n.language]);

  const displayText = (value: string | { en: string; ar: string } | undefined): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[i18n.language as 'en' | 'ar'] || value.en || '';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLike = async () => {
    if (post && !liked) {
      try {
        await dispatch(likeBlog(post._id)).unwrap();
        setLiked(true);
      } catch (error) {
        console.error('Error liking post:', error);
      }
    }
  };

  const sharePost = (platform: string) => {
    if (!post) return;
    
    const url = window.location.href;
    const title = displayText(post.title);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
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
      <div className="blog-post-loading">
        <div className="loading-spinner"></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-post-error">
        <h2>{t('common.error')}</h2>
        <p>{error || t('blog.postNotFound')}</p>
        <Link to="/blog" className="back-to-blog">
          {t('blog.backToBlog')}
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{displayText(post.seo.metaTitle) || displayText(post.title)}</title>
        <meta name="description" content={displayText(post.seo.metaDescription) || displayText(post.excerpt)} />
        <meta name="keywords" content={displayText(post.seo.keywords)} />
        {post.seo.canonicalUrl && <link rel="canonical" href={post.seo.canonicalUrl} />}
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={displayText(post.seo.ogTitle) || displayText(post.title)} />
        <meta property="og:description" content={displayText(post.seo.ogDescription) || displayText(post.excerpt)} />
        <meta property="og:image" content={post.seo.ogImage || post.featuredImage} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={displayText(post.seo.twitterTitle) || displayText(post.title)} />
        <meta name="twitter:description" content={displayText(post.seo.twitterDescription) || displayText(post.excerpt)} />
        <meta name="twitter:image" content={post.seo.twitterImage || post.featuredImage} />
        
        {/* Article Meta */}
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:author" content={post.author.name} />
        <meta property="article:section" content={displayText(post.category)} />
        {post.tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={displayText(tag)} />
        ))}
      </Helmet>

      <article className="blog-post">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <div className="container">
            <Link to="/">{t('navigation.home')}</Link>
            <span className="separator">›</span>
            <Link to="/blog">{t('navigation.blog')}</Link>
            <span className="separator">›</span>
            <span className="current">{displayText(post.title)}</span>
          </div>
        </nav>

        {/* Post Header */}
        <header className="post-header">
          <div className="container">
            <div className="post-category">
              {displayText(post.category)}
            </div>
            <h1 className="post-title">{displayText(post.title)}</h1>
            <p className="post-excerpt">{displayText(post.excerpt)}</p>
            
            <div className="post-meta">
              <div className="author-info">
                {post.author.avatar && (
                  <img src={post.author.avatar} alt={post.author.name} className="author-avatar" />
                )}
                <div className="author-details">
                  <span className="author-name">{post.author.name}</span>
                  <div className="post-stats">
                    <span>{formatDate(post.publishedAt!)}</span>
                    <span>•</span>
                    <span>{post.readingTime} {t('blog.minRead')}</span>
                    <span>•</span>
                    <span>{post.views} {t('blog.views')}</span>
                  </div>
                </div>
              </div>
              
              <div className="social-share">
                <button onClick={() => sharePost('facebook')} className="share-button facebook">
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button onClick={() => sharePost('twitter')} className="share-button twitter">
                  <i className="fab fa-twitter"></i>
                </button>
                <button onClick={() => sharePost('linkedin')} className="share-button linkedin">
                  <i className="fab fa-linkedin-in"></i>
                </button>
                <button onClick={() => sharePost('whatsapp')} className="share-button whatsapp">
                  <i className="fab fa-whatsapp"></i>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="post-featured-image">
          <img src={post.featuredImage} alt={displayText(post.title)} />
        </div>

        {/* Post Content */}
        <div className="post-content">
          <div className="container">
            <div className="content-wrapper">
              <div className="post-body">
                <div 
                  className="content-text"
                  dangerouslySetInnerHTML={{ __html: displayText(post.content) }}
                />
                
                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="post-tags">
                    <h4>{t('blog.tags')}:</h4>
                    <div className="tags-list">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          #{displayText(tag)}
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
                    <i className="fas fa-heart"></i>
                    <span>{post.likes + (liked ? 1 : 0)} {t('blog.likes')}</span>
                  </button>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="post-sidebar">
                {/* Author Bio */}
                <div className="author-bio">
                  <h4>{t('blog.aboutAuthor')}</h4>
                  <div className="author-card">
                    {post.author.avatar && (
                      <img src={post.author.avatar} alt={post.author.name} className="author-avatar-large" />
                    )}
                    <h5>{post.author.name}</h5>
                    {post.author.bio && (
                      <p>{displayText(post.author.bio)}</p>
                    )}
                  </div>
                </div>

                {/* Share Again */}
                <div className="share-widget">
                  <h4>{t('blog.sharePost')}</h4>
                  <div className="share-buttons">
                    <button onClick={() => sharePost('facebook')} className="share-button facebook">
                      <i className="fab fa-facebook-f"></i>
                      Facebook
                    </button>
                    <button onClick={() => sharePost('twitter')} className="share-button twitter">
                      <i className="fab fa-twitter"></i>
                      Twitter
                    </button>
                    <button onClick={() => sharePost('linkedin')} className="share-button linkedin">
                      <i className="fab fa-linkedin-in"></i>
                      LinkedIn
                    </button>
                    <button onClick={() => sharePost('whatsapp')} className="share-button whatsapp">
                      <i className="fab fa-whatsapp"></i>
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
            <Link to="/blog" className="back-to-blog">
              ← {t('blog.backToBlog')}
            </Link>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPost;
