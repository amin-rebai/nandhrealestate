import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// translations not used in this page yet
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  Card,
  CardContent,
  Tabs,
  Tab,
  Alert,
  Divider,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Save,
  Edit,
  PlayArrow,
  Home as HomeIcon,
  Article,
  Settings
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../store/store';
import {
  fetchContent,
  fetchContentBySection,
  createContent,
  updateContent,
  clearError
} from '../store/slices/contentSlice';

import axios from 'axios';
import MultilingualTextField from '../components/MultilingualTextField';
import ImageUpload from '../components/ImageUpload';
import { ensureMultilingual } from '../utils/multilingualUtils';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';




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
      id={`page-tabpanel-${index}`}
      aria-labelledby={`page-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const displayMultilingual = (
  value: string | { en: string; ar: string; fr?: string } | undefined,
  language: 'en' | 'ar' | 'fr' = 'en'
): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[language] || value.en || value.fr || '';
};

const Content: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { heroSection, aboutSection, content: contentList, error, loading } = useSelector(
    (state: RootState) => state.content
  );
  

  const [tabValue, setTabValue] = useState(0);

  // Hero Section State
  const [heroData, setHeroData] = useState({
    title: { en: '', ar: '', fr: '' },
    subtitle: { en: '', ar: '', fr: '' },
    description: { en: '', ar: '', fr: '' },
    backgroundImage: '',
    videoUrl: '',
    mediaType: 'video' as 'image' | 'video',
    ctaText: { en: '', ar: '', fr: '' },
    ctaLink: '',
    isActive: true
  });

  const [heroEditing, setHeroEditing] = useState(false);

  // About Section State
  const [aboutData, setAboutData] = useState({
    title: { en: '', ar: '', fr: '' },
    content: { en: '', ar: '', fr: '' },
    image: '',
    stats: [
      { label: { en: 'Countries', ar: 'البلدان', fr: 'Pays' }, value: '8' },
      { label: { en: 'Properties', ar: 'العقارات', fr: 'Biens' }, value: '500+' },
      { label: { en: 'Happy Clients', ar: 'العملاء السعداء', fr: 'Clients satisfaits' }, value: '1000+' },
      { label: { en: 'Years Experience', ar: 'سنوات الخبرة', fr: "Années d'expérience" }, value: '15+' }
    ],
    // metadata holds custom blocks: CEO message/photo, mission, vision, whyChoose and network
    metadata: {
      ceo: { message: { en: '', ar: '', fr: '' }, photo: '' },
      mission: { en: '', ar: '', fr: '' },
      vision: { en: '', ar: '', fr: '' },
      whyChoose: [
        { title: { en: 'Integrity', ar: 'النزاهة', fr: 'Intégrité' }, description: { en: 'Transparent services', ar: 'خدمات شفافة', fr: 'Services transparents' } },
        { title: { en: 'Local Expertise', ar: 'الخبرة المحلية', fr: 'Expertise locale' }, description: { en: 'Market knowledge', ar: 'معرفة السوق', fr: 'Connaissance du marché' } },
        { title: { en: 'Global Network', ar: 'شبكة عالمية', fr: 'Réseau mondial' }, description: { en: 'Partners worldwide', ar: 'شركاء حول العالم', fr: 'Partenaires dans le monde entier' } }
      ],
      worldwideNetwork: [
        { label: { en: 'UAE', ar: 'الإمارات', fr: 'Émirats' }, value: '10' },
        { label: { en: 'KSA', ar: 'السعودية', fr: 'Arabie Saoudite' }, value: '8' },
        { label: { en: 'USA', ar: 'الولايات المتحدة', fr: 'États-Unis' }, value: '3' }
      ]
    },
    isActive: true
  });

  const [aboutEditing, setAboutEditing] = useState(false);

  // Fetch content on mount
  useEffect(() => {
    dispatch(fetchContent({}));
    dispatch(fetchContentBySection('hero'));
    dispatch(fetchContentBySection('about'));
    // also fetch others used in Page Settings
    dispatch(fetchContentBySection('services'));
    dispatch(fetchContentBySection('portfolio'));
    dispatch(fetchContentBySection('contact'));
    dispatch(fetchContentBySection('home'));
  }, [dispatch]);

  // Update Hero State when Redux data changes
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

  // Update About State when Redux data changes
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
        metadata: {
          ceo: {
            message: ensureMultilingual(aboutSection.metadata?.ceo?.message || { en: '', ar: '', fr: '' }),
            photo: aboutSection.metadata?.ceo?.photo || ''
          },
          mission: ensureMultilingual(aboutSection.metadata?.mission || { en: '', ar: '', fr: '' }),
          vision: ensureMultilingual(aboutSection.metadata?.vision || { en: '', ar: '', fr: '' }),
          whyChoose: (aboutSection.metadata?.whyChoose || []).map((item: any) => ({
            title: ensureMultilingual(item.title),
            description: ensureMultilingual(item.description)
          })) || [],
          worldwideNetwork: (aboutSection.metadata?.worldwideNetwork || []).map((item: any) => ({
            label: ensureMultilingual(item.label),
            value: item.value || ''
          })) || []
        },
        isActive: aboutSection.isActive
      });
    }
  }, [aboutSection]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Save Hero Section
  const handleSaveHero = async () => {
    try {
      const heroPayload = {
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
        await dispatch(updateContent({ id: heroSection._id, data: heroPayload })).unwrap();
      } else {
        await dispatch(createContent(heroPayload)).unwrap();
      }
      setHeroEditing(false);
    } catch (error) {
      console.error('Error saving hero:', error);
    }
  };

  // Save About Section
  const handleSaveAbout = async () => {
    try {
      const aboutPayload = {
        section: 'about' as const,
        title: aboutData.title,
        content: aboutData.content,
        image: aboutData.image,
        stats: aboutData.stats,
        isActive: aboutData.isActive,
        metadata: aboutData.metadata
      };

      if (aboutSection) {
        await dispatch(updateContent({ id: aboutSection._id, data: aboutPayload })).unwrap();
      } else {
        await dispatch(createContent(aboutPayload)).unwrap();
      }
      setAboutEditing(false);
    } catch (error) {
      console.error('Error saving about:', error);
    }
  };

  // Page Settings / global hero media state
  const [pageMedia, setPageMedia] = useState({
    home: { mediaType: 'video' as 'video' | 'image', videoUrl: '', backgroundImage: '', isActive: true },
    services: { image: '', isActive: true },
    property: { image: '', isActive: true },
    contact: { image: '', isActive: true }
  });

  // Populate pageMedia from contentList when available
  useEffect(() => {
    if (contentList && Array.isArray(contentList)) {
      // home
      const homeItem = contentList.find((it: any) => it.section === 'home');
      if (homeItem) {
        setPageMedia(prev => ({ ...prev, home: { mediaType: homeItem.mediaType || 'video', videoUrl: homeItem.videoUrl || '', backgroundImage: homeItem.backgroundImage || '', isActive: homeItem.isActive } }));
      }
      // services — use single-item (first) if exist
      const servicesItem = contentList.find((it: any) => it.section === 'services');
      if (servicesItem) {
        setPageMedia(prev => ({ ...prev, services: { image: servicesItem.backgroundImage || servicesItem.image || '', isActive: servicesItem.isActive } }));
      }
      // property -> use portfolio section as property hero
      const propertyItem = contentList.find((it: any) => it.section === 'portfolio');
      if (propertyItem) {
        setPageMedia(prev => ({ ...prev, property: { image: propertyItem.backgroundImage || propertyItem.image || '', isActive: propertyItem.isActive } }));
      }
      // contact
      const contactItem = contentList.find((it: any) => it.section === 'contact');
      if (contactItem) {
        setPageMedia(prev => ({ ...prev, contact: { image: contactItem.backgroundImage || contactItem.image || '', isActive: contactItem.isActive } }));
      }
    }
  }, [contentList]);

  // Generic page media save helper
  const savePageMedia = async (section: string) => {
    try {
      let payload: any = {};
      if (section === 'home') {
        payload = {
          section: 'home',
          title: { en: 'Home Hero', ar: 'الرئيسية' },
          backgroundImage: pageMedia.home.backgroundImage,
          videoUrl: pageMedia.home.videoUrl,
          mediaType: pageMedia.home.mediaType,
          isActive: pageMedia.home.isActive
        };
      } else if (section === 'services') {
        payload = {
          section: 'services',
          title: { en: 'Our Services', ar: 'خدماتنا' },
          backgroundImage: pageMedia.services.image,
          isActive: pageMedia.services.isActive
        };
      } else if (section === 'property') {
        payload = {
          section: 'portfolio',
          title: { en: 'Properties', ar: 'العقارات' },
          backgroundImage: pageMedia.property.image,
          isActive: pageMedia.property.isActive
        };
      } else if (section === 'contact') {
        payload = {
          section: 'contact',
          title: { en: 'Contact', ar: 'اتصل' },
          backgroundImage: pageMedia.contact.image,
          isActive: pageMedia.contact.isActive
        };
      }

      // find existing item
      const existing = contentList.find((it: any) => it.section === (section === 'property' ? 'portfolio' : section));
      if (existing) {
        await dispatch(updateContent({ id: existing._id, data: payload })).unwrap();
      } else {
        await dispatch(createContent(payload)).unwrap();
      }
    } catch (err) {
      console.error('Error saving page media', section, err);
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
          Frontend Page Management
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#666',
            fontSize: '1.1rem'
          }}
        >
          Manage hero sections, page content, and upload images for your frontend pages.
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      {/* Tab Navigation */}
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
          <Tab icon={<HomeIcon />} label="Hero Section" iconPosition="start" />
          <Tab icon={<Article />} label="About Section" iconPosition="start" />
          <Tab icon={<Settings />} label="Page Settings" iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Hero Section Tab */}
      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>
                Hero Section Configuration
              </Typography>
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={heroData.isActive}
                      onChange={(e) => setHeroData({ ...heroData, isActive: e.target.checked })}
                      disabled={!heroEditing}
                    />
                  }
                  label="Active"
                />
                <Button
                  variant="contained"
                  startIcon={heroEditing ? <Save /> : <Edit />}
                  onClick={() => {
                    if (heroEditing) {
                      handleSaveHero();
                    } else {
                      setHeroEditing(true);
                    }
                  }}
                  disabled={loading}
                  sx={{
                    ml: 2,
                    backgroundColor: '#4B0E14',
                    '&:hover': { backgroundColor: '#3a0b10' }
                  }}
                >
                  {heroEditing ? 'Save Changes' : 'Edit'}
                </Button>
              </Box>
            </Box>

            <Grid container spacing={3}>
              {/* Left Column - Form */}
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <MultilingualTextField
                      label="Hero Title"
                      value={heroData.title}
                      onChange={(value) => setHeroData({ ...heroData, title: value })}
                      disabled={!heroEditing}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <MultilingualTextField
                      label="Hero Subtitle"
                      value={heroData.subtitle}
                      onChange={(value) => setHeroData({ ...heroData, subtitle: value })}
                      disabled={!heroEditing}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <MultilingualTextField
                      label="Hero Description"
                      value={heroData.description}
                      onChange={(value) => setHeroData({ ...heroData, description: value })}
                      disabled={!heroEditing}
                      multiline
                      rows={3}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <MultilingualTextField
                      label="CTA Button Text"
                      value={heroData.ctaText}
                      onChange={(value) => setHeroData({ ...heroData, ctaText: value })}
                      disabled={!heroEditing}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="CTA Link"
                      value={heroData.ctaLink}
                      onChange={(e) => setHeroData({ ...heroData, ctaLink: e.target.value })}
                      disabled={!heroEditing}
                      placeholder="/properties"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth disabled={!heroEditing}>
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

                  {heroData.mediaType === 'video' && (
                    <Grid item xs={12}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Hero Video Upload
                        </Typography>
                        <Typography variant="caption" sx={{ mb: 2, display: 'block', color: '#666' }}>
                          Recommended: 10-30 seconds, MP4 format, max 100MB
                        </Typography>
                        <Box
                          sx={{
                            border: '2px dashed #ccc',
                            borderRadius: 2,
                            padding: 3,
                            textAlign: 'center',
                            backgroundColor: heroEditing ? '#f9f9f9' : '#f5f5f5',
                            '&:hover': heroEditing ? {
                              borderColor: '#4B0E14',
                              backgroundColor: '#fff'
                            } : {},
                            opacity: heroEditing ? 1 : 0.6
                          }}
                        >
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime"
                            id="hero-video-upload"
                            disabled={!heroEditing}
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
                                  // const response = await fetch('http://localhost:5000/api/upload/video', {
                                  //   method: 'POST',
                                  //   body: formData,
                                  // });

                                  const response = await axios.post(`${API_URL}/upload/video`, formData, {
                                          headers: {
                                            'Content-Type': 'multipart/form-data',
                                            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                                          },
                                        });

                                  if (response.status === 200) {
                                    // const data = await response.json();
                                    setHeroData({ ...heroData, videoUrl: response.data.url });
                                  } else {
                                    alert('Video upload failed');
                                  }
                                } catch (error) {
                                  console.error('Error uploading video:', error);
                                  alert('Error uploading video');
                                }
                              }
                            }}
                            style={{ display: 'none' }}
                          />
                          <label htmlFor="hero-video-upload" style={{ cursor: heroEditing ? 'pointer' : 'not-allowed' }}>
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
                              ✓ Video uploaded
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  )}

                  {heroData.mediaType === 'image' && (
                    <Grid item xs={12}>
                      <ImageUpload
                        value={heroData.backgroundImage}
                        onChange={(value) => setHeroData({ ...heroData, backgroundImage: value as string })}
                        multiple={false}
                        disabled={!heroEditing}
                        variant="compact"
                        label="Upload Background Image"
                        helperText="Recommended size: 1920x1080px"
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>

              {/* Right Column - Preview */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    height: 400,
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
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
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
                <Typography variant="caption" sx={{ mt: 2, display: 'block', color: '#666' }}>
                  Preview: How the hero section will appear on the frontend
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* About Section Tab */}
      <TabPanel value={tabValue} index={1}>
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
                      disabled={!aboutEditing}
                    />
                  }
                  label="Active"
                />
                <Button
                  variant="contained"
                  startIcon={aboutEditing ? <Save /> : <Edit />}
                  onClick={() => {
                    if (aboutEditing) {
                      handleSaveAbout();
                    } else {
                      setAboutEditing(true);
                    }
                  }}
                  disabled={loading}
                  sx={{
                    ml: 2,
                    backgroundColor: '#4B0E14',
                    '&:hover': { backgroundColor: '#3a0b10' }
                  }}
                >
                  {aboutEditing ? 'Save Changes' : 'Edit'}
                </Button>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <MultilingualTextField
                      label="About Title"
                      value={aboutData.title}
                      onChange={(value) => setAboutData({ ...aboutData, title: value })}
                      disabled={!aboutEditing}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <MultilingualTextField
                      label="About Content"
                      value={aboutData.content}
                      onChange={(value) => setAboutData({ ...aboutData, content: value })}
                      disabled={!aboutEditing}
                      multiline
                      rows={6}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <ImageUpload
                      value={aboutData.image}
                      onChange={(value) => setAboutData({ ...aboutData, image: value as string })}
                      multiple={false}
                      disabled={!aboutEditing}
                      variant="compact"
                      label="Upload About Section Image"
                      helperText="Recommended size: 800x600px"
                    />
                  </Grid>

                  {/* CEO Message & Photo */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      CEO Message
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <MultilingualTextField
                      label="CEO Message"
                      value={aboutData.metadata.ceo.message}
                      onChange={(value) => setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, ceo: { ...aboutData.metadata.ceo, message: value } } })}
                      disabled={!aboutEditing}
                      multiline
                      rows={4}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <ImageUpload
                      label="CEO Photo"
                      value={aboutData.metadata.ceo.photo}
                      onChange={(value) => setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, ceo: { ...aboutData.metadata.ceo, photo: value as string } } })}
                      multiple={false}
                      disabled={!aboutEditing}
                      variant="compact"
                      helperText="Recommended size: 400x400px"
                    />
                  </Grid>

                  {/* Mission & Vision */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Mission & Vision
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <MultilingualTextField
                      label="Mission"
                      value={aboutData.metadata.mission}
                      onChange={(value) => setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, mission: value } })}
                      disabled={!aboutEditing}
                      multiline
                      rows={3}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <MultilingualTextField
                      label="Vision"
                      value={aboutData.metadata.vision}
                      onChange={(value) => setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, vision: value } })}
                      disabled={!aboutEditing}
                      multiline
                      rows={3}
                    />
                  </Grid>

                  {/* Why Choose N&H Real Estate */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Why Choose N&H Real Estate
                      </Typography>
                      {aboutEditing && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, whyChoose: [...aboutData.metadata.whyChoose, { title: { en: '', ar: '', fr: '' }, description: { en: '', ar: '', fr: '' } }] } })}
                        >
                          Add Item
                        </Button>
                      )}
                    </Box>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {aboutData.metadata.whyChoose.map((item: any, idx: number) => (
                        <Grid item xs={12} md={4} key={idx}>
                          <Paper sx={{ p: 2 }}>
                            <MultilingualTextField
                              label={`Title`}
                              value={item.title}
                              onChange={(value) => {
                                const newList = [...aboutData.metadata.whyChoose];
                                newList[idx] = { ...newList[idx], title: value };
                                setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, whyChoose: newList } });
                              }}
                              disabled={!aboutEditing}
                            />
                            <MultilingualTextField
                              label={`Description`}
                              value={item.description}
                              onChange={(value) => {
                                const newList = [...aboutData.metadata.whyChoose];
                                newList[idx] = { ...newList[idx], description: value };
                                setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, whyChoose: newList } });
                              }}
                              disabled={!aboutEditing}
                              multiline
                              rows={2}
                            />
                            {aboutEditing && (
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                <Button
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    const newList = [...aboutData.metadata.whyChoose];
                                    newList.splice(idx, 1);
                                    setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, whyChoose: newList } });
                                  }}
                                >
                                  Remove
                                </Button>
                              </Box>
                            )}
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>

                  {/* Worldwide Network */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Our Worldwide Network
                      </Typography>
                      {aboutEditing && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, worldwideNetwork: [...aboutData.metadata.worldwideNetwork, { label: { en: '', ar: '', fr: '' }, value: '' }] } })}
                        >
                          Add Country
                        </Button>
                      )}
                    </Box>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {aboutData.metadata.worldwideNetwork.map((item: any, idx: number) => (
                        <Grid item xs={12} sm={6} md={4} key={idx}>
                          <Paper sx={{ p: 2 }}>
                            <MultilingualTextField
                              label="Country"
                              value={item.label}
                              onChange={(value) => {
                                const newList = [...aboutData.metadata.worldwideNetwork];
                                newList[idx] = { ...newList[idx], label: value };
                                setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, worldwideNetwork: newList } });
                              }}
                              disabled={!aboutEditing}
                            />
                            <TextField
                              fullWidth
                              label="Value" 
                              value={item.value}
                              onChange={(e) => {
                                const newList = [...aboutData.metadata.worldwideNetwork];
                                newList[idx] = { ...newList[idx], value: e.target.value };
                                setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, worldwideNetwork: newList } });
                              }}
                              size="small"
                              disabled={!aboutEditing}
                              sx={{ mt: 1 }}
                            />
                            {aboutEditing && (
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                <Button
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    const newList = [...aboutData.metadata.worldwideNetwork];
                                    newList.splice(idx, 1);
                                    setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, worldwideNetwork: newList } });
                                  }}
                                >
                                  Remove
                                </Button>
                              </Box>
                            )}
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
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
                            disabled={!aboutEditing}
                            size="small"
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={4}>
                {/* About image / CEO preview */}
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      height: 180,
                      backgroundImage: `url(${aboutData.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 1,
                      border: '1px solid #e0e0e0',
                      mb: 2
                    }}
                  />

                  {aboutData.metadata?.ceo?.photo && (
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                      <Box
                        component="img"
                        src={aboutData.metadata.ceo.photo}
                        alt="CEO"
                        sx={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid #eee' }}
                      />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          CEO Message
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666', display: 'block', maxWidth: 220 }}>
                          {displayMultilingual(aboutData.metadata.ceo.message) || 'Short CEO message preview.'}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* Mission / Vision */}
                  {(aboutData.metadata?.mission || aboutData.metadata?.vision) && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                        Mission
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 1 }}>
                        {displayMultilingual(aboutData.metadata.mission) || ''}
                      </Typography>

                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                        Vision
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                        {displayMultilingual(aboutData.metadata.vision) || ''}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Why choose preview */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Why Choose N&H Real Estate
                  </Typography>
                  <Grid container spacing={1}>
                    {aboutData.metadata?.whyChoose?.map((item: any, i: number) => (
                      <Grid item xs={12} key={i}>
                        <Paper sx={{ p: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {displayMultilingual(item.title)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {displayMultilingual(item.description)}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Worldwide Network */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Our Worldwide Network
                  </Typography>
                  <Grid container spacing={1}>
                    {aboutData.metadata?.worldwideNetwork?.map((item: any, idx: number) => (
                      <Grid item xs={6} key={idx}>
                        <Paper sx={{ p: 1, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#4B0E14' }}>
                            {item.value}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {displayMultilingual(item.label)}
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

      {/* Page Settings Tab */}
      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14', mb: 3 }}>
              Frontend Page Settings
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Global Hero Media & Page Images
            </Typography>

            <Grid container spacing={3}>
              {/* Home Hero - Video or Image */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Home (Hero)</Typography>
                    <Box>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => savePageMedia('home')}
                        disabled={loading}
                        sx={{ backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}
                      >
                        Save
                      </Button>
                    </Box>
                  </Box>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Media Type</InputLabel>
                    <Select
                      value={pageMedia.home.mediaType}
                      label="Media Type"
                      onChange={(e) => setPageMedia({ ...pageMedia, home: { ...pageMedia.home, mediaType: e.target.value as 'video' | 'image' } })}
                    >
                      <MenuItem value="video">Video</MenuItem>
                      <MenuItem value="image">Image</MenuItem>
                    </Select>
                  </FormControl>

                  {pageMedia.home.mediaType === 'video' ? (
                    <Box>
                      <Typography variant="caption" display="block" sx={{ mb: 1 }}>Upload or paste a video URL for the Home hero (MP4 recommended)</Typography>
                      <TextField
                        fullWidth
                        placeholder="Paste video URL or upload via the file input"
                        value={pageMedia.home.videoUrl}
                        onChange={(e) => setPageMedia({ ...pageMedia, home: { ...pageMedia.home, videoUrl: e.target.value } })}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 100 * 1024 * 1024) {
                            alert('Video must be less than 100MB');
                            return;
                          }
                          try {
                            const formData = new FormData();
                            formData.append('video', file);
                            const response = await fetch('http://localhost:5000/api/upload/video', { method: 'POST', body: formData });
                            if (response.ok) {
                              const data = await response.json();
                              setPageMedia(prev => ({ ...prev, home: { ...prev.home, videoUrl: data.url } }));
                            } else {
                              alert('Upload failed');
                            }
                          } catch (err) {
                            console.error(err);
                            alert('Upload error');
                          }
                        }}
                        style={{ display: 'block', marginTop: 8 }}
                      />
                    </Box>
                  ) : (
                    <Box>
                      <ImageUpload
                        label="Upload Home Background Image"
                        value={pageMedia.home.backgroundImage}
                        onChange={(value) => setPageMedia({ ...pageMedia, home: { ...pageMedia.home, backgroundImage: value as string } })}
                        multiple={false}
                        helperText="Recommended size: 1920x1080px"
                      />
                    </Box>
                  )}
                </Paper>
              </Grid>

              {/* Services Hero */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Services Page Image</Typography>
                    <Button size="small" variant="contained" onClick={() => savePageMedia('services')} sx={{ backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}>Save</Button>
                  </Box>
                  <ImageUpload
                    label="Upload Services Hero Image"
                    value={pageMedia.services.image}
                    onChange={(value) => setPageMedia({ ...pageMedia, services: { ...pageMedia.services, image: value as string } })}
                    multiple={false}
                    helperText="Recommended size: 1600x900px"
                  />
                </Paper>
              </Grid>

              {/* Property / Portfolio Hero */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Property Page Image</Typography>
                    <Button size="small" variant="contained" onClick={() => savePageMedia('property')} sx={{ backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}>Save</Button>
                  </Box>
                  <ImageUpload
                    label="Upload Property Page Hero Image"
                    value={pageMedia.property.image}
                    onChange={(value) => setPageMedia({ ...pageMedia, property: { ...pageMedia.property, image: value as string } })}
                    multiple={false}
                    helperText="Recommended size: 1600x900px"
                  />
                </Paper>
              </Grid>

              {/* Contact Page Image */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Contact Page Image</Typography>
                    <Button size="small" variant="contained" onClick={() => savePageMedia('contact')} sx={{ backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}>Save</Button>
                  </Box>
                  <ImageUpload
                    label="Upload Contact Page Image"
                    value={pageMedia.contact.image}
                    onChange={(value) => setPageMedia({ ...pageMedia, contact: { ...pageMedia.contact, image: value as string } })}
                    multiple={false}
                    helperText="Recommended size: 1200x800px"
                  />
                </Paper>
              </Grid>

            </Grid>
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  );
};

export default Content;
