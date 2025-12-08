import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { compressVideo } from '../utils/videoCompressor';

interface AuthRequest extends Request {
  user?: any;
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../public/uploads');

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images
const imageFileFilter = (req: any, file: any, cb: any) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// File filter for videos
const videoFileFilter = (req: any, file: any, cb: any) => {
  // Check file type
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Not a video! Please upload only videos.'), false);
  }
};

// File filter for media (images and videos)
const mediaFileFilter = (req: any, file: any, cb: any) => {
  // Check file type
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Please upload only images or videos.'), false);
  }
};

// Configure multer for images
const imageUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: imageFileFilter
});

// Configure multer for videos
const videoUpload = multer({
  storage: storage,
  limits: {
    fileSize: 150 * 1024 * 1024, // 100MB limit for videos
  },
  fileFilter: videoFileFilter
});

// Configure multer for media (images and videos)
const mediaUpload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: mediaFileFilter
});

// @desc    Upload single image
// @route   POST /api/upload/image
// @access  Private
export const uploadImage = imageUpload.single('image');

// @desc    Upload single video
// @route   POST /api/upload/video
// @access  Private
export const uploadVideo = videoUpload.single('video');

// @desc    Upload single media file (image or video)
// @route   POST /api/upload/media
// @access  Private
export const uploadMedia = mediaUpload.single('media');

export const handleImageUpload = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload an image'
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: imageUrl,
        type: 'image'
      }
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const handleVideoUpload = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a video'
      });
    }

    const videoPath = path.join(__dirname, '../../public/uploads', req.file.filename);

    // Compress the video
    console.log(`Processing video upload: ${req.file.originalname}`);
    const compressionResult = await compressVideo(videoPath);

    if (!compressionResult.success) {
      console.warn(`Video compression failed: ${compressionResult.error}, using original file`);
    } else if (compressionResult.compressionRatio > 1) {
      console.log(`Video compressed successfully. Ratio: ${compressionResult.compressionRatio.toFixed(2)}x`);
    }

    const videoUrl = `/uploads/${req.file.filename}`;
    const finalSize = compressionResult.compressedSize;

    return res.status(200).json({
      success: true,
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        originalSize: req.file.size,
        size: finalSize,
        url: videoUrl,
        type: 'video',
        compressed: compressionResult.success && compressionResult.compressionRatio > 1,
        compressionRatio: compressionResult.compressionRatio
      }
    });
  } catch (error: any) {
    console.error('Video upload error:', error);
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const handleMediaUpload = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a media file'
      });
    }

    const mediaUrl = `/uploads/${req.file.filename}`;
    const mediaType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';

    let finalSize = req.file.size;
    let compressed = false;
    let compressionRatio = 1;

    // Compress video files
    if (mediaType === 'video') {
      const videoPath = path.join(__dirname, '../../public/uploads', req.file.filename);
      console.log(`Processing media video upload: ${req.file.originalname}`);
      const compressionResult = await compressVideo(videoPath);

      if (compressionResult.success && compressionResult.compressionRatio > 1) {
        finalSize = compressionResult.compressedSize;
        compressed = true;
        compressionRatio = compressionResult.compressionRatio;
        console.log(`Video compressed successfully. Ratio: ${compressionRatio.toFixed(2)}x`);
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        originalSize: req.file.size,
        size: finalSize,
        url: mediaUrl,
        type: mediaType,
        compressed,
        compressionRatio
      }
    });
  } catch (error: any) {
    console.error('Media upload error:', error);
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private
export const uploadImages = imageUpload.array('images', 10); // Max 10 images

export const handleImagesUpload = async (req: AuthRequest, res: Response) => {

  console.log("handleImagesUpload-------------------")
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please upload at least one image'
      });
    }

    const files = req.files as Express.Multer.File[];
    const uploadedFiles = files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: `/uploads/${file.filename}`
    }));

    return res.status(200).json({
      success: true,
      count: uploadedFiles.length,
      data: uploadedFiles
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete image
// @route   DELETE /api/upload/:filename
// @access  Private
export const deleteImage = async (req: AuthRequest, res: Response) => {
  try {
    const { filename } = req.params;
    const imagePath = path.join(__dirname, '../../public/uploads', filename);

    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }

    // Delete the file
    fs.unlinkSync(imagePath);

    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all uploaded images
// @route   GET /api/upload/images
// @access  Private
export const getUploadedImages = async (req: AuthRequest, res: Response) => {
  try {
    const uploadsPath = path.join(__dirname, '../../public/uploads');

    if (!fs.existsSync(uploadsPath)) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    const files = fs.readdirSync(uploadsPath);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });

    const images = imageFiles.map(filename => {
      const filePath = path.join(uploadsPath, filename);
      const stats = fs.statSync(filePath);

      return {
        filename,
        url: `/uploads/${filename}`,
        size: stats.size,
        uploadDate: stats.birthtime
      };
    });

    // Sort by upload date (newest first)
    images.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

    return res.status(200).json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
