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
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import FolderIcon from "@mui/icons-material/Folder";
import { useAuth } from "../../contexts/AuthContext";

interface NavigationProps {
  // Search props
  onSearch?: (searchTerm: string) => void;
  searchPlaceholder?: string;
  // Navigation props
  onNavigateToScripts?: () => void;
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
}) => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [drawerOpen, setDrawerOpen] = React.useState(false);

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

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleNavigation = (callback?: () => void) => {
    handleDrawerClose();
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

  return (
    <>
      <AppBar position="static" sx={{ mb: 2 }}>
        <Toolbar>
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            {/* Menu drawer button */}
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 1 }}
              onClick={handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              mx: 4, // Add some margin on the sides
            }}
          >
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

    {/* Navigation Drawer */}
    <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerClose}>
      <Box
        sx={{ 
          width: 250, 
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
        role="presentation"
        onClick={handleDrawerClose}
        onKeyDown={handleDrawerClose}
      >
        <List sx={{ flex: 1 }}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation(onNavigateToScripts)}>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary="Scripts" />
            </ListItemButton>
          </ListItem>
        </List>
        
        {user && (
          <>
            <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </List>
          </>
        )}
      </Box>
    </Drawer>
  </>
  );
};

export default Navigation;
