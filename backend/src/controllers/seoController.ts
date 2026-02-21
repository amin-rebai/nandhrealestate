import { Request, Response } from 'express';
import Property from '../models/Property';
import Blog from '../models/Blog';
import {
  generateProductSchema,
  generateBlogPostSchema,
  generateRealEstateAgentSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateBreadcrumbSchema,
  generateFAQSchema
} from '../services/seoService';

/**
 * Generate XML sitemap for SEO
 */
export const generateSitemap = async (req: Request, res: Response) => {
  try {
    const baseUrl = process.env.SITE_URL || 'https://nhrealestate.qa';

    // Fetch all published properties
    const properties = await Property.find({ status: 'available' })
      .select('updatedAt propertyFinderRefId type location')
      .lean();

    // Fetch all published blog posts
    const blogs = await Blog.find({ status: 'published' })
      .select('slug updatedAt')
      .lean();

    // Static pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/about', priority: '0.8', changefreq: 'monthly' },
      { url: '/services', priority: '0.8', changefreq: 'monthly' },
      { url: '/properties', priority: '0.9', changefreq: 'daily' },
      { url: '/properties?type=sale', priority: '0.9', changefreq: 'daily' },
      { url: '/properties?type=rent', priority: '0.9', changefreq: 'daily' },
      { url: '/agents', priority: '0.7', changefreq: 'monthly' },
      { url: '/blog', priority: '0.8', changefreq: 'weekly' },
      { url: '/contact', priority: '0.8', changefreq: 'monthly' },
      { url: '/our-process', priority: '0.6', changefreq: 'monthly' },
      { url: '/our-partners', priority: '0.6', changefreq: 'monthly' },
    ];

    // Generate sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
         xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

    // Add static pages
    staticPages.forEach(page => {
      sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${page.url}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${baseUrl}/ar${page.url}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${baseUrl}/fr${page.url}" />
  </url>
`;
    });

    // Add properties
    properties.forEach(property => {
      const propertyUrl = property.propertyFinderRefId
        ? `/property/${property.propertyFinderRefId}`
        : `/properties/${property._id}`;

      const lastMod = property.updatedAt
        ? new Date(property.updatedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      sitemap += `  <url>
    <loc>${baseUrl}${propertyUrl}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${propertyUrl}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${baseUrl}/ar${propertyUrl}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${baseUrl}/fr${propertyUrl}" />
  </url>
`;
    });

    // Add blog posts
    blogs.forEach(blog => {
      const blogUrl = `/blog/${blog.slug}`;
      const lastMod = blog.updatedAt
        ? new Date(blog.updatedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      sitemap += `  <url>
    <loc>${baseUrl}${blogUrl}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${blogUrl}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${baseUrl}/ar${blogUrl}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${baseUrl}/fr${blogUrl}" />
  </url>
`;
    });

    sitemap += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);

  } catch (error: any) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
};

/**
 * Generate robots.txt content
 */
export const getRobotsTxt = async (req: Request, res: Response) => {
  const baseUrl = process.env.SITE_URL || 'https://nhrealestate.qa';

  const robotsTxt = `# Robots.txt for N&H Homes Real Estate
# https://nhrealestate.qa

User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-properties.xml
Sitemap: ${baseUrl}/sitemap-blog.xml

# Disallow admin and private areas
Disallow: /admin
Disallow: /api
Disallow: /uploads/private

# Crawl-delay (optional, for respectful crawling)
Crawl-delay: 1

# Googlebot
User-agent: Googlebot
Allow: /
Crawl-delay: 1

# Bingbot
User-agent: Bingbot
Allow: /
Crawl-delay: 1
`;

  res.header('Content-Type', 'text/plain');
  res.send(robotsTxt);
};

/**
 * Get SEO data for a property
 */
export const getPropertySeo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const baseUrl = process.env.SITE_URL || 'https://nhrealestate.qa';

    const property = await Property.findById(id);

    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    // Helper function to extract English text from multilingual fields
    const getText = (field: any): string => {
      if (!field) return '';
      if (typeof field === 'string') return field;
      if (typeof field === 'object' && field.en) return field.en;
      return String(field);
    };

    const title = getText(property.title);
    const description = getText(property.description);

    // Generate meta tags
    const meta = {
      title: `${title} | N&H Homes Real Estate`,
      description: description.substring(0, 160),
      canonical: `${baseUrl}/property/${property._id}`,
      ogTitle: title,
      ogDescription: description.substring(0, 200),
      ogImage: property.images?.[0] || `${baseUrl}/og-image.jpg`,
      ogUrl: `${baseUrl}/property/${property._id}`,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description.substring(0, 200),
      twitterImage: property.images?.[0] || `${baseUrl}/og-image.jpg`,
    };

    // Generate schema - convert to plain object
    const schema = generateProductSchema(property.toObject(), baseUrl);

    // Generate breadcrumbs
    const breadcrumbs = generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Properties', url: '/properties' },
      { name: property.type === 'sale' ? 'For Sale' : 'For Rent', url: `/properties?type=${property.type}` },
      { name: title, url: `/property/${property._id}` }
    ], baseUrl);

    res.json({ meta, schema, breadcrumbs });

  } catch (error: any) {
    console.error('Error getting property SEO:', error);
    res.status(500).json({ error: 'Failed to get property SEO' });
  }
};

/**
 * Get SEO data for a blog post
 */
export const getBlogSeo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const baseUrl = process.env.SITE_URL || 'https://nhrealestate.qa';

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }

    // Helper function to extract English text from multilingual fields
    const getText = (field: any): string => {
      if (!field) return '';
      if (typeof field === 'string') return field;
      if (typeof field === 'object' && field.en) return field.en;
      return String(field);
    };

    const title = getText(blog.title);
    const excerpt = getText(blog.excerpt);

    const meta = {
      title: `${title} | N&H Homes Blog`,
      description: excerpt.substring(0, 160),
      canonical: `${baseUrl}/blog/${slug}`,
      ogTitle: title,
      ogDescription: excerpt.substring(0, 200),
      ogImage: (blog as any).featuredImage || `${baseUrl}/og-image.jpg`,
      ogUrl: `${baseUrl}/blog/${slug}`,
      ogType: 'article',
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: excerpt.substring(0, 200),
      twitterImage: (blog as any).featuredImage || `${baseUrl}/og-image.jpg`,
      articlePublishedTime: blog.createdAt,
      articleAuthor: blog.author?.name || 'N&H Homes Real Estate',
    };

    const schema = generateBlogPostSchema(blog.toObject(), baseUrl);

    const breadcrumbs = generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: title, url: `/blog/${slug}` }
    ], baseUrl);

    res.json({ meta, schema, breadcrumbs });

  } catch (error: any) {
    console.error('Error getting blog SEO:', error);
    res.status(500).json({ error: 'Failed to get blog SEO' });
  }
};

/**
 * Get FAQ SEO data
 */
export const getFaqSeo = async (req: Request, res: Response): Promise<void> => {
  try {
    const baseUrl = process.env.SITE_URL || 'https://nhrealestate.qa';

    // Common real estate FAQs
    const faqs = [
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
        answer: 'Yes, foreigners can own property in designated areas known as "freehold zones." These areas include parts of Lusail, The Pearl Qatar, and other developments. Ownership rights are typically 99-year leases in other areas.'
      },
      {
        question: 'What documents do I need to rent an apartment in Qatar?',
        answer: 'Required documents include passport copy, QID, proof of income (salary certificate or company letter), and bank statements. Some landlords may require additional documentation.'
      },
      {
        question: 'How do I register a property in Qatar?',
        answer: 'Property registration is done at the Ministry of Justice. You need the sale agreement, passport copies, QID, and proof of payment. The registration fee is typically 0.25% of the property value.'
      },
      {
        question: 'What areas are best for property investment in Qatar?',
        answer: 'Popular investment areas include The Pearl Qatar, Lusail, West Bay, Msheireb Downtown, and Al Khor. These areas offer good rental yields and potential for capital appreciation.'
      },
      {
        question: 'Can N&H Homes help with property management?',
        answer: 'Yes, N&H Homes offers comprehensive property management services including tenant screening, rent collection, maintenance, and property inspections.'
      },
      {
        question: 'What is the process for selling property in Qatar?',
        answer: 'The selling process includes obtaining a property valuation, preparing documentation, marketing the property, negotiating with buyers, and completing the transfer at the Ministry of Justice.'
      }
    ];

    const meta = {
      title: 'Frequently Asked Questions | N&H Homes Real Estate',
      description: 'Find answers to common questions about buying, selling, and renting property in Qatar. Expert guidance from N&H Homes Real Estate.',
      canonical: `${baseUrl}/faq`,
      ogTitle: 'Frequently Asked Questions | N&H Homes Real Estate',
      ogDescription: 'Find answers to common questions about buying, selling, and renting property in Qatar.',
      ogImage: `${baseUrl}/og-image.jpg`,
      ogUrl: `${baseUrl}/faq`,
      ogType: 'website',
      twitterCard: 'summary_large_image',
    };

    const schema = generateFAQSchema(faqs);
    const breadcrumbs = generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'FAQ', url: '/faq' }
    ], baseUrl);

    res.json({ meta, schema, breadcrumbs, faqs });

  } catch (error: any) {
    console.error('Error getting FAQ SEO:', error);
    res.status(500).json({ error: 'Failed to get FAQ SEO' });
  }
};

/**
 * Get global SEO data for the website
 */
export const getGlobalSeo = async (req: Request, res: Response): Promise<void> => {
  try {
    const baseUrl = process.env.SITE_URL || 'https://nhrealestate.qa';

    const meta = {
      title: 'N&H Homes Real Estate - Your Global Gateway to Premium Properties',
      description: 'Comprehensive real estate solutions across Qatar, Gulf, MENA, and Europe. Luxury properties, investment opportunities, and professional property management.',
      canonical: baseUrl,
      ogTitle: 'N&H Homes Real Estate - Your Global Gateway to Premium Properties',
      ogDescription: 'Comprehensive real estate solutions across Qatar, Gulf, MENA, and Europe.',
      ogImage: `${baseUrl}/og-image.jpg`,
      ogUrl: baseUrl,
      ogType: 'website',
      twitterCard: 'summary_large_image',
    };

    const schemas = [
      generateRealEstateAgentSchema(baseUrl),
      generateOrganizationSchema(baseUrl),
      generateWebsiteSchema(baseUrl),
    ];

    res.json({ meta, schemas });

  } catch (error: any) {
    console.error('Error getting global SEO:', error);
    res.status(500).json({ error: 'Failed to get global SEO' });
  }
};
