import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  property?: any;
  blogPost?: any;
  schema?: object;
  breadcrumbs?: object;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image, 
  type = 'website',
  property,
  blogPost,
  schema,
  breadcrumbs
}) => {
  const location = useLocation();
  const baseUrl = 'https://nhrealestate.qa';

  useEffect(() => {
    const updateSEO = async () => {
      try {
        let seoData: any = {
          meta: {
            title: title || 'N&H Homes Real Estate - Your Global Gateway to Premium Properties',
            description: description || 'Comprehensive real estate solutions across Qatar, Gulf, MENA, and Europe. Luxury properties, investment opportunities, and professional property management.',
            image: image || `${baseUrl}/og-image.jpg`,
          },
          schema: null
        };

        // Fetch dynamic SEO data if we have a property or blog post
        if (property?._id) {
          const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/seo/property/${property._id}`);
          seoData = response.data;
        } else if (blogPost?.slug) {
          const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/seo/blog/${blogPost.slug}`);
          seoData = response.data;
        }

        // Update title
        if (seoData.meta?.title) {
          document.title = seoData.meta.title;
        }

        // Update meta description
        updateMetaTag('description', seoData.meta?.description || description || '');

        // Update canonical URL
        let canonicalUrl = `${baseUrl}${location.pathname}`;
        if (seoData.meta?.canonical) {
          canonicalUrl = seoData.meta.canonical;
        }
        updateLinkTag('canonical', canonicalUrl);

        // Update Open Graph tags
        updateMetaTag('og:title', seoData.meta?.ogTitle || title || '');
        updateMetaTag('og:description', seoData.meta?.ogDescription || description || '');
        updateMetaTag('og:image', seoData.meta?.ogImage || image || `${baseUrl}/og-image.jpg`);
        updateMetaTag('og:url', seoData.meta?.ogUrl || canonicalUrl);
        updateMetaTag('og:type', seoData.meta?.ogType || type);

        // Update Twitter Card tags
        updateMetaTag('twitter:card', 'summary_large_image');
        updateMetaTag('twitter:title', seoData.meta?.twitterTitle || title || '');
        updateMetaTag('twitter:description', seoData.meta?.twitterDescription || description || '');
        updateMetaTag('twitter:image', seoData.meta?.twitterImage || image || `${baseUrl}/og-image.jpg`);

        // Update hreflang links
        updateHreflangLinks(canonicalUrl);

        // Remove existing schema and add new one
        const existingSchema = document.querySelector('script[type="application/ld+json"]');
        if (existingSchema) {
          existingSchema.remove();
        }

        // Use schema prop if provided, otherwise use API response
        const schemaToUse = schema || seoData.schema;
        
        if (schemaToUse) {
          addSchemaScript(schemaToUse);
        } else if (seoData.schemas && seoData.schemas.length > 0) {
          // Multiple schemas (global SEO)
          seoData.schemas.forEach((schemaItem: any) => {
            addSchemaScript(schemaItem);
          });
        }

      } catch (error) {
        console.error('Error updating SEO:', error);
        // Fallback to basic SEO
        if (title) document.title = title;
        if (description) updateMetaTag('description', description);
      }
    };

    updateSEO();
  }, [location.pathname, property, blogPost, title, description, image, type, schema, breadcrumbs]);

  // Helper functions
  const updateMetaTag = (name: string, content: string) => {
    let element = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`) as HTMLMetaElement;
    if (!element) {
      element = document.createElement('meta');
      if (name.startsWith('og:') || name.startsWith('twitter:')) {
        element.setAttribute('property', name);
      } else {
        element.setAttribute('name', name);
      }
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  const updateLinkTag = (rel: string, href: string) => {
    let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', rel);
      document.head.appendChild(element);
    }
    element.setAttribute('href', href);
  };

  const updateHreflangLinks = (canonicalUrl: string) => {
    // Remove existing hreflang links
    document.querySelectorAll('link[rel="alternate"]').forEach(el => el.remove());

    const languages = [
      { lang: 'en', href: canonicalUrl },
      { lang: 'ar', href: `${baseUrl}/ar${canonicalUrl.replace(baseUrl, '')}` },
      { lang: 'fr', href: `${baseUrl}/fr${canonicalUrl.replace(baseUrl, '')}` },
      { lang: 'x-default', href: canonicalUrl }
    ];

    languages.forEach(({ lang, href }) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', lang);
      link.setAttribute('href', href);
      document.head.appendChild(link);
    });
  };

  const addSchemaScript = (schema: object) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  };

  return null;
};

export default SEO;
