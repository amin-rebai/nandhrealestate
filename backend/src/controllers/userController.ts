import { Request, Response } from 'express';
import User from '../models/User';
import path from 'path';
import fs from 'fs';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const {
      role,
      isActive,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter: any = {};

    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = order === 'desc' ? -1 : 1;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .select('-password');

    const total = await User.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      },
      data: users
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin)
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Private (Admin)
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      phone
    });

    return res.status(201).json({
      success: true,
      data: user
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const fieldsToUpdate = { ...req.body };

    // Remove password from direct update
    if (fieldsToUpdate.password) {
      delete fieldsToUpdate.password;
    }

    const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Delete user avatar if exists
    if (user.avatar) {
      const avatarPath = path.join(__dirname, '../../public/uploads', user.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    await User.findByIdAndDelete(req.params.id);

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

// @desc    Get agents
// @route   GET /api/users/agents
// @access  Public
export const getAgents = async (req: Request, res: Response) => {
  try {
    const agents = await User.find({
      role: { $in: ['agent', 'admin'] },
      isActive: true
    }).select('-password');

    return res.status(200).json({
      success: true,
      count: agents.length,
      data: agents
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
