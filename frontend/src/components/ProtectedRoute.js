import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner, Container } from 'react-bootstrap';

const ProtectedRoute = ({ 
  children, 
  requireAdmin = false,
  redirectPath = '/login'
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  
  // If still loading auth state, show loading
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
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