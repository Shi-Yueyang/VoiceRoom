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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useAuth } from "../../contexts/AuthContext";
import scriptEditorIcon from "../../assets/script-editor.svg";

interface NavigationProps {
  // Editor mode props
  isEditorMode?: boolean;
  onNavigateBack?: () => void;
  // Search props
  onSearch?: (searchTerm: string) => void;
  searchPlaceholder?: string;
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
  isEditorMode = false,
  onNavigateBack,
  onSearch,
  searchPlaceholder,
}) => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = React.useState("");

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    onSearch?.("");
  };

  // Determine placeholder text based on mode
  const placeholder = searchPlaceholder || (isEditorMode ? "Search blocks..." : "Search scripts...");

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
          {isEditorMode ? (
            // Editor mode: Back button only
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
          ) : (
            // Default mode: Logo only
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img
                src={scriptEditorIcon}
                alt="Script Editor"
                style={{ width: 24, height: 24 }}
              />
            </Box>
          )}
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
  );
};

export default Navigation;
