import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

interface PublicRouteProps {
  children: ReactNode;
  redirectAuthenticated?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectAuthenticated = true
}) => {
  const { isAuthenticated, initialized } = useAuth();
  const location = useLocation();

  if (!initialized) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (redirectAuthenticated && isAuthenticated) {
    // Get the redirect path from location state or default to dashboard
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
