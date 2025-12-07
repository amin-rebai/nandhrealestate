import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  MenuItem,
  Chip,
  Paper,
  InputAdornment,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Mail as MailIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../store/store';
import { fetchAgents } from '../store/slices/userSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Agents: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { agents, loading } = useSelector((state: RootState) => state.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAgents, setFilteredAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    dispatch(fetchAgents());
  }, [dispatch]);

  useEffect(() => {
    if (agents && agents.length > 0) {
      const filtered = agents.filter((agent) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          agent.name.toLowerCase().includes(searchLower) ||
          agent.email.toLowerCase().includes(searchLower)
        );
      });
      setFilteredAgents(filtered);
      setCurrentPage(1);
    }
  }, [agents, searchTerm]);

  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);

  const handleContactOpen = (agent: any) => {
    setSelectedAgent(agent);
    setContactForm({ name: '', email: '', phone: '', message: '' });
    setContactDialogOpen(true);
  };

  const handleContactClose = () => {
    setContactDialogOpen(false);
    setSelectedAgent(null);
  };

  const handleSendMessage = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // TODO: Send message via API
      console.log('Sending message:', { ...contactForm, agentId: selectedAgent._id });
      alert('Message sent successfully!');
      handleContactClose();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 8, flexGrow: 1 }}>
        {/* Page Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              color: '#4B0E14',
              mb: 2
            }}
          >
            {t('agents.title', 'Our Agents')}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              fontSize: '1.1rem',
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            {t('agents.description', 'Meet our professional team of real estate agents ready to help you find your perfect property.')}
          </Typography>
        </Box>

        {/* Search Box */}
        <Paper sx={{ mb: 4, p: 2 }}>
          <TextField
            fullWidth
            placeholder={t('common.search', 'Search agents by name or email')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#4B0E14' }} />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f9f9f9'
              }
            }}
          />
        </Paper>

        {/* Agents Grid */}
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="textSecondary">Loading agents...</Typography>
          </Box>
        ) : paginatedAgents.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="textSecondary">
              {searchTerm
                ? t('agents.noResults', 'No agents found matching your search.')
                : t('agents.noAgents', 'No agents available.')}
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {paginatedAgents.map((agent: any) => (
                <Grid item xs={12} sm={6} md={4} key={agent._id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 30px rgba(75, 14, 20, 0.15)'
                      }
                    }}
                  >
                    {/* Agent Photo - Large */}
                    <Box
                      sx={{
                        position: 'relative',
                        height: 320,
                        backgroundColor: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}
                    >
                      {agent.avatar ? (
                        <Box
                          component="img"
                          src={agent.avatar.startsWith('http') ? agent.avatar : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${agent.avatar}`}
                          alt={agent.name}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'top center'
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%)'
                          }}
                        >
                          <PersonIcon sx={{ fontSize: 100, color: '#ccc' }} />
                        </Box>
                      )}
                    </Box>

                    <CardContent sx={{ p: 3 }}>
                      {/* Agent Name with Verified Badge */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <VerifiedIcon sx={{ fontSize: 20, color: '#1da1f2' }} />
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{
                            fontWeight: 700,
                            color: '#1a1a1a',
                            fontSize: '1.1rem'
                          }}
                        >
                          {agent.name}
                        </Typography>
                        {/* Rating */}
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                          <StarIcon sx={{ fontSize: 18, color: '#1a1a1a' }} />
                          <Typography sx={{ fontWeight: 600, color: '#1a1a1a', ml: 0.5, fontSize: '0.95rem' }}>
                            5.0
                          </Typography>
                          <Typography sx={{ color: '#888', fontSize: '0.85rem', ml: 0.3 }}>/5</Typography>
                        </Box>
                      </Box>

                      {/* Title */}
                      <Typography
                        sx={{
                          color: '#C5A059',
                          fontSize: '0.9rem',
                          mb: 1
                        }}
                      >
                        {agent.title || 'Real Estate Consultant'}
                      </Typography>

                      {/* Location */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#666', mb: 2 }}>
                        <LocationIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                          {agent.location || 'Doha, Qatar'}
                        </Typography>
                      </Box>
                    </CardContent>

                    {/* Action Button */}
                    <Box sx={{ p: 3, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{
                          borderColor: '#1a1a1a',
                          color: '#1a1a1a',
                          borderRadius: '8px',
                          py: 1.2,
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '0.95rem',
                          '&:hover': {
                            backgroundColor: '#1a1a1a',
                            color: 'white',
                            borderColor: '#1a1a1a'
                          }
                        }}
                        onClick={() => handleContactOpen(agent)}
                      >
                        Start working with {agent.name.split(' ')[0]}
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#4B0E14',
                      '&.Mui-selected': {
                        backgroundColor: '#4B0E14',
                        color: 'white'
                      }
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>

      {/* Contact Dialog */}
      <Dialog
        open={contactDialogOpen}
        onClose={handleContactClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#4B0E14', fontWeight: 700 }}>
          {t('contact.sendMessage', 'Send Message to')} {selectedAgent?.name}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label={t('common.name', 'Name')}
            value={contactForm.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContactForm({ ...contactForm, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t('common.email', 'Email')}
            type="email"
            value={contactForm.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContactForm({ ...contactForm, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t('common.phone', 'Phone (Optional)')}
            value={contactForm.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContactForm({ ...contactForm, phone: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t('common.message', 'Message')}
            multiline
            rows={4}
            value={contactForm.message}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setContactForm({ ...contactForm, message: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleContactClose}>{t('common.cancel', 'Cancel')}</Button>
          <Button
            onClick={handleSendMessage}
            variant="contained"
            sx={{
              backgroundColor: '#4B0E14',
              '&:hover': { backgroundColor: '#3a0b10' }
            }}
          >
            {t('common.send', 'Send')}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default Agents;
