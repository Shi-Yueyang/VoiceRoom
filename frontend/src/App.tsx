import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import AppRouter from './components/AppRouter';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      '"Helvetica Neue"',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppRouter
          selectedScriptId={selectedScriptId}
          setSelectedScriptId={setSelectedScriptId}
          onSelectScript={handleSelectScript}
          onCreateNewScriptSuccess={handleCreateNewScriptSuccess}
          onSaveScript={handleSaveScript}
        />
      </Router>
    </ThemeProvider>
  );
};

export default App;