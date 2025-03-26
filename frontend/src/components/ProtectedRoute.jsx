import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ redirectPath = '/login' }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  
  // Optional: Show loading state or null while checking auth state
  // This prevents flickering if auth state loads slightly after component mount
  if (isLoading && !isAuthenticated) {
       // Or return a loading spinner component
       return null;
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    return <Navigate to={redirectPath} replace />;
  }

  // If authenticated, render the child route components
  return <Outlet />;
};


ProtectedRoute.propTypes = {
  redirectPath: PropTypes.string,
};

export default ProtectedRoute;