import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Alert,
  IconButton,
  Card,
  CardMedia,
  CardActions,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Visibility,
  Close,
  Image as ImageIcon
} from '@mui/icons-material';
import axios from 'axios';

interface ImageUploadProps {
  value?: string | string[]; // Single URL or array of URLs
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  accept?: string;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  showPreview?: boolean;
  dragAndDrop?: boolean;
  variant?: 'button' | 'dropzone' | 'compact';
}

interface UploadedImage {
  url: string;
  filename: string;
  size: number;
}

interface PendingImage {
  file: File;
  preview: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  multiple = false,
  maxFiles = 10,
  maxSize = 5,
  accept = 'image/*',
  label = 'Upload Images',
  helperText,
  disabled = false,
  showPreview = true,
  dragAndDrop = true,
  variant = 'dropzone'
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Convert value to array for consistent handling
  const imageUrls = multiple
    ? (Array.isArray(value) ? value : (value ? [value] : []))
    : (value ? [value as string] : []);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      pendingImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [pendingImages]);

  const handleFileSelect = useCallback(async (files: FileList) => {
    if (disabled) return;

    setError(null);
    const selectedFiles = Array.from(files);

    // Validate file count
    if (multiple && selectedFiles.length + imageUrls.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate file sizes
    const oversizedFiles = selectedFiles.filter(file => file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`Files must be smaller than ${maxSize}MB`);
      return;
    }

    // Validate file types
    const invalidFiles = selectedFiles.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError('Only image files are allowed');
      return;
    }

    // Create preview URLs for selected files
    const pendingImagesWithPreviews: PendingImage[] = selectedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPendingImages(pendingImagesWithPreviews);
    setConfirmDialogOpen(true);

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [disabled, multiple, maxFiles, maxSize, imageUrls]);

  const handleConfirmUpload = useCallback(async () => {
    if (pendingImages.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const uploadedImages: string[] = [];

      for (const pendingImage of pendingImages) {
        const formData = new FormData();
        formData.append('image', pendingImage.file);

        const response = await axios.post(`${API_URL}/upload/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          },
        });

        uploadedImages.push(response.data.data.url);
      }

      if (multiple) {
        const newUrls = [...imageUrls, ...uploadedImages];
        onChange(newUrls);
      } else {
        onChange(uploadedImages[0]);
      }

      // Clean up preview URLs
      pendingImages.forEach(img => URL.revokeObjectURL(img.preview));
      setPendingImages([]);
      setConfirmDialogOpen(false);
    } catch (error: any) {
      console.error('Upload failed:', error);
      setError(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [pendingImages, multiple, imageUrls, onChange, API_URL]);

  const handleCancelUpload = useCallback(() => {
    // Clean up preview URLs
    pendingImages.forEach(img => URL.revokeObjectURL(img.preview));
    setPendingImages([]);
    setConfirmDialogOpen(false);
    setError(null);
  }, [pendingImages]);

  const handleRemovePendingImage = useCallback((index: number) => {
    const newPendingImages = [...pendingImages];
    URL.revokeObjectURL(newPendingImages[index].preview);
    newPendingImages.splice(index, 1);
    setPendingImages(newPendingImages);
  }, [pendingImages]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (disabled || !dragAndDrop) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [disabled, dragAndDrop, handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && dragAndDrop) {
      setDragOver(true);
    }
  }, [disabled, dragAndDrop]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleRemoveImage = (index: number) => {
    if (disabled) return;

    if (multiple) {
      const newUrls = imageUrls.filter((_, i) => i !== index);
      onChange(newUrls);
    } else {
      onChange('');
    }
  };

  const handlePreview = (url: string) => {
    setPreviewImage(url);
    setPreviewOpen(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Compact variant for inline use
  if (variant === 'compact') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          style={{ display: 'none' }}
        />
        <Button
          variant="outlined"
          size="small"
          startIcon={<CloudUpload />}
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          sx={{
            borderColor: '#4B0E14',
            color: '#4B0E14',
            '&:hover': {
              borderColor: '#3a0b10',
              backgroundColor: '#f8f5f0'
            }
          }}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
        {imageUrls.length > 0 && (
          <Chip
            label={`${imageUrls.length} image${imageUrls.length > 1 ? 's' : ''}`}
            size="small"
            color="primary"
          />
        )}
      </Box>
    );
  }

  // Button variant
  if (variant === 'button') {
    return (
      <Box>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          style={{ display: 'none' }}
        />
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          sx={{
            backgroundColor: '#4B0E14',
            '&:hover': { backgroundColor: '#3a0b10' }
          }}
        >
          {uploading ? 'Uploading...' : label}
        </Button>
        {helperText && (
          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#666' }}>
            {helperText}
          </Typography>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}
        {uploading && <LinearProgress sx={{ mt: 1 }} />}
      </Box>
    );
  }

  // Default dropzone variant
  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
        style={{ display: 'none' }}
      />
      
      {/* Upload Area */}
      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
        sx={{
          border: `2px dashed ${dragOver ? '#4B0E14' : '#ddd'}`,
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          backgroundColor: dragOver ? '#f8f5f0' : disabled ? '#f5f5f5' : 'transparent',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: disabled ? '#ddd' : '#4B0E14',
            backgroundColor: disabled ? '#f5f5f5' : '#f8f5f0'
          }
        }}
      >
        <ImageIcon sx={{ fontSize: 48, color: disabled ? '#ccc' : '#4B0E14', mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1, color: disabled ? '#ccc' : '#4B0E14' }}>
          {dragAndDrop ? 'Drag & drop images here' : 'Click to upload images'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
          {dragAndDrop && 'or click to browse files'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<CloudUpload />}
          disabled={disabled}
          sx={{
            borderColor: '#4B0E14',
            color: '#4B0E14',
            '&:hover': {
              borderColor: '#3a0b10',
              backgroundColor: '#f8f5f0'
            }
          }}
        >
          {label}
        </Button>
        {helperText && (
          <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#666' }}>
            {helperText}
          </Typography>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: '#666' }}>
            Uploading images...
          </Typography>
        </Box>
      )}

      {/* Image Preview Grid */}
      {showPreview && imageUrls.length > 0 && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {imageUrls.map((url, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="120"
                  image={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${url}`}
                  alt={`Upload ${index + 1}`}
                  sx={{ objectFit: 'cover' }}
                />
                <CardActions sx={{ p: 1, justifyContent: 'center' }}>
                  <IconButton
                    size="small"
                    onClick={() => handlePreview(`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${url}`)}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    disabled={disabled}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Upload Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelUpload}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Confirm Upload ({pendingImages.length} {pendingImages.length === 1 ? 'image' : 'images'})
          <IconButton onClick={handleCancelUpload} disabled={uploading}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Review the selected images before uploading:
          </Typography>

          <Grid container spacing={2}>
            {pendingImages.map((pendingImage, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={pendingImage.preview}
                    alt={pendingImage.file.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
                    <Box>
                      <Typography variant="caption" display="block" noWrap sx={{ maxWidth: 120 }}>
                        {pendingImage.file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(pendingImage.file.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleRemovePendingImage(index)}
                      disabled={uploading}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {uploading && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Uploading images...
              </Typography>
              <LinearProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelUpload}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmUpload}
            variant="contained"
            disabled={uploading || pendingImages.length === 0}
            sx={{
              backgroundColor: '#4B0E14',
              '&:hover': { backgroundColor: '#3a0b10' }
            }}
          >
            {uploading ? 'Uploading...' : `Upload ${pendingImages.length} ${pendingImages.length === 1 ? 'Image' : 'Images'}`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Image Preview
          <IconButton onClick={() => setPreviewOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center' }}>
            <img
              src={previewImage}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain'
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ImageUpload;
