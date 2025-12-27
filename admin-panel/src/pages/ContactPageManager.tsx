import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Tabs, Tab, Card, CardContent, Grid, TextField,
  Button, Switch, FormControlLabel, Alert, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Tooltip, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Save, Edit, Delete, Phone, Share, Email, Visibility, MarkEmailRead, LocationOn, Image as ImageIcon } from '@mui/icons-material';
import { RootState, AppDispatch } from '../store/store';
import { fetchContentBySection, createContent, updateContent, clearError } from '../store/slices/contentSlice';
import MultilingualTextField from '../components/MultilingualTextField';
import ImageUpload from '../components/ImageUpload';
import { ensureMultilingual } from '../utils/multilingualUtils';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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

interface ContactRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

const ContactPageManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { content: contentList, error, loading } = useSelector((state: RootState) => state.content);
  const [tabValue, setTabValue] = useState(0);

  // Contact Info State
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    address: { en: '', ar: '', fr: '' },
    businessHours: { en: '', ar: '', fr: '' },
    mapUrl: '',
    backgroundImage: '',
    isActive: true
  });
  const [contactEditing, setContactEditing] = useState(false);

  // Social Media State
  const [socialMedia, setSocialMedia] = useState({
    facebook: '',
    instagram: '',
    tiktok: '',
    linkedin: '',
    youtube: '',
    whatsapp: '',
    isActive: true
  });
  const [socialEditing, setSocialEditing] = useState(false);

  // Contact Requests State
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<ContactRequest | null>(null);

  useEffect(() => {
    dispatch(fetchContentBySection('contact'));
    fetchContactRequests();
  }, [dispatch]);

  useEffect(() => {
    if (contentList && Array.isArray(contentList)) {
      const contactItem = contentList.find((it: any) => it.section === 'contact');
      if (contactItem) {
        setContactInfo({
          phone: contactItem.metadata?.phone || '',
          email: contactItem.metadata?.email || '',
          address: ensureMultilingual(contactItem.metadata?.address),
          businessHours: ensureMultilingual(contactItem.metadata?.businessHours),
          mapUrl: contactItem.metadata?.mapUrl || '',
          backgroundImage: contactItem.metadata?.backgroundImage || '',
          isActive: contactItem.isActive
        });
        setSocialMedia({
          facebook: contactItem.metadata?.social?.facebook || '',
          instagram: contactItem.metadata?.social?.instagram || '',
          tiktok: contactItem.metadata?.social?.tiktok || '',
          linkedin: contactItem.metadata?.social?.linkedin || '',
          youtube: contactItem.metadata?.social?.youtube || '',
          whatsapp: contactItem.metadata?.social?.whatsapp || '',
          isActive: true
        });
      }
    }
  }, [contentList]);

  const fetchContactRequests = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/contact-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) setContactRequests(response.data);
    } catch (error) { console.error('Error fetching contact requests:', error); }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveContactInfo = async () => {
    try {
      const contactItem = contentList?.find((it: any) => it.section === 'contact');
      const payload = {
        section: 'contact' as const,
        title: { en: 'Contact Us', ar: 'اتصل بنا', fr: 'Contactez-nous' },
        metadata: {
          phone: contactInfo.phone,
          email: contactInfo.email,
          address: contactInfo.address,
          businessHours: contactInfo.businessHours,
          mapUrl: contactInfo.mapUrl,
          backgroundImage: contactInfo.backgroundImage,
          social: socialMedia
        },
        isActive: contactInfo.isActive
      };
      if (contactItem) {
        await dispatch(updateContent({ id: contactItem._id, data: payload })).unwrap();
      } else {
        await dispatch(createContent(payload)).unwrap();
      }
      setContactEditing(false);
    } catch (error) { console.error('Error saving contact info:', error); }
  };

  const handleSaveSocialMedia = async () => {
    try {
      const contactItem = contentList?.find((it: any) => it.section === 'contact');
      if (contactItem) {
        const payload = { ...contactItem, metadata: { ...contactItem.metadata, social: socialMedia } };
        await dispatch(updateContent({ id: contactItem._id, data: payload })).unwrap();
      }
      setSocialEditing(false);
    } catch (error) { console.error('Error saving social media:', error); }
  };

  // Continue in next section
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#4B0E14', mb: 1 }}>Contact Page Management</Typography>
        <Typography variant="body1" sx={{ color: '#666' }}>Manage contact information, social media links, and contact form requests.</Typography>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>{error}</Alert>}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<Phone />} label="Contact Info" iconPosition="start" />
          <Tab icon={<Share />} label="Social Media" iconPosition="start" />
          <Tab icon={<Email />} label="Contact Requests" iconPosition="start" />
        </Tabs>
      </Paper>
      {/* Contact Info Tab */}
      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>Contact Information</Typography>
              <Box>
                <FormControlLabel control={<Switch checked={contactInfo.isActive} onChange={(e) => setContactInfo({ ...contactInfo, isActive: e.target.checked })} disabled={!contactEditing} />} label="Active" />
                <Button variant="contained" startIcon={contactEditing ? <Save /> : <Edit />} onClick={() => contactEditing ? handleSaveContactInfo() : setContactEditing(true)} disabled={loading} sx={{ ml: 2, backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}>
                  {contactEditing ? 'Save Changes' : 'Edit'}
                </Button>
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Phone Number" value={contactInfo.phone} onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })} disabled={!contactEditing} InputProps={{ startAdornment: <Phone sx={{ mr: 1, color: '#666' }} /> }} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Email Address" value={contactInfo.email} onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })} disabled={!contactEditing} InputProps={{ startAdornment: <Email sx={{ mr: 1, color: '#666' }} /> }} /></Grid>
              <Grid item xs={12}><MultilingualTextField label="Address" value={contactInfo.address} onChange={(value) => setContactInfo({ ...contactInfo, address: value })} disabled={!contactEditing} multiline rows={2} /></Grid>
              <Grid item xs={12}><MultilingualTextField label="Business Hours" value={contactInfo.businessHours} onChange={(value) => setContactInfo({ ...contactInfo, businessHours: value })} disabled={!contactEditing} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Google Maps Embed URL" value={contactInfo.mapUrl} onChange={(e) => setContactInfo({ ...contactInfo, mapUrl: e.target.value })} disabled={!contactEditing} InputProps={{ startAdornment: <LocationOn sx={{ mr: 1, color: '#666' }} /> }} /></Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ImageIcon sx={{ color: '#666' }} /> Hero Background Image
                </Typography>
                <ImageUpload
                  value={contactInfo.backgroundImage}
                  onChange={(value) => setContactInfo({ ...contactInfo, backgroundImage: value as string })}
                  multiple={false}
                  disabled={!contactEditing}
                  label="Upload Background Image"
                  helperText="Recommended size: 1920x600px for hero section"
                  showPreview={true}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Social Media Tab */}
      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>Social Media Links</Typography>
              <Button variant="contained" startIcon={socialEditing ? <Save /> : <Edit />} onClick={() => socialEditing ? handleSaveSocialMedia() : setSocialEditing(true)} disabled={loading} sx={{ backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}>
                {socialEditing ? 'Save Changes' : 'Edit'}
              </Button>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Facebook URL" value={socialMedia.facebook} onChange={(e) => setSocialMedia({ ...socialMedia, facebook: e.target.value })} disabled={!socialEditing} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Instagram URL" value={socialMedia.instagram} onChange={(e) => setSocialMedia({ ...socialMedia, instagram: e.target.value })} disabled={!socialEditing} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Twitter/X URL" value={socialMedia.tiktok} onChange={(e) => setSocialMedia({ ...socialMedia, tiktok: e.target.value })} disabled={!socialEditing} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="LinkedIn URL" value={socialMedia.linkedin} onChange={(e) => setSocialMedia({ ...socialMedia, linkedin: e.target.value })} disabled={!socialEditing} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="YouTube URL" value={socialMedia.youtube} onChange={(e) => setSocialMedia({ ...socialMedia, youtube: e.target.value })} disabled={!socialEditing} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="WhatsApp Number" value={socialMedia.whatsapp} onChange={(e) => setSocialMedia({ ...socialMedia, whatsapp: e.target.value })} disabled={!socialEditing} placeholder="+1234567890" /></Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Contact Requests Tab */}
      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#4B0E14' }}>Contact Form Requests</Typography>
              <Button variant="outlined" onClick={fetchContactRequests}>Refresh</Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Subject</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contactRequests.length === 0 ? (
                    <TableRow><TableCell colSpan={6} align="center">No contact requests found.</TableCell></TableRow>
                  ) : (
                    contactRequests.map((request) => (
                      <TableRow key={request._id} hover>
                        <TableCell>{request.name}</TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell>{request.subject}</TableCell>
                        <TableCell>
                          <Chip label={request.status} size="small" color={request.status === 'new' ? 'error' : request.status === 'read' ? 'warning' : 'success'} />
                        </TableCell>
                        <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Tooltip title="View"><IconButton size="small" onClick={() => { setSelectedRequest(request); setViewDialogOpen(true); }}><Visibility /></IconButton></Tooltip>
                          <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => { setRequestToDelete(request); setDeleteDialogOpen(true); }}><Delete /></IconButton></Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>

      {/* View Request Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#4B0E14', color: 'white' }}>Contact Request Details</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedRequest && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}><Typography variant="subtitle2" color="textSecondary">Name</Typography><Typography>{selectedRequest.name}</Typography></Grid>
              <Grid item xs={6}><Typography variant="subtitle2" color="textSecondary">Email</Typography><Typography>{selectedRequest.email}</Typography></Grid>
              <Grid item xs={6}><Typography variant="subtitle2" color="textSecondary">Phone</Typography><Typography>{selectedRequest.phone || 'N/A'}</Typography></Grid>
              <Grid item xs={6}><Typography variant="subtitle2" color="textSecondary">Date</Typography><Typography>{new Date(selectedRequest.createdAt).toLocaleString()}</Typography></Grid>
              <Grid item xs={12}><Typography variant="subtitle2" color="textSecondary">Subject</Typography><Typography>{selectedRequest.subject}</Typography></Grid>
              <Grid item xs={12}><Typography variant="subtitle2" color="textSecondary">Message</Typography><Typography sx={{ whiteSpace: 'pre-wrap' }}>{selectedRequest.message}</Typography></Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<MarkEmailRead />} sx={{ backgroundColor: '#4B0E14', '&:hover': { backgroundColor: '#3a0b10' } }}>Mark as Read</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete this contact request from "{requestToDelete?.name}"?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContactPageManager;

