import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Tabs, Tab, Card, CardContent, Grid, TextField,
  Button, Switch, FormControlLabel, Alert, IconButton, Tooltip, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Save, Edit, Delete, Add, Business, Handshake, Timeline, Settings } from '@mui/icons-material';
import { RootState, AppDispatch } from '../store/store';
import { fetchContentBySection, createContent, updateContent, deleteContent, clearError } from '../store/slices/contentSlice';
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

type ContentSection = 'home' | 'hero' | 'about' | 'featured' | 'services' | 'goals' | 'clients' | 'vision' | 'mission' | 'values' | 'slider' | 'portfolio' | 'contact';

interface ServiceItem {
  _id?: string;
  title: { en: string; ar: string; fr: string };
  description: { en: string; ar: string; fr: string };
  image: string;
  order: number;
  isActive: boolean;
  section: ContentSection;
}

const ServicesPageManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { content: contentList, error, loading } = useSelector((state: RootState) => state.content);
  const [tabValue, setTabValue] = useState(0);

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [partners, setPartners] = useState<ServiceItem[]>([]);
  const [processes, setProcesses] = useState<ServiceItem[]>([]);

  // Process section settings (background image, title, subtitle)
  const [processSectionData, setProcessSectionData] = useState({
    title: { en: 'Our Process', ar: 'عمليتنا', fr: 'Notre processus' },
    subtitle: { en: 'A systematic approach to delivering exceptional results', ar: 'نهج منهجي لتقديم نتائج استثنائية', fr: 'Une approche systématique pour des résultats exceptionnels' },
    backgroundImage: '',
    isActive: true
  });
  const [processSectionEditing, setProcessSectionEditing] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [currentSection, setCurrentSection] = useState<'services' | 'clients' | 'goals'>('services');
  const [formData, setFormData] = useState<ServiceItem>({
    title: { en: '', ar: '', fr: '' },
    description: { en: '', ar: '', fr: '' },
    image: '',
    order: 0,
    isActive: true,
    section: 'services'
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ServiceItem | null>(null);

  useEffect(() => {
    dispatch(fetchContentBySection('services'));
    dispatch(fetchContentBySection('clients'));
    dispatch(fetchContentBySection('goals'));
    dispatch(fetchContentBySection('process-section'));
  }, [dispatch]);

  useEffect(() => {
    if (contentList && Array.isArray(contentList)) {
      setServices(contentList.filter((it: any) => it.section === 'services').map((it: any) => ({
        _id: it._id,
        title: ensureMultilingual(it.title),
        description: ensureMultilingual(it.description || it.content),
        image: it.image || it.backgroundImage || '',
        order: it.order || 0,
        isActive: it.isActive,
        section: 'services'
      })));
      setPartners(contentList.filter((it: any) => it.section === 'clients').map((it: any) => ({
        _id: it._id,
        title: ensureMultilingual(it.title),
        description: ensureMultilingual(it.description || it.content),
        image: it.image || it.backgroundImage || '',
        order: it.order || 0,
        isActive: it.isActive,
        section: 'clients'
      })));
      setProcesses(contentList.filter((it: any) => it.section === 'goals').map((it: any) => ({
        _id: it._id,
        title: ensureMultilingual(it.title),
        description: ensureMultilingual(it.description || it.content),
        image: it.image || it.backgroundImage || '',
        order: it.order || 0,
        isActive: it.isActive,
        section: 'goals'
      })));

      // Load process section settings
      const processSectionItem = contentList.find((it: any) => it.section === 'process-section');
      if (processSectionItem) {
        setProcessSectionData({
          title: ensureMultilingual(processSectionItem.title),
          subtitle: ensureMultilingual(processSectionItem.description),
          backgroundImage: processSectionItem.image || processSectionItem.backgroundImage || '',
          isActive: processSectionItem.isActive ?? true
        });
      }
    }
  }, [contentList]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const openDialog = (section: 'services' | 'clients' | 'goals', item?: ServiceItem) => {
    setCurrentSection(section);
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData({ title: { en: '', ar: '', fr: '' }, description: { en: '', ar: '', fr: '' }, image: '', order: 0, isActive: true, section });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData, content: formData.description };
      if (editingItem && editingItem._id) {
        await dispatch(updateContent({ id: editingItem._id, data: payload })).unwrap();
      } else {
        await dispatch(createContent(payload)).unwrap();
      }
      setDialogOpen(false);
      dispatch(fetchContentBySection(currentSection));
    } catch (error) { console.error('Error saving:', error); }
  };

  const handleDelete = async () => {
    if (itemToDelete && itemToDelete._id) {
      try {
        await dispatch(deleteContent(itemToDelete._id)).unwrap();
        setDeleteDialogOpen(false);
        setItemToDelete(null);
        dispatch(fetchContentBySection(currentSection));
      } catch (error) { console.error('Error deleting:', error); }
    }
  };

  const handleSaveProcessSection = async () => {
    try {
      const processSectionItem = contentList?.find((it: any) => it.section === 'process-section');
      const payload = {
        section: 'process-section' as const,
        title: processSectionData.title,
        description: processSectionData.subtitle,
        image: processSectionData.backgroundImage,
        isActive: processSectionData.isActive
      };
      if (processSectionItem) {
        await dispatch(updateContent({ id: processSectionItem._id, data: payload })).unwrap();
      } else {
        await dispatch(createContent(payload)).unwrap();
      }
      setProcessSectionEditing(false);
      dispatch(fetchContentBySection('process-section'));
    } catch (error) {
      console.error('Error saving process section:', error);
    }
  };

  const getDisplayText = (value: { en: string; ar: string; fr: string } | string): string => {
    if (typeof value === 'string') return value;
    return value.en || value.ar || value.fr || '';
  };

  const renderTable = (items: ServiceItem[], section: 'services' | 'clients' | 'goals', title: string) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>{title}</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => openDialog(section)} sx={{ backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}>Add New</Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Order</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow><TableCell colSpan={4} align="center">No items found. Click "Add New" to create one.</TableCell></TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item._id} hover>
                    <TableCell>{getDisplayText(item.title)}</TableCell>
                    <TableCell>{item.order}</TableCell>
                    <TableCell><Switch checked={item.isActive} size="small" disabled /></TableCell>
                    <TableCell>
                      <Tooltip title="Edit"><IconButton size="small" onClick={() => openDialog(section, item)}><Edit /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => { setItemToDelete(item); setCurrentSection(section); setDeleteDialogOpen(true); }}><Delete /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#4B0E14', mb: 1 }}>Services Pages Management</Typography>
        <Typography variant="body1" sx={{ color: '#666' }}>Manage Our Services, Our Partners, and Our Process page content.</Typography>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>{error}</Alert>}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<Business />} label="Our Services" iconPosition="start" />
          <Tab icon={<Handshake />} label="Our Partners" iconPosition="start" />
          <Tab icon={<Timeline />} label="Our Process" iconPosition="start" />
          <Tab icon={<Settings />} label="Process Section Settings" iconPosition="start" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>{renderTable(services, 'services', 'Our Services')}</TabPanel>
      <TabPanel value={tabValue} index={1}>{renderTable(partners, 'clients', 'Our Partners')}</TabPanel>
      <TabPanel value={tabValue} index={2}>{renderTable(processes, 'goals', 'Our Process Steps')}</TabPanel>

      {/* Process Section Settings Tab */}
      <TabPanel value={tabValue} index={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>Process Section Settings</Typography>
              <Box>
                <FormControlLabel control={<Switch checked={processSectionData.isActive} onChange={(e) => setProcessSectionData({ ...processSectionData, isActive: e.target.checked })} disabled={!processSectionEditing} />} label="Active" />
                <Button variant="contained" startIcon={processSectionEditing ? <Save /> : <Edit />} onClick={() => processSectionEditing ? handleSaveProcessSection() : setProcessSectionEditing(true)} disabled={loading} sx={{ ml: 2, backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}>
                  {processSectionEditing ? 'Save Changes' : 'Edit'}
                </Button>
              </Box>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MultilingualTextField label="Section Title" value={processSectionData.title} onChange={(value) => setProcessSectionData({ ...processSectionData, title: value })} disabled={!processSectionEditing} helperText="e.g., Our Process" />
              </Grid>
              <Grid item xs={12}>
                <MultilingualTextField label="Section Subtitle" value={processSectionData.subtitle} onChange={(value) => setProcessSectionData({ ...processSectionData, subtitle: value })} disabled={!processSectionEditing} helperText="e.g., A systematic approach to delivering exceptional results" />
              </Grid>
              <Grid item xs={12}>
                <ImageUpload
                  value={processSectionData.backgroundImage}
                  onChange={(value) => setProcessSectionData({ ...processSectionData, backgroundImage: value as string })}
                  multiple={false}
                  disabled={!processSectionEditing}
                  label="Upload Background Image"
                  helperText="Full-width background image for the Process section. Recommended size: 1920x1080px"
                  showPreview={true}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#4B0E14', color: 'white' }}>
          {editingItem ? 'Edit Item' : 'Add New Item'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}><MultilingualTextField label="Title" value={formData.title} onChange={(value) => setFormData({ ...formData, title: value })} /></Grid>
            <Grid item xs={12}><MultilingualTextField label="Description" value={formData.description} onChange={(value) => setFormData({ ...formData, description: value })} multiline rows={4} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth type="number" label="Order" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} /></Grid>
            <Grid item xs={12} sm={6}><FormControlLabel control={<Switch checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />} label="Active" /></Grid>
            <Grid item xs={12}>
              <ImageUpload
                label="Upload Service Image"
                value={formData.image}
                onChange={(value) => setFormData({ ...formData, image: value as string })}
                multiple={false}
                helperText="Recommended size: 800x600px"
                showPreview={true}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={loading} sx={{ backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}>
            {editingItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete "{itemToDelete ? getDisplayText(itemToDelete.title) : ''}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={loading}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServicesPageManager;

