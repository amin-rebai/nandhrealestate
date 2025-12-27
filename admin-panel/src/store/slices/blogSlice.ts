import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Multilingual text interface
interface MultilingualText {
  en: string;
  ar: string;
}

// SEO metadata interface
interface SEOMetadata {
  metaTitle: MultilingualText;
  metaDescription: MultilingualText;
  keywords: MultilingualText;
  canonicalUrl?: string;
  ogTitle?: MultilingualText;
  ogDescription?: MultilingualText;
  ogImage?: string;
  tiktokTitle?: MultilingualText;
  tiktokDescription?: MultilingualText;
  tiktokImage?: string;
  structuredData?: any;
}

// Blog post interface
export interface BlogPost {
  _id: string;
  title: MultilingualText;
  slug: MultilingualText;
  excerpt: MultilingualText;
  content: MultilingualText;
  featuredImage: string;
  gallery?: string[];
  author: {
    name: string;
    avatar?: string;
    bio?: MultilingualText;
  };
  category: MultilingualText;
  tags: MultilingualText[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  readingTime?: number;
  views: number;
  likes: number;
  seo: SEOMetadata;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Blog state interface
interface BlogState {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  total: number;
  loading: boolean;
  error: string | null;
  categories: Array<{ category: string; count: number }>;
  tags: Array<{ tag: string; count: number }>;
  filters: {
    status?: string;
    category?: string;
    tag?: string;
    search?: string;
    page: number;
    limit: number;
  };
}

// Initial state
const initialState: BlogState = {
  posts: [],
  currentPost: null,
  total: 0,
  loading: false,
  error: null,
  categories: [],
  tags: [],
  filters: {
    page: 1,
    limit: 10
  }
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Async thunks
export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async (params: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    tag?: string;
    search?: string;
    language?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    // Add admin flag to get full multilingual content
    queryParams.append('admin', 'true');

    const response = await fetch(`${API_URL}/blog?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }
    return response.json();
  }
);

export const fetchBlogById = createAsyncThunk(
  'blog/fetchBlogById',
  async (id: string) => {
    const response = await fetch(`${API_URL}/blog/${id}?admin=true`);
    if (!response.ok) {
      throw new Error('Failed to fetch blog post');
    }
    return response.json();
  }
);

export const createBlog = createAsyncThunk(
  'blog/createBlog',
  async (blogData: Partial<BlogPost>) => {
    const response = await fetch(`${API_URL}/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create blog post');
    }
    return response.json();
  }
);

export const updateBlog = createAsyncThunk(
  'blog/updateBlog',
  async ({ id, data }: { id: string; data: Partial<BlogPost> }) => {
    const response = await fetch(`${API_URL}/blog/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update blog post');
    }
    return response.json();
  }
);

export const deleteBlog = createAsyncThunk(
  'blog/deleteBlog',
  async (id: string) => {
    const response = await fetch(`${API_URL}/blog/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete blog post');
    }
    return { id };
  }
);

export const toggleBlogStatus = createAsyncThunk(
  'blog/toggleBlogStatus',
  async ({ id, status }: { id: string; status: string }) => {
    const response = await fetch(`${API_URL}/blog/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update blog status');
    }
    return response.json();
  }
);

export const fetchBlogCategories = createAsyncThunk(
  'blog/fetchCategories',
  async () => {
    const response = await fetch(`${API_URL}/blog/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  }
);

export const fetchBlogTags = createAsyncThunk(
  'blog/fetchTags',
  async () => {
    const response = await fetch(`${API_URL}/blog/tags`);
    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }
    return response.json();
  }
);

// Blog slice
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<BlogState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.data;
        state.total = action.payload.pagination?.totalItems || 0;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch blog posts';
      })

      // Fetch blog by ID
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload.data;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch blog post';
      })

      // Create blog
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload.data);
        state.total += 1;
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create blog post';
      })

      // Update blog
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex(post => post._id === action.payload.data._id);
        if (index !== -1) {
          state.posts[index] = action.payload.data;
        }
        if (state.currentPost && state.currentPost._id === action.payload.data._id) {
          state.currentPost = action.payload.data;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update blog post';
      })

      // Delete blog
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter(post => post._id !== action.payload.id);
        state.total -= 1;
        if (state.currentPost && state.currentPost._id === action.payload.id) {
          state.currentPost = null;
        }
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete blog post';
      })

      // Toggle blog status
      .addCase(toggleBlogStatus.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post._id === action.payload.data._id);
        if (index !== -1) {
          state.posts[index] = action.payload.data;
        }
        if (state.currentPost && state.currentPost._id === action.payload.data._id) {
          state.currentPost = action.payload.data;
        }
      })

      // Fetch categories
      .addCase(fetchBlogCategories.fulfilled, (state, action) => {
        state.categories = action.payload.data;
      })

      // Fetch tags
      .addCase(fetchBlogTags.fulfilled, (state, action) => {
        state.tags = action.payload.data;
      });
  },
});

export const { setFilters, clearCurrentPost, clearError } = blogSlice.actions;
export default blogSlice.reducer;
