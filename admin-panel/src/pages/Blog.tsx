import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  TablePagination,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  Visibility,
  ThumbUp,
  Schedule,
  Public,
  Drafts,
  Archive,
  Search,
  FilterList
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { RootState, AppDispatch } from '../store/store';
import {
  fetchBlogs,
  deleteBlog,
  toggleBlogStatus,
  setFilters,
  clearError,
  BlogPost
} from '../store/slices/blogSlice';

const Blog: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { posts, total, loading, error, filters } = useSelector((state: RootState) => state.blog);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchBlogs(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (error) {
      // Handle error display
      console.error('Blog error:', error);
      setTimeout(() => {
        dispatch(clearError());
      }, 5000);
    }
  }, [error, dispatch]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, post: BlogPost) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(post);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPost(null);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    setAnchorEl(null); // Close menu but keep selectedPost
  };

  const handleDeleteConfirm = () => {
    if (selectedPost) {
      dispatch(deleteBlog(selectedPost._id));
    }
    setDeleteDialogOpen(false);
    setSelectedPost(null);
  };

  const handleStatusChange = (status: 'draft' | 'published' | 'archived') => {
    if (selectedPost) {
      dispatch(toggleBlogStatus({ id: selectedPost._id, status }));
    }
    handleMenuClose();
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    dispatch(setFilters({ page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ limit: parseInt(event.target.value, 10), page: 1 }));
  };

  const handleSearch = () => {
    dispatch(setFilters({ search: searchTerm, page: 1 }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <Public fontSize="small" />;
      case 'draft':
        return <Drafts fontSize="small" />;
      case 'archived':
        return <Archive fontSize="small" />;
      default:
        return <Schedule fontSize="small" />;
    }
  };

  const displayMultilingual = (value: any, language: 'en' | 'ar' | 'fr' = 'en'): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[language] || value.en || value.fr || '';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#4B0E14' }}>
          {t('navigation.blog')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            backgroundColor: '#4B0E14',
            '&:hover': { backgroundColor: '#3A0B10' }
          }}
          onClick={() => navigate('/blog/create')}
        >
          {t('blog.addPost')}
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    {t('blog.stats.totalPosts')}
                  </Typography>
                  <Typography variant="h4">
                    {total}
                  </Typography>
                </Box>
                <Avatar sx={{ backgroundColor: '#4B0E14', width: 56, height: 56 }}>
                  <Public />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    {t('blog.stats.published')}
                  </Typography>
                  <Typography variant="h4">
                    {posts.filter(p => p.status === 'published').length}
                  </Typography>
                </Box>
                <Avatar sx={{ backgroundColor: '#C5A059', width: 56, height: 56 }}>
                  <Visibility />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    {t('blog.stats.drafts')}
                  </Typography>
                  <Typography variant="h4">
                    {posts.filter(p => p.status === 'draft').length}
                  </Typography>
                </Box>
                <Avatar sx={{ backgroundColor: '#FF9800', width: 56, height: 56 }}>
                  <Drafts />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    {t('blog.stats.totalViews')}
                  </Typography>
                  <Typography variant="h4">
                    {posts.reduce((sum, post) => sum + post.views, 0)}
                  </Typography>
                </Box>
                <Avatar sx={{ backgroundColor: '#2196F3', width: 56, height: 56 }}>
                  <ThumbUp />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder={t('blog.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            size="small"
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
          <Button
            variant="outlined"
            onClick={handleSearch}
            startIcon={<Search />}
          >
            {t('common.search')}
          </Button>
          <Button
            variant="outlined"
            onClick={() => setFilterDialogOpen(true)}
            startIcon={<FilterList />}
          >
            {t('common.filters')}
          </Button>
        </Box>
      </Paper>

      {/* Blog Posts Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('blog.title')}</TableCell>
              <TableCell>{t('blog.author')}</TableCell>
              <TableCell>{t('blog.category')}</TableCell>
              <TableCell>{t('blog.status')}</TableCell>
              <TableCell>{t('blog.publishedAt')}</TableCell>
              <TableCell align="center">{t('blog.views')}</TableCell>
              <TableCell align="center">{t('blog.likes')}</TableCell>
              <TableCell align="center">{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography>{t('common.loading')}...</Typography>
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="textSecondary">
                    {t('blog.noPosts')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post._id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {displayMultilingual(post.title)}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {displayMultilingual(post.excerpt).substring(0, 100)}...
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {post.author.avatar && (
                        <Avatar src={post.author.avatar} sx={{ width: 24, height: 24 }} />
                      )}
                      <Typography variant="body2">{post.author.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {displayMultilingual(post.category)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(post.status)}
                      label={t(`blog.status.${post.status}`)}
                      color={getStatusColor(post.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString()
                        : '-'
                      }
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">{post.views}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">{post.likes}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={t('common.actions')}>
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, post)}
                        size="small"
                      >
                        <MoreVert />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={total}
        rowsPerPage={filters.limit}
        page={filters.page - 1}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => navigate(`/blog/edit/${selectedPost?._id}`)}>
          <Edit sx={{ mr: 1 }} />
          {t('common.edit')}
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('published')}>
          <Public sx={{ mr: 1 }} />
          {t('blog.publish')}
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('draft')}>
          <Drafts sx={{ mr: 1 }} />
          {t('blog.makeDraft')}
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('archived')}>
          <Archive sx={{ mr: 1 }} />
          {t('blog.archive')}
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          {t('common.delete')}
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('blog.deleteConfirmTitle')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('blog.deleteConfirmMessage', { title: displayMultilingual(selectedPost?.title) })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Blog;
