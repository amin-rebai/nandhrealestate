import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  type: 'sale' | 'rent';
  status: 'available' | 'sold' | 'rented';
  createdAt: string;
  updatedAt: string;
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
  async () => {
    const response = await axios.get('/api/properties');
    return response.data;
  }
);

export const fetchPropertyById = createAsyncThunk(
  'properties/fetchPropertyById',
  async (id: string) => {
    const response = await axios.get(`/api/properties/${id}`);
    return response.data;
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
        state.error = action.error.message || 'Failed to fetch properties';
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
        state.error = action.error.message || 'Failed to fetch property';
      });
  },
});

export const { clearSelectedProperty, clearError } = propertySlice.actions;
export default propertySlice.reducer;
