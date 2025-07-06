import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../../contexts/AuthContext';
import scriptEditorIcon from '../../assets/script-editor.svg';

interface NavigationProps {
  // Editor mode props
  isEditorMode?: boolean;
  scriptTitle?: string;
  isLoadingScript?: boolean;
  onNavigateBack?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  isEditorMode = false,
  scriptTitle,
  isLoadingScript = false,
  onNavigateBack,
}) => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        {isEditorMode ? (
          // Editor mode: Back button + Script title
          <>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="back"
              sx={{ mr: 1 }}
              onClick={onNavigateBack}
            >
              <ArrowBackIcon />
            </IconButton>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {isLoadingScript ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  <span>Loading script...</span>
                </Box>
              ) : (
                scriptTitle || "Script Editor"
              )}
            </Typography>
          </>
        ) : (
          // Default mode: Logo + App title
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <img 
              src={scriptEditorIcon} 
              alt="Script Editor" 
              style={{ width: 24, height: 24 }}
            />
            <Typography variant="h6" component="div">
              Script Editor
            </Typography>
          </Box>
        )}
        
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

            
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
