import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'agent' | 'admin';
  phone?: string;
  avatar?: string;
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: localStorage.getItem('adminToken')
};

// Set up axios defaults
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async thunks
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      
      // Check if user is admin or agent
      if (!['admin', 'agent'].includes(response.data.user.role)) {
        throw new Error('Access denied. Admin or Agent role required.');
      }
      
      localStorage.setItem('adminToken', response.data.token);
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No token found');
      }
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${API_URL}/auth/me`);
      
      // Check if user is admin or agent
      if (!['admin', 'agent'].includes(response.data.data.role)) {
        throw new Error('Access denied. Admin or Agent role required.');
      }
      
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to get user';
      localStorage.removeItem('adminToken');
      delete axios.defaults.headers.common['Authorization'];
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem('adminToken');
      delete axios.defaults.headers.common['Authorization'];
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('adminToken', action.payload.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login Admin
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout, clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
