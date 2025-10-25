import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SupportedLanguage = 'en' | 'ar';

interface LanguageState {
  currentLanguage: SupportedLanguage;
  isRTL: boolean;
}

const initialState: LanguageState = {
  currentLanguage: 'en',
  isRTL: false,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<SupportedLanguage>) => {
      state.currentLanguage = action.payload;
      state.isRTL = action.payload === 'ar';
      
      // Update document direction
      document.documentElement.dir = state.isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = action.payload;
      
      // Store in localStorage
      localStorage.setItem('i18nextLng', action.payload);
    },
    toggleLanguage: (state) => {
      const newLanguage: SupportedLanguage = state.currentLanguage === 'en' ? 'ar' : 'en';
      state.currentLanguage = newLanguage;
      state.isRTL = newLanguage === 'ar';
      
      // Update document direction
      document.documentElement.dir = state.isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = newLanguage;
      
      // Store in localStorage
      localStorage.setItem('i18nextLng', newLanguage);
    },
    initializeLanguage: (state) => {
      // Get language from localStorage or browser
      const storedLanguage = localStorage.getItem('i18nextLng') as SupportedLanguage;
      const browserLanguage = navigator.language.startsWith('ar') ? 'ar' : 'en';
      const language = storedLanguage || browserLanguage;
      
      state.currentLanguage = language;
      state.isRTL = language === 'ar';
      
      // Update document direction
      document.documentElement.dir = state.isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  },
});

export const { setLanguage, toggleLanguage, initializeLanguage } = languageSlice.actions;
export default languageSlice.reducer;
