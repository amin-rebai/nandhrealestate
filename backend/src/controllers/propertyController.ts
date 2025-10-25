import { Request, Response } from 'express';
import Property from '../models/Property';
import path from 'path';
import fs from 'fs';
import { getLanguageFromRequest, transformContentForLanguage, SupportedLanguage } from '../utils/languageUtils';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req: Request, res: Response) => {
  try {
    const {
      category,
      location,
      propertyType,
      bedrooms,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    // Build filter object
    const filter: any = {};

    if (category) filter.type = category;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (propertyType) filter.propertyType = propertyType;
    if (bedrooms) filter.bedrooms = bedrooms;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = order === 'desc' ? -1 : 1;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const properties = await Property.find(filter)
      .populate('agent', 'name email phone')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Property.countDocuments(filter);
    const language = getLanguageFromRequest(req);

    // Transform properties for the requested language
    const transformedProperties = properties.map(property =>
      transformContentForLanguage(property.toObject(), language)
    );

    return res.status(200).json({
      success: true,
      count: transformedProperties.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      },
      data: transformedProperties,
      language
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
export const getProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id).populate('agent', 'name email phone');
    const language = getLanguageFromRequest(req);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }

    // Transform property for the requested language
    const transformedProperty = transformContentForLanguage(property.toObject(), language);

    return res.status(200).json({
      success: true,
      data: transformedProperty,
      language
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Agent/Admin)
export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    // Add user to req.body
    req.body.agent = req.user.id;

    const property = await Property.create(req.body);

    return res.status(201).json({
      success: true,
      data: property
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Agent/Admin)
export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }

    // Make sure user is property owner or admin
    if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this property'
      });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      data: property
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};


// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Agent/Admin)
export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }

    // Make sure user is property owner or admin
    if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this property'
      });
    }

    // Delete property images
    if (property.images && property.images.length > 0) {
      property.images.forEach(image => {
        const imagePath = path.join(__dirname, '../../public/uploads', image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await Property.findByIdAndDelete(req.params.id);

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
