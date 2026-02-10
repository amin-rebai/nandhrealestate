import translate from 'google-translate-api-x';

export interface MultilingualText {
  en: string;
  ar: string;
  fr?: string;
}

/**
 * Translate English text to Arabic and French
 * @param text - English text to translate
 * @returns Object with translations in Arabic and French
 */
export const translateTextFromEnglish = async (text: string): Promise<{ ar: string; fr: string }> => {
  try {
    if (!text || text.trim().length === 0) {
      return { ar: '', fr: '' };
    }

    // Translate to Arabic
    const arResult = await translate(text, { to: 'ar' });
    const arText = arResult.text;

    // Translate to French
    const frResult = await translate(text, { to: 'fr' });
    const frText = frResult.text;

    return {
      ar: arText,
      fr: frText
    };
  } catch (error) {
    console.error('Translation error:', error);
    // Return empty strings if translation fails
    return { ar: '', fr: '' };
  }
};

/**
 * Translate French text to English and Arabic
 * @param text - French text to translate
 * @returns Object with translations in English and Arabic
 */
export const translateTextFromFrench = async (text: string): Promise<{ en: string; ar: string }> => {
  try {
    if (!text || text.trim().length === 0) {
      return { en: '', ar: '' };
    }

    // Translate to English
    const enResult = await translate(text, { to: 'en' });
    const enText = enResult.text;

    // Translate to Arabic
    const arResult = await translate(text, { to: 'ar' });
    const arText = arResult.text;

    return {
      en: enText,
      ar: arText
    };
  } catch (error) {
    console.error('Translation error:', error);
    // Return empty strings if translation fails
    return { en: '', ar: '' };
  }
};

/**
 * Translate Arabic text to English and French
 * @param text - Arabic text to translate
 * @returns Object with translations in English and French
 */
export const translateTextFromArabic = async (text: string): Promise<{ en: string; fr: string }> => {
  try {
    if (!text || text.trim().length === 0) {
      return { en: '', fr: '' };
    }

    // Translate to English
    const enResult = await translate(text, { to: 'en' });
    const enText = enResult.text;

    // Translate to French
    const frResult = await translate(text, { to: 'fr' });
    const frText = frResult.text;

    return {
      en: enText,
      fr: frText
    };
  } catch (error) {
    console.error('Translation error:', error);
    // Return empty strings if translation fails
    return { en: '', fr: '' };
  }
};

/**
 * Auto-fill multilingual content when only one language is provided
 * Supports English, French, and Arabic as source languages
 * @param multilingualObj - Object with multilingual fields
 * @returns Object with auto-translated content
 */
export const autoTranslateContent = async (
  multilingualObj: any
): Promise<any> => {
  if (!multilingualObj) return multilingualObj;

  // If English text exists but Arabic or French are missing, translate from English
  if (multilingualObj.en && (!multilingualObj.ar || !multilingualObj.fr)) {
    const translations = await translateTextFromEnglish(multilingualObj.en);

    return {
      en: multilingualObj.en,
      ar: multilingualObj.ar || translations.ar,
      fr: multilingualObj.fr || translations.fr
    };
  }

  // If French text exists but English or Arabic are missing, translate from French
  if (multilingualObj.fr && (!multilingualObj.en || !multilingualObj.ar)) {
    const translations = await translateTextFromFrench(multilingualObj.fr);

    return {
      en: multilingualObj.en || translations.en,
      ar: multilingualObj.ar || translations.ar,
      fr: multilingualObj.fr
    };
  }

  // If Arabic text exists but English or French are missing, translate from Arabic
  if (multilingualObj.ar && (!multilingualObj.en || !multilingualObj.fr)) {
    const translations = await translateTextFromArabic(multilingualObj.ar);

    return {
      en: multilingualObj.en || translations.en,
      ar: multilingualObj.ar,
      fr: multilingualObj.fr || translations.fr
    };
  }

  return multilingualObj;
};

/**
 * Auto-translate all multilingual fields in blog data
 * @param blogData - Blog post data
 * @returns Blog data with auto-translated fields
 */
export const autoTranslateBlogContent = async (blogData: any): Promise<any> => {
  const translatedData = { ...blogData };

  // Fields that need translation
  const fieldsToTranslate = ['title', 'excerpt', 'content', 'category'];

  for (const field of fieldsToTranslate) {
    if (translatedData[field]) {
      translatedData[field] = await autoTranslateContent(translatedData[field]);
    }
  }

  // Handle tags array
  if (translatedData.tags && Array.isArray(translatedData.tags)) {
    translatedData.tags = await Promise.all(
      translatedData.tags.map((tag: any) => autoTranslateContent(tag))
    );
  }

  // Handle SEO metadata
  if (translatedData.seo) {
    const seoFields = ['metaTitle', 'metaDescription', 'keywords', 'ogTitle', 'ogDescription', 'tiktokTitle', 'tiktokDescription'];

    for (const field of seoFields) {
      if (translatedData.seo[field]) {
        translatedData.seo[field] = await autoTranslateContent(translatedData.seo[field]);
      }
    }
  }

  return translatedData;
};

