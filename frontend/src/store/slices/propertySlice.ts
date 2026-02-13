import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Agent {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

// Property category types
export type PropertyCategory = 'residential' | 'commercial' | 'industrial' | 'land';

// Expanded property types
export type PropertyType =
  // Residential
  | 'Apartment' | 'Villa' | 'Penthouse' | 'Studio' | 'Townhouse' | 'Duplex'
  | 'Hotel Apartment' | 'Chalet' | 'Compound Villa' | 'Standalone Villa'
  // Commercial
  | 'Office' | 'Shop' | 'Showroom' | 'Retail Shop' | 'Commercial Villa'
  | 'Restaurant' | 'Whole Building' | 'Hotel'
  // Industrial
  | 'Warehouse' | 'Factory' | 'Labor Camp' | 'Industrial Land'
  // Land
  | 'Land' | 'Land Plot' | 'Residential Land' | 'Commercial Land';

export interface Property {
  _id: string;
  title: string | { en: string; ar: string; fr?: string };
  description: string | { en: string; ar: string; fr?: string };
  price: number;
  currency?: 'QAR' | 'USD' | 'EUR' | 'AED' | 'SAR' | 'KWD' | 'BHD' | 'OMR';
  location: string | { en: string; ar: string; fr?: string };
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  type: 'sale' | 'rent' | 'off-plan';
  status: 'available' | 'sold' | 'rented';
  createdAt: string;
  updatedAt: string;
  // Property classification
  category?: PropertyCategory;
  propertyType?: PropertyType | string;
  // Additional fields
  country?: string;
  priceText?: string;
  // yearBuilt?: number;
  features?: string[] | { en: string[]; ar: string[]; fr?: string[] };
  agent?: string | Agent;
  agentPhone?: string;
  dateAdded?: string;
  verified?: boolean;
  // Off-plan specific fields
  completionDate?: string;
  paymentPlan?: string;
  video?: string;
  developer?: string;
  projectName?: string;
  handoverDate?: string;
  startingPrice?: number;
  downPayment?: string;
  installmentPlan?: string;
  // Additional FGRealty-style fields
  referenceNumber?: string;
  serviceCharge?: number;
  transferFee?: string;
  titleDeed?: boolean;
  tenanted?: boolean;
  availableFrom?: string;
  propertyBrochure?: string;
  layoutImage?: string;
  roi?: string;
  guaranteedReturns?: string;
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
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      // Fetch all properties by default (limit=100 to get all properties)
      const queryParams = { ...params, limit: params.limit || 100 };
      const queryString = new URLSearchParams(queryParams).toString();
      const response = await axios.get(`${API_URL}/properties?${queryString}`);
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
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${API_URL}/properties/${id}`);
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
