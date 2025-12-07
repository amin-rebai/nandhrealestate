// Centralized API configuration
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Base URL without /api suffix (for static files like uploads)
export const BASE_URL = API_URL.replace('/api', '');

// Helper to get full URL for uploaded files
export const getUploadUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

