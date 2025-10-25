import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Home,
  People,
  Image,
  Article,
  AccountCircle,
  Logout,
  Settings,
  RssFeed
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../store/store';
import { logout } from '../store/slices/authSlice';
import LanguageSwitcher from './LanguageSwitcher';

const drawerWidth = 280;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleProfileMenuClose();
  };

  const menuItems = [
    {
      text: t('navigation.dashboard'),
      icon: <Dashboard />,
      path: '/dashboard'
    },
    {
      text: t('navigation.properties'),
      icon: <Home />,
      path: '/properties'
    },
    {
      text: t('navigation.users'),
      icon: <People />,
      path: '/users'
    },
    {
      text: t('media.title'),
      icon: <Image />,
      path: '/media'
    },
    {
      text: t('content.title'),
      icon: <Article />,
      path: '/content'
    },
    {
      text: t('navigation.blog'),
      icon: <RssFeed />,
      path: '/blog'
    }
  ];

  const drawer = (
    <Box>
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #4B0E14 0%, #C5A059 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 700,
            mb: 1
          }}
        >
          N&H Real Estate
        </Typography>
        <Typography
          variant="body2"
          sx={{
            opacity: 0.9,
            fontSize: '0.9rem'
          }}
        >
          Admin Panel
        </Typography>
      </Box>

      <Divider />

      {/* User Info */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: '#4B0E14',
              mr: 2,
              width: 40,
              height: 40
            }}
          >
            {user?.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user?.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={user?.role.toUpperCase()}
                size="small"
                sx={{
                  backgroundColor: user?.role === 'admin' ? '#4B0E14' : '#C5A059',
                  color: 'white',
                  fontSize: '0.7rem',
                  height: 20
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
              sx={{
                borderRadius: 2,
                mx: 1,
                backgroundColor: location.pathname === item.path ? '#4B0E14' : 'transparent',
                color: location.pathname === item.path ? 'white' : 'inherit',
                '&:hover': {
                  backgroundColor: location.pathname === item.path ? '#3a0b10' : '#f5f5f5',
                },
                transition: 'all 0.2s ease'
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'white' : '#4B0E14',
                  minWidth: 40
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: location.pathname === item.path ? 600 : 500
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: '#4B0E14',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.path === location.pathname)?.text || t('dashboard.title')}
          </Typography>

          <LanguageSwitcher />

          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="profile-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{ ml: 1 }}
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: '#f8f5f0'
        }}
      >
        <Toolbar />
        {children}
      </Box>

      {/* Profile Menu */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          {t('navigation.settings')}
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {t('navigation.logout')}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Layout;
