import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Tabs, Tab, Card, CardContent, Grid, TextField,
  Button, Switch, FormControlLabel, Alert, Divider
} from '@mui/material';
import { Save, Edit, Info, Person, Visibility, CheckCircle, Public } from '@mui/icons-material';
import { RootState, AppDispatch } from '../store/store';
import { fetchContentBySection, createContent, updateContent, clearError } from '../store/slices/contentSlice';
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
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AboutPageManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { aboutSection, error, loading } = useSelector((state: RootState) => state.content);
  const [tabValue, setTabValue] = useState(0);

  // About Section State
  const [aboutData, setAboutData] = useState<{
    title: { en?: string; ar?: string; fr?: string };
    content: { en?: string; ar?: string; fr?: string };
    image: string;
    stats: Array<{ label: { en?: string; ar?: string; fr?: string }; value: string }>;
    metadata: {
      ceo: {
        message: { en?: string; ar?: string; fr?: string };
        photo: string;
        name: { en?: string; ar?: string; fr?: string };
        title: { en?: string; ar?: string; fr?: string };
        sectionTitle: { en?: string; ar?: string; fr?: string };
      };
      mission: { en?: string; ar?: string; fr?: string };
      missionImage: string;
      vision: { en?: string; ar?: string; fr?: string };
      visionImage: string;
      whyChoose: Array<{ title: { en?: string; ar?: string; fr?: string }; description: { en?: string; ar?: string; fr?: string } }>;
      worldwideNetwork: Array<{ label: { en?: string; ar?: string; fr?: string }; value: string }>;
    };
    isActive: boolean;
  }>({
    title: { en: '', ar: '', fr: '' },
    content: { en: '', ar: '', fr: '' },
    image: '',
    stats: [
      { label: { en: 'Countries', ar: 'البلدان', fr: 'Pays' }, value: '8' },
      { label: { en: 'Properties', ar: 'العقارات', fr: 'Biens' }, value: '500+' },
      { label: { en: 'Happy Clients', ar: 'العملاء السعداء', fr: 'Clients satisfaits' }, value: '1000+' },
      { label: { en: 'Years Experience', ar: 'سنوات الخبرة', fr: "Années d'expérience" }, value: '15+' }
    ],
    metadata: {
      ceo: {
        message: { en: '', ar: '', fr: '' },
        photo: '',
        name: { en: '', ar: '', fr: '' },
        title: { en: '', ar: '', fr: '' },
        sectionTitle: { en: '', ar: '', fr: '' }
      },
      mission: { en: '', ar: '', fr: '' },
      missionImage: '',
      vision: { en: '', ar: '', fr: '' },
      visionImage: '',
      whyChoose: [],
      worldwideNetwork: []
    },
    isActive: true
  });
  const [aboutEditing, setAboutEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchContentBySection('about'));
  }, [dispatch]);

  useEffect(() => {
    if (aboutSection) {
      setAboutData({
        title: ensureMultilingual(aboutSection.title),
        content: ensureMultilingual(aboutSection.content),
        image: aboutSection.image || '',
        stats: (aboutSection.stats || []).map((stat: any) => ({
          label: ensureMultilingual(stat.label),
          value: stat.value || ''
        })),
        metadata: {
          ceo: {
            message: ensureMultilingual(aboutSection.metadata?.ceo?.message || { en: '', ar: '', fr: '' }),
            photo: aboutSection.metadata?.ceo?.photo || '',
            name: ensureMultilingual(aboutSection.metadata?.ceo?.name || { en: '', ar: '', fr: '' }),
            title: ensureMultilingual(aboutSection.metadata?.ceo?.title || { en: '', ar: '', fr: '' }),
            sectionTitle: ensureMultilingual(aboutSection.metadata?.ceo?.sectionTitle || { en: '', ar: '', fr: '' })
          },
          mission: ensureMultilingual(aboutSection.metadata?.mission || { en: '', ar: '', fr: '' }),
          missionImage: aboutSection.metadata?.missionImage || '',
          vision: ensureMultilingual(aboutSection.metadata?.vision || { en: '', ar: '', fr: '' }),
          visionImage: aboutSection.metadata?.visionImage || '',
          whyChoose: (aboutSection.metadata?.whyChoose || []).map((item: any) => ({
            title: ensureMultilingual(item.title),
            description: ensureMultilingual(item.description)
          })),
          worldwideNetwork: (aboutSection.metadata?.worldwideNetwork || []).map((item: any) => ({
            label: ensureMultilingual(item.label),
            value: item.value || ''
          }))
        },
        isActive: aboutSection.isActive
      });
    }
  }, [aboutSection]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveAbout = async () => {
    try {
      const aboutPayload = {
        section: 'about' as const,
        title: ensureMultilingual(aboutData.title),
        content: ensureMultilingual(aboutData.content),
        image: aboutData.image,
        stats: aboutData.stats.map(stat => ({
          label: ensureMultilingual(stat.label),
          value: stat.value
        })),
        metadata: {
          ceo: {
            message: ensureMultilingual(aboutData.metadata.ceo.message),
            photo: aboutData.metadata.ceo.photo,
            name: ensureMultilingual(aboutData.metadata.ceo.name),
            title: ensureMultilingual(aboutData.metadata.ceo.title),
            sectionTitle: ensureMultilingual(aboutData.metadata.ceo.sectionTitle)
          },
          mission: ensureMultilingual(aboutData.metadata.mission),
          missionImage: aboutData.metadata.missionImage,
          vision: ensureMultilingual(aboutData.metadata.vision),
          visionImage: aboutData.metadata.visionImage,
          whyChoose: aboutData.metadata.whyChoose.map(item => ({
            title: ensureMultilingual(item.title),
            description: ensureMultilingual(item.description)
          })),
          worldwideNetwork: aboutData.metadata.worldwideNetwork.map(item => ({
            label: ensureMultilingual(item.label),
            value: item.value
          }))
        },
        isActive: aboutData.isActive
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

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#4B0E14', mb: 1 }}>
          About Page Management
        </Typography>
        <Typography variant="body1" sx={{ color: '#666' }}>
          Manage about section, CEO message, mission/vision, and company information.
        </Typography>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<Info />} label="About Content" iconPosition="start" />
          <Tab icon={<Person />} label="CEO Message" iconPosition="start" />
          <Tab icon={<Visibility />} label="Mission & Vision" iconPosition="start" />
          <Tab icon={<CheckCircle />} label="Why Choose Us" iconPosition="start" />
          <Tab icon={<Public />} label="Network" iconPosition="start" />
        </Tabs>
      </Paper>

      {/* About Content Tab */}
      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>About Section Content</Typography>
              <Box>
                <FormControlLabel control={<Switch checked={aboutData.isActive} onChange={(e) => setAboutData({ ...aboutData, isActive: e.target.checked })} disabled={!aboutEditing} />} label="Active" />
                <Button variant="contained" startIcon={aboutEditing ? <Save /> : <Edit />} onClick={() => aboutEditing ? handleSaveAbout() : setAboutEditing(true)} disabled={loading} sx={{ ml: 2, backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}>
                  {aboutEditing ? 'Save Changes' : 'Edit'}
                </Button>
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}><MultilingualTextField label="About Title" value={aboutData.title} onChange={(value) => setAboutData({ ...aboutData, title: value })} disabled={!aboutEditing} /></Grid>
              <Grid item xs={12}><MultilingualTextField label="About Content" value={aboutData.content} onChange={(value) => setAboutData({ ...aboutData, content: value })} disabled={!aboutEditing} multiline rows={6} /></Grid>
              <Grid item xs={12}><ImageUpload value={aboutData.image} onChange={(value) => setAboutData({ ...aboutData, image: value as string })} multiple={false} disabled={!aboutEditing} label="About Section Image" helperText="Recommended size: 800x600px" showPreview={true} /></Grid>
              <Grid item xs={12}><Divider sx={{ my: 2 }} /><Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Statistics</Typography></Grid>
              {aboutData.stats.map((stat, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <TextField fullWidth label={typeof stat.label === 'object' ? stat.label.en : stat.label} value={stat.value} onChange={(e) => { const newStats = [...aboutData.stats]; newStats[index].value = e.target.value; setAboutData({ ...aboutData, stats: newStats }); }} disabled={!aboutEditing} size="small" />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* CEO Message Tab */}
      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>CEO Section</Typography>
              <Button variant="contained" startIcon={aboutEditing ? <Save /> : <Edit />} onClick={() => aboutEditing ? handleSaveAbout() : setAboutEditing(true)} disabled={loading} sx={{ backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}>
                {aboutEditing ? 'Save Changes' : 'Edit'}
              </Button>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MultilingualTextField label="Section Title (e.g., 'The Vision Behind N&H Homes Real Estate')" value={aboutData.metadata.ceo.sectionTitle} onChange={(value) => setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, ceo: { ...aboutData.metadata.ceo, sectionTitle: value } } })} disabled={!aboutEditing} />
              </Grid>
              <Grid item xs={12} md={6}>
                <MultilingualTextField label="CEO Name" value={aboutData.metadata.ceo.name} onChange={(value) => setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, ceo: { ...aboutData.metadata.ceo, name: value } } })} disabled={!aboutEditing} />
              </Grid>
              <Grid item xs={12} md={6}>
                <MultilingualTextField label="CEO Title (e.g., 'Chairman of Board of Directors')" value={aboutData.metadata.ceo.title} onChange={(value) => setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, ceo: { ...aboutData.metadata.ceo, title: value } } })} disabled={!aboutEditing} />
              </Grid>
              <Grid item xs={12}>
                <MultilingualTextField label="CEO Message/Quote" value={aboutData.metadata.ceo.message} onChange={(value) => setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, ceo: { ...aboutData.metadata.ceo, message: value } } })} disabled={!aboutEditing} multiline rows={4} />
              </Grid>
              <Grid item xs={12}>
                <ImageUpload label="CEO Photo (Full body photo recommended)" value={aboutData.metadata.ceo.photo} onChange={(value) => setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, ceo: { ...aboutData.metadata.ceo, photo: value as string } } })} multiple={false} disabled={!aboutEditing} helperText="Upload a professional full-body photo of the CEO" showPreview={true} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Mission & Vision Tab */}
      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>Mission & Vision</Typography>
              <Button variant="contained" startIcon={aboutEditing ? <Save /> : <Edit />} onClick={() => aboutEditing ? handleSaveAbout() : setAboutEditing(true)} disabled={loading} sx={{ backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}>
                {aboutEditing ? 'Save Changes' : 'Edit'}
              </Button>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12}><Divider sx={{ mb: 2 }}><Typography variant="subtitle2">Vision Section</Typography></Divider></Grid>
              <Grid item xs={12} md={8}><MultilingualTextField label="Vision Statement" value={aboutData.metadata.vision} onChange={(value) => setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, vision: value } })} disabled={!aboutEditing} multiline rows={4} /></Grid>
              <Grid item xs={12} md={4}><ImageUpload label="Vision Background Image" value={aboutData.metadata.visionImage} onChange={(value) => setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, visionImage: value as string } })} multiple={false} disabled={!aboutEditing} helperText="Full-width background image for vision section" showPreview={true} /></Grid>

              <Grid item xs={12}><Divider sx={{ my: 2 }}><Typography variant="subtitle2">Mission Section</Typography></Divider></Grid>
              <Grid item xs={12} md={8}><MultilingualTextField label="Mission Statement" value={aboutData.metadata.mission} onChange={(value) => setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, mission: value } })} disabled={!aboutEditing} multiline rows={4} /></Grid>
              <Grid item xs={12} md={4}><ImageUpload label="Mission Background Image" value={aboutData.metadata.missionImage} onChange={(value) => setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, missionImage: value as string } })} multiple={false} disabled={!aboutEditing} helperText="Full-width background image for mission section" showPreview={true} /></Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Why Choose Us Tab */}
      <TabPanel value={tabValue} index={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>Why Choose N&H Homes Real Estate</Typography>
              <Box>
                {aboutEditing && <Button size="small" variant="outlined" onClick={() => setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, whyChoose: [...aboutData.metadata.whyChoose, { title: { en: '', ar: '', fr: '' }, description: { en: '', ar: '', fr: '' } }] } })} sx={{ mr: 2 }}>Add Item</Button>}
                <Button variant="contained" startIcon={aboutEditing ? <Save /> : <Edit />} onClick={() => aboutEditing ? handleSaveAbout() : setAboutEditing(true)} disabled={loading} sx={{ backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}>
                  {aboutEditing ? 'Save Changes' : 'Edit'}
                </Button>
              </Box>
            </Box>
            <Grid container spacing={2}>
              {aboutData.metadata.whyChoose.map((item, idx) => (
                <Grid item xs={12} md={4} key={idx}>
                  <Paper sx={{ p: 2 }}>
                    <MultilingualTextField label="Title" value={item.title} onChange={(value) => { const newList = [...aboutData.metadata.whyChoose]; newList[idx] = { ...newList[idx], title: value }; setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, whyChoose: newList } }); }} disabled={!aboutEditing} />
                    <MultilingualTextField label="Description" value={item.description} onChange={(value) => { const newList = [...aboutData.metadata.whyChoose]; newList[idx] = { ...newList[idx], description: value }; setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, whyChoose: newList } }); }} disabled={!aboutEditing} multiline rows={2} />
                    {aboutEditing && <Button size="small" color="error" onClick={() => { const newList = [...aboutData.metadata.whyChoose]; newList.splice(idx, 1); setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, whyChoose: newList } }); }}>Remove</Button>}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Network Tab */}
      <TabPanel value={tabValue} index={4}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>Our Worldwide Network</Typography>
              <Box>
                {aboutEditing && <Button size="small" variant="outlined" onClick={() => setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, worldwideNetwork: [...aboutData.metadata.worldwideNetwork, { label: { en: '', ar: '', fr: '' }, value: '' }] } })} sx={{ mr: 2 }}>Add Country</Button>}
                <Button variant="contained" startIcon={aboutEditing ? <Save /> : <Edit />} onClick={() => aboutEditing ? handleSaveAbout() : setAboutEditing(true)} disabled={loading} sx={{ backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}>
                  {aboutEditing ? 'Save Changes' : 'Edit'}
                </Button>
              </Box>
            </Box>
            <Grid container spacing={2}>
              {aboutData.metadata.worldwideNetwork.map((item, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Paper sx={{ p: 2 }}>
                    <MultilingualTextField label="Country" value={item.label} onChange={(value) => { const newList = [...aboutData.metadata.worldwideNetwork]; newList[idx] = { ...newList[idx], label: value }; setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, worldwideNetwork: newList } }); }} disabled={!aboutEditing} />
                    <TextField fullWidth label="Value" value={item.value} onChange={(e) => { const newList = [...aboutData.metadata.worldwideNetwork]; newList[idx] = { ...newList[idx], value: e.target.value }; setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, worldwideNetwork: newList } }); }} size="small" disabled={!aboutEditing} sx={{ mt: 1 }} />
                    {aboutEditing && <Button size="small" color="error" onClick={() => { const newList = [...aboutData.metadata.worldwideNetwork]; newList.splice(idx, 1); setAboutData({ ...aboutData, metadata: { ...aboutData.metadata, worldwideNetwork: newList } }); }}>Remove</Button>}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  );
};

export default AboutPageManager;

