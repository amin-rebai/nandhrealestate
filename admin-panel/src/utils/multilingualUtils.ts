export interface MultilingualValue {
  en: string;
  ar: string;
  fr: string;
}

export const ensureMultilingual = (value: any): MultilingualValue => {
  if (!value) {
    return { en: '', ar: '', fr: '' };
  }

  if (typeof value === 'string') {
    return { en: value, ar: value, fr: value };
  }

  return { en: value.en || '', ar: value.ar || '', fr: value.fr || '' };
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
