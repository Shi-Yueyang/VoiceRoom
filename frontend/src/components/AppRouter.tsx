import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';

import ScriptListScreen from './ScriptListScreen';
import ScriptEditorScreen from './ScriptEditorScreen';

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
  setSelectedScriptId: (id: string | null) => void,
  onSaveScript: (scriptId: string, data: any) => void
}) => {
  const { scriptId } = useParams<{ scriptId: string }>();
  const navigate = useNavigate();

  // Set the selected script ID from URL parameter and fetch script data


  // Handle navigation back to script list
  const handleBack = () => {
    console.log('Navigating back to script list');
    setSelectedScriptId(null);
    navigate('/');
  };

  return (
    <ScriptEditorScreen
      scriptId={scriptId || ''}
      onNavigateBack={handleBack}
    />
  );
};

const AppRouter = ({
  selectedScriptId,
  setSelectedScriptId,
  onSelectScript,
  onCreateNewScriptSuccess,
  onSaveScript,
}: AppRouterProps) => {
  return (
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
  );
};

export default AppRouter;
