import { Routes, Route, Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

import { ScriptListScreen } from '../features/scripts';
import { ScriptEditorScreen } from '../features/editor';
import { Navigation } from './ui';
import { useState } from 'react';

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
  
  return (
    <ScriptEditorScreen
      scriptId={scriptId ?? ''}
      onNavigateBack={onNavigateBack}
      hideAppBar={true}
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
  const isEditorRoute = location.pathname.startsWith('/editor');
  const [searchTerm, setSearchTerm] = useState('');

  const handleBack = () => {
    setSelectedScriptId(null);
    navigate('/', { replace: true });
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navigation
        isEditorMode={isEditorRoute}
        onNavigateBack={isEditorRoute ? handleBack : undefined}
        onSearch={setSearchTerm}
      />
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
          path="/editor/:scriptId"
          element={
            <EditorWrapper
              onNavigateBack={handleBack}
              searchTerm={searchTerm}
            />
          }
        />
      </Routes>
    </Box>
  );
};

export default AppRouter;