import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Tooltip,
  Chip,
  LinearProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Visibility,
  Add,
  Image,
  InsertDriveFile
} from '@mui/icons-material';
import axios from 'axios';

interface UploadedFile {
  filename: string;
  url: string;
  size: number;
  uploadDate: string;
}

const Media: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<UploadedFile | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
console.log("fetchFiles-------------2")

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/upload/images`);
      setFiles(response.data.data);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    const formData = new FormData();

    if (selectedFiles.length === 1) {
      formData.append('image', selectedFiles[0]);

      console.log("formData-------",`${API_URL}/upload/image` ,formData)
      try {
        const response = await axios.post(`${API_URL}/upload/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setSuccess('File uploaded successfully!');
        fetchFiles();
      } catch (error: any) {
        setError(error.response?.data?.error || 'Failed to upload file');
      }
    } else {
      // Multiple files
      Array.from(selectedFiles).forEach(file => {
        formData.append('images', file);
      });
      try {
        const response = await axios.post(`${API_URL}/upload/images`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setSuccess(`${response.data.count} files uploaded successfully!`);
        fetchFiles();
      } catch (error: any) {
        setError(error.response?.data?.error || 'Failed to upload files');
      }
    }

    setUploading(false);
    setUploadDialogOpen(false);
    event.target.value = '';
  };

  const handleDeleteFile = async () => {
    if (!fileToDelete) return;

    setLoading(true);
    try {
      await axios.delete(`${API_URL}/upload/${fileToDelete.filename}`);
      setSuccess('File deleted successfully!');
      fetchFiles();
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to delete file');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImageFile = (filename: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: '#4B0E14',
              mb: 1
            }}
          >
            Media Library
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            Manage images and files for your website
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={() => setUploadDialogOpen(true)}
          sx={{
            backgroundColor: '#4B0E14',
            '&:hover': {
              backgroundColor: '#3a0b10'
            }
          }}
        >
          Upload Files
        </Button>
      </Box>

      {/* Stats */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#4B0E14' }}>
                {files.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Total Files
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#C5A059' }}>
                {files.filter(f => isImageFile(f.filename)).length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Images
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C2C2C' }}>
                {formatFileSize(files.reduce((total, file) => total + file.size, 0))}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Total Size
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Loading */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Files Grid */}
      <Grid container spacing={2}>
        {files.map((file) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={file.filename}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
              }}
            >
              {isImageFile(file.filename) ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={`${ 'http://localhost:5000'}${file.url}`}
                  // image={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${file.url}`}
                  alt={file.filename}
                  sx={{ objectFit: 'cover' }}
                />
              ) : (
                <Box
                  sx={{
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5'
                  }}
                >
                  <InsertDriveFile sx={{ fontSize: 60, color: '#666' }} />
                </Box>
              )}
              
              <Box sx={{ p: 2, flexGrow: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {file.filename}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Chip
                    label={formatFileSize(file.size)}
                    size="small"
                    sx={{ fontSize: '0.7rem' }}
                  />
                  {isImageFile(file.filename) && (
                    <Chip
                      label="Image"
                      size="small"
                      sx={{
                        backgroundColor: '#4B0E14',
                        color: 'white',
                        fontSize: '0.7rem'
                      }}
                    />
                  )}
                </Box>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem' }}>
                  {new Date(file.uploadDate).toLocaleDateString()}
                </Typography>
              </Box>

              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Tooltip title="Preview">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setPreviewFile(file);
                      setPreviewDialogOpen(true);
                    }}
                    sx={{ color: '#4B0E14' }}
                  >
                    <Visibility />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setFileToDelete(file);
                      setDeleteDialogOpen(true);
                    }}
                    sx={{ color: '#F44336' }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {files.length === 0 && !loading && (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: '#f8f5f0'
          }}
        >
          <Image sx={{ fontSize: 60, color: '#C5A059', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#4B0E14', mb: 1 }}>
            No files uploaded yet
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
            Start by uploading your first image or file
          </Typography>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={() => setUploadDialogOpen(true)}
            sx={{
              backgroundColor: '#4B0E14',
              '&:hover': {
                backgroundColor: '#3a0b10'
              }
            }}
          >
            Upload Files
          </Button>
        </Paper>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Files</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="single-file-upload"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="single-file-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUpload />}
                sx={{
                  mr: 2,
                  mb: 2,
                  borderColor: '#4B0E14',
                  color: '#4B0E14',
                  '&:hover': {
                    borderColor: '#3a0b10',
                    backgroundColor: '#f8f5f0'
                  }
                }}
              >
                Upload Single Image
              </Button>
            </label>

            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="multiple-files-upload"
              type="file"
              multiple
              onChange={handleFileUpload}
            />
            <label htmlFor="multiple-files-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUpload />}
                sx={{
                  mb: 2,
                  backgroundColor: '#4B0E14',
                  '&:hover': {
                    backgroundColor: '#3a0b10'
                  }
                }}
              >
                Upload Multiple Images
              </Button>
            </label>

            <Typography variant="body2" sx={{ color: '#666', mt: 2 }}>
              Supported formats: JPG, PNG, GIF, WebP, SVG
              <br />
              Maximum file size: 5MB per file
            </Typography>

            {uploading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress />
                <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                  Uploading files...
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)} disabled={uploading}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          File Preview: {previewFile?.filename}
        </DialogTitle>
        <DialogContent>
          {previewFile && (
            <Box sx={{ textAlign: 'center' }}>
              {isImageFile(previewFile.filename) ? (
                <img
                  src={`${ 'http://localhost:5000'}${previewFile.url}`}
                  // src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${previewFile.url}`}
                  alt={previewFile.filename}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '70vh',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <Box sx={{ py: 4 }}>
                  <InsertDriveFile sx={{ fontSize: 100, color: '#666', mb: 2 }} />
                  <Typography variant="h6">{previewFile.filename}</Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    File size: {formatFileSize(previewFile.size)}
                  </Typography>
                </Box>
              )}

              <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>File URL:</strong>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    backgroundColor: 'white',
                    p: 1,
                    borderRadius: 1,
                    wordBreak: 'break-all'
                  }}
                >
                  {`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${previewFile.url}`}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{fileToDelete?.filename}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteFile}
            color="error"
            variant="contained"
            disabled={loading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert onClose={() => setSuccess(null)} severity="success">
          {success}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Media;
