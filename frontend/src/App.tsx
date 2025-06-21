import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import AppRouter from './components/AppRouter';
import { ProtectedRoute } from './features/auth';
import { AuthProvider } from './contexts/AuthContext';
import { theme } from './config/theme';
import { axios } from './config/api';

const App = () => {
  const [selectedScriptId, setSelectedScriptId] = useState<string | null>(null);

  // Handler for selecting a script from the list
  const handleSelectScript = (scriptId: string) => {
    console.log('Selected script ID:', scriptId);
    setSelectedScriptId(scriptId);
  };

  // Handler for successfully creating a new script
  const handleCreateNewScriptSuccess = (newScriptId: string) => {
    console.log('New script created with ID:', newScriptId);
    setSelectedScriptId(newScriptId);
  };

  // Handler for saving script
  const handleSaveScript = async (scriptId: string, data: any) => {
    try {
      await axios.put(`/api/scripts/${scriptId}`, { blocks: data });
      console.log('Script saved successfully');
    } catch (error) {
      console.error('Error saving script:', error);
    }
  };

  console.log('App component rendered with selectedScriptId:', selectedScriptId);
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <ProtectedRoute>
            <AppRouter
              selectedScriptId={selectedScriptId}
              setSelectedScriptId={setSelectedScriptId}
              onSelectScript={handleSelectScript}
              onCreateNewScriptSuccess={handleCreateNewScriptSuccess}
              onSaveScript={handleSaveScript}
            />
          </ProtectedRoute>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;