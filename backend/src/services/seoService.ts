/**
 * SEO Schema Markup Service
 * Generates JSON-LD structured data for better search engine visibility
 */

interface Property {
  _id: any;
  title: string | { en: string; ar: string; fr?: string } | any;
  description: string | { en: string; ar: string; fr?: string } | any;
  price: number;
  currency?: string;
  location: string | { en: string; ar: string; fr?: string } | any;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images?: string[];
  type: 'sale' | 'rent' | 'off-plan';
  propertyType?: string;
  featured?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface BlogPost {
  _id: any;
  title: string | { en: string; ar: string; fr?: string } | any;
  slug: string;
  excerpt?: string | { en: string; ar: string; fr?: string } | any;
  content?: string | { en: string; ar: string; fr?: string } | any;
  image?: string;
  coverImage?: string;
  author?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

/**
 * Generate Product schema for a property (Real Estate Listing)
 */
export const generateProductSchema = (property: Property, baseUrl: string): object => {
  const title = typeof property.title === 'object' ? property.title.en : property.title;
  const description = typeof property.description === 'object' ? property.description.en : property.description;
  const location = typeof property.location === 'object' ? property.location.en : property.location;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: description.substring(0, 5000),
    image: property.images?.[0] || `${baseUrl}/images/og-image.jpg`,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: property.currency || 'QAR',
      availability: property.type === 'sale'
        ? 'https://schema.org/ForSale'
        : 'https://schema.org/ForRent',
      url: `${baseUrl}/property/${property._id}`
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Bedrooms',
        value: property.bedrooms
      },
      {
        '@type': 'PropertyValue',
        name: 'Bathrooms',
        value: property.bathrooms
      },
      {
        '@type': 'PropertyValue',
        name: 'Area',
        value: `${property.area} sqm`
      },
      {
        '@type': 'PropertyValue',
        name: 'Property Type',
        value: property.propertyType || 'Apartment'
      },
      {
        '@type': 'PropertyValue',
        name: 'Listing Type',
        value: property.type === 'sale' ? 'For Sale' : 'For Rent'
      },
      {
        '@type': 'PropertyValue',
        name: 'Location',
        value: location
      }
    ]
  };
};

/**
 * Generate FAQ schema for FAQ page
 */
export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>): object => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};

/**
 * Generate BreadcrumbList schema
 */
export const generateBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>,
  baseUrl: string
): object => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`
    }))
  };
};

/**
 * Generate BlogPost schema
 */
export const generateBlogPostSchema = (post: BlogPost, baseUrl: string): object => {
  const title = typeof post.title === 'object' ? post.title.en : post.title;
  const description = typeof post.excerpt === 'object' ? post.excerpt.en : (post.excerpt || '');

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description.substring(0, 5000),
    image: post.image || `${baseUrl}/images/og-image.jpg`,
    author: {
      '@type': 'Person',
      name: post.author || 'N&H Homes Real Estate'
    },
    publisher: {
      '@type': 'Organization',
      name: 'N&H Homes Real Estate',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    datePublished: post.createdAt || new Date().toISOString(),
    dateModified: post.updatedAt || new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`
    }
  };
};

/**
 * Generate RealEstateAgent schema
 */
export const generateRealEstateAgentSchema = (baseUrl: string): object => {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'N&H Homes Real Estate',
    description: 'Qatar-headquartered property services company offering integrated real estate solutions across the Gulf, MENA, and Europe.',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    telephone: '+974 7070 4504',
    email: 'info@nhrealestate.qa',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Doha',
      addressCountry: 'Qatar'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '25.2854',
      longitude: '51.5310'
    },
    openingHours: 'Mo-Su 09:00-18:00',
    priceRange: '$$$',
    areaServed: [
      { '@type': 'Country', name: 'Qatar' },
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Country', name: 'Saudi Arabia' },
      { '@type': 'Country', name: 'Egypt' },
      { '@type': 'Country', name: 'France' },
      { '@type': 'Country', name: 'Turkey' }
    ],
    serviceType: [
      'Real Estate Sales',
      'Property Leasing',
      'Property Management',
      'Real Estate Investment'
    ]
  };
};

/**
 * Generate Organization schema
 */
export const generateOrganizationSchema = (baseUrl: string): object => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'N&H Homes Real Estate',
    alternateName: 'N&H Homes',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Your Global Gateway to Premium Properties. Comprehensive real estate solutions across Qatar, Gulf, MENA, and Europe.',
    telephone: '+974 7070 4504',
    email: 'info@nhrealestate.qa',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Doha',
      addressLocality: 'Doha',
      addressCountry: 'Qatar'
    },
    sameAs: [
      'https://www.facebook.com/nhomesrealestate',
      'https://www.instagram.com/nhomesrealestate',
      'https://twitter.com/nhomesrealestate',
      'https://www.linkedin.com/company/nhomesrealestate'
    ]
  };
};

/**
 * Generate Website schema with search action
 */
export const generateWebsiteSchema = (baseUrl: string): object => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'N&H Homes Real Estate',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/properties?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
};
