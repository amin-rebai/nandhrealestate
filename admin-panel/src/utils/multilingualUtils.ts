export interface MultilingualValue {
  en: string;
  ar: string;
  fr?: string;
}

export const ensureMultilingual = (value: any): MultilingualValue => {
  if (!value) {
    return { en: '', ar: '' };
  }

  if (typeof value === 'string') {
    return { en: value, ar: '' };
  }

  // Return only the languages that have content, with defaults for required fields
  const result: MultilingualValue = {
    en: value.en || '',
    ar: value.ar || ''
  };
  if (value.fr) result.fr = value.fr;

  return result;
};

export const getMultilingualValue = (value: string | MultilingualValue | undefined | null, language: 'en' | 'ar' | 'fr' = 'en'): string => {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  return value[language] || value.en || value.fr || '';
};

export const createMultilingualValue = (en: string = '', ar: string = '', fr: string = ''): MultilingualValue => {
  return { en, ar, fr };
};
