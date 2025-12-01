export type MLValue = string | number | { en?: string; ar?: string; fr?: string } | null | undefined;

export const getMultilingualValue = (value: MLValue, language: 'en' | 'ar' | 'fr' = 'en'): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    return (value as any)[language] ?? (value as any).en ?? (value as any).fr ?? '';
  }
  return '';
};

export default getMultilingualValue;
