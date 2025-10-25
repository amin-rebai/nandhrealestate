import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Avatar,
  Pagination,
  InputAdornment,
  Fab,
  Tooltip,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  ImageList,
  ImageListItem,
  ImageListItemBar
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Search,
  FilterList,
  Home,
  LocationOn,
  AttachMoney,
  ExpandMore,
  CloudUpload,
  Close as CloseIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { RootState, AppDispatch } from '../store/store';
import {
  fetchProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  clearError,
  Property
} from '../store/slices/propertySlice';
import { fetchAgents } from '../store/slices/userSlice';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Type for property data sent to API (agent is string ID)
type PropertyFormData = Omit<Property, '_id' | 'agent' | 'createdAt' | 'updatedAt' | 'images'> & {
  agent: string;
  images?: string[];
};

const Properties: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { properties, loading, error, total, pagination } = useSelector(
    (state: RootState) => state.properties
  );
  const { agents } = useSelector((state: RootState) => state.users);
  const { user } = useSelector((state: RootState) => state.auth);

  const [open, setOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    country: 'Qatar',
    bedrooms: '',
    bathrooms: '',
    area: '',
    yearBuilt: '',
    images: [] as string[],
    type: 'sale' as 'sale' | 'rent' | 'off-plan',
    status: 'available' as 'available' | 'sold' | 'rented',
    features: '',
    agent: '',
    verified: false,
    completionDate: '',
    paymentPlan: '',
    propertyType: 'Apartment'
  });

  useEffect(() => {
    const params: any = {
      page: currentPage,
      limit: 10
    };

    if (searchTerm) {
      params.location = searchTerm;
    }

    if (filterType !== 'all') {
      params.category = filterType;
    }

    dispatch(fetchProperties(params));
    dispatch(fetchAgents());
  }, [dispatch, currentPage, searchTerm, filterType]);

  const handleOpenDialog = (property?: Property) => {
    if (property) {
      setEditingProperty(property);
      setFormData({
        title: typeof property.title === 'string'
          ? property.title
          : (property.title as any)?.en || '',
        description: typeof property.description === 'string'
          ? property.description
          : (property.description as any)?.en || '',
        price: property.price.toString(),
        location: typeof property.location === 'string'
          ? property.location
          : (property.location as any)?.en || '',
        country: (property as any).country || 'Qatar',
        bedrooms: property.bedrooms.toString(),
        bathrooms: property.bathrooms.toString(),
        area: property.area.toString(),
        yearBuilt: (property as any).yearBuilt?.toString() || '',
        images: property.images || [],
        type: property.type,
        status: property.status,
        features: typeof property.features === 'object' && Array.isArray(property.features)
          ? property.features.join(', ')
          : typeof property.features === 'object'
          ? ((property.features as any).en?.join(', ') || '')
          : '',
        agent: property.agent._id,
        verified: (property as any).verified || false,
        completionDate: (property as any).completionDate || '',
        paymentPlan: (property as any).paymentPlan || '',
        propertyType: (property as any).propertyType || 'Apartment'
      });
    } else {
      setEditingProperty(null);
      setFormData({
        title: '',
        description: '',
        price: '',
        location: '',
        country: 'Qatar',
        bedrooms: '',
        bathrooms: '',
        area: '',
        yearBuilt: '',
        images: [],
        type: 'sale',
        status: 'available',
        features: '',
        agent: user?._id || '',
        verified: false,
        completionDate: '',
        paymentPlan: '',
        propertyType: 'Apartment'
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingProperty(null);
    dispatch(clearError());
  };

  const handleSubmit = async () => {
    const propertyData: any = {
      title: { en: formData.title, ar: formData.title },
      description: { en: formData.description, ar: formData.description },
      price: Number(formData.price),
      location: { en: formData.location, ar: formData.location },
      country: formData.country,
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      area: Number(formData.area),
      yearBuilt: Number(formData.yearBuilt),
      images: formData.images,
      type: formData.type,
      status: formData.status,
      features: {
        en: formData.features.split(',').map((f: string) => f.trim()).filter((f: string) => f),
        ar: formData.features.split(',').map((f: string) => f.trim()).filter((f: string) => f)
      },
      agent: formData.agent,
      verified: formData.verified,
      propertyType: formData.propertyType
    };

    // Add off-plan specific fields
    if (formData.type === 'off-plan') {
      propertyData.completionDate = formData.completionDate;
      propertyData.paymentPlan = formData.paymentPlan;
    }

    try {
      if (editingProperty) {
        await dispatch(updateProperty({ id: editingProperty._id, data: propertyData })).unwrap();
      } else {
        await dispatch(createProperty(propertyData)).unwrap();
      }
      handleCloseDialog();
    } catch (error) {
      // Error handled by slice
    }
  };

  const handleDeleteClick = (property: Property) => {
    setPropertyToDelete(property);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (propertyToDelete) {
      try {
        await dispatch(deleteProperty(propertyToDelete._id)).unwrap();
        setDeleteDialogOpen(false);
        setPropertyToDelete(null);
      } catch (error) {
        // Error handled by slice
      }
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedImages: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post(`${API_URL}/upload/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          },
        });

        uploadedImages.push(response.data.data.url);
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));
    } catch (error: any) {
      console.error('Failed to upload images:', error);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#4CAF50';
      case 'sold':
        return '#F44336';
      case 'rented':
        return '#FF9800';
      default:
        return '#757575';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sale':
        return '#4B0E14';
      case 'rent':
        return '#C5A059';
      case 'off-plan':
        return '#2C2C2C';
      default:
        return '#757575';
    }
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
            Properties Management
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            Manage all properties in your real estate portfolio
          </Typography>
        </Box>
      </Box>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Filter by Type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="sale">For Sale</MenuItem>
              <MenuItem value="rent">For Rent</MenuItem>
              <MenuItem value="off-plan">Off-Plan</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Total: {total} properties
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Properties Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f5f0' }}>
              <TableCell sx={{ fontWeight: 600 }}>Property</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Agent</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property._id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {typeof property.title === 'string'
                        ? property.title
                        : (property.title as any)?.en || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {property.bedrooms} bed • {property.bathrooms} bath • {property.area} sqm
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      {(property as any).propertyType} • {(property as any).yearBuilt}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ fontSize: 16, color: '#666', mr: 0.5 }} />
                    <Typography variant="body2">
                      {typeof property.location === 'string'
                        ? property.location
                        : (property.location as any)?.en || 'N/A'}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#999' }}>
                    {(property as any).country || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#C5A059' }}>
                    ${property.price.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={property.type.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: getTypeColor(property.type),
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={property.status.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(property.status),
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        mr: 1,
                        backgroundColor: '#4B0E14',
                        fontSize: '0.875rem'
                      }}
                    >
                      {property.agent.name.charAt(0)}
                    </Avatar>
                    <Typography variant="body2">{property.agent.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit Property">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(property)}
                        sx={{ color: '#4B0E14' }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Property">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(property)}
                        sx={{ color: '#F44336' }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={pagination.pages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
          />
        </Box>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add property"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: '#4B0E14',
          '&:hover': {
            backgroundColor: '#3a0b10'
          }
        }}
        onClick={() => handleOpenDialog()}
      >
        <Add />
      </Fab>

      {/* Property Dialog */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editingProperty ? t('properties.editProperty') : t('properties.addProperty')}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 1 }}>
            {/* Basic Information */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Basic Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Property Title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      multiline
                      rows={3}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      required
                    >
                      <MenuItem value="Qatar">Qatar</MenuItem>
                      <MenuItem value="UAE">UAE</MenuItem>
                      <MenuItem value="Saudi Arabia">Saudi Arabia</MenuItem>
                      <MenuItem value="Egypt">Egypt</MenuItem>
                      <MenuItem value="France">France</MenuItem>
                      <MenuItem value="Morocco">Morocco</MenuItem>
                      <MenuItem value="Oman">Oman</MenuItem>
                      <MenuItem value="Turkey">Turkey</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      fullWidth
                      label="Bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      fullWidth
                      label="Bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      fullWidth
                      label="Area (sqm)"
                      type="number"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      fullWidth
                      label="Year Built"
                      type="number"
                      value={formData.yearBuilt}
                      onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <TextField
                      select
                      fullWidth
                      label="Property Type"
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      required
                    >
                      <MenuItem value="Apartment">Apartment</MenuItem>
                      <MenuItem value="Villa">Villa</MenuItem>
                      <MenuItem value="Penthouse">Penthouse</MenuItem>
                      <MenuItem value="Studio">Studio</MenuItem>
                      <MenuItem value="Townhouse">Townhouse</MenuItem>
                      <MenuItem value="Office">Office</MenuItem>
                      <MenuItem value="Shop">Shop</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <TextField
                      select
                      fullWidth
                      label="Type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      required
                    >
                      <MenuItem value="sale">For Sale</MenuItem>
                      <MenuItem value="rent">For Rent</MenuItem>
                      <MenuItem value="off-plan">Off-Plan</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <TextField
                      select
                      fullWidth
                      label="Status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      required
                    >
                      <MenuItem value="available">Available</MenuItem>
                      <MenuItem value="sold">Sold</MenuItem>
                      <MenuItem value="rented">Rented</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Agent"
                      value={formData.agent}
                      onChange={(e) => setFormData({ ...formData, agent: e.target.value })}
                      required
                    >
                      {agents.map((agent) => (
                        <MenuItem key={agent._id} value={agent._id}>
                          {agent.name} ({agent.role})
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.verified}
                          onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                          color="primary"
                        />
                      }
                      label="Verified Property"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Features (comma separated)"
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      placeholder="e.g. Swimming Pool, Gym, Parking, Garden"
                      helperText="Enter features separated by commas"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Off-Plan Specific Fields */}
            {formData.type === 'off-plan' && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">Off-Plan Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Completion Date"
                        value={formData.completionDate}
                        onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                        placeholder="e.g. Q4 2025"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Payment Plan"
                        value={formData.paymentPlan}
                        onChange={(e) => setFormData({ ...formData, paymentPlan: e.target.value })}
                        placeholder="e.g. 10% Down Payment, 90% on Completion"
                        required
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Images Section */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Property Images</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="property-images-upload"
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                      />
                      <label htmlFor="property-images-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<CloudUpload />}
                          disabled={uploading}
                          sx={{
                            borderColor: '#4B0E14',
                            color: '#4B0E14',
                            '&:hover': {
                              borderColor: '#3a0b10',
                              backgroundColor: '#f8f5f0'
                            }
                          }}
                        >
                          {uploading ? 'Uploading...' : 'Upload Images'}
                        </Button>
                      </label>
                    </Box>

                    {formData.images.length > 0 && (
                      <ImageList sx={{ width: '100%', height: 200 }} cols={4} rowHeight={150}>
                        {formData.images.map((image, index) => (
                          <ImageListItem key={index}>
                            <img
                              src={`${API_URL}${image}`}
                              alt={`Property ${index + 1}`}
                              loading="lazy"
                              style={{ objectFit: 'cover' }}
                            />
                            <ImageListItemBar
                              actionIcon={
                                <IconButton
                                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                  onClick={() => handleRemoveImage(index)}
                                >
                                  <CloseIcon />
                                </IconButton>
                              }
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    )}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || uploading}
            sx={{
              backgroundColor: '#4B0E14',
              '&:hover': {
                backgroundColor: '#3a0b10'
              }
            }}
          >
            {editingProperty ? 'Update' : 'Create'} Property
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{
              propertyToDelete
                ? (typeof propertyToDelete.title === 'string'
                    ? propertyToDelete.title
                    : (propertyToDelete.title as any)?.en || 'this property')
                : 'this property'
            }"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={loading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Properties;
