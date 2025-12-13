import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Alert,
  IconButton,
  Link
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  PictureAsPdf,
  OpenInNew
} from '@mui/icons-material';
import axios from 'axios';

interface PdfUploadProps {
  value?: string;
  onChange: (value: string) => void;
  maxSize?: number; // in MB
  label?: string;
  helperText?: string;
  disabled?: boolean;
}

const PdfUpload: React.FC<PdfUploadProps> = ({
  value,
  onChange,
  maxSize = 50,
  label = 'Upload PDF Brochure',
  helperText = 'Max file size: 50MB. PDF files only.',
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  

  const handleFileSelect = useCallback(async (files: FileList) => {
    if (disabled) return;

    setError(null);
    const file = files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File must be smaller than ${maxSize}MB`);
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await axios.post(`${API_URL}/upload/pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
      });

      if (response.data.success && response.data.data?.url) {
        onChange(response.data.data.url);
      } else {
        setError(response.data.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      setError(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [disabled, maxSize, API_URL, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [disabled, handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleRemove = () => {
    if (!disabled) onChange('');
  };

  const getFileName = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
        style={{ display: 'none' }}
      />

      {/* Upload Area */}
      {!value && (
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
          <PictureAsPdf sx={{ fontSize: 48, color: disabled ? '#ccc' : '#4B0E14', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1, color: disabled ? '#ccc' : '#4B0E14' }}>
            Drag & drop PDF here
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
            or click to browse files
          </Typography>
          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            disabled={disabled}
            sx={{
              borderColor: '#4B0E14',
              color: '#4B0E14',
              '&:hover': { borderColor: '#3a0b10', backgroundColor: '#f8f5f0' }
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
      )}

      {/* PDF Preview */}
      {value && (
        <Box
          sx={{
            border: '1px solid #ddd',
            borderRadius: 2,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f8f5f0'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PictureAsPdf sx={{ fontSize: 40, color: '#d32f2f' }} />
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {getFileName(value)}
              </Typography>
              <Link
                href={`${API_URL}${value}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.875rem' }}
              >
                View PDF <OpenInNew fontSize="small" />
              </Link>
            </Box>
          </Box>
          <IconButton onClick={handleRemove} disabled={disabled} color="error">
            <Delete />
          </IconButton>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: '#666' }}>
            Uploading PDF...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PdfUpload;

