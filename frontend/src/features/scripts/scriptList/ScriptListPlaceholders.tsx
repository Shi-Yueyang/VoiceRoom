import React from 'react';
import {
  Typography,
  Paper,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';

interface EmptyScriptListProps {
  onCreateNew: () => void;
}

export const EmptyScriptList: React.FC<EmptyScriptListProps> = ({ onCreateNew }) => {
  return (
    <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
      <DescriptionIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        No scripts found
      </Typography>
      <Typography variant="body2" color="text.secondary">
        We couldn't find any scripts in your account. Create your first script to get started with crafting your narratives.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onCreateNew}
        sx={{ mt: 2 }}
      >
        Create New Script
      </Button>
    </Paper>
  );
};

interface LoadingStateProps {}

export const LoadingState: React.FC<LoadingStateProps> = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
      <CircularProgress />
    </Box>
  );
};

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  isRetrying: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  onRetry, 
  isRetrying 
}) => {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
      <Typography variant="body2" color="text.secondary" paragraph>
        There was a problem connecting to the server. This could be due to network issues or the server might be offline.
      </Typography>
      <Button
        variant="outlined"
        color="primary"
        onClick={onRetry}
        startIcon={isRetrying ? <CircularProgress size={20} /> : null}
        disabled={isRetrying}
      >
        {isRetrying ? 'Trying again...' : 'Retry'}
      </Button>
    </Paper>
  );
};
