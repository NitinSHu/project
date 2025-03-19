import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance for auth requests
const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include token in requests
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Register a new user
export const register = async (userData) => {
  try {
    const response = await authApi.post('/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Registration failed' };
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await authApi.post('/login', credentials);
    const { access_token, refresh_token, user } = response.data;
    
    // Store tokens and user data
    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('refreshToken', refresh_token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { user };
  } catch (error) {
    throw error.response?.data || { error: 'Login failed' };
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// Get current authenticated user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  return JSON.parse(userStr);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('accessToken') !== null;
};

// Check if user is admin
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};

// Refresh access token
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');
    
    const response = await authApi.post('/refresh', { refresh_token: refreshToken });
    const { access_token } = response.data;
    
    localStorage.setItem('accessToken', access_token);
    return access_token;
  } catch (error) {
    logout();
    throw error.response?.data || { error: 'Token refresh failed' };
  }
};

// Get all users (admin only)
export const getUsers = async () => {
  try {
    const response = await authApi.get('/users');
    return response.data.users;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch users' };
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await authApi.get(`/users/${userId}`);
    return response.data.user;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch user' };
  }
};

// Update user
export const updateUser = async (userId, userData) => {
  try {
    const response = await authApi.put(`/users/${userId}`, userData);
    
    // If updating current user, update localStorage
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to update user' };
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const response = await authApi.delete(`/users/${userId}`);
    
    // If deleting current user, logout
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      logout();
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to delete user' };
  }
}; 