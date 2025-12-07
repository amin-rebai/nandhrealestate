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
  Switch,
  FormControlLabel,
  Alert
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Search,
  Phone,
  Email,
  Save,
  Close,
  CloudUpload,
  LocationOn
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../store/store';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  clearError,
  User
} from '../store/slices/userSlice';
import { API_URL, BASE_URL } from '../utils/api';

const Agents: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, total, pagination } = useSelector(
    (state: RootState) => state.users
  );

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    title: 'Real Estate Consultant',
    location: 'Doha, Qatar',
    avatar: '',
    isActive: true
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Filter to only show agents
  const agents = users.filter((user) => user.role === 'agent');

  useEffect(() => {
    const params: any = {
      page: currentPage,
      limit: 10,
      role: 'agent' // Filter for agents only
    };

    dispatch(fetchUsers(params));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        phone: user.phone || '',
        title: (user as any).title || 'Real Estate Consultant',
        location: (user as any).location || 'Doha, Qatar',
        avatar: (user as any).avatar || '',
        isActive: user.isActive
      });
      setAvatarPreview((user as any).avatar || null);
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        title: 'Real Estate Consultant',
        location: 'Doha, Qatar',
        avatar: '',
        isActive: true
      });
      setAvatarPreview(null);
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingUser(null);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formDataUpload,
      });
      const data = await response.json();
      if (data.url) {
        setFormData({ ...formData, avatar: data.url });
        setAvatarPreview(data.url);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  const handleSaveAgent = async () => {
    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingUser) {
        await dispatch(
          updateUser({
            id: editingUser._id,
            data: {
              name: formData.name,
              email: formData.email,
              ...(formData.password && { password: formData.password }),
              phone: formData.phone,
              title: formData.title,
              location: formData.location,
              avatar: formData.avatar,
              isActive: formData.isActive
            }
          })
        ).unwrap();
      } else {
        if (!formData.password) {
          alert('Password is required for new agents');
          return;
        }
        await dispatch(
          createUser({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            title: formData.title,
            location: formData.location,
            avatar: formData.avatar,
            role: 'agent',
            isActive: formData.isActive
          })
        ).unwrap();
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving agent:', error);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await dispatch(deleteUser(userToDelete._id)).unwrap();
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      } catch (error) {
        console.error('Error deleting agent:', error);
      }
    }
  };

  const filteredAgents = agents.filter((agent) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      agent.name.toLowerCase().includes(searchLower) ||
      agent.email.toLowerCase().includes(searchLower) ||
      (agent.phone && agent.phone.includes(searchTerm))
    );
  });

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
          Agent Management
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#666',
            fontSize: '1.1rem'
          }}
        >
          Manage real estate agents and their information.
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      {/* Search and Add Button */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search agents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#4B0E14' }} />
              </InputAdornment>
            )
          }}
          sx={{ flex: 1, maxWidth: '400px' }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: '#4B0E14',
            '&:hover': { backgroundColor: '#3a0b10' }
          }}
        >
          Add Agent
        </Button>
      </Box>

      {/* Agents Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 700, color: '#4B0E14' }}>Agent</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#4B0E14' }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#4B0E14' }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#4B0E14' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#4B0E14' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    Loading agents...
                  </TableCell>
                </TableRow>
              ) : filteredAgents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    {searchTerm ? 'No agents found matching your search.' : 'No agents available.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAgents.map((agent) => (
                  <TableRow
                    key={agent._id}
                    sx={{
                      '&:hover': { backgroundColor: '#f9f9f9' },
                      borderBottom: '1px solid #e0e0e0'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={(agent as any).avatar ? ((agent as any).avatar.startsWith('http') ? (agent as any).avatar : `${BASE_URL}${(agent as any).avatar}`) : undefined}
                          sx={{
                            backgroundColor: '#4B0E14',
                            width: 50,
                            height: 50,
                            fontSize: '1rem'
                          }}
                        >
                          {agent.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>{agent.name}</Typography>
                          <Typography sx={{ fontSize: '0.85rem', color: '#C5A059' }}>
                            {(agent as any).title || 'Real Estate Consultant'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#666' }}>
                          <Email sx={{ fontSize: 16 }} />
                          <Typography variant="body2">{agent.email}</Typography>
                        </Box>
                        {agent.phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#666' }}>
                            <Phone sx={{ fontSize: 16 }} />
                            <Typography variant="body2">{agent.phone}</Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#666' }}>
                        <LocationOn sx={{ fontSize: 16 }} />
                        <Typography variant="body2">{(agent as any).location || 'Doha, Qatar'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={agent.isActive ? 'Active' : 'Inactive'}
                        color={agent.isActive ? 'success' : 'default'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(agent)}
                            sx={{ color: '#4B0E14' }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(agent)}
                            sx={{ color: '#d32f2f' }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Pagination */}
      {filteredAgents.length > 0 && pagination.pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={pagination.pages}
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

      {/* Add/Edit Agent Dialog */}
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#4B0E14' }}>
          {editingUser ? 'Edit Agent' : 'Add New Agent'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            {/* Avatar Upload */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 1 }}>
                <Avatar
                  src={avatarPreview ? (avatarPreview.startsWith('http') ? avatarPreview : `${BASE_URL}${avatarPreview}`) : undefined}
                  sx={{ width: 100, height: 100, backgroundColor: '#4B0E14' }}
                >
                  {formData.name ? formData.name.charAt(0).toUpperCase() : 'A'}
                </Avatar>
                <Box>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    sx={{ borderColor: '#4B0E14', color: '#4B0E14' }}
                  >
                    Upload Photo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleAvatarUpload}
                    />
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 1, color: '#666' }}>
                    Recommended: Square image, at least 400x400px
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Agent's full name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Real Estate Consultant"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Doha, Qatar"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="agent@example.com"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={editingUser ? 'Leave blank to keep current password' : 'Enter password'}
                helperText={editingUser ? 'Leave blank to keep current password' : 'Required'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+974 7070 4504"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{editingUser ? 'Cancel' : 'Close'}</Button>
          <Button
            onClick={handleSaveAgent}
            variant="contained"
            startIcon={<Save />}
            sx={{
              backgroundColor: '#4B0E14',
              '&:hover': { backgroundColor: '#3a0b10' }
            }}
          >
            {editingUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#d32f2f' }}>
          Delete Agent
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to delete <strong>{userToDelete?.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              backgroundColor: '#d32f2f',
              '&:hover': { backgroundColor: '#b71c1c' }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Agents;
