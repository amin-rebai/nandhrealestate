import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Close,
  PlayArrow,
  Videocam
} from '@mui/icons-material';
import axios from 'axios';

interface VideoUploadProps {
  value?: string;
  onChange: (value: string) => void;
  maxSize?: number; // in MB
  accept?: string;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  showPreview?: boolean;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
  value,
  onChange,
  maxSize = 100,
  accept = 'video/mp4,video/webm,video/quicktime',
  label = 'Upload Video',
  helperText,
  disabled = false,
  showPreview = true
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingVideo, setPendingVideo] = useState<{ file: File; preview: string } | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleFileSelect = useCallback(async (files: FileList) => {
    if (disabled) return;
    setError(null);

    const file = files[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Video must be smaller than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Only video files are allowed');
      return;
    }

    setPendingVideo({ file, preview: URL.createObjectURL(file) });
    setConfirmDialogOpen(true);

    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [disabled, maxSize]);

  const handleConfirmUpload = useCallback(async () => {
    if (!pendingVideo) return;
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('video', pendingVideo.file);

      const response = await axios.post(`${API_URL}/upload/video`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
      });

      onChange(response.data.data.url);
      URL.revokeObjectURL(pendingVideo.preview);
      setPendingVideo(null);
      setConfirmDialogOpen(false);
    } catch (error: any) {
      console.error('Upload failed:', error);
      setError(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [pendingVideo, onChange, API_URL]);

  const handleCancelUpload = useCallback(() => {
    if (pendingVideo) URL.revokeObjectURL(pendingVideo.preview);
    setPendingVideo(null);
    setConfirmDialogOpen(false);
    setError(null);
  }, [pendingVideo]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFileSelect(files);
  }, [disabled, handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleRemoveVideo = () => {
    if (!disabled) onChange('');
  };

  const getVideoUrl = (url: string) => {
    return url.startsWith('http') ? url : `${API_URL.replace('/api', '')}${url}`;
  };

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
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
        <Videocam sx={{ fontSize: 48, color: disabled ? '#ccc' : '#4B0E14', mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1, color: disabled ? '#ccc' : '#4B0E14' }}>
          Drag & drop video here
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
          or click to browse files
        </Typography>
        <Button
          variant="outlined"
          startIcon={<CloudUpload />}
          disabled={disabled}
          sx={{ borderColor: '#4B0E14', color: '#4B0E14', '&:hover': { borderColor: '#3a0b10', backgroundColor: '#f8f5f0' } }}
        >
          {label}
        </Button>
        {helperText && (
          <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#666' }}>
            {helperText}
          </Typography>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: '#666' }}>Uploading video...</Typography>
        </Box>
      )}

      {/* Video Preview */}
      {showPreview && value && (
        <Box sx={{ mt: 2, position: 'relative' }}>
          <Typography variant="caption" sx={{ color: 'green', display: 'block', mb: 1 }}>✓ Video uploaded</Typography>
          <Box sx={{ borderRadius: 2, overflow: 'hidden', backgroundColor: '#000', position: 'relative' }}>
            <video
              src={getVideoUrl(value)}
              controls
              muted
              loop
              playsInline
              style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
            />
            <IconButton
              onClick={(e) => { e.stopPropagation(); handleRemoveVideo(); }}
              disabled={disabled}
              sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.9)', '&:hover': { backgroundColor: 'rgba(255,255,255,1)' } }}
              size="small"
              color="error"
            >
              <Delete />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Upload Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={handleCancelUpload} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Confirm Video Upload
          <IconButton onClick={handleCancelUpload} disabled={uploading}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Review the selected video before uploading:</Typography>
          {pendingVideo && (
            <Box>
              <Box sx={{ borderRadius: 2, overflow: 'hidden', backgroundColor: '#000', mb: 2 }}>
                <video src={pendingVideo.preview} controls muted style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
              </Box>
              <Typography variant="body2">{pendingVideo.file.name}</Typography>
              <Typography variant="caption" color="text.secondary">{(pendingVideo.file.size / 1024 / 1024).toFixed(2)} MB</Typography>
            </Box>
          )}
          {uploading && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>Uploading video...</Typography>
              <LinearProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUpload} disabled={uploading}>Cancel</Button>
          <Button onClick={handleConfirmUpload} variant="contained" disabled={uploading || !pendingVideo} sx={{ backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}>
            {uploading ? 'Uploading...' : 'Upload Video'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoUpload;

