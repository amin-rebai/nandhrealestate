import { Request, Response } from 'express';
import Blog, { IBlog } from '../models/Blog';
import { getLanguageFromRequest, transformContentForLanguage } from '../utils/languageUtils';
import { autoTranslateBlogContent } from '../services/translationService';

// Get all blog posts with filtering and pagination
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const language = getLanguageFromRequest(req);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const isAdmin = req.query.admin === 'true';

    const {
      status,
      category,
      tag,
      featured,
      search,
      author,
      sortBy = 'publishedAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter query
    let filter: any = {};

    // For admin, don't filter by isActive or status unless specified
    if (!isAdmin) {
      filter.isActive = true;
      if (status) {
        filter.status = status;
      } else {
        filter.status = 'published'; // Default to published posts for public API
      }
    } else {
      // For admin, only filter by status if specified
      if (status) {
        filter.status = status;
      }
    }

    if (category) {
      filter.$or = [
        { 'category.en': new RegExp(category as string, 'i') },
        { 'category.ar': new RegExp(category as string, 'i') },
        { 'category.fr': new RegExp(category as string, 'i') }
      ];
    }

    if (tag) {
      filter.$or = [
        { 'tags.en': new RegExp(tag as string, 'i') },
        { 'tags.ar': new RegExp(tag as string, 'i') },
        { 'tags.fr': new RegExp(tag as string, 'i') }
      ];
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    if (author) {
      filter['author.name'] = new RegExp(author as string, 'i');
    }

    // Handle search
    let query = Blog.find(filter);

    if (search) {
      filter.$text = { $search: search as string };
      query = Blog.find(filter).sort({ score: { $meta: 'textScore' } });
    } else {
      // Apply sorting
      const sortOptions: any = {};
      sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;
      query = query.sort(sortOptions);
    }

    // Execute query with pagination
    const blogs = await query
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Blog.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Transform content for requested language
    const transformedBlogs = blogs.map(blog =>
      transformContentForLanguage(blog, language)
    );

    return res.json({
      success: true,
      data: transformedBlogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      language
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching blog posts',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get single blog post by slug
export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const language = getLanguageFromRequest(req);

    // Find by slug in any language
    const blog = await Blog.findOne({
      $or: [
        { 'slug.en': slug },
        { 'slug.ar': slug },
        { 'slug.fr': slug }
      ],
      status: 'published',
      isActive: true
    }).lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment views (async, don't wait)
    Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }).exec();

    // For admin or frontend language switching, return full multilingual content
    if (req.query.admin === 'true') {
      return res.json({
        success: true,
        data: blog,
        language
      });
    }

    // Transform content for requested language
    const transformedBlog = transformContentForLanguage(blog, language);

    return res.json({
      success: true,
      data: transformedBlog,
      language
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching blog post',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get blog post by ID (for admin)
export const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const language = getLanguageFromRequest(req);

    const blog = await Blog.findById(id).lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // For admin, return full multilingual content
    if (req.query.admin === 'true') {
      return res.json({
        success: true,
        data: blog,
        language
      });
    }

    // Transform content for requested language
    const transformedBlog = transformContentForLanguage(blog, language);

    return res.json({
      success: true,
      data: transformedBlog,
      language
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching blog post',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create new blog post
export const createBlog = async (req: Request, res: Response) => {
  try {
    let blogData = req.body;

    // Validate that at least one language has title and content
    const hasTitle = (blogData.title?.en && blogData.title.en.trim()) || (blogData.title?.ar && blogData.title.ar.trim()) || (blogData.title?.fr && blogData.title.fr.trim());
    const hasContent = (blogData.content?.en && blogData.content.en.trim()) || (blogData.content?.ar && blogData.content.ar.trim()) || (blogData.content?.fr && blogData.content.fr.trim());

    if (!hasTitle) {
      return res.status(400).json({
        success: false,
        message: 'Title is required in at least one language'
      });
    }

    if (!hasContent) {
      return res.status(400).json({
        success: false,
        message: 'Content is required in at least one language'
      });
    }

    // Auto-translate content if English is provided but other languages are missing
    blogData = await autoTranslateBlogContent(blogData);

    // Generate slug if not provided
    if (!blogData.slug || (!blogData.slug.en && !blogData.slug.ar && !blogData.slug.fr)) {
      const titleEn = blogData.title?.en || '';
      const titleAr = blogData.title?.ar || '';
      const titleFr = blogData.title?.fr || '';
      blogData.slug = {};

      // Only generate slug for languages that have title
      if (titleEn) {
        blogData.slug.en = titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      if (titleAr) {
        blogData.slug.ar = titleAr.toLowerCase().replace(/[^ا-ي0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      if (titleFr) {
        blogData.slug.fr = titleFr.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
    }


    // console.log("===================== success", blogData)
    const blog = new Blog(blogData);
    await blog.save();

    return res.status(201).json({
      success: true,
      data: blog,
      message: 'Blog post created successfully'
    });
  } catch (error) {
    console.error('Error creating blog:', error);

    if (error instanceof Error && error.message.includes('duplicate key')) {
      return res.status(400).json({
        success: false,
        message: 'A blog post with this slug already exists'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error creating blog post',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update blog post
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let updateData = req.body;

    // Auto-translate content if English is provided but other languages are missing
    updateData = await autoTranslateBlogContent(updateData);

    const blog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    return res.json({
      success: true,
      data: blog,
      message: 'Blog post updated successfully'
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating blog post',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete blog post
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    return res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting blog post',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Toggle blog post status
export const toggleBlogStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'published', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be draft, published, or archived'
      });
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    return res.json({
      success: true,
      data: blog,
      message: `Blog post ${status} successfully`
    });
  } catch (error) {
    console.error('Error updating blog status:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating blog status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Like blog post
export const likeBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    blog.likes += 1;
    await blog.save();

    return res.json({
      success: true,
      data: { likes: blog.likes },
      message: 'Blog post liked successfully'
    });
  } catch (error) {
    console.error('Error liking blog:', error);
    return res.status(500).json({
      success: false,
      message: 'Error liking blog post',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get blog categories
export const getBlogCategories = async (req: Request, res: Response) => {
  try {
    const language = getLanguageFromRequest(req);

    const categories = await Blog.aggregate([
      { $match: { status: 'published', isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Transform categories for requested language
    const transformedCategories = categories.map(cat => ({
      category: language === 'ar' ? cat._id.ar : cat._id.en,
      count: cat.count
    }));

    return res.json({
      success: true,
      data: transformedCategories,
      language
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching blog categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get blog tags
export const getBlogTags = async (req: Request, res: Response) => {
  try {
    const language = getLanguageFromRequest(req);

    const tags = await Blog.aggregate([
      { $match: { status: 'published', isActive: true } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 50 } // Limit to top 50 tags
    ]);

    // Transform tags for requested language
    const transformedTags = tags.map(tag => ({
      tag: language === 'ar' ? tag._id.ar : tag._id.en,
      count: tag.count
    }));

    return res.json({
      success: true,
      data: transformedTags,
      language
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching blog tags',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
