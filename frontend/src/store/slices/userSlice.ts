import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: { email: string; password: string }) => {
    const response = await axios.post('/api/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData: { name: string; email: string; password: string }) => {
    const response = await axios.post('/api/auth/register', userData);
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  }
);

export const getCurrentUser = createAsyncThunk(
  'user/getCurrentUser',
  async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    
    const response = await axios.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      });
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;
