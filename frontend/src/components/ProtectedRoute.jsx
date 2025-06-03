import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ redirectPath = '/login' }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();
  
  // Optional: Show loading state while checking auth state
  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    // Store the attempted path to redirect back after login
    sessionStorage.setItem('redirectPath', location.pathname);
    return <Navigate to={redirectPath} replace />;
  }

  // If authenticated, render the child route components
  return <Outlet />;
};

ProtectedRoute.propTypes = {
  redirectPath: PropTypes.string
};

export default ProtectedRoute;