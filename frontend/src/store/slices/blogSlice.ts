import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/api';

// Multilingual text interface
interface MultilingualText {
  en: string;
  ar: string;
}

// Blog post interface
export interface BlogPost {
  _id: string;
  title: string | MultilingualText;
  slug: string | MultilingualText;
  excerpt: string | MultilingualText;
  content: string | MultilingualText;
  featuredImage: string;
  gallery?: string[];
  author: {
    name: string;
    avatar?: string;
    bio?: string | MultilingualText;
  };
  category: string | MultilingualText;
  tags: Array<string | MultilingualText>;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  readingTime?: number;
  views: number;
  likes: number;
  seo: {
    metaTitle: string | MultilingualText;
    metaDescription: string | MultilingualText;
    keywords: string | MultilingualText;
    canonicalUrl?: string;
    ogTitle?: string | MultilingualText;
    ogDescription?: string | MultilingualText;
    ogImage?: string;
    tiktokTitle?: string | MultilingualText;
    tiktokDescription?: string | MultilingualText;
    tiktokImage?: string;
  };
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Blog state interface
interface BlogState {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  featuredPosts: BlogPost[];
  categories: Array<{ category: string; count: number }>;
  tags: Array<{ tag: string; count: number }>;
  total: number;
  loading: boolean;
  error: string | null;
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
  featuredPosts: [],
  categories: [],
  tags: [],
  total: 0,
  loading: false,
  error: null,
  filters: {
    page: 1,
    limit: 9
  }
};

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

    // Add admin=true to get full multilingual data for language switching
    queryParams.append('admin', 'true');

    const response = await fetch(`${API_URL}/blog?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }
    return response.json();
  }
);

export const fetchBlogBySlug = createAsyncThunk(
  'blog/fetchBlogBySlug',
  async (params: { slug: string; language?: string }) => {
    const queryParams = new URLSearchParams();
    if (params.language) {
      queryParams.append('language', params.language);
    }

    const response = await fetch(`${API_URL}/blog/slug/${params.slug}?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch blog post');
    }
    return response.json();
  }
);

export const fetchFeaturedBlogs = createAsyncThunk(
  'blog/fetchFeaturedBlogs',
  async (params: { language?: string; limit?: number } = {}) => {
    const queryParams = new URLSearchParams();
    queryParams.append('featured', 'true');
    queryParams.append('status', 'published');

    if (params.language) {
      queryParams.append('language', params.language);
    }
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const response = await fetch(`${API_URL}/blog?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch featured blog posts');
    }
    return response.json();
  }
);

export const likeBlog = createAsyncThunk(
  'blog/likeBlog',
  async (blogId: string) => {
    const response = await fetch(`${API_URL}/blog/${blogId}/like`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to like blog post');
    }
    return response.json();
  }
);

export const fetchBlogCategories = createAsyncThunk(
  'blog/fetchCategories',
  async (language?: string) => {
    const queryParams = new URLSearchParams();
    if (language) {
      queryParams.append('language', language);
    }

    const response = await fetch(`${API_URL}/blog/categories?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  }
);

export const fetchBlogTags = createAsyncThunk(
  'blog/fetchTags',
  async (language?: string) => {
    const queryParams = new URLSearchParams();
    if (language) {
      queryParams.append('language', language);
    }

    const response = await fetch(`${API_URL}/blog/tags?${queryParams}`);
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
    resetBlogState: (state) => {
      state.posts = [];
      state.currentPost = null;
      state.featuredPosts = [];
      state.total = 0;
      state.error = null;
      state.filters = { page: 1, limit: 9 };
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
        state.posts = action.payload.data || [];
        state.total = action.payload.pagination?.totalItems || 0;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch blog posts';
      })

      // Fetch blog by slug
      .addCase(fetchBlogBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload.data;
      })
      .addCase(fetchBlogBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch blog post';
      })

      // Fetch featured blogs
      .addCase(fetchFeaturedBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredPosts = action.payload.data || [];
      })
      .addCase(fetchFeaturedBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch featured blog posts';
      })

      // Like blog
      .addCase(likeBlog.fulfilled, (state, action) => {
        if (state.currentPost && state.currentPost._id === action.payload.data._id) {
          state.currentPost.likes = action.payload.data.likes;
        }

        // Update in posts array if present
        const postIndex = state.posts.findIndex(post => post._id === action.payload.data._id);
        if (postIndex !== -1) {
          state.posts[postIndex].likes = action.payload.data.likes;
        }

        // Update in featured posts if present
        const featuredIndex = state.featuredPosts.findIndex(post => post._id === action.payload.data._id);
        if (featuredIndex !== -1) {
          state.featuredPosts[featuredIndex].likes = action.payload.data.likes;
        }
      })

      // Fetch categories
      .addCase(fetchBlogCategories.fulfilled, (state, action) => {
        state.categories = action.payload.data || [];
      })

      // Fetch tags
      .addCase(fetchBlogTags.fulfilled, (state, action) => {
        state.tags = action.payload.data || [];
      });
  },
});

export const { setFilters, clearCurrentPost, clearError, resetBlogState } = blogSlice.actions;
export default blogSlice.reducer;
