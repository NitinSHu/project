import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requireAdmin = false,
  redirectPath = '/login'
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  
  // If still loading auth state, show loading
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If admin access required but user is not admin, redirect to dashboard
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // Render the protected component
  return children;
};

export default ProtectedRoute; 