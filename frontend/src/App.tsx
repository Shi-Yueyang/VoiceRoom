import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';

import { AppRouter } from './components';
import { AuthProvider, ProtectedRoute } from './features/auth';
import { theme } from './config/theme';

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
            />
          </ProtectedRoute>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;