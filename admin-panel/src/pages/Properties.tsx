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
  Close as CloseIcon,
  Star,
  StarBorder,
  Collections,
  CollectionsBookmark
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
import ImageUpload from '../components/ImageUpload';
import VideoUpload from '../components/VideoUpload';
import PdfUpload from '../components/PdfUpload';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
    currency: 'QAR' as 'QAR' | 'USD' | 'EUR' | 'AED' | 'SAR' | 'KWD' | 'BHD' | 'OMR',
    location: '',
    locationCity: '',
    locationDetails: '',
    country: 'Qatar',
    bedrooms: '',
    bathrooms: '',
    area: '',
    // yearBuilt: '',
    images: [] as string[],
    video: '',
    type: 'sale' as 'sale' | 'rent' | 'off-plan',
    status: 'available' as 'available' | 'sold' | 'rented',
    features: '',
    agent: '',
    verified: false,
    completionDate: '',
    paymentPlan: '',
    developer: '',
    projectName: '',
    handoverDate: '',
    startingPrice: '',
    downPayment: '',
    installmentPlan: '',
    category: 'residential' as 'residential' | 'commercial' | 'industrial' | 'land',
    propertyType: 'Apartment',
    // Additional FGRealty-style fields
    referenceNumber: '',
    serviceCharge: '',
    transferFee: '',
    titleDeed: false,
    tenanted: false,
    availableFrom: '',
    propertyBrochure: '',
    layoutImage: '',
    roi: '',
    guaranteedReturns: '',
    // Featured options
    featured: false,
    featuredInPortfolio: false
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
      const locationStr = typeof property.location === 'string'
        ? property.location
        : (property.location as any)?.en || '';

      // Parse location to extract city and details
      const locationParts = locationStr.split(',').map((s: string) => s.trim());
      const locationCity = locationParts[0] || '';
      const locationDetails = locationParts.slice(1).join(', ') || '';

      setFormData({
        title: typeof property.title === 'string'
          ? property.title
          : (property.title as any)?.en || '',
        description: typeof property.description === 'string'
          ? property.description
          : (property.description as any)?.en || '',
        price: property.price.toString(),
        currency: (property as any).currency || 'QAR',
        location: locationStr,
        locationCity: locationCity,
        locationDetails: locationDetails,
        country: (property as any).country || 'Qatar',
        bedrooms: property.bedrooms.toString(),
        bathrooms: property.bathrooms.toString(),
        area: property.area.toString(),
        // yearBuilt: (property as any).yearBuilt?.toString() || '',
        images: property.images || [],
        video: (property as any).video || '',
        type: property.type,
        status: property.status,
        features: typeof property.features === 'object' && Array.isArray(property.features)
          ? property.features.join(', ')
          : typeof property.features === 'object'
          ? ((property.features as any).en?.join(', ') || '')
          : '',
        agent: typeof property.agent === 'string' ? property.agent : property.agent?._id || '',
        verified: (property as any).verified || false,
        completionDate: (property as any).completionDate || '',
        paymentPlan: (property as any).paymentPlan || '',
        developer: (property as any).developer || '',
        projectName: (property as any).projectName || '',
        handoverDate: (property as any).handoverDate || '',
        startingPrice: (property as any).startingPrice?.toString() || '',
        downPayment: (property as any).downPayment || '',
        installmentPlan: (property as any).installmentPlan || '',
        category: (property as any).category || 'residential',
        propertyType: (property as any).propertyType || 'Apartment',
        // Additional FGRealty-style fields
        referenceNumber: (property as any).referenceNumber || '',
        serviceCharge: (property as any).serviceCharge?.toString() || '',
        transferFee: (property as any).transferFee || '',
        titleDeed: (property as any).titleDeed || false,
        tenanted: (property as any).tenanted || false,
        availableFrom: (property as any).availableFrom || '',
        propertyBrochure: (property as any).propertyBrochure || '',
        layoutImage: (property as any).layoutImage || '',
        roi: (property as any).roi || '',
        guaranteedReturns: (property as any).guaranteedReturns || '',
        // Featured options
        featured: (property as any).featured || false,
        featuredInPortfolio: (property as any).featuredInPortfolio || false
      });
    } else {
      setEditingProperty(null);
      setFormData({
        title: '',
        description: '',
        price: '',
        currency: 'QAR',
        location: '',
        locationCity: '',
        locationDetails: '',
        country: 'Qatar',
        bedrooms: '',
        bathrooms: '',
        area: '',
        // yearBuilt: '',
        images: [],
        video: '',
        type: 'sale',
        status: 'available',
        features: '',
        agent: user?._id || '',
        verified: false,
        completionDate: '',
        paymentPlan: '',
        developer: '',
        projectName: '',
        handoverDate: '',
        startingPrice: '',
        downPayment: '',
        installmentPlan: '',
        category: 'residential',
        propertyType: 'Apartment',
        // Additional FGRealty-style fields
        referenceNumber: '',
        serviceCharge: '',
        transferFee: '',
        titleDeed: false,
        tenanted: false,
        availableFrom: '',
        propertyBrochure: '',
        layoutImage: '',
        roi: '',
        guaranteedReturns: '',
        // Featured options
        featured: false,
        featuredInPortfolio: false
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
    console.log('handleSubmit called');
    console.log('formData:', formData);

    // Validate Qatar-specific fields
    if (formData.country === 'Qatar' && !formData.locationCity) {
      alert('Please select a city/area for Qatar properties');
      return;
    }

    // Validate non-Qatar location field
    if (formData.country !== 'Qatar' && !formData.location) {
      alert('Please enter a location');
      return;
    }

    // Construct full location string
    const fullLocation = formData.country === 'Qatar' && formData.locationCity
      ? `${formData.locationCity}${formData.locationDetails ? ', ' + formData.locationDetails : ''}`
      : formData.location;

    console.log('fullLocation:', fullLocation);

    const propertyData: any = {
      title: { en: formData.title, ar: formData.title },
      description: { en: formData.description, ar: formData.description },
      price: Number(formData.price),
      currency: formData.currency,
      location: { en: fullLocation, ar: fullLocation },
      country: formData.country,
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      area: Number(formData.area),
      // yearBuilt: Number(formData.yearBuilt),
      images: formData.images,
      video: formData.video,
      type: formData.type,
      status: formData.status,
      features: {
        en: formData.features.split(',').map((f: string) => f.trim()).filter((f: string) => f),
        ar: formData.features.split(',').map((f: string) => f.trim()).filter((f: string) => f)
      },
      agent: formData.agent,
      verified: formData.verified,
      category: formData.category,
      propertyType: formData.propertyType
    };

    console.log('propertyData:', propertyData);

    // Add off-plan specific fields
    if (formData.type === 'off-plan') {
      propertyData.completionDate = formData.completionDate;
      propertyData.paymentPlan = formData.paymentPlan;
      propertyData.developer = formData.developer;
      propertyData.projectName = formData.projectName;
      propertyData.handoverDate = formData.handoverDate;
      propertyData.startingPrice = formData.startingPrice ? Number(formData.startingPrice) : undefined;
      propertyData.downPayment = formData.downPayment;
      propertyData.installmentPlan = formData.installmentPlan;
      propertyData.availableFrom = formData.availableFrom;
      propertyData.roi = formData.roi;
      propertyData.guaranteedReturns = formData.guaranteedReturns;
    }

    // Add additional property fields (applicable to all types)
    propertyData.referenceNumber = formData.referenceNumber || undefined;
    propertyData.serviceCharge = formData.serviceCharge ? Number(formData.serviceCharge) : undefined;
    propertyData.transferFee = formData.transferFee || undefined;
    propertyData.titleDeed = formData.titleDeed;
    propertyData.tenanted = formData.tenanted;
    propertyData.propertyBrochure = formData.propertyBrochure || undefined;
    propertyData.layoutImage = formData.layoutImage || undefined;

    // Featured options
    propertyData.featured = formData.featured;
    propertyData.featuredInPortfolio = formData.featuredInPortfolio;

    try {
      console.log('Dispatching createProperty/updateProperty...');
      if (editingProperty) {
        await dispatch(updateProperty({ id: editingProperty._id, data: propertyData })).unwrap();
      } else {
        await dispatch(createProperty(propertyData)).unwrap();
      }
      console.log('Property created/updated successfully');

      // Refetch properties to get populated agent data
      await dispatch(fetchProperties({ page: currentPage, limit: 10 }));

      handleCloseDialog();
    } catch (error) {
      console.error('Error creating/updating property:', error);
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

  // Toggle featured status
  const handleToggleFeatured = async (property: Property) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_URL}/properties/${property._id}/featured`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refetch properties to update the list
      dispatch(fetchProperties({ page: currentPage, limit: 10 }));
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  // Toggle portfolio status
  const handleTogglePortfolio = async (property: Property) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_URL}/properties/${property._id}/portfolio`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refetch properties to update the list
      dispatch(fetchProperties({ page: currentPage, limit: 10 }));
    } catch (error) {
      console.error('Error toggling portfolio status:', error);
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

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is a video
    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file');
      return;
    }

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      alert('Video file size must be less than 100MB');
      return;
    }

    setUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('video', file);

      const response = await axios.post(`${API_URL}/upload/video`, formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
      });

      setFormData(prev => ({
        ...prev,
        video: response.data.data.url
      }));
    } catch (error: any) {
      console.error('Failed to upload video:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleRemoveVideo = () => {
    setFormData(prev => ({
      ...prev,
      video: ''
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
              <TableCell sx={{ fontWeight: 600 }}>Featured</TableCell>
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
                    {/* <Typography variant="caption" sx={{ color: '#999' }}>
                      {(property as any).propertyType} • {(property as any).yearBuilt}
                    </Typography> */}
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
                    {property.price.toLocaleString()}
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
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title={(property as any).featured ? "Remove from Featured" : "Add to Featured"}>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleFeatured(property)}
                        sx={{
                          color: (property as any).featured ? '#FFD700' : '#ccc',
                          '&:hover': { color: '#FFD700' }
                        }}
                      >
                        {(property as any).featured ? <Star /> : <StarBorder />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={(property as any).featuredInPortfolio ? "Remove from Portfolio" : "Add to Portfolio"}>
                      <IconButton
                        size="small"
                        onClick={() => handleTogglePortfolio(property)}
                        sx={{
                          color: (property as any).featuredInPortfolio ? '#4B0E14' : '#ccc',
                          '&:hover': { color: '#4B0E14' }
                        }}
                      >
                        {(property as any).featuredInPortfolio ? <CollectionsBookmark /> : <Collections />}
                      </IconButton>
                    </Tooltip>
                  </Box>
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
                      {property.agent?.name?.charAt(0) || 'A'}
                    </Avatar>
                    <Typography variant="body2">{property.agent?.name || 'Unknown Agent'}</Typography>
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
                  <Grid item xs={6} md={4}>
                    <TextField
                      select
                      fullWidth
                      label="Listing Type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      required
                    >
                      <MenuItem value="sale">For Sale</MenuItem>
                      <MenuItem value="rent">For Rent</MenuItem>
                      <MenuItem value="off-plan">Off-Plan</MenuItem>
                    </TextField>
                  </Grid>
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
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      InputProps={{
                        startAdornment: <InputAdornment position="start">{formData.currency}</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      select
                      fullWidth
                      label="Currency"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                      required
                    >
                      <MenuItem value="QAR">QAR (Qatar Riyal)</MenuItem>
                      <MenuItem value="USD">USD (US Dollar)</MenuItem>
                      <MenuItem value="EUR">EUR (Euro)</MenuItem>
                      <MenuItem value="AED">AED (UAE Dirham)</MenuItem>
                      <MenuItem value="SAR">SAR (Saudi Riyal)</MenuItem>
                      <MenuItem value="KWD">KWD (Kuwaiti Dinar)</MenuItem>
                      <MenuItem value="BHD">BHD (Bahraini Dinar)</MenuItem>
                      <MenuItem value="OMR">OMR (Omani Rial)</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Country"
                      value={formData.country}
                      onChange={(e) => {
                        const newCountry = e.target.value;
                        setFormData({
                          ...formData,
                          country: newCountry,
                          locationCity: '',
                          locationDetails: '',
                          location: newCountry !== 'Qatar' ? formData.location : ''
                        });
                      }}
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

                  {/* Qatar-specific location fields */}
                  {formData.country === 'Qatar' ? (
                    <>
                      <Grid item xs={12} md={6}>
                        <TextField
                          select
                          fullWidth
                          label="City/Area"
                          value={formData.locationCity}
                          onChange={(e) => setFormData({ ...formData, locationCity: e.target.value })}
                          required
                        >
                          <MenuItem value="">Select City/Area</MenuItem>
                          <MenuItem value="Doha">Doha</MenuItem>
                          <MenuItem value="Lusail">Lusail</MenuItem>
                          <MenuItem value="The Pearl">The Pearl</MenuItem>
                          <MenuItem value="West Bay">West Bay</MenuItem>
                          <MenuItem value="Al Waab">Al Waab</MenuItem>
                          <MenuItem value="Al Sadd">Al Sadd</MenuItem>
                          <MenuItem value="Al Dafna">Al Dafna</MenuItem>
                          <MenuItem value="Msheireb Downtown">Msheireb Downtown</MenuItem>
                          <MenuItem value="Al Wakrah">Al Wakrah</MenuItem>
                          <MenuItem value="Al Khor">Al Khor</MenuItem>
                          <MenuItem value="Al Rayyan">Al Rayyan</MenuItem>
                          <MenuItem value="Umm Salal">Umm Salal</MenuItem>
                          <MenuItem value="Al Gharrafa">Al Gharrafa</MenuItem>
                          <MenuItem value="Ain Khaled">Ain Khaled</MenuItem>
                          <MenuItem value="Old Airport">Old Airport</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Location Details (Building, Street, Community)"
                          value={formData.locationDetails}
                          onChange={(e) => setFormData({ ...formData, locationDetails: e.target.value })}
                          placeholder="e.g., Marina Tower, Building 123, Street 45"
                          helperText="Optional: Add specific building, street, or community details"
                        />
                      </Grid>
                    </>
                  ) : (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                        placeholder="Enter full location"
                      />
                    </Grid>
                  )}
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
                  {/* <Grid item xs={6} md={3}>
                    <TextField
                      fullWidth
                      label="Year Built"
                      type="number"
                      value={formData.yearBuilt}
                      onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })}
                      required
                    />
                  </Grid> */}
                  <Grid item xs={6} md={4}>
                    <TextField
                      select
                      fullWidth
                      label="Category"
                      value={formData.category}
                      onChange={(e) => {
                        const newCategory = e.target.value as any;
                        let newPropertyType = 'Apartment'; // default

                        if (newCategory === 'residential') {
                          newPropertyType = 'Apartment';
                        } else if (newCategory === 'commercial') {
                          newPropertyType = 'Office';
                        } else if (newCategory === 'industrial') {
                          newPropertyType = 'Warehouse';
                        } else if (newCategory === 'land') {
                          newPropertyType = 'Land';
                        }

                        setFormData({ ...formData, category: newCategory, propertyType: newPropertyType });
                      }}
                      required
                    >
                      <MenuItem value="residential">Residential</MenuItem>
                      <MenuItem value="commercial">Commercial</MenuItem>
                      <MenuItem value="industrial">Industrial</MenuItem>
                      <MenuItem value="land">Land</MenuItem>
                    </TextField>
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
                      {/* Residential Options */}
                      <MenuItem value="Apartment" style={{ display: formData.category === 'residential' ? 'block' : 'none' }}>Apartment</MenuItem>
                      <MenuItem value="Villa" style={{ display: formData.category === 'residential' ? 'block' : 'none' }}>Villa</MenuItem>
                      <MenuItem value="Penthouse" style={{ display: formData.category === 'residential' ? 'block' : 'none' }}>Penthouse</MenuItem>
                      <MenuItem value="Studio" style={{ display: formData.category === 'residential' ? 'block' : 'none' }}>Studio</MenuItem>
                      <MenuItem value="Townhouse" style={{ display: formData.category === 'residential' ? 'block' : 'none' }}>Townhouse</MenuItem>
                      <MenuItem value="Duplex" style={{ display: formData.category === 'residential' ? 'block' : 'none' }}>Duplex</MenuItem>
                      <MenuItem value="Hotel Apartment" style={{ display: formData.category === 'residential' ? 'block' : 'none' }}>Hotel Apartment</MenuItem>
                      <MenuItem value="Chalet" style={{ display: formData.category === 'residential' ? 'block' : 'none' }}>Chalet</MenuItem>
                      <MenuItem value="Compound Villa" style={{ display: formData.category === 'residential' ? 'block' : 'none' }}>Compound Villa</MenuItem>
                      <MenuItem value="Standalone Villa" style={{ display: formData.category === 'residential' ? 'block' : 'none' }}>Standalone Villa</MenuItem>

                      {/* Commercial Options */}
                      <MenuItem value="Office" style={{ display: formData.category === 'commercial' ? 'block' : 'none' }}>Office</MenuItem>
                      <MenuItem value="Shop" style={{ display: formData.category === 'commercial' ? 'block' : 'none' }}>Shop</MenuItem>
                      <MenuItem value="Showroom" style={{ display: formData.category === 'commercial' ? 'block' : 'none' }}>Showroom</MenuItem>
                      <MenuItem value="Retail Shop" style={{ display: formData.category === 'commercial' ? 'block' : 'none' }}>Retail Shop</MenuItem>
                      <MenuItem value="Commercial Villa" style={{ display: formData.category === 'commercial' ? 'block' : 'none' }}>Commercial Villa</MenuItem>
                      <MenuItem value="Restaurant" style={{ display: formData.category === 'commercial' ? 'block' : 'none' }}>Restaurant</MenuItem>
                      <MenuItem value="Whole Building" style={{ display: formData.category === 'commercial' ? 'block' : 'none' }}>Whole Building</MenuItem>
                      <MenuItem value="Hotel" style={{ display: formData.category === 'commercial' ? 'block' : 'none' }}>Hotel</MenuItem>

                      {/* Industrial Options */}
                      <MenuItem value="Warehouse" style={{ display: formData.category === 'industrial' ? 'block' : 'none' }}>Warehouse</MenuItem>
                      <MenuItem value="Factory" style={{ display: formData.category === 'industrial' ? 'block' : 'none' }}>Factory</MenuItem>
                      <MenuItem value="Labor Camp" style={{ display: formData.category === 'industrial' ? 'block' : 'none' }}>Labor Camp</MenuItem>
                      <MenuItem value="Industrial Land" style={{ display: formData.category === 'industrial' ? 'block' : 'none' }}>Industrial Land</MenuItem>

                      {/* Land Options */}
                      <MenuItem value="Land" style={{ display: formData.category === 'land' ? 'block' : 'none' }}>Land</MenuItem>
                      <MenuItem value="Land Plot" style={{ display: formData.category === 'land' ? 'block' : 'none' }}>Land Plot</MenuItem>
                      <MenuItem value="Residential Land" style={{ display: formData.category === 'land' ? 'block' : 'none' }}>Residential Land</MenuItem>
                      <MenuItem value="Commercial Land" style={{ display: formData.category === 'land' ? 'block' : 'none' }}>Commercial Land</MenuItem>
                    </TextField>
                  </Grid>
                  {/* <Grid item xs={6} md={4}>
                    <TextField
                      select
                      fullWidth
                      label="Listing Type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      required
                    >
                      <MenuItem value="sale">For Sale</MenuItem>
                      <MenuItem value="rent">For Rent</MenuItem>
                      <MenuItem value="off-plan">Off-Plan</MenuItem>
                    </TextField>
                  </Grid> */}
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

            {/* Featured Options */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">
                  <Star sx={{ verticalAlign: 'middle', mr: 1, color: '#FFD700' }} />
                  Featured Options
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Featured properties will appear in the "Featured Properties" section on the home page.
                      Portfolio properties will appear in the "Our Portfolio" showcase section.
                    </Alert>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#FFD700',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#FFD700',
                            },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Star sx={{ color: formData.featured ? '#FFD700' : '#ccc' }} />
                          Show in Featured Properties (Home Page)
                        </Box>
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.featuredInPortfolio}
                          onChange={(e) => setFormData({ ...formData, featuredInPortfolio: e.target.checked })}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#4B0E14',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#4B0E14',
                            },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CollectionsBookmark sx={{ color: formData.featuredInPortfolio ? '#4B0E14' : '#ccc' }} />
                          Show in Our Portfolio Section
                        </Box>
                      }
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Off-Plan Specific Fields */}
            {formData.type === 'off-plan' && (
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">Off-Plan Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Developer"
                        value={formData.developer}
                        onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                        placeholder="e.g. Emaar Properties"
                        helperText="Name of the property developer"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Project Name"
                        value={formData.projectName}
                        onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                        placeholder="e.g. Dubai Creek Harbour"
                        helperText="Name of the development project"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Completion Date"
                        value={formData.completionDate}
                        onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                        placeholder="e.g. Q4 2025"
                        helperText="Expected project completion date"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Handover Date"
                        value={formData.handoverDate}
                        onChange={(e) => setFormData({ ...formData, handoverDate: e.target.value })}
                        placeholder="e.g. December 2025"
                        helperText="Expected handover date to buyers"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Starting Price"
                        type="number"
                        value={formData.startingPrice}
                        onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                        placeholder="e.g. 500000"
                        helperText="Starting price for units in this project"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">QAR</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Down Payment"
                        value={formData.downPayment}
                        onChange={(e) => setFormData({ ...formData, downPayment: e.target.value })}
                        placeholder="e.g. 10% or QAR 50,000"
                        helperText="Required down payment amount or percentage"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Payment Plan"
                        value={formData.paymentPlan}
                        onChange={(e) => setFormData({ ...formData, paymentPlan: e.target.value })}
                        placeholder="e.g. 10% Down Payment, 40% During Construction, 50% on Completion"
                        helperText="Overall payment plan structure"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Installment Plan"
                        value={formData.installmentPlan}
                        onChange={(e) => setFormData({ ...formData, installmentPlan: e.target.value })}
                        placeholder="e.g. Monthly installments available, Flexible payment options, Post-handover payment plan"
                        helperText="Detailed installment options and payment flexibility"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Available From"
                        value={formData.availableFrom}
                        onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                        placeholder="e.g. 2025"
                        helperText="Year/date when property will be available"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="ROI"
                        value={formData.roi}
                        onChange={(e) => setFormData({ ...formData, roi: e.target.value })}
                        placeholder="e.g. 6.5%"
                        helperText="Expected Return on Investment"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Guaranteed Returns"
                        value={formData.guaranteedReturns}
                        onChange={(e) => setFormData({ ...formData, guaranteedReturns: e.target.value })}
                        placeholder="e.g. Guaranteed rental returns for 3 years"
                        helperText="Details about guaranteed rental returns if applicable"
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Additional Property Details */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Additional Property Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Reference Number"
                      value={formData.referenceNumber}
                      onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                      placeholder="e.g. AS-002138-2863"
                      helperText="Custom property reference number"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Service Charge"
                      type="number"
                      value={formData.serviceCharge}
                      onChange={(e) => setFormData({ ...formData, serviceCharge: e.target.value })}
                      placeholder="e.g. 14"
                      helperText="Service charge per sqm (QAR)"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">QAR</InputAdornment>,
                        endAdornment: <InputAdornment position="end">/sqm</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Transfer Fee"
                      value={formData.transferFee}
                      onChange={(e) => setFormData({ ...formData, transferFee: e.target.value })}
                      placeholder="e.g. 0% or 2%"
                      helperText="Property transfer fee percentage"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.titleDeed}
                          onChange={(e) => setFormData({ ...formData, titleDeed: e.target.checked })}
                        />
                      }
                      label="Title Deed Available"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.tenanted}
                          onChange={(e) => setFormData({ ...formData, tenanted: e.target.checked })}
                        />
                      }
                      label="Currently Tenanted"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ImageUpload
                      value={formData.layoutImage}
                      onChange={(value) => setFormData(prev => ({ ...prev, layoutImage: Array.isArray(value) ? value[0] : value }))}
                      multiple={false}
                      label="Layout / Floor Plan Image"
                      helperText="Upload floor plan or layout image"
                      showPreview={true}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <PdfUpload
                      value={formData.propertyBrochure}
                      onChange={(value) => setFormData(prev => ({ ...prev, propertyBrochure: value }))}
                      label="Upload Property Brochure"
                      helperText="PDF files only. Max size: 50MB"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Images Section */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Property Images</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <ImageUpload
                      value={formData.images}
                      onChange={(value) => setFormData(prev => ({ ...prev, images: Array.isArray(value) ? value : [value] }))}
                      multiple={true}
                      maxFiles={20}
                      label="Upload Property Images"
                      helperText="Upload multiple images. Recommended size: 1200x800px. Max 20 images."
                      showPreview={true}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Video Section */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Property Video</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <VideoUpload
                      value={formData.video}
                      onChange={(value) => setFormData(prev => ({ ...prev, video: value }))}
                      label="Upload Property Video"
                      helperText="Max file size: 100MB. Supported formats: MP4, MOV, WebM"
                      showPreview={true}
                    />
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
