import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Save,
  Cancel,
  ExpandMore,
  Search
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { RootState, AppDispatch } from '../store/store';
import {
  createBlog,
  updateBlog,
  fetchBlogById,
  clearCurrentPost,
  BlogPost
} from '../store/slices/blogSlice';
import MultilingualTextField from '../components/MultilingualTextField';
import RichTextEditor from '../components/RichTextEditor';
import ImageUpload from '../components/ImageUpload';
import ImageGallery from '../components/ImageGallery';

const BlogForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentPost, loading, error } = useSelector((state: RootState) => state.blog);

  const isEdit = Boolean(id);

  // Form state
  const [formData, setFormData] = useState({
    title: { en: '', ar: '', fr: '' },
    slug: { en: '', ar: '', fr: '' },
    excerpt: { en: '', ar: '', fr: '' },
    content: { en: '', ar: '', fr: '' },
    featuredImage: '',
    category: { en: '', ar: '', fr: '' },
    tags: [] as Array<{ en: string; ar: string; fr: string }>,
    author: {
      name: '',
      avatar: '',
      bio: { en: '', ar: '', fr: '' }
    },
    status: 'draft' as 'draft' | 'published' | 'archived',
    isFeatured: false,
    isActive: true,
    seo: {
      metaTitle: { en: '', ar: '', fr: '' },
      metaDescription: { en: '', ar: '', fr: '' },
      keywords: { en: '', ar: '', fr: '' },
      canonicalUrl: '',
      ogTitle: { en: '', ar: '', fr: '' },
      ogDescription: { en: '', ar: '', fr: '' },
      ogImage: '',
      tiktokTitle: { en: '', ar: '', fr: '' },
      tiktokDescription: { en: '', ar: '', fr: '' },
      tiktokImage: ''
    }
  });

  const [tagInput, setTagInput] = useState({ en: '', ar: '', fr: '' });

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchBlogById(id));
    }
    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (currentPost && isEdit) {
      const resolve = (val: any) => ({ en: val?.en ?? '', ar: val?.ar ?? '', fr: val?.fr ?? '' });
      setFormData({
        title: resolve(currentPost.title),
        slug: resolve(currentPost.slug),
        excerpt: resolve(currentPost.excerpt),
        content: resolve(currentPost.content),
        featuredImage: currentPost.featuredImage || '',
        category: resolve(currentPost.category),
        tags: Array.isArray(currentPost.tags) ? currentPost.tags.map((t: any) => resolve(t)) : [],
        author: {
          name: currentPost.author?.name || '',
          avatar: currentPost.author?.avatar || '',
          bio: resolve(currentPost.author?.bio)
        },
        status: currentPost.status || 'draft',
        isFeatured: !!currentPost.isFeatured,
        isActive: currentPost.isActive ?? true,
        seo: {
          metaTitle: resolve(currentPost.seo?.metaTitle),
          metaDescription: resolve(currentPost.seo?.metaDescription),
          keywords: resolve(currentPost.seo?.keywords),
          canonicalUrl: currentPost.seo?.canonicalUrl || '',
          ogTitle: resolve(currentPost.seo?.ogTitle),
          ogDescription: resolve(currentPost.seo?.ogDescription),
          ogImage: currentPost.seo?.ogImage || '',
          tiktokTitle: resolve(currentPost.seo?.tiktokTitle),
          tiktokDescription: resolve(currentPost.seo?.tiktokDescription),
          tiktokImage: currentPost.seo?.tiktokImage || ''
        }
      });
    }
  }, [currentPost, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEdit && id) {
        await dispatch(updateBlog({ id, data: formData })).unwrap();
      } else {
        await dispatch(createBlog(formData)).unwrap();
      }
      navigate('/blog');
    } catch (error) {
      console.error('Error saving blog post:', error);
    }
  };

  const handleCancel = () => {
    navigate('/blog');
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };
  const handleTitleChange = (value: { en: string; ar: string; fr: string }) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: {
        en: generateSlug(value.en),
        ar: generateSlug(value.ar),
        fr: generateSlug(value.fr)
      }
    }));
  };
  const addTag = () => {
    if (tagInput.en.trim() && tagInput.ar.trim() && tagInput.fr.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, { en: tagInput.en.trim(), ar: tagInput.ar.trim(), fr: tagInput.fr.trim() }]
      }));
      setTagInput({ en: '', ar: '', fr: '' });
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#4B0E14' }}>
          {isEdit ? t('blog.editPost') : t('blog.createPost')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Cancel />}
            onClick={handleCancel}
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              backgroundColor: '#4B0E14',
              '&:hover': { backgroundColor: '#3A0B10' }
            }}
          >
            {loading ? t('common.saving') : t('common.save')}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {t('blog.postContent')}
              </Typography>

              <MultilingualTextField
                label={t('blog.postTitle')}
                value={formData.title}
                onChange={handleTitleChange}
                required
                sx={{ mb: 3 }}
              />

              <MultilingualTextField
                label="Slug"
                value={formData.slug}
                onChange={(value) => setFormData(prev => ({ ...prev, slug: value }))}
                helperText="URL-friendly version of the title"
                sx={{ mb: 3 }}
              />

              <MultilingualTextField
                label={t('blog.excerpt')}
                value={formData.excerpt}
                onChange={(value) => setFormData(prev => ({ ...prev, excerpt: value }))}
                multiline
                rows={3}
                sx={{ mb: 3 }}
              />

              <RichTextEditor
                label={t('blog.postContent')}
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                minRows={15}
              />
            </Paper>

            {/* SEO Settings */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Search />
                  <Typography variant="h6">{t('blog.seo.title')}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <MultilingualTextField
                      label={t('blog.seo.metaTitle')}
                      value={formData.seo.metaTitle}
                      onChange={(value) => setFormData(prev => ({
                        ...prev,
                        seo: { ...prev.seo, metaTitle: value }
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MultilingualTextField
                      label={t('blog.seo.metaDescription')}
                      value={formData.seo.metaDescription}
                      onChange={(value) => setFormData(prev => ({
                        ...prev,
                        seo: { ...prev.seo, metaDescription: value }
                      }))}
                      multiline
                      rows={3}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MultilingualTextField
                      label={t('blog.seo.keywords')}
                      value={formData.seo.keywords}
                      onChange={(value) => setFormData(prev => ({
                        ...prev,
                        seo: { ...prev.seo, keywords: value }
                      }))}
                      helperText="Separate keywords with commas"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('blog.seo.canonicalUrl')}
                      value={formData.seo.canonicalUrl}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        seo: { ...prev.seo, canonicalUrl: e.target.value }
                      }))}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {t('blog.settings')}
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('blog.status.title')}</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                >
                  <MenuItem value="draft">{t('blog.status.draft')}</MenuItem>
                  <MenuItem value="published">{t('blog.status.published')}</MenuItem>
                  <MenuItem value="archived">{t('blog.status.archived')}</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  />
                }
                label="Featured Post"
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                }
                label="Active"
                sx={{ mb: 2 }}
              />

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  {t('blog.featuredImage')}
                </Typography>
                <ImageUpload
                  value={formData.featuredImage}
                  onChange={(value) => setFormData(prev => ({ ...prev, featuredImage: value as string }))}
                  multiple={false}
                  variant="dropzone"
                  label="Upload Featured Image"
                  helperText="Recommended size: 1200x630px for optimal social media sharing"
                  showPreview={true}
                />
              </Box>

              <MultilingualTextField
                label={t('blog.category')}
                value={formData.category}
                onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                sx={{ mb: 2 }}
              />

              {/* Tags */}
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                {t('blog.tags')}
              </Typography>

              <Box sx={{ mb: 2 }}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={`${tag.en} / ${tag.ar} / ${tag.fr}`}
                    onDelete={() => removeTag(index)}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>

              <Grid container spacing={1} sx={{ mb: 2, alignItems: 'center' }}>
                <Grid item xs={4}>
                  <TextField
                    size="small"
                    placeholder="English tag"
                    value={tagInput.en}
                    onChange={(e) => setTagInput(prev => ({ ...prev, en: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    size="small"
                    placeholder="Arabic tag"
                    value={tagInput.ar}
                    onChange={(e) => setTagInput(prev => ({ ...prev, ar: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    size="small"
                    placeholder="French tag"
                    value={tagInput.fr}
                    onChange={(e) => setTagInput(prev => ({ ...prev, fr: e.target.value }))}
                    sx={{ mr: 1 }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={addTag}
                    disabled={!tagInput.en.trim() || !tagInput.ar.trim() || !tagInput.fr.trim()}
                  >
                    Add Tag
                  </Button>
                </Grid>
              </Grid>

              {/* Author */}
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                {t('blog.author')}
              </Typography>
              
              <TextField
                fullWidth
                label="Author Name"
                value={formData.author.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  author: { ...prev.author, name: e.target.value }
                }))}
                sx={{ mb: 2 }}
              />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Author Avatar
                </Typography>
                <ImageUpload
                  value={formData.author.avatar}
                  onChange={(value) => setFormData(prev => ({
                    ...prev,
                    author: { ...prev.author, avatar: value as string }
                  }))}
                  multiple={false}
                  label="Upload Avatar"
                  helperText="Recommended size: 200x200px"
                  showPreview={true}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default BlogForm;
