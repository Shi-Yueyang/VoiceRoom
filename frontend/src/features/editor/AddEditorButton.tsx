import { useState } from "react";
import {
  Fab,
  Modal,
  Paper,
  Button,
  Box,
  Typography,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import axios from "axios";

interface AddEditorButtonProps {
  scriptId: string;
  onEditorAdded?: (editorUsername: string) => void;
}

const AddEditorButton = ({ scriptId, onEditorAdded }: AddEditorButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    // Reset form when opening/closing
    if (!isModalOpen) {
      setUsername("");
      setError("");
      setSuccess("");
    }
  };

  const handleAddEditor = async () => {
    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(`/api/scripts/${scriptId}/editors`, {
        username: username.trim()
      });
      
      setSuccess(`Successfully added ${username} as an editor`);
      setUsername("");
      onEditorAdded?.(username.trim());
      
      // Close modal after a short delay to show success message
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess("");
      }, 1500);
    } catch (error: any) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Failed to add editor. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !loading) {
      handleAddEditor();
    }
  };

  return (
    <>
      <Fab
        color="secondary"
        aria-label="add editor"
        onClick={toggleModal}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 88, // Position to the left of the AddBlockButton (56px FAB + 16px gap + 16px margin)
          zIndex: (theme) => theme.zIndex.speedDial,
        }}
      >
        <PersonAddIcon />
      </Fab>

      <Modal
        open={isModalOpen}
        onClose={toggleModal}
        aria-labelledby="add-editor-modal-title"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Paper
          sx={{
            padding: 3,
            minWidth: "320px",
            maxWidth: "90%",
            maxHeight: "80%",
            overflowY: "auto",
          }}
        >
          <Typography
            id="add-editor-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Add Editor to Script
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter the username of the person you want to add as an editor for this script.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
            placeholder="Enter username"
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={toggleModal} disabled={loading}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleAddEditor}
              disabled={loading || !username.trim()}
              startIcon={loading ? <CircularProgress size={16} /> : null}
            >
              {loading ? "Adding..." : "Add Editor"}
            </Button>
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

export default AddEditorButton;
