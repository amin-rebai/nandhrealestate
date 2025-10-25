import { Request, Response } from 'express';
import Content from '../models/Content';
import { getLanguageFromRequest, transformContentForLanguage, SupportedLanguage } from '../utils/languageUtils';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all content sections
// @route   GET /api/content
// @access  Public
export const getContent = async (req: Request, res: Response) => {
  try {
    const { section, active } = req.query;
    const language = getLanguageFromRequest(req);

    // Build filter object
    const filter: any = {};
    if (section) filter.section = section;
    if (active !== undefined) filter.isActive = active === 'true';

    const content = await Content.find(filter).sort({ section: 1, order: 1 });

    // Transform content for the requested language
    const transformedContent = content.map(item =>
      transformContentForLanguage(item.toObject(), language)
    );

    return res.status(200).json({
      success: true,
      count: transformedContent.length,
      data: transformedContent,
      language
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single content section
// @route   GET /api/content/:id
// @access  Public
export const getContentById = async (req: Request, res: Response) => {
  try {
    const language = getLanguageFromRequest(req);
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    // Transform content for the requested language
    const transformedContent = transformContentForLanguage(content.toObject(), language);

    return res.status(200).json({
      success: true,
      data: transformedContent,
      language
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new content section
// @route   POST /api/content
// @access  Private (Admin)
export const createContent = async (req: AuthRequest, res: Response) => {
  try {
    const content = await Content.create(req.body);

    return res.status(201).json({
      success: true,
      data: content
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update content section
// @route   PUT /api/content/:id
// @access  Private (Admin)
export const updateContent = async (req: AuthRequest, res: Response) => {
  try {
    let content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    content = await Content.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      data: content
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete content section
// @route   DELETE /api/content/:id
// @access  Private (Admin)
export const deleteContent = async (req: AuthRequest, res: Response) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    await Content.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get content by section type
// @route   GET /api/content/section/:section
// @access  Public
export const getContentBySection = async (req: Request, res: Response) => {
  try {
    const { section } = req.params;
    const { active = 'true' } = req.query;
    const language = getLanguageFromRequest(req);

    const filter: any = { section };
    if (active !== undefined) filter.isActive = active === 'true';

    const content = await Content.find(filter).sort({ order: 1 });

    // Transform content for the requested language
    const transformedContent = content.map(item =>
      transformContentForLanguage(item.toObject(), language)
    );

    return res.status(200).json({
      success: true,
      count: transformedContent.length,
      data: transformedContent,
      language
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update content order
// @route   PUT /api/content/reorder
// @access  Private (Admin)
export const reorderContent = async (req: AuthRequest, res: Response) => {
  try {
    const { items } = req.body; // Array of { id, order }

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: 'Items must be an array'
      });
    }

    // Update order for each item
    const updatePromises = items.map(item =>
      Content.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updatePromises);

    return res.status(200).json({
      success: true,
      message: 'Content order updated successfully'
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Toggle content active status
// @route   PUT /api/content/:id/toggle
// @access  Private (Admin)
export const toggleContentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    content.isActive = !content.isActive;
    await content.save();

    return res.status(200).json({
      success: true,
      data: content
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
