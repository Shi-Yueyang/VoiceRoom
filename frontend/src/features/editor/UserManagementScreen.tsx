import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
  Container,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { scriptService } from '../../services';

interface User {
  _id: string;
  username: string;
}

interface ScriptEditorsData {
  creator: User;
  editors: User[];
}

interface UserManagementScreenProps {
  scriptId: string;
  searchTerm?: string;
  onNavigateBack: () => void;
}

const UserManagementScreen: React.FC<UserManagementScreenProps> = ({
  scriptId,
  searchTerm = '',
  onNavigateBack,
}) => {
  // State management
  const [scriptData, setScriptData] = useState<ScriptEditorsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add user dialog state
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState<string | null>(null);
  const [addUserSuccess, setAddUserSuccess] = useState<string | null>(null);

  // Remove user dialog state
  const [removeUserDialogOpen, setRemoveUserDialogOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState<User | null>(null);
  const [removeUserLoading, setRemoveUserLoading] = useState(false);

  // Fetch script editors data
  const fetchScriptData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await scriptService.getScriptEditors(scriptId);
      setScriptData(data);
    } catch (err: any) {
      console.error('Error fetching script editors:', err);
      setError(err.response?.data?.error || 'Failed to load script data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScriptData();
  }, [scriptId]);

  // Handle add user
  const handleAddUser = async () => {
    if (!newUsername.trim()) {
      setAddUserError('Please enter a username');
      return;
    }

    try {
      setAddUserLoading(true);
      setAddUserError(null);
      setAddUserSuccess(null);

      await scriptService.addEditorToScript(scriptId, newUsername.trim());

      setAddUserSuccess(`${newUsername} has been added as an editor`);
      setNewUsername('');
      
      // Refresh the data
      await fetchScriptData();
      
      // Close dialog after a brief delay
      setTimeout(() => {
        setAddUserDialogOpen(false);
        setAddUserSuccess(null);
      }, 1500);
    } catch (err: any) {
      console.error('Error adding user:', err);
      setAddUserError(err.response?.data?.error || 'Failed to add user');
    } finally {
      setAddUserLoading(false);
    }
  };

  // Handle remove user
  const handleRemoveUser = async () => {
    if (!userToRemove) return;

    try {
      setRemoveUserLoading(true);
      await scriptService.removeEditorFromScript(scriptId, userToRemove._id);
      
      // Refresh the data
      await fetchScriptData();
      setRemoveUserDialogOpen(false);
      setUserToRemove(null);
    } catch (err: any) {
      console.error('Error removing user:', err);
      setError(err.response?.data?.error || 'Failed to remove user');
    } finally {
      setRemoveUserLoading(false);
    }
  };

  // Check if current user is creator (for permission controls)
  const allUsers = scriptData ? [scriptData.creator, ...scriptData.editors] : [];
  const filteredAllUsers = allUsers.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="sm" sx={{ py: 2, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={onNavigateBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Manage Users
        </Typography>
      </Box>



      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Users Section */}
      {!loading && !error && scriptData && (
        <>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Users
          </Typography>
          
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <List disablePadding>
              {filteredAllUsers.map((user, index) => {
                const isCreator = user._id === scriptData.creator._id;
                const isEditor = !isCreator;
                
                return (
                  <React.Fragment key={user._id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      sx={{
                        minHeight: 72,
                        py: 2,
                        backgroundColor: 'background.paper',
                      }}
                      secondaryAction={
                        isEditor ? (
                          <Tooltip title="Remove editor">
                            <IconButton
                              edge="end"
                              onClick={() => {
                                setUserToRemove(user);
                                setRemoveUserDialogOpen(true);
                              }}
                              color="error"
                              size="small"
                            >
                              <PersonRemoveIcon />
                            </IconButton>
                          </Tooltip>
                        ) : null
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            backgroundColor: isCreator ? 'primary.main' : 'secondary.main',
                            fontSize: '1.25rem',
                            fontWeight: 'medium',
                          }}
                        >
                          {user.username.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {user.username}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {isCreator ? 'Creator' : 'Editor'}
                          </Typography>
                        }
                        sx={{ ml: 2 }}
                      />
                    </ListItem>
                  </React.Fragment>
                );
              })}
            </List>
          </Card>

          {/* No search results */}
          {searchTerm.trim() && filteredAllUsers.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No users found matching "{searchTerm}"
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your search terms
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => setAddUserDialogOpen(true)}
              sx={{
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              Add User
            </Button>
          </Box>
        </>
      )}

      {/* Add User Dialog */}
      <Dialog
        open={addUserDialogOpen}
        onClose={() => !addUserLoading && setAddUserDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add New Editor</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter the username of the person you want to add as an editor for this script.
          </Typography>

          {addUserError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {addUserError}
            </Alert>
          )}

          {addUserSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {addUserSuccess}
            </Alert>
          )}

          <TextField
            autoFocus
            fullWidth
            label="Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !addUserLoading && newUsername.trim()) {
                handleAddUser();
              }
            }}
            disabled={addUserLoading}
            placeholder="Enter username"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setAddUserDialogOpen(false)} 
            disabled={addUserLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddUser}
            disabled={addUserLoading || !newUsername.trim()}
            startIcon={addUserLoading ? <CircularProgress size={16} /> : <PersonAddIcon />}
          >
            {addUserLoading ? 'Adding...' : 'Add Editor'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remove User Confirmation Dialog */}
      <Dialog
        open={removeUserDialogOpen}
        onClose={() => !removeUserLoading && setRemoveUserDialogOpen(false)}
      >
        <DialogTitle>Remove Editor</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove <strong>{userToRemove?.username}</strong> as an editor? 
            They will no longer be able to edit this script.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setRemoveUserDialogOpen(false)} 
            disabled={removeUserLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleRemoveUser}
            disabled={removeUserLoading}
            startIcon={removeUserLoading ? <CircularProgress size={16} /> : <PersonRemoveIcon />}
          >
            {removeUserLoading ? 'Removing...' : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagementScreen;
