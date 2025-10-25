export interface MultilingualValue {
  en: string;
  ar: string;
}

export const ensureMultilingual = (value: string | MultilingualValue | undefined | null): MultilingualValue => {
  if (!value) {
    return { en: '', ar: '' };
  }
  
  if (typeof value === 'string') {
    return { en: value, ar: value };
  }
  
  return value;
};

export const getMultilingualValue = (value: string | MultilingualValue | undefined | null, language: 'en' | 'ar' = 'en'): string => {
  if (!value) {
    return '';
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  return value[language] || value.en || '';
};

export const createMultilingualValue = (en: string = '', ar: string = ''): MultilingualValue => {
  return { en, ar };
};
