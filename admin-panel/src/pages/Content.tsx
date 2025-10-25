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
  FormControlLabel
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
  People
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
    loading,
    error
  } = useSelector((state: RootState) => state.content);
  const { t } = useTranslation();

  const [tabValue, setTabValue] = useState(0);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Local state for editing
  const [heroData, setHeroData] = useState({
    title: { en: '', ar: '' },
    subtitle: { en: '', ar: '' },
    description: { en: '', ar: '' },
    backgroundImage: '',
    ctaText: { en: '', ar: '' },
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
        ctaText: ensureMultilingual(heroSection.ctaText),
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

  // Fetch specific content sections
  useEffect(() => {
    dispatch(fetchContentBySection('services'));
    dispatch(fetchContentBySection('goals'));
    dispatch(fetchContentBySection('clients'));
    dispatch(fetchContentBySection('vision'));
    dispatch(fetchContentBySection('mission'));
    dispatch(fetchContentBySection('values'));
  }, [dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveHero = async () => {
    try {
      const heroContentData = {
        section: 'hero' as const,
        title: heroData.title,
        subtitle: heroData.subtitle,
        description: heroData.description,
        backgroundImage: heroData.backgroundImage,
        ctaText: heroData.ctaText,
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
        </Tabs>
      </Paper>

      {/* Hero Section Tab */}
      <TabPanel value={tabValue} index={0}>
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
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    height: 200,
                    backgroundImage: `url(${heroData.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 1,
                    border: '1px solid #e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      borderRadius: 1
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {displayMultilingual(heroData.title)}
                    </Typography>
                    <Typography variant="body2">
                      {displayMultilingual(heroData.subtitle)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Featured Sections Tab */}
      <TabPanel value={tabValue} index={1}>
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
      <TabPanel value={tabValue} index={2}>
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
      <TabPanel value={tabValue} index={3}>
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
            onClick={() => {
              // Add new service logic
            }}
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
                      onClick={() => {
                        // Edit service logic
                      }}
                      sx={{ color: '#4B0E14' }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        // Delete service logic
                      }}
                      sx={{ color: '#d32f2f' }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Goals Section Tab */}
      <TabPanel value={tabValue} index={4}>
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
            onClick={() => {
              // Add new goal logic
            }}
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
                      onClick={() => {
                        // Edit goal logic
                      }}
                      sx={{ color: '#4B0E14' }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        // Delete goal logic
                      }}
                      sx={{ color: '#d32f2f' }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Clients Section Tab */}
      <TabPanel value={tabValue} index={5}>
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
            onClick={() => {
              // Add new client logic
            }}
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
                      onClick={() => {
                        // Edit client logic
                      }}
                      sx={{ color: '#4B0E14' }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        // Delete client logic
                      }}
                      sx={{ color: '#d32f2f' }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Vision Section Tab */}
      <TabPanel value={tabValue} index={6}>
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
                      checked={visionSection?.isActive || false}
                      onChange={(e) => {
                        // Toggle vision active state
                      }}
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
                  value={ensureMultilingual(visionSection?.title)}
                  onChange={(value) => {
                    // Update vision title
                  }}
                  fullWidth
                  sx={{ mb: 3 }}
                />

                <MultilingualTextField
                  label="Vision Description"
                  value={ensureMultilingual(visionSection?.description)}
                  onChange={(value) => {
                    // Update vision description
                  }}
                  multiline
                  rows={6}
                  fullWidth
                />
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
      <TabPanel value={tabValue} index={7}>
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
                      checked={missionSection?.isActive || false}
                      onChange={(e) => {
                        // Toggle mission active state
                      }}
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
                  value={ensureMultilingual(missionSection?.title)}
                  onChange={(value) => {
                    // Update mission title
                  }}
                  fullWidth
                  sx={{ mb: 3 }}
                />

                <MultilingualTextField
                  label="Mission Description"
                  value={ensureMultilingual(missionSection?.description)}
                  onChange={(value) => {
                    // Update mission description
                  }}
                  multiline
                  rows={6}
                  fullWidth
                />
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
      <TabPanel value={tabValue} index={8}>
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
            onClick={() => {
              // Add new value logic
            }}
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
                      onClick={() => {
                        // Edit value logic
                      }}
                      sx={{ color: '#4B0E14' }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        // Delete value logic
                      }}
                      sx={{ color: '#d32f2f' }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>


    </Box>
  );
};

export default Content;
