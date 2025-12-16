/**
 * Utility functions for handling multilingual content
 */

export type SupportedLanguage = 'en' | 'ar' | 'fr';

/**
 * Extract content for a specific language from multilingual object
 */
export const extractLanguageContent = (
  multilingualObj: any,
  language: SupportedLanguage = 'en'
): any => {
  if (!multilingualObj) return multilingualObj;

  // If it's already a simple value, return as is
  if (typeof multilingualObj === 'string' || typeof multilingualObj === 'number' || typeof multilingualObj === 'boolean') {
    return multilingualObj;
  }

  // If it's an array, process each item
  if (Array.isArray(multilingualObj)) {
    return multilingualObj.map(item => extractLanguageContent(item, language));
  }

  // If it has language properties, extract the requested language
  if (multilingualObj.en !== undefined || multilingualObj.ar !== undefined || multilingualObj.fr !== undefined) {
    return multilingualObj[language] || multilingualObj.en || multilingualObj.ar || multilingualObj.fr;
  }

  // If it's an object, recursively process its properties
  if (typeof multilingualObj === 'object' && multilingualObj !== null) {
    const result: any = {};
    for (const [key, value] of Object.entries(multilingualObj)) {
      result[key] = extractLanguageContent(value, language);
    }
    return result;
  }

  return multilingualObj;
};

/**
 * Transform content object to include only the requested language
 */
export const transformContentForLanguage = (
  content: any,
  language: SupportedLanguage = 'en'
): any => {
  if (!content) return content;

  const transformed = { ...content };

  // Transform multilingual fields
  const multilingualFields = ['title', 'subtitle', 'content', 'description', 'ctaText', 'location'];

  multilingualFields.forEach(field => {
    if (transformed[field]) {
      transformed[field] = extractLanguageContent(transformed[field], language);
    }
  });

  // Handle stats array
  if (transformed.stats && Array.isArray(transformed.stats)) {
    transformed.stats = transformed.stats.map((stat: any) => ({
      ...stat,
      label: extractLanguageContent(stat.label, language)
    }));
  }

  // Handle features array
  if (transformed.features) {
    transformed.features = extractLanguageContent(transformed.features, language);
  }

  // Handle metadata object - recursively transform all multilingual fields
  if (transformed.metadata && typeof transformed.metadata === 'object') {
    transformed.metadata = extractLanguageContent(transformed.metadata, language);
  }

  return transformed;
};

/**
 * Validate that required language content exists
 */
export const validateLanguageContent = (
  content: any,
  requiredFields: string[],
  language: SupportedLanguage
): string[] => {
  const errors: string[] = [];

  requiredFields.forEach(field => {
    if (!content[field] || !content[field][language]) {
      const langName = language === 'en' ? 'English' : language === 'ar' ? 'Arabic' : 'French';
      errors.push(`${field} is required in ${langName}`);
    }
  });

  return errors;
};

/**
 * Get language from request query or headers
 */
export const getLanguageFromRequest = (req: any): SupportedLanguage => {
  // Check query parameter first
  const queryLang = req.query.lang || req.query.language;
  if (queryLang === 'ar' || queryLang === 'en' || queryLang === 'fr') {
    return queryLang as SupportedLanguage;
  }

  // Check Accept-Language header
  const acceptLanguage = req.headers['accept-language'];
  if (acceptLanguage) {
    if (acceptLanguage.includes('ar')) return 'ar';
    if (acceptLanguage.includes('fr')) return 'fr';
    if (acceptLanguage.includes('en')) return 'en';
  }


  // Default to English
  return 'en';
};
