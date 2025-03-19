import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  login as loginService, 
  logout as logoutService, 
  getCurrentUser, 
  isAdmin as checkIsAdmin
} from '../services/authService';

// Create auth context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const initAuth = () => {
      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await loginService(credentials);
      setUser(result.user);
      return result;
    } catch (err) {
      setError(err.error || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    logoutService();
    setUser(null);
  };

  // Check if user is admin
  const isAdmin = () => {
    return checkIsAdmin();
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Update user information
  const updateUserInfo = (updatedUser) => {
    setUser(updatedUser);
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAdmin,
    isAuthenticated,
    updateUserInfo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;