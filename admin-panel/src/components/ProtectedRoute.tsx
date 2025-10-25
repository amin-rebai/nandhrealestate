import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { RootState, AppDispatch } from '../store/store';
import { getCurrentUser } from '../store/slices/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token && !isAuthenticated && !loading) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated, loading]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f8f5f0'
        }}
      >
        <CircularProgress
          size={60}
          sx={{
            color: '#4B0E14',
            mb: 2
          }}
        />
        <Typography
          variant="h6"
          sx={{
            color: '#4B0E14',
            fontWeight: 600,
            mb: 1
          }}
        >
          N&H Real Estate
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#666'
          }}
        >
          Loading admin panel...
        </Typography>
      </Box>
    );
  }

  // Check if user is authenticated and has proper role
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin or agent role
  if (user && !['admin', 'agent'].includes(user.role)) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f8f5f0',
          textAlign: 'center',
          p: 3
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: '#4B0E14',
            fontWeight: 700,
            mb: 2
          }}
        >
          Access Denied
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#666',
            mb: 3
          }}
        >
          You don't have permission to access the admin panel.
          <br />
          Administrator or Agent role is required.
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#999'
          }}
        >
          Current role: {user.role}
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
