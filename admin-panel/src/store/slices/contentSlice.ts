import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface ContentItem {
  _id: string;
  section: 'home' | 'hero' | 'about' | 'about-home' | 'featured' | 'featured-properties' | 'process-section' | 'services' | 'goals' | 'clients' | 'vision' | 'mission' | 'values' | 'slider' | 'portfolio' | 'contact';
  title: string | { en: string; ar: string; fr?: string };
  subtitle?: string | { en: string; ar: string; fr?: string };
  content?: string | { en: string; ar: string; fr?: string };
  description?: string | { en: string; ar: string; fr?: string };
  image?: string;
  backgroundImage?: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video';
  ctaText?: string | { en: string; ar: string; fr?: string };
  ctaLink?: string;
  propertyType?: 'villa' | 'apartment' | 'penthouse' | 'commercial' | 'office' | 'retail';
  isActive: boolean;
  order?: number;
  stats?: Array<{
    label: string | { en: string; ar: string; fr?: string };
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
  selectedContent: ContentItem | null;
  loading: boolean;
  error: string | null;
  heroSection: ContentItem | null;
  aboutSection: ContentItem | null;
  featuredSections: ContentItem[];
  servicesSections: ContentItem[];
  goalsSections: ContentItem[];
  clientsSections: ContentItem[];
  visionSection: ContentItem | null;
  missionSection: ContentItem | null;
  valuesSections: ContentItem[];
  sliderSections: ContentItem[];
  portfolioSections: ContentItem[];
  contactSection: ContentItem | null;
}

const initialState: ContentState = {
  content: [],
  selectedContent: null,
  loading: false,
  error: null,
  heroSection: null,
  aboutSection: null,
  featuredSections: [],
  servicesSections: [],
  goalsSections: [],
  clientsSections: [],
  visionSection: null,
  missionSection: null,
  valuesSections: [],
  sliderSections: [],
  portfolioSections: [],
  contactSection: null
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Async thunks
export const fetchContent = createAsyncThunk(
  'content/fetchContent',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(`${API_URL}/content?${queryString}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to fetch content';
      return rejectWithValue(message);
    }
  }
);

export const fetchContentBySection = createAsyncThunk(
  'content/fetchContentBySection',
  async (section: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/content/section/${section}`);
      return { section, data: response.data };
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to fetch content';
      return rejectWithValue(message);
    }
  }
);

export const fetchContentById = createAsyncThunk(
  'content/fetchContentById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/content/${id}`);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to fetch content';
      return rejectWithValue(message);
    }
  }
);

export const createContent = createAsyncThunk(
  'content/createContent',
  async (contentData: Partial<ContentItem>, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/content`, contentData);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to create content';
      return rejectWithValue(message);
    }
  }
);

export const updateContent = createAsyncThunk(
  'content/updateContent',
  async ({ id, data }: { id: string; data: Partial<ContentItem> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/content/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to update content';
      return rejectWithValue(message);
    }
  }
);

export const deleteContent = createAsyncThunk(
  'content/deleteContent',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/content/${id}`);
      return id;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to delete content';
      return rejectWithValue(message);
    }
  }
);

