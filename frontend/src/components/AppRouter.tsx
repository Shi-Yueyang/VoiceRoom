import { Routes, Route, Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { ScriptListScreen } from '../features/scripts';
import { ScriptEditorScreen } from '../features/editor';
import { Navigation } from './ui';

type AppRouterProps = {
  selectedScriptId: string | null;
  setSelectedScriptId: (id: string | null) => void;
  onSelectScript: (scriptId: string) => void;
  onCreateNewScriptSuccess: (newScriptId: string) => void;
  onSaveScript: (scriptId: string, data: any) => void;
};

const ScriptEditorWrapper = ({ 
  setSelectedScriptId,
}: { 
  setSelectedScriptId: (id: string | null) => void;
  onSaveScript: (scriptId: string, data: any) => void;
}) => {
  const { scriptId } = useParams<{ scriptId: string }>();
  const navigate = useNavigate();
  const [scriptTitle, setScriptTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch script data including title
  useEffect(() => {
    const fetchScriptData = async () => {
      if (!scriptId) return;
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/scripts/${scriptId}`);
        if (response.data) {
          setScriptTitle(response.data.title || "");
        }
      } catch (error) {
        console.error("Error fetching script data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScriptData();
  }, [scriptId]);

  const handleBack = () => {
    console.log('Navigating back to script list');
    setSelectedScriptId(null);
    navigate('/');
  };

  return (
    <>
      <Navigation 
        isEditorMode={true}
        scriptTitle={scriptTitle}
        isLoadingScript={isLoading}
        onNavigateBack={handleBack}
      />
      <ScriptEditorScreen
        scriptId={scriptId || ''}
        onNavigateBack={handleBack}
        hideAppBar={true}
      />
    </>
  );
};

const AppRouter = ({
  selectedScriptId,
  setSelectedScriptId,
  onSelectScript,
  onCreateNewScriptSuccess,
  onSaveScript,
}: AppRouterProps) => {
  const location = useLocation();
  const isEditorRoute = location.pathname.startsWith('/editor');

  return (
    <Box>
      {!isEditorRoute && <Navigation />}
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
              />
            )
          } 
        />
        
        <Route 
          path="/editor/:scriptId" 
          element={
            <ScriptEditorWrapper 
              setSelectedScriptId={setSelectedScriptId} 
              onSaveScript={onSaveScript} 
            />
          } 
        />
      </Routes>
    </Box>
  );
};

export default AppRouter;
