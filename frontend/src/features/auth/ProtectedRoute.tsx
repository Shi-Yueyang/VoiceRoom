import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import AuthScreen from './AuthScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
