import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

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
  title: {
    en: string;
    ar: string;
  } | string; // Support both formats for backward compatibility
  description: {
    en: string;
    ar: string;
  } | string;
  price: number;
  location: {
    en: string;
    ar: string;
  } | string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  yearBuilt: number;
  images: string[];
  video?: string;
  type: 'sale' | 'rent' | 'off-plan';
  status: 'available' | 'sold' | 'rented';
  features: {
    en: string[];
    ar: string[];
  } | string[];
  agent: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  verified: boolean;
  // Property classification
  category: PropertyCategory;
  propertyType: PropertyType | string;
  // Off-plan specific fields
  completionDate?: string;
  paymentPlan?: string;
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
  createdAt: string;
  updatedAt: string;
}

interface PropertyState {
  properties: Property[];
  selectedProperty: Property | null;
  loading: boolean;
  error: string | null;
  total: number;
  pagination: {
    page: number;
    limit: number;
    pages: number;
  };
}

const initialState: PropertyState = {
  properties: [],
  selectedProperty: null,
  loading: false,
  error: null,
  total: 0,
  pagination: {
    page: 1,
    limit: 10,
    pages: 1
  }
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(`${API_URL}/properties?${queryString}`);
      return response.data;
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
      const response = await axios.get(`${API_URL}/properties/${id}`);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to fetch property';
      return rejectWithValue(message);
    }
  }
);

export const createProperty = createAsyncThunk(
  'properties/createProperty',
  async (propertyData: Partial<Property>, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/properties`, propertyData);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to create property';
      return rejectWithValue(message);
    }
  }
);

export const updateProperty = createAsyncThunk(
  'properties/updateProperty',
  async ({ id, data }: { id: string; data: Partial<Property> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/properties/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to update property';
      return rejectWithValue(message);
    }
  }
);

export const deleteProperty = createAsyncThunk(
  'properties/deleteProperty',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/properties/${id}`);
      return id;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to delete property';
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
    setSelectedProperty: (state, action: PayloadAction<Property>) => {
      state.selectedProperty = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Properties
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.data;
        state.total = action.payload.total;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Property By ID
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
        state.error = action.payload as string;
      })
      // Create Property
      .addCase(createProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.properties.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Property
      .addCase(updateProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.properties.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.properties[index] = action.payload;
        }
        if (state.selectedProperty?._id === action.payload._id) {
          state.selectedProperty = action.payload;
        }
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Property
      .addCase(deleteProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = state.properties.filter(p => p._id !== action.payload);
        state.total -= 1;
        if (state.selectedProperty?._id === action.payload) {
          state.selectedProperty = null;
        }
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedProperty, clearError, setSelectedProperty } = propertySlice.actions;
export default propertySlice.reducer;