export const toggleContentStatus = createAsyncThunk(
  'content/toggleContentStatus',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/content/${id}/toggle`);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to toggle content status';
      return rejectWithValue(message);
    }
  }
);

export const reorderContent = createAsyncThunk(
  'content/reorderContent',
  async (items: Array<{ id: string; order: number }>, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/content/reorder`, { items });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to reorder content';
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
    setSelectedContent: (state, action: PayloadAction<ContentItem | null>) => {
      state.selectedContent = action.payload;
    }
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
        } else if (section === 'services') {
          state.servicesSections = data.data;
        } else if (section === 'goals') {
          state.goalsSections = data.data;
        } else if (section === 'clients') {
          state.clientsSections = data.data;
        } else if (section === 'vision') {
          state.visionSection = data.data.find((item: ContentItem) => item.isActive) || null;
        } else if (section === 'mission') {
          state.missionSection = data.data.find((item: ContentItem) => item.isActive) || null;
        } else if (section === 'values') {
          state.valuesSections = data.data;
        } else if (section === 'slider') {
          state.sliderSections = data.data;
        } else if (section === 'portfolio') {
          state.portfolioSections = data.data;
        } else if (section === 'contact') {
          state.contactSection = data.data[0] || null;
        }
      })
      .addCase(fetchContentBySection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Content
      .addCase(createContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContent.fulfilled, (state, action) => {
        state.loading = false;
        state.content.push(action.payload);

        // Update section-specific state
        if (action.payload.section === 'hero' && action.payload.isActive) {
          state.heroSection = action.payload;
        } else if (action.payload.section === 'about' && action.payload.isActive) {
          state.aboutSection = action.payload;
        } else if (action.payload.section === 'featured') {
          state.featuredSections.push(action.payload);
        } else if (action.payload.section === 'services') {
          state.servicesSections.push(action.payload);
        } else if (action.payload.section === 'goals') {
          state.goalsSections.push(action.payload);
        } else if (action.payload.section === 'clients') {
          state.clientsSections.push(action.payload);
        } else if (action.payload.section === 'vision' && action.payload.isActive) {
          state.visionSection = action.payload;
        } else if (action.payload.section === 'mission' && action.payload.isActive) {
          state.missionSection = action.payload;
        } else if (action.payload.section === 'values') {
          state.valuesSections.push(action.payload);
        } else if (action.payload.section === 'slider') {
          state.sliderSections.push(action.payload);
        } else if (action.payload.section === 'portfolio') {
          state.portfolioSections.push(action.payload);
        }
      })
      .addCase(createContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Content
      .addCase(updateContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.content.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.content[index] = action.payload;
        }

        // Update section-specific state
        if (action.payload.section === 'hero' && action.payload.isActive) {
          state.heroSection = action.payload;
        } else if (action.payload.section === 'about' && action.payload.isActive) {
          state.aboutSection = action.payload;
        } else if (action.payload.section === 'featured') {
          const featuredIndex = state.featuredSections.findIndex(item => item._id === action.payload._id);
          if (featuredIndex !== -1) {
            state.featuredSections[featuredIndex] = action.payload;
          }
        } else if (action.payload.section === 'services') {
          const servicesIndex = state.servicesSections.findIndex(item => item._id === action.payload._id);
          if (servicesIndex !== -1) {
            state.servicesSections[servicesIndex] = action.payload;
          }
        } else if (action.payload.section === 'goals') {
          const goalsIndex = state.goalsSections.findIndex(item => item._id === action.payload._id);
          if (goalsIndex !== -1) {
            state.goalsSections[goalsIndex] = action.payload;
          }
        } else if (action.payload.section === 'clients') {
          const clientsIndex = state.clientsSections.findIndex(item => item._id === action.payload._id);
          if (clientsIndex !== -1) {
            state.clientsSections[clientsIndex] = action.payload;
          }
        } else if (action.payload.section === 'vision' && action.payload.isActive) {
          state.visionSection = action.payload;
        } else if (action.payload.section === 'mission' && action.payload.isActive) {
          state.missionSection = action.payload;
        } else if (action.payload.section === 'values') {
          const valuesIndex = state.valuesSections.findIndex(item => item._id === action.payload._id);
          if (valuesIndex !== -1) {
            state.valuesSections[valuesIndex] = action.payload;
          }
        } else if (action.payload.section === 'slider') {
          const sliderIndex = state.sliderSections.findIndex(item => item._id === action.payload._id);
          if (sliderIndex !== -1) {
            state.sliderSections[sliderIndex] = action.payload;
          }
        } else if (action.payload.section === 'portfolio') {
          const portfolioIndex = state.portfolioSections.findIndex(item => item._id === action.payload._id);
          if (portfolioIndex !== -1) {
            state.portfolioSections[portfolioIndex] = action.payload;
          }
        }

        if (state.selectedContent?._id === action.payload._id) {
          state.selectedContent = action.payload;
        }
      })
      .addCase(updateContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Content
      .addCase(deleteContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContent.fulfilled, (state, action) => {
        state.loading = false;
        state.content = state.content.filter(item => item._id !== action.payload);
        state.featuredSections = state.featuredSections.filter(item => item._id !== action.payload);
        state.servicesSections = state.servicesSections.filter(item => item._id !== action.payload);
        state.goalsSections = state.goalsSections.filter(item => item._id !== action.payload);
        state.clientsSections = state.clientsSections.filter(item => item._id !== action.payload);
        state.valuesSections = state.valuesSections.filter(item => item._id !== action.payload);
        state.sliderSections = state.sliderSections.filter(item => item._id !== action.payload);
        state.portfolioSections = state.portfolioSections.filter(item => item._id !== action.payload);

        // Clear single sections if deleted
        if (state.heroSection?._id === action.payload) {
          state.heroSection = null;
        }
        if (state.aboutSection?._id === action.payload) {
          state.aboutSection = null;
        }
        if (state.visionSection?._id === action.payload) {
          state.visionSection = null;
        }
        if (state.missionSection?._id === action.payload) {
          state.missionSection = null;
        }
        if (state.contactSection?._id === action.payload) {
          state.contactSection = null;
        }

        if (state.selectedContent?._id === action.payload) {
          state.selectedContent = null;
        }
      })
      .addCase(deleteContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle Content Status
      .addCase(toggleContentStatus.fulfilled, (state, action) => {
        const index = state.content.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.content[index] = action.payload;
        }

        // Update section-specific state
        if (action.payload.section === 'featured') {
          const featuredIndex = state.featuredSections.findIndex(item => item._id === action.payload._id);
          if (featuredIndex !== -1) {
            state.featuredSections[featuredIndex] = action.payload;
          }
        }
      });
  }
});

export const { clearError, setSelectedContent } = contentSlice.actions;
export default contentSlice.reducer;
