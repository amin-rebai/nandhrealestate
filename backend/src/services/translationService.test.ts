import {
  translateTextFromEnglish,
  translateTextFromFrench,
  translateTextFromArabic,
  autoTranslateContent,
  autoTranslateBlogContent
} from './translationService';

/**
 * Test suite for translation service
 * These tests demonstrate the auto-translation functionality
 */

describe('Translation Service', () => {

  describe('translateTextFromEnglish', () => {
    it('should translate English text to Arabic and French', async () => {
      const englishText = 'Welcome to our real estate blog';
      const result = await translateTextFromEnglish(englishText);

      expect(result).toHaveProperty('ar');
      expect(result).toHaveProperty('fr');
      expect(result.ar).toBeTruthy();
      expect(result.fr).toBeTruthy();
      console.log('English translation result:', result);
    });

    it('should handle empty strings', async () => {
      const result = await translateTextFromEnglish('');
      expect(result.ar).toBe('');
      expect(result.fr).toBe('');
    });
  });

  describe('translateTextFromFrench', () => {
    it('should translate French text to English and Arabic', async () => {
      const frenchText = 'Bienvenue sur notre blog immobilier';
      const result = await translateTextFromFrench(frenchText);

      expect(result).toHaveProperty('en');
      expect(result).toHaveProperty('ar');
      expect(result.en).toBeTruthy();
      expect(result.ar).toBeTruthy();
      console.log('French translation result:', result);
    });

    it('should handle empty strings', async () => {
      const result = await translateTextFromFrench('');
      expect(result.en).toBe('');
      expect(result.ar).toBe('');
    });
  });

  describe('translateTextFromArabic', () => {
    it('should translate Arabic text to English and French', async () => {
      const arabicText = 'مرحبا بك في مدونتنا العقارية';
      const result = await translateTextFromArabic(arabicText);

      expect(result).toHaveProperty('en');
      expect(result).toHaveProperty('fr');
      expect(result.en).toBeTruthy();
      expect(result.fr).toBeTruthy();
      console.log('Arabic translation result:', result);
    });

    it('should handle empty strings', async () => {
      const result = await translateTextFromArabic('');
      expect(result.en).toBe('');
      expect(result.fr).toBe('');
    });
  });

  describe('autoTranslateContent', () => {
    it('should auto-translate when only English is provided', async () => {
      const content = {
        en: 'Real Estate Tips'
      };

      const result = await autoTranslateContent(content);

      expect(result.en).toBe('Real Estate Tips');
      expect(result.ar).toBeTruthy();
      expect(result.fr).toBeTruthy();
      console.log('Auto-translated from English:', result);
    });

    it('should auto-translate when only French is provided', async () => {
      const content = {
        fr: 'Conseils Immobiliers'
      };

      const result = await autoTranslateContent(content);

      expect(result.fr).toBe('Conseils Immobiliers');
      expect(result.en).toBeTruthy();
      expect(result.ar).toBeTruthy();
      console.log('Auto-translated from French:', result);
    });

    it('should auto-translate when only Arabic is provided', async () => {
      const content = {
        ar: 'نصائح العقارات'
      };

      const result = await autoTranslateContent(content);

      expect(result.ar).toBe('نصائح العقارات');
      expect(result.en).toBeTruthy();
      expect(result.fr).toBeTruthy();
      console.log('Auto-translated from Arabic:', result);
    });

    it('should preserve existing translations', async () => {
      const content = {
        en: 'Real Estate Tips',
        ar: 'نصائح العقارات',
        fr: 'Conseils Immobiliers'
      };

      const result = await autoTranslateContent(content);

      expect(result.en).toBe('Real Estate Tips');
      expect(result.ar).toBe('نصائح العقارات');
      expect(result.fr).toBe('Conseils Immobiliers');
    });

    it('should fill missing translations from English', async () => {
      const content = {
        en: 'How to buy a house',
        ar: 'كيفية شراء منزل'
      };

      const result = await autoTranslateContent(content);

      expect(result.en).toBe('How to buy a house');
      expect(result.ar).toBe('كيفية شراء منزل');
      expect(result.fr).toBeTruthy(); // Should be auto-translated
      console.log('Partially translated from English:', result);
    });

    it('should fill missing translations from French', async () => {
      const content = {
        fr: 'Comment acheter une maison',
        ar: 'كيفية شراء منزل'
      };

      const result = await autoTranslateContent(content);

      expect(result.fr).toBe('Comment acheter une maison');
      expect(result.ar).toBe('كيفية شراء منزل');
      expect(result.en).toBeTruthy(); // Should be auto-translated
      console.log('Partially translated from French:', result);
    });

    it('should fill missing translations from Arabic', async () => {
      const content = {
        ar: 'كيفية شراء منزل',
        en: 'How to buy a house'
      };

      const result = await autoTranslateContent(content);

      expect(result.ar).toBe('كيفية شراء منزل');
      expect(result.en).toBe('How to buy a house');
      expect(result.fr).toBeTruthy(); // Should be auto-translated
      console.log('Partially translated from Arabic:', result);
    });
  });

  describe('autoTranslateBlogContent', () => {
    it('should auto-translate all blog fields', async () => {
      const blogData = {
        title: { en: 'Best Properties in Dubai' },
        excerpt: { en: 'Discover the best properties available in Dubai' },
        content: { en: 'Dubai is one of the most sought-after real estate markets...' },
        category: { en: 'Real Estate' },
        tags: [{ en: 'Dubai' }, { en: 'Properties' }],
        seo: {
          metaTitle: { en: 'Best Properties in Dubai' },
          metaDescription: { en: 'Find the best properties in Dubai' }
        }
      };

      const result = await autoTranslateBlogContent(blogData);

      // Check title
      expect(result.title.en).toBe('Best Properties in Dubai');
      expect(result.title.ar).toBeTruthy();
      expect(result.title.fr).toBeTruthy();

      // Check excerpt
      expect(result.excerpt.en).toBe('Discover the best properties available in Dubai');
      expect(result.excerpt.ar).toBeTruthy();

      // Check tags
      expect(result.tags[0].ar).toBeTruthy();
      expect(result.tags[1].fr).toBeTruthy();

      console.log('Auto-translated blog data:', result);
    });
  });
});

/**
 * Example usage in blog creation:
 * 
 * When a user creates a blog post with only English content:
 * 
 * POST /api/blog
 * {
 *   "title": { "en": "10 Tips for First-Time Home Buyers" },
 *   "excerpt": { "en": "Learn the essential tips for buying your first home" },
 *   "content": { "en": "Buying a home is one of the biggest decisions..." },
 *   "category": { "en": "Buying Guide" },
 *   "tags": [{ "en": "Home Buying" }, { "en": "Tips" }]
 * }
 * 
 * The system will automatically translate to Arabic and French:
 * 
 * {
 *   "title": {
 *     "en": "10 Tips for First-Time Home Buyers",
 *     "ar": "10 نصائح لمشتري المنازل لأول مرة",
 *     "fr": "10 conseils pour les acheteurs de maison pour la première fois"
 *   },
 *   "excerpt": {
 *     "en": "Learn the essential tips for buying your first home",
 *     "ar": "تعلم النصائح الأساسية لشراء منزلك الأول",
 *     "fr": "Apprenez les conseils essentiels pour acheter votre première maison"
 *   },
 *   ...
 * }
 */

