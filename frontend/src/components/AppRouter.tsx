import { Routes, Route, Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, useTheme, useMediaQuery } from '@mui/material';

import { ScriptListScreen } from '../features/scripts';
import { ScriptEditorScreen, UserManagementScreen } from '../features/editor';
import { GroupsScreen } from '../features/groups';
import { Navigation } from './ui';
import { useState, useEffect } from 'react';

interface AppRouterProps {
  selectedScriptId: string | null;
  setSelectedScriptId: (id: string | null) => void;
  onSelectScript: (scriptId: string) => void;
  onCreateNewScriptSuccess: (newScriptId: string) => void;
}

// Wrapper component to handle editor route params
const EditorWrapper = ({ 
  onNavigateBack, 
  searchTerm 
}: { 
  onNavigateBack: () => void;
  searchTerm: string;
}) => {
  const { scriptId } = useParams<{ scriptId: string }>();
  const navigate = useNavigate();
  
  const handleNavigateToUserManagement = () => {
    navigate(`/editor/${scriptId}/users`);
  };
  
  return (
    <ScriptEditorScreen
      scriptId={scriptId ?? ''}
      onNavigateBack={onNavigateBack}
      hideAppBar={true}
      searchTerm={searchTerm}
      onNavigateToUserManagement={handleNavigateToUserManagement}
    />
  );
};

// Wrapper component to handle user management route params
const UserManagementWrapper = ({
  searchTerm,
}: {
  searchTerm: string;
  onNavigateBack: () => void;
}) => {
  const { scriptId } = useParams<{ scriptId: string }>();
  const navigate = useNavigate();
  
  const handleNavigateBackToEditor = () => {
    navigate(`/editor/${scriptId}`);
  };
  
  return (
    <UserManagementScreen
      scriptId={scriptId ?? ''}
      onNavigateBack={handleNavigateBackToEditor}
      searchTerm={searchTerm}
    />
  );
};

const AppRouter = ({
  selectedScriptId,
  setSelectedScriptId,
  onSelectScript,
  onCreateNewScriptSuccess,
}: AppRouterProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default open on large screens

  const handleBack = () => {
    setSelectedScriptId(null);
    navigate('/', { replace: true });
  };



  const handleNavigateToScripts = () => {
    setSelectedScriptId(null);
    navigate('/', { replace: true });
  };

  const handleNavigateToGroups = () => {
    setSelectedScriptId(null);
    navigate('/groups', { replace: true });
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar on small screens
  useEffect(() => {
    if (!isLargeScreen) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isLargeScreen]);



  // Determine if search should be shown (on script list, groups, and script editor, not user management)
  const showSearch = !location.pathname.includes('/users');

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navigation
        onSearch={showSearch ? setSearchTerm : undefined}
        onNavigateToScripts={handleNavigateToScripts}
        onNavigateToGroups={handleNavigateToGroups}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={handleSidebarToggle}
      />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          ml: isLargeScreen && sidebarOpen ? '250px' : 0,
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Routes>
        <Route
          path="/"
          element={
            selectedScriptId ? (
              <Navigate to={`/editor/${selectedScriptId}`} replace />
            ) : (
              <ScriptListScreen
                onSelectScript={onSelectScript}
                onCreateNewScriptSuccess={onCreateNewScriptSuccess}
                searchTerm={searchTerm}
              />
            )
          }
        />
        <Route
          path="/groups"
          element={<GroupsScreen searchTerm={searchTerm} />}
        />
        <Route
          path="/editor/:scriptId"
          element={
            <EditorWrapper
              onNavigateBack={handleBack}
              searchTerm={searchTerm}
            />
          }
        />
        <Route
          path="/editor/:scriptId/users"
          element={
            <UserManagementWrapper
            searchTerm={searchTerm}
              onNavigateBack={handleBack}
            />
          }
        />
      </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default AppRouter;