import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Agent {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Property {
  _id: string;
  title: string | { en: string; ar: string; fr?: string };
  description: string | { en: string; ar: string; fr?: string };
  price: number;
  location: string | { en: string; ar: string; fr?: string };
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  type: 'sale' | 'rent' | 'off-plan';
  status: 'available' | 'sold' | 'rented';
  createdAt: string;
  updatedAt: string;
  // Additional fields for compatibility with mock data
  category?: string;
  propertyType?: string;
  country?: string;
  priceText?: string;
  yearBuilt?: number;
  features?: string[] | { en: string[]; ar: string[]; fr?: string[] };
  agent?: string | Agent;
  agentPhone?: string;
  dateAdded?: string;
  verified?: boolean;
  completionDate?: string;
  paymentPlan?: string;
  video?: string;
  developer?: string;
  projectName?: string;
  handoverDate?: string;
  startingPrice?: number;
  downPayment?: string;
  installmentPlan?: string;
}

interface PropertyState {
  properties: Property[];
  selectedProperty: Property | null;
  loading: boolean;
  error: string | null;
}

const initialState: PropertyState = {
  properties: [],
  selectedProperty: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(`http://localhost:5000/api/properties?${queryString}`);
      return response.data.data || response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to fetch properties';
      return rejectWithValue(message);
    }
  }
);

export const fetchPropertyById = createAsyncThunk(
  'properties/fetchPropertyById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/properties/${id}`);
      return response.data.data || response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to fetch property';
      return rejectWithValue(message);
    }
  }
);

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    clearSelectedProperty: (state) => {
      state.selectedProperty = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to fetch properties';
      })
      .addCase(fetchPropertyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProperty = action.payload;
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to fetch property';
      });
  },
});

export const { clearSelectedProperty, clearError } = propertySlice.actions;
export default propertySlice.reducer;
