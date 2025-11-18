import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Tabs,
  Tab,
  Chip,
  Alert,
  Divider,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Visibility,
  Save,
  Image as ImageIcon,
  Article,
  Home as HomeIcon,
  People,
  Slideshow,
  PlayArrow,
  Business,
  ContactMail,
  Phone,
  Email,
  LocationOn,
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
  YouTube
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../store/store';
import {
  fetchContent,
  fetchContentBySection,
  createContent,
  updateContent,
  deleteContent,
  toggleContentStatus,
  clearError
} from '../store/slices/contentSlice';
import MultilingualTextField from '../components/MultilingualTextField';
import ImageUpload from '../components/ImageUpload';
import { ensureMultilingual } from '../utils/multilingualUtils';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`content-tabpanel-${index}`}
      aria-labelledby={`content-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Helper function to display multilingual content
const displayMultilingual = (value: string | { en: string; ar: string } | undefined, language: 'en' | 'ar' = 'en'): string => {
  if (!value) return '';
  if (typeof value === 'string') {
    return value;
  }
  return value[language] || value.en || '';
};

const Content: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    heroSection,
    aboutSection,
    featuredSections,
    servicesSections,
    goalsSections,
    clientsSections,
    visionSection,
    missionSection,
    valuesSections,
    sliderSections,
    portfolioSections,
    contactSection,
    loading,
    error
  } = useSelector((state: RootState) => state.content);
  const { t } = useTranslation();

  const [tabValue, setTabValue] = useState(0);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Add slide dialog state
  const [addSlideDialogOpen, setAddSlideDialogOpen] = useState(false);
  const [editSlideDialogOpen, setEditSlideDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<any>(null);
  const [newSlideData, setNewSlideData] = useState({
    title: { en: '', ar: '' },
    subtitle: { en: '', ar: '' },
    description: { en: '', ar: '' },
    ctaText: { en: '', ar: '' },
    ctaLink: '',
    mediaType: 'image' as 'image' | 'video',
    backgroundImage: '',
    videoUrl: '',
    order: 0,
    isActive: true
  });
  const [editSlideData, setEditSlideData] = useState({
    title: { en: '', ar: '' },
    subtitle: { en: '', ar: '' },
    description: { en: '', ar: '' },
    ctaText: { en: '', ar: '' },
    ctaLink: '',
    mediaType: 'image' as 'image' | 'video',
    backgroundImage: '',
    videoUrl: '',
    order: 0,
    isActive: true
  });

  // Generic dialog states for all sections
  const [dialogState, setDialogState] = useState({
    services: { open: false, editing: null as any, data: { title: { en: '', ar: '' }, description: { en: '', ar: '' }, image: '', order: 0, isActive: true } },
    goals: { open: false, editing: null as any, data: { title: { en: '', ar: '' }, description: { en: '', ar: '' }, image: '', order: 0, isActive: true } },
    clients: { open: false, editing: null as any, data: { title: { en: '', ar: '' }, description: { en: '', ar: '' }, image: '', order: 0, isActive: true } },
    values: { open: false, editing: null as any, data: { title: { en: '', ar: '' }, description: { en: '', ar: '' }, image: '', order: 0, isActive: true } },
    portfolio: { open: false, editing: null as any, data: { title: { en: '', ar: '' }, description: { en: '', ar: '' }, image: '', propertyType: 'villa' as any, ctaText: { en: '', ar: '' }, ctaLink: '', order: 0, isActive: true } }
  });

  // Local state for editing
  const [heroData, setHeroData] = useState({
    title: { en: '', ar: '' },
    subtitle: { en: '', ar: '' },
    description: { en: '', ar: '' },
    backgroundImage: '',
    videoUrl: '',
    mediaType: 'video' as 'image' | 'video',
    ctaText: { en: '', ar: '' },
    ctaLink: '',
    isActive: true
  });

  const [aboutData, setAboutData] = useState({
    title: { en: '', ar: '' },
    content: { en: '', ar: '' },
    image: '',
    stats: [
      { label: { en: 'Countries', ar: 'البلدان' }, value: '8' },
      { label: { en: 'Properties', ar: 'العقارات' }, value: '500+' },
      { label: { en: 'Happy Clients', ar: 'العملاء السعداء' }, value: '1000+' },
      { label: { en: 'Years Experience', ar: 'سنوات الخبرة' }, value: '15+' }
    ],
    isActive: true
  });

  // Vision and Mission local state
  const [visionData, setVisionData] = useState({
    title: { en: '', ar: '' },
    description: { en: '', ar: '' },
    isActive: true
  });

  const [missionData, setMissionData] = useState({
    title: { en: '', ar: '' },
    description: { en: '', ar: '' },
    isActive: true
  });

  // Contact section local state
  const [contactData, setContactData] = useState({
    title: { en: '', ar: '' },
    description: { en: '', ar: '' },
    phone: '',
    email: '',
    address: { en: '', ar: '' },
    businessHours: { en: '', ar: '' },
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: ''
    },
    isActive: true
  });

  // Fetch content on component mount
  useEffect(() => {
    dispatch(fetchContent({}));
  }, [dispatch]);

  // Update local state when Redux data changes
  useEffect(() => {
    if (heroSection) {
      setHeroData({
        title: ensureMultilingual(heroSection.title),
        subtitle: ensureMultilingual(heroSection.subtitle),
        description: ensureMultilingual(heroSection.description),
        backgroundImage: heroSection.backgroundImage || '',
        videoUrl: heroSection.videoUrl || '',
        mediaType: heroSection.mediaType || 'video',
        ctaText: ensureMultilingual(heroSection.ctaText),
        ctaLink: heroSection.ctaLink || '',
        isActive: heroSection.isActive
      });
    }
  }, [heroSection]);

  useEffect(() => {
    if (aboutSection) {
      setAboutData({
        title: ensureMultilingual(aboutSection.title),
        content: ensureMultilingual(aboutSection.content),
        image: aboutSection.image || '',
        stats: (aboutSection.stats || [
          { label: { en: 'Countries', ar: 'البلدان' }, value: '8' },
          { label: { en: 'Properties', ar: 'العقارات' }, value: '500+' },
          { label: { en: 'Happy Clients', ar: 'العملاء السعداء' }, value: '1000+' },
          { label: { en: 'Years Experience', ar: 'سنوات الخبرة' }, value: '15+' }
        ]).map(stat => ({
          ...stat,
          label: ensureMultilingual(stat.label)
        })),
        isActive: aboutSection.isActive
      });
    }
  }, [aboutSection]);

  // Update vision data when Redux data changes
  useEffect(() => {
    if (visionSection) {
      setVisionData({
        title: ensureMultilingual(visionSection.title),
        description: ensureMultilingual(visionSection.description),
        isActive: visionSection.isActive
      });
    }
  }, [visionSection]);

  // Update mission data when Redux data changes
  useEffect(() => {
    if (missionSection) {
      setMissionData({
        title: ensureMultilingual(missionSection.title),
        description: ensureMultilingual(missionSection.description),
        isActive: missionSection.isActive
      });
    }
  }, [missionSection]);

  // Update contact data when Redux data changes
  useEffect(() => {
    if (contactSection) {
      setContactData({
        title: ensureMultilingual(contactSection.title),
        description: ensureMultilingual(contactSection.description),
        phone: contactSection.metadata?.phone || '',
        email: contactSection.metadata?.email || '',
        address: ensureMultilingual(contactSection.metadata?.address),
        businessHours: ensureMultilingual(contactSection.metadata?.businessHours),
        socialMedia: {
          facebook: contactSection.metadata?.socialMedia?.facebook || '',
          instagram: contactSection.metadata?.socialMedia?.instagram || '',
          twitter: contactSection.metadata?.socialMedia?.twitter || '',
          linkedin: contactSection.metadata?.socialMedia?.linkedin || '',
          youtube: contactSection.metadata?.socialMedia?.youtube || ''
        },
        isActive: contactSection.isActive
      });
    }
  }, [contactSection]);

  // Fetch specific content sections
  useEffect(() => {
    dispatch(fetchContentBySection('slider'));
    dispatch(fetchContentBySection('portfolio'));
    dispatch(fetchContentBySection('services'));
    dispatch(fetchContentBySection('goals'));
    dispatch(fetchContentBySection('clients'));
    dispatch(fetchContentBySection('vision'));
    dispatch(fetchContentBySection('mission'));
    dispatch(fetchContentBySection('values'));
    dispatch(fetchContentBySection('contact'));
  }, [dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Helper functions for dialog management
  const openDialog = (section: keyof typeof dialogState, item?: any) => {
    setDialogState(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        open: true,
        editing: item || null,
        data: item ? {
          title: ensureMultilingual(item.title),
          description: ensureMultilingual(item.description),
          image: item.image || item.backgroundImage || '',
          ...(section === 'portfolio' && {
            propertyType: item.propertyType || 'villa',
            ctaText: ensureMultilingual(item.ctaText),
            ctaLink: item.ctaLink || ''
          }),
          order: item.order || 0,
          isActive: item.isActive !== undefined ? item.isActive : true
        } : prev[section].data
      }
    }));
  };

  const closeDialog = (section: keyof typeof dialogState) => {
    setDialogState(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        open: false,
        editing: null,
        data: section === 'portfolio'
          ? { title: { en: '', ar: '' }, description: { en: '', ar: '' }, image: '', propertyType: 'villa', ctaText: { en: '', ar: '' }, ctaLink: '', order: 0, isActive: true }
          : { title: { en: '', ar: '' }, description: { en: '', ar: '' }, image: '', order: 0, isActive: true }
      }
    }));
  };

  const updateDialogData = (section: keyof typeof dialogState, field: string, value: any) => {
    setDialogState(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        data: {
          ...prev[section].data,
          [field]: value
        }
      }
    }));
  };

  const handleSaveHero = async () => {
    try {
      const heroContentData = {
        section: 'hero' as const,
        title: heroData.title,
        subtitle: heroData.subtitle,
        description: heroData.description,
        backgroundImage: heroData.backgroundImage,
        videoUrl: heroData.videoUrl,
        mediaType: heroData.mediaType,
        ctaText: heroData.ctaText,
        ctaLink: heroData.ctaLink,
        isActive: heroData.isActive
      };

      if (heroSection) {
        await dispatch(updateContent({ id: heroSection._id, data: heroContentData })).unwrap();
      } else {
        await dispatch(createContent(heroContentData)).unwrap();
      }
      setEditingSection(null);
    } catch (error) {
      console.error('Error saving hero data:', error);
    }
  };

  const handleSaveAbout = async () => {
    try {
      const aboutContentData = {
        section: 'about' as const,
        title: aboutData.title,
        content: aboutData.content,
        image: aboutData.image,
        stats: aboutData.stats,
        isActive: aboutData.isActive
      };

      if (aboutSection) {
        await dispatch(updateContent({ id: aboutSection._id, data: aboutContentData })).unwrap();
      } else {
        await dispatch(createContent(aboutContentData)).unwrap();
      }
      setEditingSection(null);
    } catch (error) {
      console.error('Error saving about data:', error);
    }
  };



  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: '#4B0E14',
            mb: 1
          }}
        >
          Content Management
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#666',
            fontSize: '1.1rem'
          }}
        >
          Manage your website's main page content, images, and sections.
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600
            }
          }}
        >
          <Tab
            icon={<Slideshow />}
            label="Slider"
            iconPosition="start"
          />
          <Tab
            icon={<Business />}
            label="Portfolio"
            iconPosition="start"
          />
          <Tab
            icon={<HomeIcon />}
            label="Hero Section"
            iconPosition="start"
          />
          <Tab
            icon={<Article />}
            label="Featured Sections"
            iconPosition="start"
          />
          <Tab
            icon={<ImageIcon />}
            label="About Section"
            iconPosition="start"
          />
          <Tab
            icon={<Article />}
            label="Services"
            iconPosition="start"
          />
          <Tab
            icon={<Article />}
            label="Goals"
            iconPosition="start"
          />
          <Tab
            icon={<People />}
            label="Clients"
            iconPosition="start"
          />
          <Tab
            icon={<Visibility />}
            label="Vision"
            iconPosition="start"
          />
          <Tab
            icon={<Article />}
            label="Mission"
            iconPosition="start"
          />
          <Tab
            icon={<Article />}
            label="Values"
            iconPosition="start"
          />
          <Tab
            icon={<ContactMail />}
            label="Contact & Social"
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Slider Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>
            Homepage Slider Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              backgroundColor: '#4B0E14',
              '&:hover': { backgroundColor: '#3a0b10' }
            }}
            onClick={() => setAddSlideDialogOpen(true)}
          >
            Add Slide
          </Button>
        </Box>

        <Grid container spacing={3}>
          {sliderSections.map((slide) => (
            <Grid item xs={12} md={6} lg={4} key={slide._id}>
              <Card>
                {slide.mediaType === 'video' && slide.videoUrl ? (
                  <Box sx={{ position: 'relative', height: 200, backgroundColor: '#000' }}>
                    <video
                      src={slide.videoUrl}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(75, 14, 20, 0.9)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        fontWeight: 600
                      }}
                    >
                      <PlayArrow sx={{ fontSize: 18 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>Short Video</Typography>
                    </Box>
                  </Box>
                ) : (
                  <CardMedia
                    component="img"
                    height="200"
                    image={slide.backgroundImage || slide.image}
                    alt={displayMultilingual(slide.title)}
                  />
                )}
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>
                      {displayMultilingual(slide.title)}
                    </Typography>
                    <Chip
                      label={slide.isActive ? 'Active' : 'Inactive'}
                      color={slide.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                    {displayMultilingual(slide.description)}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => {
                        setEditingSlide(slide);
                        setEditSlideData({
                          title: typeof slide.title === 'string' ? { en: slide.title, ar: slide.title } : (slide.title || { en: '', ar: '' }),
                          subtitle: typeof slide.subtitle === 'string' ? { en: slide.subtitle, ar: slide.subtitle } : (slide.subtitle || { en: '', ar: '' }),
                          description: typeof slide.description === 'string' ? { en: slide.description, ar: slide.description } : (slide.description || { en: '', ar: '' }),
                          ctaText: typeof slide.ctaText === 'string' ? { en: slide.ctaText, ar: slide.ctaText } : (slide.ctaText || { en: '', ar: '' }),
                          ctaLink: slide.ctaLink || '',
                          mediaType: slide.mediaType || 'image',
                          backgroundImage: slide.backgroundImage || '',
                          videoUrl: slide.videoUrl || '',
                          order: slide.order || 0,
                          isActive: slide.isActive !== undefined ? slide.isActive : true
                        });
                        setEditSlideDialogOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this slide?')) {
                          dispatch(deleteContent(slide._id));
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="default"
                      onClick={() => dispatch(toggleContentStatus(slide._id))}
                    >
                      <Visibility />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Portfolio Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>
            Portfolio Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              backgroundColor: '#4B0E14',
              '&:hover': { backgroundColor: '#3a0b10' }
            }}
            onClick={() => openDialog('portfolio')}
          >
            Add Portfolio Item
          </Button>
        </Box>

        <Grid container spacing={3}>
          {portfolioSections.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.backgroundImage || item.image}
                  alt={displayMultilingual(item.title)}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>
                      {displayMultilingual(item.title)}
                    </Typography>
                    <Chip
                      label={item.isActive ? 'Active' : 'Inactive'}
                      color={item.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  {item.propertyType && (
                    <Chip
                      label={item.propertyType.charAt(0).toUpperCase() + item.propertyType.slice(1)}
                      variant="outlined"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  )}
                  <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                    {displayMultilingual(item.description)}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => openDialog('portfolio', item)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this portfolio item?')) {
                          dispatch(deleteContent(item._id));
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="default"
                      onClick={() => dispatch(toggleContentStatus(item._id))}
                    >
                      <Visibility />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Hero Section Tab */}
      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>
                Hero Section Configuration
              </Typography>
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={heroData.isActive}
                      onChange={(e) => setHeroData({ ...heroData, isActive: e.target.checked })}
                    />
                  }
                  label="Active"
                />
                <Button
                  variant="contained"
                  startIcon={editingSection === 'hero' ? <Save /> : <Edit />}
                  onClick={() => {
                    if (editingSection === 'hero') {
                      handleSaveHero();
                    } else {
                      setEditingSection('hero');
                    }
                  }}
                  disabled={loading}
                  sx={{
                    ml: 2,
                    backgroundColor: '#4B0E14',
                    '&:hover': { backgroundColor: '#3a0b10' }
                  }}
                >
                  {editingSection === 'hero' ? 'Save Changes' : 'Edit'}
                </Button>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <MultilingualTextField
                      label={t('content.contentTitle')}
                      value={heroData.title}
                      onChange={(value) => setHeroData({ ...heroData, title: value })}
                      disabled={editingSection !== 'hero'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MultilingualTextField
                      label={t('content.subtitle')}
                      value={heroData.subtitle}
                      onChange={(value) => setHeroData({ ...heroData, subtitle: value })}
                      disabled={editingSection !== 'hero'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MultilingualTextField
                      label={t('content.description')}
                      value={heroData.description}
                      onChange={(value) => setHeroData({ ...heroData, description: value })}
                      disabled={editingSection !== 'hero'}
                      multiline
                      rows={3}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <MultilingualTextField
                      label={t('content.ctaText')}
                      value={heroData.ctaText}
                      onChange={(value) => setHeroData({ ...heroData, ctaText: value })}
                      disabled={editingSection !== 'hero'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="CTA Link"
                      value={heroData.ctaLink}
                      onChange={(e) => setHeroData({ ...heroData, ctaLink: e.target.value })}
                      disabled={editingSection !== 'hero'}
                      placeholder="/properties"
                    />
                  </Grid>

                  {/* Media Type Selection */}
                  <Grid item xs={12}>
                    <FormControl fullWidth disabled={editingSection !== 'hero'}>
                      <InputLabel>Media Type</InputLabel>
                      <Select
                        value={heroData.mediaType}
                        label="Media Type"
                        onChange={(e) => setHeroData({ ...heroData, mediaType: e.target.value as 'image' | 'video' })}
                      >
                        <MenuItem value="video">Video (Recommended)</MenuItem>
                        <MenuItem value="image">Image</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Video Upload */}
                  {heroData.mediaType === 'video' && (
                    <Grid item xs={12}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Hero Video Upload
                        </Typography>
                        <Typography variant="caption" sx={{ mb: 2, display: 'block', color: '#666' }}>
                          Recommended: 10-30 seconds, MP4 format, max 100MB. This video will be the main hero background.
                        </Typography>
                        <Box
                          sx={{
                            border: '2px dashed #ccc',
                            borderRadius: 2,
                            padding: 3,
                            textAlign: 'center',
                            backgroundColor: editingSection === 'hero' ? '#f9f9f9' : '#f5f5f5',
                            '&:hover': editingSection === 'hero' ? {
                              borderColor: '#4B0E14',
                              backgroundColor: '#fff'
                            } : {},
                            opacity: editingSection === 'hero' ? 1 : 0.6
                          }}
                        >
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime"
                            id="hero-video-upload"
                            disabled={editingSection !== 'hero'}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 100 * 1024 * 1024) {
                                  alert('Video file size must be less than 100MB');
                                  return;
                                }
                                try {
                                  const formData = new FormData();
                                  formData.append('video', file);
                                  const response = await fetch('/api/upload/video', {
                                    method: 'POST',
                                    body: formData,
                                  });
                                  if (response.ok) {
                                    const data = await response.json();
                                    setHeroData({ ...heroData, videoUrl: data.url });
                                  } else {
                                    alert('Video upload failed. Please try again.');
                                  }
                                } catch (error) {
                                  console.error('Error uploading video:', error);
                                  alert('Error uploading video. Please try again.');
                                }
                              }
                            }}
                            style={{ display: 'none' }}
                          />
                          <label htmlFor="hero-video-upload" style={{ cursor: editingSection === 'hero' ? 'pointer' : 'not-allowed' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                              <PlayArrow sx={{ fontSize: 48, color: '#4B0E14' }} />
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                Click to upload hero video
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                MP4, WebM or MOV (max 100MB)
                              </Typography>
                            </Box>
                          </label>
                        </Box>
                        {heroData.videoUrl && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" sx={{ display: 'block', color: 'green', mb: 1 }}>
                              ✓ Video uploaded: {heroData.videoUrl.split('/').pop()}
                            </Typography>
                            <video
                              src={heroData.videoUrl}
                              controls
                              style={{
                                width: '100%',
                                maxHeight: '300px',
                                borderRadius: '8px',
                                border: '1px solid #ddd'
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  )}

                  {/* Image Upload */}
                  {heroData.mediaType === 'image' && (
                    <Grid item xs={12}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Background Image
                        </Typography>
                        <ImageUpload
                          value={heroData.backgroundImage}
                          onChange={(value) => setHeroData({ ...heroData, backgroundImage: value as string })}
                          multiple={false}
                          disabled={editingSection !== 'hero'}
                          variant="compact"
                          label="Upload Background"
                          helperText="Recommended size: 1920x1080px"
                        />
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    height: 300,
                    borderRadius: 1,
                    border: '1px solid #e0e0e0',
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: '#000'
                  }}
                >
                  {heroData.mediaType === 'video' && heroData.videoUrl ? (
                    <video
                      src={heroData.videoUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : heroData.backgroundImage ? (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${heroData.backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999'
                      }}
                    >
                      <Typography>No media uploaded</Typography>
                    </Box>
                  )}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      textAlign: 'center',
                      padding: 2
                    }}
                  >
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {displayMultilingual(heroData.title) || 'Hero Title'}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {displayMultilingual(heroData.subtitle) || 'Hero Subtitle'}
                      </Typography>
                      {heroData.ctaText && (
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: '#C1A88A',
                            '&:hover': { backgroundColor: '#a08970' }
                          }}
                        >
                          {displayMultilingual(heroData.ctaText)}
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Featured Sections Tab */}
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>
            Featured Sections
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              backgroundColor: '#4B0E14',
              '&:hover': { backgroundColor: '#3a0b10' }
            }}
          >
            Add Section
          </Button>
        </Box>

        <Grid container spacing={3}>
          {featuredSections.map((section) => (
            <Grid item xs={12} md={4} key={section._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={section.image}
                  alt={displayMultilingual(section.title)}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>
                      {displayMultilingual(section.title)}
                    </Typography>
                    <Chip
                      label={section.isActive ? 'Active' : 'Inactive'}
                      color={section.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                    {displayMultilingual(section.description)}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => {
                        // TODO: Implement edit featured section
                        console.log('Edit section:', section._id);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this section?')) {
                          dispatch(deleteContent(section._id));
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="default"
                      onClick={() => dispatch(toggleContentStatus(section._id))}
                    >
                      <Visibility />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* About Section Tab */}
      <TabPanel value={tabValue} index={4}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>
                About Section Configuration
              </Typography>
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={aboutData.isActive}
                      onChange={(e) => setAboutData({ ...aboutData, isActive: e.target.checked })}
                    />
                  }
                  label="Active"
                />
                <Button
                  variant="contained"
                  startIcon={editingSection === 'about' ? <Save /> : <Edit />}
                  onClick={() => {
                    if (editingSection === 'about') {
                      handleSaveAbout();
                    } else {
                      setEditingSection('about');
                    }
                  }}
                  disabled={loading}
                  sx={{
                    ml: 2,
                    backgroundColor: '#4B0E14',
                    '&:hover': { backgroundColor: '#3a0b10' }
                  }}
                >
                  {editingSection === 'about' ? 'Save Changes' : 'Edit'}
                </Button>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <MultilingualTextField
                      label={t('content.contentTitle')}
                      value={aboutData.title}
                      onChange={(value) => setAboutData({ ...aboutData, title: value })}
                      disabled={editingSection !== 'about'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MultilingualTextField
                      label={t('content.content')}
                      value={aboutData.content}
                      onChange={(value) => setAboutData({ ...aboutData, content: value })}
                      disabled={editingSection !== 'about'}
                      multiline
                      rows={6}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        About Section Image
                      </Typography>
                      <ImageUpload
                        value={aboutData.image}
                        onChange={(value) => setAboutData({ ...aboutData, image: value as string })}
                        multiple={false}
                        disabled={editingSection !== 'about'}
                        variant="compact"
                        label="Upload Image"
                        helperText="Recommended size: 800x600px"
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Statistics
                </Typography>
                <Grid container spacing={2}>
                  {aboutData.stats.map((stat, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <TextField
                        fullWidth
                        label={`${stat.label} Value`}
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...aboutData.stats];
                          newStats[index].value = e.target.value;
                          setAboutData({ ...aboutData, stats: newStats });
                        }}
                        disabled={editingSection !== 'about'}
                        size="small"
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    height: 300,
                    backgroundImage: `url(${aboutData.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 1,
                    border: '1px solid #e0e0e0'
                  }}
                />
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Statistics Preview:
                  </Typography>
                  <Grid container spacing={1}>
                    {aboutData.stats.map((stat, index) => (
                      <Grid item xs={6} key={index}>
                        <Paper sx={{ p: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#4B0E14' }}>
                            {stat.value}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {displayMultilingual(stat.label)}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Services Section Tab */}
      <TabPanel value={tabValue} index={5}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>
            Services
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              backgroundColor: '#4B0E14',
              '&:hover': { backgroundColor: '#3a0b10' }
            }}
            onClick={() => openDialog('services')}
          >
            Add Service
          </Button>
        </Box>

        <Grid container spacing={3}>
          {servicesSections.map((section) => (
            <Grid item xs={12} md={4} key={section._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={section.image}
                  alt={displayMultilingual(section.title)}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>
                      {displayMultilingual(section.title)}
                    </Typography>
                    <Chip
                      label={section.isActive ? 'Active' : 'Inactive'}
                      color={section.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                    {displayMultilingual(section.description)}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => openDialog('services', section)}
                      sx={{ color: '#4B0E14' }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this service?')) {
                          dispatch(deleteContent(section._id));
                        }
                      }}
                      sx={{ color: '#d32f2f' }}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => dispatch(toggleContentStatus(section._id))}
                      sx={{ color: '#4B0E14' }}
                    >
                      <Visibility />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Goals Section Tab */}
      <TabPanel value={tabValue} index={6}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>
            Goals
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              backgroundColor: '#4B0E14',
              '&:hover': { backgroundColor: '#3a0b10' }
            }}
            onClick={() => openDialog('goals')}
          >
            Add Goal
          </Button>
        </Box>

        <Grid container spacing={3}>
          {goalsSections.map((section) => (
            <Grid item xs={12} md={4} key={section._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={section.image}
                  alt={displayMultilingual(section.title)}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>
                      {displayMultilingual(section.title)}
                    </Typography>
                    <Chip
                      label={section.isActive ? 'Active' : 'Inactive'}
                      color={section.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                    {displayMultilingual(section.description)}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => openDialog('goals', section)}
                      sx={{ color: '#4B0E14' }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this goal?')) {
                          dispatch(deleteContent(section._id));
                        }
                      }}
                      sx={{ color: '#d32f2f' }}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => dispatch(toggleContentStatus(section._id))}
                      sx={{ color: '#4B0E14' }}
                    >
                      <Visibility />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Clients Section Tab */}
      <TabPanel value={tabValue} index={7}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>
            Our Clients
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              backgroundColor: '#4B0E14',
              '&:hover': { backgroundColor: '#3a0b10' }
            }}
            onClick={() => openDialog('clients')}
          >
            Add Client
          </Button>
        </Box>

        <Grid container spacing={3}>
          {clientsSections.map((section) => (
            <Grid item xs={12} md={3} key={section._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="150"
                  image={section.image}
                  alt={displayMultilingual(section.title)}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>
                      {displayMultilingual(section.title)}
                    </Typography>
                    <Chip
                      label={section.isActive ? 'Active' : 'Inactive'}
                      color={section.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => openDialog('clients', section)}
                      sx={{ color: '#4B0E14' }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this client?')) {
                          dispatch(deleteContent(section._id));
                        }
                      }}
                      sx={{ color: '#d32f2f' }}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => dispatch(toggleContentStatus(section._id))}
                      sx={{ color: '#4B0E14' }}
                    >
                      <Visibility />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Vision Section Tab */}
      <TabPanel value={tabValue} index={8}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>
                Vision Statement
              </Typography>
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={visionData.isActive}
                      onChange={(e) => setVisionData({ ...visionData, isActive: e.target.checked })}
                    />
                  }
                  label="Active"
                />
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  sx={{
                    ml: 2,
                    backgroundColor: '#4B0E14',
                    '&:hover': { backgroundColor: '#3a0b10' }
                  }}
                  onClick={() => {
                    // Save vision logic
                  }}
                >
                  Save Vision
                </Button>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <MultilingualTextField
                  label="Vision Title"
                  value={visionData.title}
                  onChange={(value) => setVisionData({ ...visionData, title: value })}
                  fullWidth
                  sx={{ mb: 3 }}
                />

                <MultilingualTextField
                  label="Vision Description"
                  value={visionData.description}
                  onChange={(value) => setVisionData({ ...visionData, description: value })}
                  multiline
                  rows={6}
                  fullWidth
                />

                <Button
                  variant="contained"
                  sx={{
                    mt: 3,
                    backgroundColor: '#4B0E14',
                    '&:hover': { backgroundColor: '#3a0b10' }
                  }}
                  onClick={async () => {
                    try {
                      const visionPayload = {
                        section: 'vision' as const,
                        title: visionData.title,
                        description: visionData.description,
                        isActive: visionData.isActive
                      };

                      if (visionSection) {
                        await dispatch(updateContent({
                          id: visionSection._id,
                          data: visionPayload
                        })).unwrap();
                      } else {
                        await dispatch(createContent(visionPayload)).unwrap();
                      }
                    } catch (error) {
                      console.error('Error saving vision:', error);
                    }
                  }}
                >
                  Save Vision
                </Button>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Vision Image
                  </Typography>
                  <ImageUpload
                    value={visionSection?.image || ''}
                    onChange={(value) => {
                      // Update vision image - this would need proper state management
                      console.log('Vision image updated:', value);
                    }}
                    multiple={false}
                    variant="dropzone"
                    label="Upload Vision Image"
                    helperText="Recommended size: 600x400px"
                    showPreview={true}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Mission Section Tab */}
      <TabPanel value={tabValue} index={9}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>
                Mission Statement
              </Typography>
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={missionData.isActive}
                      onChange={(e) => setMissionData({ ...missionData, isActive: e.target.checked })}
                    />
                  }
                  label="Active"
                />
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  sx={{
                    ml: 2,
                    backgroundColor: '#4B0E14',
                    '&:hover': { backgroundColor: '#3a0b10' }
                  }}
                  onClick={() => {
                    // Save mission logic
                  }}
                >
                  Save Mission
                </Button>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <MultilingualTextField
                  label="Mission Title"
                  value={missionData.title}
                  onChange={(value) => setMissionData({ ...missionData, title: value })}
                  fullWidth
                  sx={{ mb: 3 }}
                />

                <MultilingualTextField
                  label="Mission Description"
                  value={missionData.description}
                  onChange={(value) => setMissionData({ ...missionData, description: value })}
                  multiline
                  rows={6}
                  fullWidth
                />

                <Button
                  variant="contained"
                  sx={{
                    mt: 3,
                    backgroundColor: '#4B0E14',
                    '&:hover': { backgroundColor: '#3a0b10' }
                  }}
                  onClick={async () => {
                    try {
                      const missionPayload = {
                        section: 'mission' as const,
                        title: missionData.title,
                        description: missionData.description,
                        isActive: missionData.isActive
                      };

                      if (missionSection) {
                        await dispatch(updateContent({
                          id: missionSection._id,
                          data: missionPayload
                        })).unwrap();
                      } else {
                        await dispatch(createContent(missionPayload)).unwrap();
                      }
                    } catch (error) {
                      console.error('Error saving mission:', error);
                    }
                  }}
                >
                  Save Mission
                </Button>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Mission Image
                  </Typography>
                  <ImageUpload
                    value={missionSection?.image || ''}
                    onChange={(value) => {
                      // Update mission image - this would need proper state management
                      console.log('Mission image updated:', value);
                    }}
                    multiple={false}
                    variant="dropzone"
                    label="Upload Mission Image"
                    helperText="Recommended size: 600x400px"
                    showPreview={true}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Values Section Tab */}
      <TabPanel value={tabValue} index={10}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>
            Our Values
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              backgroundColor: '#4B0E14',
              '&:hover': { backgroundColor: '#3a0b10' }
            }}
            onClick={() => openDialog('values')}
          >
            Add Value
          </Button>
        </Box>

        <Grid container spacing={3}>
          {valuesSections.map((section) => (
            <Grid item xs={12} md={4} key={section._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={section.image}
                  alt={displayMultilingual(section.title)}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>
                      {displayMultilingual(section.title)}
                    </Typography>
                    <Chip
                      label={section.isActive ? 'Active' : 'Inactive'}
                      color={section.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                    {displayMultilingual(section.description)}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => openDialog('values', section)}
                      sx={{ color: '#4B0E14' }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this value?')) {
                          dispatch(deleteContent(section._id));
                        }
                      }}
                      sx={{ color: '#d32f2f' }}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => dispatch(toggleContentStatus(section._id))}
                      sx={{ color: '#4B0E14' }}
                    >
                      <Visibility />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Contact & Social Media Tab */}
      <TabPanel value={tabValue} index={11}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14', mb: 3 }}>
              Contact Information & Social Media Links
            </Typography>

            <Grid container spacing={3}>
              {/* Contact Information Section */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone /> Contact Information
                  </Typography>

                  <TextField
                    fullWidth
                    label="Title (English)"
                    value={contactData.title.en}
                    onChange={(e) => setContactData({ ...contactData, title: { ...contactData.title, en: e.target.value } })}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Title (Arabic)"
                    value={contactData.title.ar}
                    onChange={(e) => setContactData({ ...contactData, title: { ...contactData.title, ar: e.target.value } })}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description (English)"
                    value={contactData.description.en}
                    onChange={(e) => setContactData({ ...contactData, description: { ...contactData.description, en: e.target.value } })}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description (Arabic)"
                    value={contactData.description.ar}
                    onChange={(e) => setContactData({ ...contactData, description: { ...contactData.description, ar: e.target.value } })}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    placeholder="+974 7070 4504"
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Email Address"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    placeholder="info@nhrealestate.qa"
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Address (English)"
                    value={contactData.address.en}
                    onChange={(e) => setContactData({ ...contactData, address: { ...contactData.address, en: e.target.value } })}
                    placeholder="Doha, Qatar"
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Address (Arabic)"
                    value={contactData.address.ar}
                    onChange={(e) => setContactData({ ...contactData, address: { ...contactData.address, ar: e.target.value } })}
                    placeholder="الدوحة، قطر"
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Business Hours (English)"
                    value={contactData.businessHours.en}
                    onChange={(e) => setContactData({ ...contactData, businessHours: { ...contactData.businessHours, en: e.target.value } })}
                    placeholder="Sun - Thu: 8:00 AM - 6:00 PM"
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Business Hours (Arabic)"
                    value={contactData.businessHours.ar}
                    onChange={(e) => setContactData({ ...contactData, businessHours: { ...contactData.businessHours, ar: e.target.value } })}
                    placeholder="الأحد - الخميس: 8:00 صباحاً - 6:00 مساءً"
                  />
                </Paper>
              </Grid>

              {/* Social Media Links Section */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Social Media Links
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Facebook sx={{ color: '#1877F2' }} />
                    <TextField
                      fullWidth
                      label="Facebook URL"
                      value={contactData.socialMedia.facebook}
                      onChange={(e) => setContactData({
                        ...contactData,
                        socialMedia: { ...contactData.socialMedia, facebook: e.target.value }
                      })}
                      placeholder="https://facebook.com/nhrealestate"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Instagram sx={{ color: '#E4405F' }} />
                    <TextField
                      fullWidth
                      label="Instagram URL"
                      value={contactData.socialMedia.instagram}
                      onChange={(e) => setContactData({
                        ...contactData,
                        socialMedia: { ...contactData.socialMedia, instagram: e.target.value }
                      })}
                      placeholder="https://instagram.com/nhrealestate"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Twitter sx={{ color: '#1DA1F2' }} />
                    <TextField
                      fullWidth
                      label="Twitter/X URL"
                      value={contactData.socialMedia.twitter}
                      onChange={(e) => setContactData({
                        ...contactData,
                        socialMedia: { ...contactData.socialMedia, twitter: e.target.value }
                      })}
                      placeholder="https://twitter.com/nhrealestate"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LinkedIn sx={{ color: '#0A66C2' }} />
                    <TextField
                      fullWidth
                      label="LinkedIn URL"
                      value={contactData.socialMedia.linkedin}
                      onChange={(e) => setContactData({
                        ...contactData,
                        socialMedia: { ...contactData.socialMedia, linkedin: e.target.value }
                      })}
                      placeholder="https://linkedin.com/company/nhrealestate"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <YouTube sx={{ color: '#FF0000' }} />
                    <TextField
                      fullWidth
                      label="YouTube URL"
                      value={contactData.socialMedia.youtube}
                      onChange={(e) => setContactData({
                        ...contactData,
                        socialMedia: { ...contactData.socialMedia, youtube: e.target.value }
                      })}
                      placeholder="https://youtube.com/@nhrealestate"
                    />
                  </Box>
                </Paper>
              </Grid>

              {/* Save Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={contactData.isActive}
                        onChange={(e) => setContactData({ ...contactData, isActive: e.target.checked })}
                        color="primary"
                      />
                    }
                    label="Active"
                  />
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={async () => {
                      try {
                        const contactPayload = {
                          section: 'contact' as const,
                          title: contactData.title,
                          description: contactData.description,
                          isActive: contactData.isActive,
                          metadata: {
                            phone: contactData.phone,
                            email: contactData.email,
                            address: contactData.address,
                            businessHours: contactData.businessHours,
                            socialMedia: contactData.socialMedia
                          }
                        };

                        if (contactSection) {
                          await dispatch(updateContent({ id: contactSection._id, data: contactPayload as any }));
                        } else {
                          await dispatch(createContent(contactPayload as any));
                        }
                        alert('Contact information saved successfully!');
                      } catch (error) {
                        console.error('Error saving contact information:', error);
                        alert('Failed to save contact information');
                      }
                    }}
                    sx={{
                      backgroundColor: '#4B0E14',
                      '&:hover': { backgroundColor: '#6B1E24' }
                    }}
                  >
                    Save Contact Information
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Add Slide Dialog */}
      <Dialog
        open={addSlideDialogOpen}
        onClose={() => setAddSlideDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Slide</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              {/* Media Type Selection */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Media Type</InputLabel>
                  <Select
                    value={newSlideData.mediaType}
                    label="Media Type"
                    onChange={(e) => setNewSlideData({
                      ...newSlideData,
                      mediaType: e.target.value as 'image' | 'video'
                    })}
                  >
                    <MenuItem value="image">Image</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Title */}
              <Grid item xs={12}>
                <MultilingualTextField
                  label="Slide Title"
                  value={newSlideData.title}
                  onChange={(value) => setNewSlideData({ ...newSlideData, title: value })}
                  fullWidth
                />
              </Grid>

              {/* Subtitle */}
              <Grid item xs={12}>
                <MultilingualTextField
                  label="Slide Subtitle"
                  value={newSlideData.subtitle}
                  onChange={(value) => setNewSlideData({ ...newSlideData, subtitle: value })}
                  fullWidth
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <MultilingualTextField
                  label="Slide Description"
                  value={newSlideData.description}
                  onChange={(value) => setNewSlideData({ ...newSlideData, description: value })}
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>

              {/* CTA Text */}
              <Grid item xs={12} md={6}>
                <MultilingualTextField
                  label="CTA Button Text"
                  value={newSlideData.ctaText}
                  onChange={(value) => setNewSlideData({ ...newSlideData, ctaText: value })}
                  fullWidth
                />
              </Grid>

              {/* CTA Link */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="CTA Link"
                  value={newSlideData.ctaLink}
                  onChange={(e) => setNewSlideData({ ...newSlideData, ctaLink: e.target.value })}
                  fullWidth
                />
              </Grid>

              {/* Media Upload */}
              <Grid item xs={12}>
                {newSlideData.mediaType === 'image' ? (
                  <ImageUpload
                    label="Background Image"
                    value={newSlideData.backgroundImage}
                    onChange={(url) => setNewSlideData({ ...newSlideData, backgroundImage: Array.isArray(url) ? url[0] : url })}
                  />
                ) : (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Short Video Upload
                    </Typography>
                    <Typography variant="caption" sx={{ mb: 2, display: 'block', color: '#666' }}>
                      Recommended: 10-30 seconds, MP4 format, max 100MB. Short videos work best for hero sliders.
                    </Typography>
                    <Box
                      sx={{
                        border: '2px dashed #ccc',
                        borderRadius: 2,
                        padding: 3,
                        textAlign: 'center',
                        backgroundColor: '#f9f9f9',
                        '&:hover': {
                          borderColor: '#4B0E14',
                          backgroundColor: '#fff'
                        }
                      }}
                    >
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        id="video-upload-new"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Validate file size (100MB)
                            if (file.size > 100 * 1024 * 1024) {
                              alert('Video file size must be less than 100MB');
                              return;
                            }

                            try {
                              const formData = new FormData();
                              formData.append('video', file);

                              const response = await fetch('/api/upload/video', {
                                method: 'POST',
                                body: formData,
                              });

                              if (response.ok) {
                                const data = await response.json();
                                setNewSlideData({ ...newSlideData, videoUrl: data.url });
                              } else {
                                alert('Video upload failed. Please try again.');
                              }
                            } catch (error) {
                              console.error('Error uploading video:', error);
                              alert('Error uploading video. Please try again.');
                            }
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="video-upload-new" style={{ cursor: 'pointer' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <PlayArrow sx={{ fontSize: 48, color: '#4B0E14' }} />
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Click to upload video
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            MP4, WebM or MOV (max 100MB)
                          </Typography>
                        </Box>
                      </label>
                    </Box>
                    {newSlideData.videoUrl && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" sx={{ display: 'block', color: 'green', mb: 1 }}>
                          ✓ Video uploaded successfully
                        </Typography>
                        <video
                          src={newSlideData.videoUrl}
                          controls
                          style={{
                            width: '100%',
                            maxHeight: '300px',
                            borderRadius: '8px',
                            border: '1px solid #ddd'
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                )}
              </Grid>

              {/* Order */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Display Order"
                  type="number"
                  value={newSlideData.order}
                  onChange={(e) => setNewSlideData({ ...newSlideData, order: parseInt(e.target.value) || 0 })}
                  fullWidth
                />
              </Grid>

              {/* Active Status */}
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newSlideData.isActive}
                      onChange={(e) => setNewSlideData({ ...newSlideData, isActive: e.target.checked })}
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddSlideDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}
            onClick={async () => {
              try {
                await dispatch(createContent({
                  section: 'slider',
                  title: newSlideData.title,
                  subtitle: newSlideData.subtitle,
                  description: newSlideData.description,
                  ctaText: newSlideData.ctaText,
                  ctaLink: newSlideData.ctaLink,
                  mediaType: newSlideData.mediaType,
                  backgroundImage: newSlideData.mediaType === 'image' ? newSlideData.backgroundImage : undefined,
                  videoUrl: newSlideData.mediaType === 'video' ? newSlideData.videoUrl : undefined,
                  order: newSlideData.order,
                  isActive: newSlideData.isActive
                })).unwrap();

                // Reset form and close dialog
                setNewSlideData({
                  title: { en: '', ar: '' },
                  subtitle: { en: '', ar: '' },
                  description: { en: '', ar: '' },
                  ctaText: { en: '', ar: '' },
                  ctaLink: '',
                  mediaType: 'image',
                  backgroundImage: '',
                  videoUrl: '',
                  order: 0,
                  isActive: true
                });
                setAddSlideDialogOpen(false);
              } catch (error) {
                console.error('Error creating slide:', error);
              }
            }}
          >
            Add Slide
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Slide Dialog */}
      <Dialog
        open={editSlideDialogOpen}
        onClose={() => setEditSlideDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Slide</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              {/* Media Type Selection */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Media Type</InputLabel>
                  <Select
                    value={editSlideData.mediaType}
                    label="Media Type"
                    onChange={(e) => setEditSlideData({ ...editSlideData, mediaType: e.target.value as 'image' | 'video' })}
                  >
                    <MenuItem value="image">Image</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Title */}
              <Grid item xs={12}>
                <MultilingualTextField
                  label="Slide Title"
                  value={editSlideData.title}
                  onChange={(value) => setEditSlideData({ ...editSlideData, title: value })}
                  fullWidth
                />
              </Grid>

              {/* Subtitle */}
              <Grid item xs={12}>
                <MultilingualTextField
                  label="Slide Subtitle"
                  value={editSlideData.subtitle}
                  onChange={(value) => setEditSlideData({ ...editSlideData, subtitle: value })}
                  fullWidth
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <MultilingualTextField
                  label="Slide Description"
                  value={editSlideData.description}
                  onChange={(value) => setEditSlideData({ ...editSlideData, description: value })}
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>

              {/* CTA Text */}
              <Grid item xs={12} md={6}>
                <MultilingualTextField
                  label="CTA Button Text"
                  value={editSlideData.ctaText}
                  onChange={(value) => setEditSlideData({ ...editSlideData, ctaText: value })}
                  fullWidth
                />
              </Grid>

              {/* CTA Link */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="CTA Link"
                  value={editSlideData.ctaLink}
                  onChange={(e) => setEditSlideData({ ...editSlideData, ctaLink: e.target.value })}
                  fullWidth
                />
              </Grid>

              {/* Media Upload/Input */}
              <Grid item xs={12}>
                {editSlideData.mediaType === 'image' ? (
                  <ImageUpload
                    label="Background Image"
                    value={editSlideData.backgroundImage}
                    onChange={(url) => setEditSlideData({ ...editSlideData, backgroundImage: Array.isArray(url) ? url[0] : url })}
                  />
                ) : (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Short Video Upload
                    </Typography>
                    <Typography variant="caption" sx={{ mb: 2, display: 'block', color: '#666' }}>
                      Recommended: 10-30 seconds, MP4 format, max 100MB. Short videos work best for hero sliders.
                    </Typography>
                    <Box
                      sx={{
                        border: '2px dashed #ccc',
                        borderRadius: 2,
                        padding: 3,
                        textAlign: 'center',
                        backgroundColor: '#f9f9f9',
                        '&:hover': {
                          borderColor: '#4B0E14',
                          backgroundColor: '#fff'
                        }
                      }}
                    >
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        id="video-upload-edit"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Validate file size (100MB)
                            if (file.size > 100 * 1024 * 1024) {
                              alert('Video file size must be less than 100MB');
                              return;
                            }

                            try {
                              const formData = new FormData();
                              formData.append('video', file);

                              const response = await fetch('/api/upload/video', {
                                method: 'POST',
                                body: formData,
                              });

                              if (response.ok) {
                                const data = await response.json();
                                setEditSlideData({ ...editSlideData, videoUrl: data.url });
                              } else {
                                alert('Video upload failed. Please try again.');
                              }
                            } catch (error) {
                              console.error('Error uploading video:', error);
                              alert('Error uploading video. Please try again.');
                            }
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="video-upload-edit" style={{ cursor: 'pointer' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <PlayArrow sx={{ fontSize: 48, color: '#4B0E14' }} />
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Click to upload new video
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            MP4, WebM or MOV (max 100MB)
                          </Typography>
                        </Box>
                      </label>
                    </Box>
                    {editSlideData.videoUrl && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" sx={{ display: 'block', color: 'green', mb: 1 }}>
                          ✓ Current video: {editSlideData.videoUrl.split('/').pop()}
                        </Typography>
                        <video
                          src={editSlideData.videoUrl}
                          controls
                          style={{
                            width: '100%',
                            maxHeight: '300px',
                            borderRadius: '8px',
                            border: '1px solid #ddd'
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                )}
              </Grid>

              {/* Order */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Display Order"
                  type="number"
                  value={editSlideData.order}
                  onChange={(e) => setEditSlideData({ ...editSlideData, order: parseInt(e.target.value) || 0 })}
                  fullWidth
                />
              </Grid>

              {/* Active Status */}
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editSlideData.isActive}
                      onChange={(e) => setEditSlideData({ ...editSlideData, isActive: e.target.checked })}
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditSlideDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}
            onClick={async () => {
              try {
                await dispatch(updateContent({
                  id: editingSlide._id,
                  data: {
                    section: 'slider',
                    title: editSlideData.title,
                    subtitle: editSlideData.subtitle,
                    description: editSlideData.description,
                    ctaText: editSlideData.ctaText,
                    ctaLink: editSlideData.ctaLink,
                    mediaType: editSlideData.mediaType,
                    backgroundImage: editSlideData.mediaType === 'image' ? editSlideData.backgroundImage : undefined,
                    videoUrl: editSlideData.mediaType === 'video' ? editSlideData.videoUrl : undefined,
                    order: editSlideData.order,
                    isActive: editSlideData.isActive
                  }
                })).unwrap();

                setEditSlideDialogOpen(false);
                setEditingSlide(null);
              } catch (error) {
                console.error('Error updating slide:', error);
              }
            }}
          >
            Update Slide
          </Button>
        </DialogActions>
      </Dialog>

      {/* Services Dialog */}
      <Dialog
        open={dialogState.services.open}
        onClose={() => closeDialog('services')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogState.services.editing ? 'Edit Service' : 'Add New Service'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              {/* Title */}
              <Grid item xs={12}>
                <MultilingualTextField
                  label="Service Title"
                  value={dialogState.services.data.title}
                  onChange={(value) => updateDialogData('services', 'title', value)}
                  fullWidth
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <MultilingualTextField
                  label="Service Description"
                  value={dialogState.services.data.description}
                  onChange={(value) => updateDialogData('services', 'description', value)}
                  multiline
                  rows={4}
                  fullWidth
                />
              </Grid>

              {/* Image Upload */}
              <Grid item xs={12}>
                <ImageUpload
                  label="Service Image"
                  value={dialogState.services.data.image}
                  onChange={(url) => updateDialogData('services', 'image', url)}
                />
              </Grid>

              {/* Order */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Display Order"
                  type="number"
                  value={dialogState.services.data.order}
                  onChange={(e) => updateDialogData('services', 'order', parseInt(e.target.value) || 0)}
                  fullWidth
                />
              </Grid>

              {/* Active Status */}
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={dialogState.services.data.isActive}
                      onChange={(e) => updateDialogData('services', 'isActive', e.target.checked)}
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => closeDialog('services')}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}
            onClick={async () => {
              try {
                const serviceData = {
                  section: 'services' as const,
                  title: dialogState.services.data.title,
                  description: dialogState.services.data.description,
                  image: dialogState.services.data.image,
                  order: dialogState.services.data.order,
                  isActive: dialogState.services.data.isActive
                };

                if (dialogState.services.editing) {
                  await dispatch(updateContent({
                    id: dialogState.services.editing._id,
                    data: serviceData
                  })).unwrap();
                } else {
                  await dispatch(createContent(serviceData)).unwrap();
                }

                closeDialog('services');
              } catch (error) {
                console.error('Error saving service:', error);
              }
            }}
          >
            {dialogState.services.editing ? 'Update Service' : 'Add Service'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Goals Dialog */}
      <Dialog
        open={dialogState.goals.open}
        onClose={() => closeDialog('goals')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogState.goals.editing ? 'Edit Goal' : 'Add New Goal'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              {/* Title */}
              <Grid item xs={12}>
                <MultilingualTextField
                  label="Goal Title"
                  value={dialogState.goals.data.title}
                  onChange={(value) => updateDialogData('goals', 'title', value)}
                  fullWidth
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <MultilingualTextField
                  label="Goal Description"
                  value={dialogState.goals.data.description}
                  onChange={(value) => updateDialogData('goals', 'description', value)}
                  multiline
                  rows={4}
                  fullWidth
                />
              </Grid>

              {/* Image Upload */}
              <Grid item xs={12}>
                <ImageUpload
                  label="Goal Image"
                  value={dialogState.goals.data.image}
                  onChange={(url) => updateDialogData('goals', 'image', url)}
                />
              </Grid>

              {/* Order */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Display Order"
                  type="number"
                  value={dialogState.goals.data.order}
                  onChange={(e) => updateDialogData('goals', 'order', parseInt(e.target.value) || 0)}
                  fullWidth
                />
              </Grid>

              {/* Active Status */}
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={dialogState.goals.data.isActive}
                      onChange={(e) => updateDialogData('goals', 'isActive', e.target.checked)}
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => closeDialog('goals')}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}
            onClick={async () => {
              try {
                const goalData = {
                  section: 'goals' as const,
                  title: dialogState.goals.data.title,
                  description: dialogState.goals.data.description,
                  image: dialogState.goals.data.image,
                  order: dialogState.goals.data.order,
                  isActive: dialogState.goals.data.isActive
                };

                if (dialogState.goals.editing) {
                  await dispatch(updateContent({
                    id: dialogState.goals.editing._id,
                    data: goalData
                  })).unwrap();
                } else {
                  await dispatch(createContent(goalData)).unwrap();
                }

                closeDialog('goals');
              } catch (error) {
                console.error('Error saving goal:', error);
              }
            }}
          >
            {dialogState.goals.editing ? 'Update Goal' : 'Add Goal'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clients Dialog */}
      <Dialog
        open={dialogState.clients.open}
        onClose={() => closeDialog('clients')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogState.clients.editing ? 'Edit Client' : 'Add New Client'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MultilingualTextField
                  label="Client Name"
                  value={dialogState.clients.data.title}
                  onChange={(value) => updateDialogData('clients', 'title', value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <MultilingualTextField
                  label="Client Description"
                  value={dialogState.clients.data.description}
                  onChange={(value) => updateDialogData('clients', 'description', value)}
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <ImageUpload
                  label="Client Logo"
                  value={dialogState.clients.data.image}
                  onChange={(url) => updateDialogData('clients', 'image', url)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Display Order"
                  type="number"
                  value={dialogState.clients.data.order}
                  onChange={(e) => updateDialogData('clients', 'order', parseInt(e.target.value) || 0)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={dialogState.clients.data.isActive}
                      onChange={(e) => updateDialogData('clients', 'isActive', e.target.checked)}
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => closeDialog('clients')}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}
            onClick={async () => {
              try {
                const clientData = {
                  section: 'clients' as const,
                  title: dialogState.clients.data.title,
                  description: dialogState.clients.data.description,
                  image: dialogState.clients.data.image,
                  order: dialogState.clients.data.order,
                  isActive: dialogState.clients.data.isActive
                };
                if (dialogState.clients.editing) {
                  await dispatch(updateContent({
                    id: dialogState.clients.editing._id,
                    data: clientData
                  })).unwrap();
                } else {
                  await dispatch(createContent(clientData)).unwrap();
                }
                closeDialog('clients');
              } catch (error) {
                console.error('Error saving client:', error);
              }
            }}
          >
            {dialogState.clients.editing ? 'Update Client' : 'Add Client'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Values Dialog */}
      <Dialog
        open={dialogState.values.open}
        onClose={() => closeDialog('values')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogState.values.editing ? 'Edit Value' : 'Add New Value'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MultilingualTextField
                  label="Value Title"
                  value={dialogState.values.data.title}
                  onChange={(value) => updateDialogData('values', 'title', value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <MultilingualTextField
                  label="Value Description"
                  value={dialogState.values.data.description}
                  onChange={(value) => updateDialogData('values', 'description', value)}
                  multiline
                  rows={4}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <ImageUpload
                  label="Value Image"
                  value={dialogState.values.data.image}
                  onChange={(url) => updateDialogData('values', 'image', url)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Display Order"
                  type="number"
                  value={dialogState.values.data.order}
                  onChange={(e) => updateDialogData('values', 'order', parseInt(e.target.value) || 0)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={dialogState.values.data.isActive}
                      onChange={(e) => updateDialogData('values', 'isActive', e.target.checked)}
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => closeDialog('values')}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}
            onClick={async () => {
              try {
                const valueData = {
                  section: 'values' as const,
                  title: dialogState.values.data.title,
                  description: dialogState.values.data.description,
                  image: dialogState.values.data.image,
                  order: dialogState.values.data.order,
                  isActive: dialogState.values.data.isActive
                };
                if (dialogState.values.editing) {
                  await dispatch(updateContent({
                    id: dialogState.values.editing._id,
                    data: valueData
                  })).unwrap();
                } else {
                  await dispatch(createContent(valueData)).unwrap();
                }
                closeDialog('values');
              } catch (error) {
                console.error('Error saving value:', error);
              }
            }}
          >
            {dialogState.values.editing ? 'Update Value' : 'Add Value'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Portfolio Dialog */}
      <Dialog
        open={dialogState.portfolio.open}
        onClose={() => closeDialog('portfolio')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogState.portfolio.editing ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Property Type</InputLabel>
                  <Select
                    value={dialogState.portfolio.data.propertyType}
                    label="Property Type"
                    onChange={(e) => updateDialogData('portfolio', 'propertyType', e.target.value)}
                  >
                    <MenuItem value="villa">Villa</MenuItem>
                    <MenuItem value="apartment">Apartment</MenuItem>
                    <MenuItem value="penthouse">Penthouse</MenuItem>
                    <MenuItem value="commercial">Commercial</MenuItem>
                    <MenuItem value="office">Office</MenuItem>
                    <MenuItem value="retail">Retail</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <MultilingualTextField
                  label="Portfolio Title"
                  value={dialogState.portfolio.data.title}
                  onChange={(value) => updateDialogData('portfolio', 'title', value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <MultilingualTextField
                  label="Portfolio Description"
                  value={dialogState.portfolio.data.description}
                  onChange={(value) => updateDialogData('portfolio', 'description', value)}
                  multiline
                  rows={4}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <ImageUpload
                  label="Portfolio Image"
                  value={dialogState.portfolio.data.image}
                  onChange={(url) => updateDialogData('portfolio', 'image', url)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <MultilingualTextField
                  label="CTA Button Text"
                  value={dialogState.portfolio.data.ctaText}
                  onChange={(value) => updateDialogData('portfolio', 'ctaText', value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="CTA Link"
                  value={dialogState.portfolio.data.ctaLink}
                  onChange={(e) => updateDialogData('portfolio', 'ctaLink', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Display Order"
                  type="number"
                  value={dialogState.portfolio.data.order}
                  onChange={(e) => updateDialogData('portfolio', 'order', parseInt(e.target.value) || 0)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={dialogState.portfolio.data.isActive}
                      onChange={(e) => updateDialogData('portfolio', 'isActive', e.target.checked)}
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => closeDialog('portfolio')}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}
            onClick={async () => {
              try {
                const portfolioData = {
                  section: 'portfolio' as const,
                  title: dialogState.portfolio.data.title,
                  description: dialogState.portfolio.data.description,
                  image: dialogState.portfolio.data.image,
                  propertyType: dialogState.portfolio.data.propertyType,
                  ctaText: dialogState.portfolio.data.ctaText,
                  ctaLink: dialogState.portfolio.data.ctaLink,
                  order: dialogState.portfolio.data.order,
                  isActive: dialogState.portfolio.data.isActive
                };
                if (dialogState.portfolio.editing) {
                  await dispatch(updateContent({
                    id: dialogState.portfolio.editing._id,
                    data: portfolioData
                  })).unwrap();
                } else {
                  await dispatch(createContent(portfolioData)).unwrap();
                }
                closeDialog('portfolio');
              } catch (error) {
                console.error('Error saving portfolio item:', error);
              }
            }}
          >
            {dialogState.portfolio.editing ? 'Update Portfolio Item' : 'Add Portfolio Item'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Content;
