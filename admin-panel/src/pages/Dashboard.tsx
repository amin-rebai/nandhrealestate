import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Home,
  People,
  TrendingUp,
  Visibility,
  AttachMoney,
  LocationOn
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../store/store';
import { fetchProperties } from '../store/slices/propertySlice';
import { fetchUsers } from '../store/slices/userSlice';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();

  // Helper function to display multilingual content
  const displayMultilingual = (value: string | { en: string; ar: string; fr?: string } | undefined): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    const lang = i18n.language === 'ar' ? 'ar' : i18n.language === 'fr' ? 'fr' : 'en';
    return value[lang] || value.en || value.fr || '';
  };
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { properties, total: totalProperties, loading: propertiesLoading } = useSelector(
    (state: RootState) => state.properties
  );
  const { users, total: totalUsers, loading: usersLoading } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    dispatch(fetchProperties({ limit: 5 }));
    dispatch(fetchUsers({ limit: 5 }));
  }, [dispatch]);

  const stats = [
    {
      title: t('dashboard.stats.totalProperties'),
      value: totalProperties,
      icon: <Home sx={{ fontSize: 40, color: '#4B0E14' }} />,
      color: '#4B0E14',
      bgColor: '#f8f5f0'
    },
    {
      title: t('dashboard.stats.totalUsers'),
      value: totalUsers,
      icon: <People sx={{ fontSize: 40, color: '#C5A059' }} />,
      color: '#C5A059',
      bgColor: '#faf9f5'
    },
    {
      title: t('dashboard.stats.propertiesForSale'),
      value: properties.filter(p => p.type === 'sale').length,
      icon: <AttachMoney sx={{ fontSize: 40, color: '#2C2C2C' }} />,
      color: '#2C2C2C',
      bgColor: '#f5f5f5'
    },
    {
      title: t('dashboard.stats.propertiesForRent'),
      value: properties.filter(p => p.type === 'rent').length,
      icon: <LocationOn sx={{ fontSize: 40, color: '#4B0E14' }} />,
      color: '#4B0E14',
      bgColor: '#f8f5f0'
    }
  ];

  const recentProperties = properties.slice(0, 5);
  const recentUsers = users.slice(0, 5);



  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Welcome Section */}
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
          Welcome back, {user?.name}!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#666',
            fontSize: '1.1rem'
          }}
        >
          Here's what's happening with your real estate platform today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                background: stat.bgColor,
                border: `1px solid ${stat.color}20`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 25px ${stat.color}20`
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {stat.icon}
                </Box>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    color: stat.color,
                    mb: 1
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    fontWeight: 500
                  }}
                >
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Properties */}
        <Grid item xs={12} lg={8}>
          <Paper
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f5f0 100%)',
              border: '1px solid #e0e0e0'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Home sx={{ color: '#4B0E14', mr: 1 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#4B0E14'
                }}
              >
                Recent Properties
              </Typography>
            </Box>

            {propertiesLoading ? (
              <LinearProgress sx={{ mb: 2 }} />
            ) : (
              <Box>
                {recentProperties.length === 0 ? (
                  <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', py: 4 }}>
                    No properties found. Start by adding your first property!
                  </Typography>
                ) : (
                  recentProperties.map((property) => (
                    <Box
                      key={property._id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        py: 2,
                        borderBottom: '1px solid #e0e0e0',
                        '&:last-child': {
                          borderBottom: 'none'
                        }
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            color: '#4B0E14',
                            mb: 0.5
                          }}
                        >
                          {displayMultilingual(property.title)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: '#666', mb: 1 }}
                        >
                          {displayMultilingual(property.location)}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            label={property.type.toUpperCase()}
                            size="small"
                            sx={{
                              backgroundColor: property.type === 'sale' ? '#4B0E14' : property.type === 'rent' ? '#C5A059' : '#2C2C2C',
                              color: 'white',
                              fontSize: '0.75rem'
                            }}
                          />
                          <Chip
                            label={property.status.toUpperCase()}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: '#C5A059'
                          }}
                        >
                          ${property.price.toLocaleString()}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: '#666' }}
                        >
                          {property.bedrooms} bed • {property.bathrooms} bath
                        </Typography>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recent Users */}
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #faf9f5 100%)',
              border: '1px solid #e0e0e0'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <People sx={{ color: '#C5A059', mr: 1 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#4B0E14'
                }}
              >
                Recent Users
              </Typography>
            </Box>

            {usersLoading ? (
              <LinearProgress sx={{ mb: 2 }} />
            ) : (
              <Box>
                {recentUsers.length === 0 ? (
                  <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', py: 4 }}>
                    No users found.
                  </Typography>
                ) : (
                  recentUsers.map((user) => (
                    <Box
                      key={user._id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        py: 2,
                        borderBottom: '1px solid #e0e0e0',
                        '&:last-child': {
                          borderBottom: 'none'
                        }
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: user.role === 'admin' ? '#4B0E14' : user.role === 'agent' ? '#C5A059' : '#2C2C2C',
                          mr: 2
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            color: '#4B0E14'
                          }}
                        >
                          {user.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: '#666' }}
                        >
                          {user.email}
                        </Typography>
                      </Box>
                      <Chip
                        label={user.role.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: user.role === 'admin' ? '#4B0E14' : user.role === 'agent' ? '#C5A059' : '#2C2C2C',
                          color: 'white',
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                  ))
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
