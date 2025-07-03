import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { scriptService, type ScriptSummary } from '../../services';

// Import reusable components
import {
  ScriptList,
  CreateScriptDialog,
  DeleteScriptDialog,
  EmptyScriptList,
  LoadingState,
  ErrorState,
  NotificationSnackbar,
} from './scriptList';

/**
 * Props interface for the ScriptListScreen component
 */
interface ScriptListScreenProps {
  onSelectScript: (scriptId: string) => void;
  onCreateNewScriptSuccess: (newScriptId: string) => void;
}

/**
 * ScriptListScreen - Displays a list of available scripts and allows creating new ones
 */
const ScriptListScreen: React.FC<ScriptListScreenProps> = ({ 
  onSelectScript, 
  onCreateNewScriptSuccess 
}) => {
  
  // State declarations
  const [scripts, setScripts] = useState<ScriptSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isCreatingScript, setIsCreatingScript] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [scriptToDelete, setScriptToDelete] = useState<ScriptSummary | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Fetch all scripts from the backend API
  useEffect(() => {
    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await scriptService.getScripts();
      
      // Update state with the response data
      setScripts(response.scripts);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      // Show a message if no scripts were returned from the backend
      if (response.scripts.length === 0) {
        showNotification('No scripts found. Create your first script to get started.', 'info');
      }
    } catch (err) {
      console.error('Error fetching scripts:', err);
      setError('Failed to load scripts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handler for creating a new script
  const handleCreateScript = async (title: string) => {
    if (!title.trim()) {
      showNotification('Please enter a title for your script', 'warning');
      return;
    }

    setIsCreatingScript(true);
    
    try {
      const newScript = await scriptService.createScript({ 
        title: title.trim()
      });
      
      // Add the new script to the list and close the dialog
      setScripts(prev => [newScript, ...prev]);
      setIsCreateDialogOpen(false);
      
      // Show success message
      showNotification('Script created successfully!', 'success');
      
      // Navigate to the editor screen with the new script
      onCreateNewScriptSuccess(newScript._id);
    } catch (err) {
      console.error('Error creating script:', err);
      showNotification('Failed to create script. Please try again.', 'error');
    } finally {
      setIsCreatingScript(false);
    }
  };

  // Handler for opening the delete confirmation dialog
  const handleOpenDeleteDialog = (event: React.MouseEvent, script: ScriptSummary) => {
    event.stopPropagation(); // Prevent triggering the list item click
    setScriptToDelete(script);
    setDeleteDialogOpen(true);
  };

  // Handler for deleting a script
  const handleDeleteScript = async () => {
    if (!scriptToDelete) return;
    
    setIsDeleting(true);
    
    try {
      await scriptService.deleteScript(scriptToDelete._id);
      
      // Remove the deleted script from the list
      setScripts(prev => prev.filter(script => script._id !== scriptToDelete._id));
      
      // Show success message
      showNotification(`"${scriptToDelete.title}" deleted successfully`, 'success');
      
      // If the list is now empty, refresh to show the empty state
      if (scripts.length === 1) {
        fetchScripts();
      }
    } catch (err) {
      console.error('Error deleting script:', err);
      showNotification('Failed to delete script. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setScriptToDelete(null);
    }
  };

  // Helper function to show notifications
  const showNotification = (message: string, severity: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Format the date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          The Manucript
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
          sx={{ borderRadius: 8 }}
        >
          New Script
        </Button>
      </Box>

      {/* Loading state */}
      {loading && <LoadingState />}
      
      {/* Error state */}
      {error && (
        <ErrorState 
          error={error} 
          onRetry={() => fetchScripts()} 
          isRetrying={loading} 
        />
      )}

      {/* Empty state */}
      {!loading && !error && scripts.length === 0 && (
        <EmptyScriptList onCreateNew={() => setIsCreateDialogOpen(true)} />
      )}

      {/* Script list */}
      {!loading && !error && scripts.length > 0 && (
        <ScriptList
          scripts={scripts}
          currentPage={currentPage}
          totalPages={totalPages}
          onSelectScript={onSelectScript}
          onDeleteScript={handleOpenDeleteDialog}
          onPageChange={fetchScripts}
          formatDate={formatDate}
        />
      )}

      {/* Create script dialog */}
      <CreateScriptDialog
        open={isCreateDialogOpen}
        isCreating={isCreatingScript}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateScript={handleCreateScript}
      />

      {/* Delete confirmation dialog */}
      <DeleteScriptDialog
        open={deleteDialogOpen}
        isDeleting={isDeleting}
        script={scriptToDelete}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirmDelete={handleDeleteScript}
      />

      {/* Notification snackbar */}
      <NotificationSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </Container>
  );
};

export default ScriptListScreen;
