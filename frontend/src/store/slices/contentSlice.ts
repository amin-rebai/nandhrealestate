import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { SupportedLanguage } from './languageSlice';

export interface ContentItem {
  _id: string;
  section: 'hero' | 'about' | 'featured';
  title: string;
  subtitle?: string;
  content?: string;
  description?: string;
  image?: string;
  backgroundImage?: string;
  ctaText?: string;
  isActive: boolean;
  order?: number;
  stats?: Array<{
    label: string;
    value: string;
  }>;
  metadata?: {
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

interface ContentState {
  content: ContentItem[];
  heroSection: ContentItem | null;
  aboutSection: ContentItem | null;
  featuredSections: ContentItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ContentState = {
  content: [],
  heroSection: null,
  aboutSection: null,
  featuredSections: [],
  loading: false,
  error: null,
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchContent = createAsyncThunk(
  'content/fetchContent',
  async (params: { language?: SupportedLanguage; section?: string; active?: boolean } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.language) queryParams.append('lang', params.language);
      if (params.section) queryParams.append('section', params.section);
      if (params.active !== undefined) queryParams.append('active', params.active.toString());

      const response = await axios.get(`${API_URL}/content?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to fetch content';
      return rejectWithValue(message);
    }
  }
);

export const fetchContentBySection = createAsyncThunk(
  'content/fetchContentBySection',
  async (params: { section: string; language?: SupportedLanguage; active?: boolean }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.language) queryParams.append('lang', params.language);
      if (params.active !== undefined) queryParams.append('active', params.active.toString());

      const response = await axios.get(`${API_URL}/content/section/${params.section}?${queryParams.toString()}`);
      return { section: params.section, data: response.data };
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to fetch content';
      return rejectWithValue(message);
    }
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Content
      .addCase(fetchContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload.data;
        
        // Organize content by sections
        state.heroSection = action.payload.data.find((item: ContentItem) => item.section === 'hero' && item.isActive) || null;
        state.aboutSection = action.payload.data.find((item: ContentItem) => item.section === 'about' && item.isActive) || null;
        state.featuredSections = action.payload.data.filter((item: ContentItem) => item.section === 'featured');
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Content By Section
      .addCase(fetchContentBySection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentBySection.fulfilled, (state, action) => {
        state.loading = false;
        const { section, data } = action.payload;
        
        if (section === 'hero') {
          state.heroSection = data.data.find((item: ContentItem) => item.isActive) || null;
        } else if (section === 'about') {
          state.aboutSection = data.data.find((item: ContentItem) => item.isActive) || null;
        } else if (section === 'featured') {
          state.featuredSections = data.data;
        }
      })
      .addCase(fetchContentBySection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError } = contentSlice.actions;
export default contentSlice.reducer;
