import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  styled,
  alpha,
  InputBase,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupIcon from "@mui/icons-material/Group";

import FolderIcon from "@mui/icons-material/Folder";
import { useAuth } from "../../contexts/AuthContext";

const SIDEBAR_WIDTH = 250;

interface NavigationProps {
  // Search props
  onSearch?: (searchTerm: string) => void;
  searchPlaceholder?: string;
  // Navigation props
  onNavigateToScripts?: () => void;
  onNavigateToGroups?: () => void;
  // Sidebar props
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
}
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "90%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "90%",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 5, 1, 0), // Add right padding for clear button
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

const Navigation: React.FC<NavigationProps> = ({
  onSearch,
  searchPlaceholder,
  onNavigateToScripts,
  onNavigateToGroups,
  sidebarOpen = false,
  onSidebarToggle,
}) => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

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

  const handleDrawerToggle = () => {
    if (isLargeScreen) {
      onSidebarToggle?.();
    } else {
      setMobileDrawerOpen(true);
    }
  };

  const handleNavigation = (callback?: () => void) => {
    if (!isLargeScreen) {
      setMobileDrawerOpen(false);
    }
    callback?.();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    onSearch?.("");
  };

  // Determine placeholder text
  const placeholder = searchPlaceholder || "Search...";

  // Sidebar content component
  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <Box
      sx={{ 
        width: SIDEBAR_WIDTH, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      {/* Header section - matches YouTube's spacing */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        px: 2,
        py: 1.5,
        minHeight: 56, // Match typical header height
      }}>
        <IconButton
          onClick={() => {
            if (isLargeScreen) {
              onSidebarToggle?.();
            } else {
              onItemClick?.();
            }
          }}
          size="medium"
          aria-label="close sidebar"
          sx={{ 
            mr: 2,
            '&:hover': {
              bgcolor: 'action.hover',
            }
          }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1 
        }}>
          {/* App branding - similar to YouTube logo placement */}
          <Box sx={{ 
            fontWeight: 600, 
            fontSize: '1.1rem',
            color: 'text.primary',
            letterSpacing: '-0.5px'
          }}>
            ScriptApp
          </Box>
        </Box>
      </Box>

      {/* Navigation items */}
      <Box sx={{ flex: 1, py: 1 }}>
        <List sx={{ padding: 0 }}>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => {
                onItemClick?.();
                handleNavigation(onNavigateToScripts);
              }}
              sx={{
                px: 3,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
                borderRadius: 0,
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: 'text.primary'
              }}>
                <FolderIcon fontSize="medium" />
              </ListItemIcon>
              <ListItemText 
                primary="Scripts" 
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: 400,
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => {
                onItemClick?.();
                handleNavigation(onNavigateToGroups);
              }}
              sx={{
                px: 3,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
                borderRadius: 0,
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: 'text.primary'
              }}>
                <GroupIcon fontSize="medium" />
              </ListItemIcon>
              <ListItemText 
                primary="Groups" 
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      
      {/* Bottom section for user actions */}
      {user && (
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
          <List sx={{ padding: 0 }}>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => {
                  onItemClick?.();
                  handleLogout();
                }}
                sx={{
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  borderRadius: 0,
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 40,
                  color: 'text.primary'
                }}>
                  <LogoutIcon fontSize="medium" />
                </ListItemIcon>
                <ListItemText 
                  primary="Logout" 
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          mb: 2,
          ml: isLargeScreen && sidebarOpen ? `${SIDEBAR_WIDTH}px` : 0,
          width: isLargeScreen && sidebarOpen ? `calc(100% - ${SIDEBAR_WIDTH}px)` : '100%',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          zIndex: theme.zIndex.drawer + 1, // Ensure AppBar stays above sidebar
        }}
      >
        <Toolbar>
          {/* Only show menu button when sidebar/drawer is closed */}
          {(isLargeScreen ? !sidebarOpen : !mobileDrawerOpen) && (
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 1 }}
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              mx: 4, // Add some margin on the sides
            }}
          >
            {onSearch && (
              <Search sx={{ width: "100%" }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder={placeholder}
                  inputProps={{ "aria-label": "search" }}
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "inherit",
                      opacity: 0.7,
                      "&:hover": {
                        opacity: 1,
                      },
                    }}
                    onClick={handleSearchClear}
                    aria-label="clear search"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
              </Search>
            )}
          </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {user && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <Avatar
                  sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>

    {/* Persistent Sidebar for large screens */}
    {isLargeScreen && (
      <Drawer
        variant="persistent"
        anchor="left"
        open={sidebarOpen}
        sx={{
          width: sidebarOpen ? SIDEBAR_WIDTH : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            top: 0,
            height: '100vh',
            position: 'fixed',
            zIndex: theme.zIndex.drawer,
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    )}

    {/* Mobile Drawer for small screens */}
    {!isLargeScreen && (
      <Drawer 
        anchor="left" 
        open={mobileDrawerOpen} 
        onClose={() => setMobileDrawerOpen(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            border: 'none',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          },
        }}
      >
        <SidebarContent onItemClick={() => setMobileDrawerOpen(false)} />
      </Drawer>
    )}
  </>
  );
};

export default Navigation;
