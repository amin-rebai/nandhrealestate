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
  FormControlLabel
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Search,
  People,
  Email,
  Phone
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

const Users: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, total, pagination } = useSelector(
    (state: RootState) => state.users
  );

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'agent' | 'admin',
    phone: '',
    isActive: true
  });

  useEffect(() => {
    const params: any = {
      page: currentPage,
      limit: 10
    };
    
    if (filterRole !== 'all') {
      params.role = filterRole;
    }

    dispatch(fetchUsers(params));
  }, [dispatch, currentPage, filterRole]);

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        phone: user.phone || '',
        isActive: user.isActive
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user',
        phone: '',
        isActive: true
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingUser(null);
    dispatch(clearError());
  };

  const handleSubmit = async () => {
    // Remove empty password for updates using destructuring
    if (editingUser && !formData.password) {
      const { password, ...userData } = formData;
      await submitUserData(userData);
    } else {
      await submitUserData(formData);
    }
  };

  const submitUserData = async (userData: any) => {

    try {
      if (editingUser) {
        await dispatch(updateUser({ id: editingUser._id, data: userData })).unwrap();
      } else {
        await dispatch(createUser(userData)).unwrap();
      }
      handleCloseDialog();
    } catch (error) {
      // Error handled by slice
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        await dispatch(deleteUser(userToDelete._id)).unwrap();
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      } catch (error) {
        // Error handled by slice
      }
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return '#4B0E14';
      case 'agent':
        return '#C5A059';
      case 'user':
        return '#2C2C2C';
      default:
        return '#757575';
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Users Management
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            Manage users, agents, and administrators
          </Typography>
        </Box>
      </Box>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search users..."
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
              label="Filter by Role"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="admin">Administrators</MenuItem>
              <MenuItem value="agent">Agents</MenuItem>
              <MenuItem value="user">Users</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Total: {total} users
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f5f0' }}>
              <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        mr: 2,
                        backgroundColor: getRoleColor(user.role),
                        fontSize: '1rem'
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {user.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        ID: {user._id.slice(-8)}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Email sx={{ fontSize: 16, color: '#666', mr: 0.5 }} />
                    <Typography variant="body2">{user.email}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Phone sx={{ fontSize: 16, color: '#666', mr: 0.5 }} />
                    <Typography variant="body2">{user.phone || 'N/A'}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.role.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: getRoleColor(user.role),
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.isActive ? 'ACTIVE' : 'INACTIVE'}
                    size="small"
                    sx={{
                      backgroundColor: user.isActive ? '#4CAF50' : '#F44336',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit User">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(user)}
                        sx={{ color: '#4B0E14' }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete User">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(user)}
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
        aria-label="add user"
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

      {/* User Dialog */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editingUser}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                required
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="agent">Agent</MenuItem>
                <MenuItem value="admin">Administrator</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="Active User"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: '#4B0E14',
              '&:hover': {
                backgroundColor: '#3a0b10'
              }
            }}
          >
            {editingUser ? 'Update' : 'Create'} User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{userToDelete?.name}"? This action cannot be undone.
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

export default Users;
