import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Tabs, Tab, Card, CardContent, Grid, TextField,
  Button, Switch, FormControlLabel, Alert, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Save, Edit, Home as HomeIcon, Assessment, Campaign, Info, Villa } from '@mui/icons-material';
import { RootState, AppDispatch } from '../store/store';
import {
  fetchContent, fetchContentBySection, createContent, updateContent, clearError
} from '../store/slices/contentSlice';
import MultilingualTextField from '../components/MultilingualTextField';
import ImageUpload from '../components/ImageUpload';
import VideoUpload from '../components/VideoUpload';
import { ensureMultilingual } from '../utils/multilingualUtils';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const HomePageManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { heroSection, content: contentList, error, loading } = useSelector(
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

  // Stats Section State
  const [statsData, setStatsData] = useState({
    stats: [
      { label: { en: 'Years Experience', ar: 'سنوات الخبرة', fr: "Années d'expérience" }, value: '15+' },
      { label: { en: 'Countries', ar: 'البلدان', fr: 'Pays' }, value: '8' },
      { label: { en: 'Properties Sold', ar: 'العقارات المباعة', fr: 'Biens vendus' }, value: '1000+' },
      { label: { en: 'Happy Clients', ar: 'العملاء السعداء', fr: 'Clients satisfaits' }, value: '2000+' }
    ],
    isActive: true
  });
  const [statsEditing, setStatsEditing] = useState(false);

  // CTA Section State
  const [ctaData, setCtaData] = useState({
    title: { en: 'Ready to Find Your Dream Property?', ar: 'هل أنت مستعد للعثور على عقار أحلامك؟', fr: 'Prêt à trouver la propriété de vos rêves?' },
    description: { en: 'Let our expert team guide you through your real estate journey', ar: 'دع فريقنا الخبير يرشدك خلال رحلتك العقارية', fr: 'Laissez notre équipe d\'experts vous guider dans votre parcours immobilier' },
    primaryButtonText: { en: 'Browse Properties', ar: 'تصفح العقارات', fr: 'Parcourir les propriétés' },
    primaryButtonLink: '/properties',
    secondaryButtonText: { en: 'Contact Us', ar: 'اتصل بنا', fr: 'Contactez-nous' },
    secondaryButtonLink: '/contact',
    isActive: true
  });
  const [ctaEditing, setCtaEditing] = useState(false);

  // About Section State (for Home Page)
  const [aboutHomeData, setAboutHomeData] = useState({
    badge: { en: 'About N&H Homes Real Estate', ar: 'عن N&H العقارية', fr: 'À propos de N&H Immobilier' },
    title: { en: 'Your Trusted Real Estate Partner', ar: 'شريكك العقاري الموثوق', fr: 'Votre partenaire immobilier de confiance' },
    description: { en: 'We provide a comprehensive portfolio of services designed for individuals, families, developers, corporate tenants, and institutional investors.', ar: 'نقدم مجموعة شاملة من الخدمات المصممة للأفراد والعائلات والمطورين والمستأجرين من الشركات والمستثمرين المؤسسيين.', fr: 'Nous proposons un portefeuille complet de services conçus pour les particuliers, les familles, les promoteurs, les locataires corporatifs et les investisseurs institutionnels.' },
    description2: { en: 'With over 15 years of experience across Qatar, UAE, Saudi Arabia, Egypt, France, Morocco, Oman, and Turkey, we deliver world-class real estate solutions tailored to your needs.', ar: 'مع أكثر من 15 عامًا من الخبرة في قطر والإمارات والسعودية ومصر وفرنسا والمغرب وعمان وتركيا، نقدم حلولاً عقارية عالمية مصممة خصيصًا لاحتياجاتك.', fr: 'Avec plus de 15 ans d\'expérience au Qatar, aux EAU, en Arabie Saoudite, en Égypte, en France, au Maroc, à Oman et en Turquie, nous fournissons des solutions immobilières de classe mondiale adaptées à vos besoins.' },
    backgroundImage: '',
    features: [
      { icon: '🏆', title: { en: 'Award-Winning Service', ar: 'خدمة حائزة على جوائز', fr: 'Service primé' }, description: { en: 'Recognized excellence in real estate', ar: 'تميز معترف به في العقارات', fr: 'Excellence reconnue dans l\'immobilier' } },
      { icon: '🌍', title: { en: 'Global Network', ar: 'شبكة عالمية', fr: 'Réseau mondial' }, description: { en: 'Properties across 8 countries', ar: 'عقارات في 8 دول', fr: 'Propriétés dans 8 pays' } },
      { icon: '🤝', title: { en: 'Trusted Expertise', ar: 'خبرة موثوقة', fr: 'Expertise de confiance' }, description: { en: '15+ years of market experience', ar: 'أكثر من 15 عامًا من الخبرة في السوق', fr: 'Plus de 15 ans d\'expérience du marché' } }
    ],
    statNumber: '1000+',
    statLabel: { en: 'Happy Clients', ar: 'عملاء سعداء', fr: 'Clients satisfaits' },
    isActive: true
  });
  const [aboutHomeEditing, setAboutHomeEditing] = useState(false);

  // Featured Properties Section State
  const [featuredPropertiesData, setFeaturedPropertiesData] = useState({
    badge: { en: 'Featured Properties', ar: 'عقارات مميزة', fr: 'Propriétés en vedette' },
    title: { en: 'Exceptional Properties', ar: 'عقارات استثنائية', fr: 'Propriétés exceptionnelles' },
    subtitle: { en: 'Handpicked luxury properties that define excellence in real estate', ar: 'عقارات فاخرة مختارة بعناية تحدد التميز في العقارات', fr: 'Propriétés de luxe sélectionnées avec soin qui définissent l\'excellence en immobilier' },
    fetchFromDatabase: true,
    propertyCount: 3,
    isActive: true
  });
  const [featuredPropertiesEditing, setFeaturedPropertiesEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchContent({}));
    dispatch(fetchContentBySection('hero'));
    dispatch(fetchContentBySection('home'));
    dispatch(fetchContentBySection('stats'));
    dispatch(fetchContentBySection('cta'));
    dispatch(fetchContentBySection('about-home'));
    dispatch(fetchContentBySection('featured-properties'));
  }, [dispatch]);

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
    if (contentList && Array.isArray(contentList)) {
      const statsItem = contentList.find((it: any) => it.section === 'stats');
      if (statsItem && statsItem.metadata?.stats) {
        setStatsData({
          stats: statsItem.metadata.stats.map((s: any) => ({
            label: ensureMultilingual(s.label),
            value: s.value || ''
          })),
          isActive: statsItem.isActive
        });
      }
      const ctaItem = contentList.find((it: any) => it.section === 'cta');
      if (ctaItem) {
        setCtaData({
          title: ensureMultilingual(ctaItem.title),
          description: ensureMultilingual(ctaItem.description),
          primaryButtonText: ensureMultilingual(ctaItem.metadata?.primaryButtonText),
          primaryButtonLink: ctaItem.metadata?.primaryButtonLink || '/properties',
          secondaryButtonText: ensureMultilingual(ctaItem.metadata?.secondaryButtonText),
          secondaryButtonLink: ctaItem.metadata?.secondaryButtonLink || '/contact',
          isActive: ctaItem.isActive
        });
      }
      const aboutHomeItem = contentList.find((it: any) => it.section === 'about-home');
      if (aboutHomeItem) {
        setAboutHomeData({
          badge: ensureMultilingual(aboutHomeItem.metadata?.badge),
          title: ensureMultilingual(aboutHomeItem.title),
          description: ensureMultilingual(aboutHomeItem.description),
          description2: ensureMultilingual(aboutHomeItem.metadata?.description2),
          backgroundImage: aboutHomeItem.backgroundImage || aboutHomeItem.image || '',
          features: aboutHomeItem.metadata?.features?.map((f: any) => ({
            icon: f.icon || '🏆',
            title: ensureMultilingual(f.title),
            description: ensureMultilingual(f.description)
          })) || aboutHomeData.features,
          statNumber: aboutHomeItem.metadata?.statNumber || '1000+',
          statLabel: ensureMultilingual(aboutHomeItem.metadata?.statLabel),
          isActive: aboutHomeItem.isActive
        });
      }
      const featuredPropertiesItem = contentList.find((it: any) => it.section === 'featured-properties');
      if (featuredPropertiesItem) {
        setFeaturedPropertiesData({
          badge: ensureMultilingual(featuredPropertiesItem.metadata?.badge),
          title: ensureMultilingual(featuredPropertiesItem.title),
          subtitle: ensureMultilingual(featuredPropertiesItem.description),
          fetchFromDatabase: featuredPropertiesItem.metadata?.fetchFromDatabase ?? true,
          propertyCount: featuredPropertiesItem.metadata?.propertyCount || 3,
          isActive: featuredPropertiesItem.isActive
        });
      }
    }
  }, [contentList]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Save functions
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

  const handleSaveAboutHome = async () => {
    try {
      const aboutHomeItem = contentList?.find((it: any) => it.section === 'about-home');
      const payload = {
        section: 'about-home' as const,
        title: aboutHomeData.title,
        description: aboutHomeData.description,
        backgroundImage: aboutHomeData.backgroundImage,
        image: aboutHomeData.backgroundImage,
        metadata: {
          badge: aboutHomeData.badge,
          description2: aboutHomeData.description2,
          features: aboutHomeData.features,
          statNumber: aboutHomeData.statNumber,
          statLabel: aboutHomeData.statLabel
        },
        isActive: aboutHomeData.isActive
      };
      if (aboutHomeItem) {
        await dispatch(updateContent({ id: aboutHomeItem._id, data: payload })).unwrap();
      } else {
        await dispatch(createContent(payload)).unwrap();
      }
      setAboutHomeEditing(false);
      dispatch(fetchContent({}));
    } catch (error) {
      console.error('Error saving about home:', error);
    }
  };

  const handleSaveFeaturedProperties = async () => {
    try {
      const featuredPropertiesItem = contentList?.find((it: any) => it.section === 'featured-properties');
      const payload = {
        section: 'featured-properties' as const,
        title: featuredPropertiesData.title,
        description: featuredPropertiesData.subtitle,
        metadata: {
          badge: featuredPropertiesData.badge,
          fetchFromDatabase: featuredPropertiesData.fetchFromDatabase,
          propertyCount: featuredPropertiesData.propertyCount
        },
        isActive: featuredPropertiesData.isActive
      };
      if (featuredPropertiesItem) {
        await dispatch(updateContent({ id: featuredPropertiesItem._id, data: payload })).unwrap();
      } else {
        await dispatch(createContent(payload)).unwrap();
      }
      setFeaturedPropertiesEditing(false);
      dispatch(fetchContent({}));
    } catch (error) {
      console.error('Error saving featured properties:', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#4B0E14', mb: 1 }}>
          Home Page Management
        </Typography>
        <Typography variant="body1" sx={{ color: '#666' }}>
          Manage hero section, statistics, and call-to-action content for the home page.
        </Typography>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<HomeIcon />} label="Hero Section" iconPosition="start" />
          <Tab icon={<Villa />} label="Featured Properties" iconPosition="start" />
          <Tab icon={<Info />} label="About Section" iconPosition="start" />
          <Tab icon={<Assessment />} label="Statistics" iconPosition="start" />
          <Tab icon={<Campaign />} label="CTA Section" iconPosition="start" />
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
                  control={<Switch checked={heroData.isActive} onChange={(e) => setHeroData({ ...heroData, isActive: e.target.checked })} disabled={!heroEditing} />}
                  label="Active"
                />
                <Button
                  variant="contained"
                  startIcon={heroEditing ? <Save /> : <Edit />}
                  onClick={() => heroEditing ? handleSaveHero() : setHeroEditing(true)}
                  disabled={loading}
                  sx={{ ml: 2, backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}
                >
                  {heroEditing ? 'Save Changes' : 'Edit'}
                </Button>
              </Box>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <MultilingualTextField label="Hero Title" value={heroData.title} onChange={(value) => setHeroData({ ...heroData, title: value })} disabled={!heroEditing} />
                  </Grid>
                  <Grid item xs={12}>
                    <MultilingualTextField label="Hero Subtitle" value={heroData.subtitle} onChange={(value) => setHeroData({ ...heroData, subtitle: value })} disabled={!heroEditing} />
                  </Grid>
                  <Grid item xs={12}>
                    <MultilingualTextField label="Hero Description" value={heroData.description} onChange={(value) => setHeroData({ ...heroData, description: value })} disabled={!heroEditing} multiline rows={3} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <MultilingualTextField label="CTA Button Text" value={heroData.ctaText} onChange={(value) => setHeroData({ ...heroData, ctaText: value })} disabled={!heroEditing} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="CTA Link" value={heroData.ctaLink} onChange={(e) => setHeroData({ ...heroData, ctaLink: e.target.value })} disabled={!heroEditing} placeholder="/properties" />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth disabled={!heroEditing}>
                      <InputLabel>Media Type</InputLabel>
                      <Select value={heroData.mediaType} label="Media Type" onChange={(e) => setHeroData({ ...heroData, mediaType: e.target.value as 'image' | 'video' })}>
                        <MenuItem value="video">Video (Recommended)</MenuItem>
                        <MenuItem value="image">Image</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {heroData.mediaType === 'video' && (
                    <Grid item xs={12}>
                      <VideoUpload
                        value={heroData.videoUrl}
                        onChange={(value) => setHeroData({ ...heroData, videoUrl: value })}
                        disabled={!heroEditing}
                        label="Upload Hero Video"
                        helperText="Recommended: MP4 format, max 150MB"
                        showPreview={true}
                      />
                    </Grid>
                  )}
                  {heroData.mediaType === 'image' && (
                    <Grid item xs={12}>
                      <ImageUpload
                        value={heroData.backgroundImage}
                        onChange={(value) => setHeroData({ ...heroData, backgroundImage: value as string })}
                        multiple={false}
                        disabled={!heroEditing}
                        label="Upload Background Image"
                        helperText="Recommended size: 1920x1080px"
                        showPreview={true}
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Featured Properties Section Tab */}
      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>Featured Properties Section</Typography>
              <Box>
                <FormControlLabel control={<Switch checked={featuredPropertiesData.isActive} onChange={(e) => setFeaturedPropertiesData({ ...featuredPropertiesData, isActive: e.target.checked })} disabled={!featuredPropertiesEditing} />} label="Active" />
                <Button variant="contained" startIcon={featuredPropertiesEditing ? <Save /> : <Edit />} onClick={() => featuredPropertiesEditing ? handleSaveFeaturedProperties() : setFeaturedPropertiesEditing(true)} disabled={loading} sx={{ ml: 2, backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}>
                  {featuredPropertiesEditing ? 'Save Changes' : 'Edit'}
                </Button>
              </Box>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MultilingualTextField label="Section Badge" value={featuredPropertiesData.badge} onChange={(value) => setFeaturedPropertiesData({ ...featuredPropertiesData, badge: value })} disabled={!featuredPropertiesEditing} helperText="e.g., Featured Properties" />
              </Grid>
              <Grid item xs={12}>
                <MultilingualTextField label="Section Title" value={featuredPropertiesData.title} onChange={(value) => setFeaturedPropertiesData({ ...featuredPropertiesData, title: value })} disabled={!featuredPropertiesEditing} helperText="e.g., Exceptional Properties" />
              </Grid>
              <Grid item xs={12}>
                <MultilingualTextField label="Section Subtitle" value={featuredPropertiesData.subtitle} onChange={(value) => setFeaturedPropertiesData({ ...featuredPropertiesData, subtitle: value })} disabled={!featuredPropertiesEditing} helperText="e.g., Handpicked luxury properties..." />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={featuredPropertiesData.fetchFromDatabase}
                      onChange={(e) => setFeaturedPropertiesData({ ...featuredPropertiesData, fetchFromDatabase: e.target.checked })}
                      disabled={!featuredPropertiesEditing}
                    />
                  }
                  label="Fetch Properties from Database"
                />
                <Typography variant="caption" sx={{ display: 'block', color: '#666', mt: 0.5 }}>
                  When enabled, properties will be automatically fetched from the database. Otherwise, static placeholder properties will be shown.
                </Typography>
              </Grid>
              {featuredPropertiesData.fetchFromDatabase && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!featuredPropertiesEditing}>
                    <InputLabel>Number of Properties</InputLabel>
                    <Select
                      value={featuredPropertiesData.propertyCount}
                      label="Number of Properties"
                      onChange={(e) => setFeaturedPropertiesData({ ...featuredPropertiesData, propertyCount: Number(e.target.value) })}
                    >
                      <MenuItem value={3}>3 Properties</MenuItem>
                      <MenuItem value={4}>4 Properties</MenuItem>
                      <MenuItem value={6}>6 Properties</MenuItem>
                      <MenuItem value={8}>8 Properties</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* About Section Tab */}
      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>About Section (Home Page)</Typography>
              <Box>
                <FormControlLabel control={<Switch checked={aboutHomeData.isActive} onChange={(e) => setAboutHomeData({ ...aboutHomeData, isActive: e.target.checked })} disabled={!aboutHomeEditing} />} label="Active" />
                <Button variant="contained" startIcon={aboutHomeEditing ? <Save /> : <Edit />} onClick={() => aboutHomeEditing ? handleSaveAboutHome() : setAboutHomeEditing(true)} disabled={loading} sx={{ ml: 2, backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}>
                  {aboutHomeEditing ? 'Save Changes' : 'Edit'}
                </Button>
              </Box>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <MultilingualTextField label="Section Badge" value={aboutHomeData.badge} onChange={(value) => setAboutHomeData({ ...aboutHomeData, badge: value })} disabled={!aboutHomeEditing} helperText="e.g., About N&H Homes Real Estate" />
              </Grid>
              <Grid item xs={12} md={6}>
                <MultilingualTextField label="Section Title" value={aboutHomeData.title} onChange={(value) => setAboutHomeData({ ...aboutHomeData, title: value })} disabled={!aboutHomeEditing} />
              </Grid>
              <Grid item xs={12}>
                <MultilingualTextField label="Description (Paragraph 1)" value={aboutHomeData.description} onChange={(value) => setAboutHomeData({ ...aboutHomeData, description: value })} disabled={!aboutHomeEditing} multiline rows={3} />
              </Grid>
              <Grid item xs={12}>
                <MultilingualTextField label="Description (Paragraph 2)" value={aboutHomeData.description2} onChange={(value) => setAboutHomeData({ ...aboutHomeData, description2: value })} disabled={!aboutHomeEditing} multiline rows={3} />
              </Grid>
              <Grid item xs={12}>
                <ImageUpload
                  value={aboutHomeData.backgroundImage}
                  onChange={(value) => setAboutHomeData({ ...aboutHomeData, backgroundImage: value as string })}
                  multiple={false}
                  disabled={!aboutHomeEditing}
                  label="Upload Background Image"
                  helperText="Full-width background image for the About section. Recommended size: 1920x1080px"
                  showPreview={true}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#4B0E14' }}>Feature Highlights</Typography>
              </Grid>
              {aboutHomeData.features.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper sx={{ p: 2 }}>
                    <TextField fullWidth label="Icon (Emoji)" value={feature.icon} onChange={(e) => { const newFeatures = [...aboutHomeData.features]; newFeatures[index] = { ...newFeatures[index], icon: e.target.value }; setAboutHomeData({ ...aboutHomeData, features: newFeatures }); }} disabled={!aboutHomeEditing} sx={{ mb: 2 }} />
                    <MultilingualTextField label="Feature Title" value={feature.title} onChange={(value) => { const newFeatures = [...aboutHomeData.features]; newFeatures[index] = { ...newFeatures[index], title: value }; setAboutHomeData({ ...aboutHomeData, features: newFeatures }); }} disabled={!aboutHomeEditing} />
                    <MultilingualTextField label="Feature Description" value={feature.description} onChange={(value) => { const newFeatures = [...aboutHomeData.features]; newFeatures[index] = { ...newFeatures[index], description: value }; setAboutHomeData({ ...aboutHomeData, features: newFeatures }); }} disabled={!aboutHomeEditing} />
                  </Paper>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#4B0E14' }}>Stats Overlay</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Stat Number" value={aboutHomeData.statNumber} onChange={(e) => setAboutHomeData({ ...aboutHomeData, statNumber: e.target.value })} disabled={!aboutHomeEditing} placeholder="e.g., 1000+" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MultilingualTextField label="Stat Label" value={aboutHomeData.statLabel} onChange={(value) => setAboutHomeData({ ...aboutHomeData, statLabel: value })} disabled={!aboutHomeEditing} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Statistics Tab */}
      <TabPanel value={tabValue} index={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>Statistics Section</Typography>
              <Box>
                <FormControlLabel control={<Switch checked={statsData.isActive} onChange={(e) => setStatsData({ ...statsData, isActive: e.target.checked })} disabled={!statsEditing} />} label="Active" />
                <Button variant="contained" startIcon={statsEditing ? <Save /> : <Edit />} onClick={() => setStatsEditing(!statsEditing)} sx={{ ml: 2, backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}>
                  {statsEditing ? 'Save Changes' : 'Edit'}
                </Button>
              </Box>
            </Box>
            <Grid container spacing={2}>
              {statsData.stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper sx={{ p: 2 }}>
                    <MultilingualTextField label="Label" value={stat.label} onChange={(value) => { const newStats = [...statsData.stats]; newStats[index] = { ...newStats[index], label: value }; setStatsData({ ...statsData, stats: newStats }); }} disabled={!statsEditing} />
                    <TextField fullWidth label="Value" value={stat.value} onChange={(e) => { const newStats = [...statsData.stats]; newStats[index] = { ...newStats[index], value: e.target.value }; setStatsData({ ...statsData, stats: newStats }); }} disabled={!statsEditing} sx={{ mt: 1 }} />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* CTA Section Tab */}
      <TabPanel value={tabValue} index={4}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>Call to Action Section</Typography>
              <Box>
                <FormControlLabel control={<Switch checked={ctaData.isActive} onChange={(e) => setCtaData({ ...ctaData, isActive: e.target.checked })} disabled={!ctaEditing} />} label="Active" />
                <Button variant="contained" startIcon={ctaEditing ? <Save /> : <Edit />} onClick={() => setCtaEditing(!ctaEditing)} sx={{ ml: 2, backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}>
                  {ctaEditing ? 'Save Changes' : 'Edit'}
                </Button>
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <MultilingualTextField label="CTA Title" value={ctaData.title} onChange={(value) => setCtaData({ ...ctaData, title: value })} disabled={!ctaEditing} />
              </Grid>
              <Grid item xs={12}>
                <MultilingualTextField label="CTA Description" value={ctaData.description} onChange={(value) => setCtaData({ ...ctaData, description: value })} disabled={!ctaEditing} multiline rows={2} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MultilingualTextField label="Primary Button Text" value={ctaData.primaryButtonText} onChange={(value) => setCtaData({ ...ctaData, primaryButtonText: value })} disabled={!ctaEditing} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Primary Button Link" value={ctaData.primaryButtonLink} onChange={(e) => setCtaData({ ...ctaData, primaryButtonLink: e.target.value })} disabled={!ctaEditing} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MultilingualTextField label="Secondary Button Text" value={ctaData.secondaryButtonText} onChange={(value) => setCtaData({ ...ctaData, secondaryButtonText: value })} disabled={!ctaEditing} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Secondary Button Link" value={ctaData.secondaryButtonLink} onChange={(e) => setCtaData({ ...ctaData, secondaryButtonLink: e.target.value })} disabled={!ctaEditing} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  );
};

export default HomePageManager;

