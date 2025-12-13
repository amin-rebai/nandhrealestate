import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Checkbox,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  Search,
  Close,
  CheckCircle,
  RadioButtonUnchecked,
  CloudUpload,
  Refresh
} from '@mui/icons-material';
import axios from 'axios';

interface ImageGalleryProps {
  open: boolean;
  onClose: () => void;
  onSelect: (selectedImages: string | string[]) => void;
  multiple?: boolean;
  selectedImages?: string | string[];
  title?: string;
}

interface UploadedImage {
  filename: string;
  url: string;
  size: number;
  uploadDate: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  open,
  onClose,
  onSelect,
  multiple = false,
  selectedImages = multiple ? [] : '',
  title = 'Select Images'
}) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Initialize selected images
  useEffect(() => {
    if (multiple) {
      setSelected(Array.isArray(selectedImages) ? selectedImages : []);
    } else {
      setSelected(selectedImages ? [selectedImages as string] : []);
    }
  }, [selectedImages, multiple]);

  // Fetch images when dialog opens
  useEffect(() => {
    if (open) {
      fetchImages();
    }
  }, [open]);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);

    console.log("fetchImages------------------")

    try {
      const response = await axios.get(`${API_URL}/upload/images`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      setImages(response.data.data || []);
    } catch (error: any) {
      console.error('Failed to fetch images:', error);
      setError('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    if (multiple) {
      setSelected(prev => {
        if (prev.includes(imageUrl)) {
          return prev.filter(url => url !== imageUrl);
        } else {
          return [...prev, imageUrl];
        }
      });
    } else {
      setSelected([imageUrl]);
    }
  };

  const handleConfirm = () => {
    if (multiple) {
      onSelect(selected);
    } else {
      onSelect(selected[0] || '');
    }
    onClose();
  };

  const handleCancel = () => {
    // Reset selection to original values
    if (multiple) {
      setSelected(Array.isArray(selectedImages) ? selectedImages : []);
    } else {
      setSelected(selectedImages ? [selectedImages as string] : []);
    }
    onClose();
  };

  const filteredImages = images.filter(image =>
    image.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '80vh' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6">{title}</Typography>
          {multiple && selected.length > 0 && (
            <Typography variant="body2" sx={{ color: '#666' }}>
              {selected.length} image{selected.length > 1 ? 's' : ''} selected
            </Typography>
          )}
        </Box>
        <IconButton onClick={handleCancel}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Search and Actions */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchImages}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={() => {
              // This could open an upload dialog or navigate to media page
              // For now, just refresh to show any newly uploaded images
              fetchImages();
            }}
            sx={{
              backgroundColor: '#4B0E14',
              '&:hover': { backgroundColor: '#3a0b10' }
            }}
          >
            Upload New
          </Button>
        </Box>

        {/* Loading */}
        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Images Grid */}
        {!loading && filteredImages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
              No images found
            </Typography>
            <Typography variant="body2" sx={{ color: '#999' }}>
              {searchTerm ? 'Try adjusting your search terms' : 'Upload some images to get started'}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filteredImages.map((image) => {
              const isSelected = selected.includes(image.url);
              const fullImageUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${image.url}`;
              

              return (
                <Grid item xs={6} sm={4} md={3} key={image.filename}>
                  <Card
                    sx={{
                      position: 'relative',
                      cursor: 'pointer',
                      border: isSelected ? '2px solid #4B0E14' : '2px solid transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }
                    }}
                    onClick={() => handleImageSelect(image.url)}
                  >
                    {/* Selection Indicator */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 1,
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        borderRadius: '50%',
                        p: 0.5
                      }}
                    >
                      {multiple ? (
                        <Checkbox
                          checked={isSelected}
                          size="small"
                          sx={{
                            color: '#4B0E14',
                            '&.Mui-checked': { color: '#4B0E14' }
                          }}
                        />
                      ) : (
                        isSelected ? (
                          <CheckCircle sx={{ color: '#4B0E14', fontSize: 24 }} />
                        ) : (
                          <RadioButtonUnchecked sx={{ color: '#666', fontSize: 24 }} />
                        )
                      )}
                    </Box>

                    <CardMedia
                      component="img"
                      height="150"
                      image={fullImageUrl}
                      alt={image.filename}
                      sx={{ objectFit: 'cover' }}
                    />

                    <CardActions sx={{ p: 1, flexDirection: 'column', alignItems: 'stretch' }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 500,
                          textAlign: 'center',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          width: '100%'
                        }}
                      >
                        {image.filename}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                        <Chip
                          label={formatFileSize(image.size)}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                        <Chip
                          label={formatDate(image.uploadDate)}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #eee' }}>
        <Button onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!multiple && selected.length === 0}
          sx={{
            backgroundColor: '#4B0E14',
            '&:hover': { backgroundColor: '#3a0b10' }
          }}
        >
          Select {selected.length > 0 && `(${selected.length})`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageGallery;
