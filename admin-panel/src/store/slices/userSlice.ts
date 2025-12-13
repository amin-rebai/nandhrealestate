import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'agent' | 'admin';
  phone?: string;
  avatar?: string;
  title?: string;
  location?: string;
  rating?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  users: User[];
  agents: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  total: number;
  pagination: {
    page: number;
    limit: number;
    pages: number;
  };
}

const initialState: UserState = {
  users: [],
  agents: [],
  selectedUser: null,
  loading: false,
  error: null,
  total: 0,
  pagination: {
    page: 1,
    limit: 10,
    pages: 1
  }
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(`${API_URL}/users?${queryString}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to fetch users';
      return rejectWithValue(message);
    }
  }
);

export const fetchAgents = createAsyncThunk(
  'users/fetchAgents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/users/agents`);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to fetch agents';
      return rejectWithValue(message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/users/${id}`);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to fetch user';
      return rejectWithValue(message);
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: Partial<User> & { password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/users`, userData);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to create user';
      return rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }: { id: string; data: Partial<User> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/users/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to update user';
      return rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      return id;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to delete user';
      return rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSelectedUser: (state, action: PayloadAction<User>) => {
      state.selectedUser = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.total = action.payload.total;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Agents
      .addCase(fetchAgents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.loading = false;
        state.agents = action.payload;
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User By ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.unshift(action.payload);
        state.total += 1;
        if (action.payload.role === 'agent' || action.payload.role === 'admin') {
          state.agents.unshift(action.payload);
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        const agentIndex = state.agents.findIndex(a => a._id === action.payload._id);
        if (agentIndex !== -1) {
          if (action.payload.role === 'agent' || action.payload.role === 'admin') {
            state.agents[agentIndex] = action.payload;
          } else {
            state.agents.splice(agentIndex, 1);
          }
        } else if (action.payload.role === 'agent' || action.payload.role === 'admin') {
          state.agents.push(action.payload);
        }
        if (state.selectedUser?._id === action.payload._id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(u => u._id !== action.payload);
        state.agents = state.agents.filter(a => a._id !== action.payload);
        state.total -= 1;
        if (state.selectedUser?._id === action.payload) {
          state.selectedUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedUser, clearError, setSelectedUser } = userSlice.actions;
export default userSlice.reducer;
