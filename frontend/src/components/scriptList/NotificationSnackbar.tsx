import React from 'react';
import {
  Snackbar,
  Alert
} from '@mui/material';

interface NotificationSnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
  severity?: 'success' | 'info' | 'warning' | 'error';
}

const NotificationSnackbar: React.FC<NotificationSnackbarProps> = ({
  open,
  message,
  onClose,
  severity = 'info'
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
