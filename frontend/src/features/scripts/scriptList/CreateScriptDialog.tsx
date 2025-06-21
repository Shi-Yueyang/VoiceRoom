import React, { useState } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress
} from '@mui/material';

interface CreateScriptDialogProps {
  open: boolean;
  isCreating: boolean;
  onClose: () => void;
  onCreateScript: (title: string) => Promise<void>;
}

const CreateScriptDialog: React.FC<CreateScriptDialogProps> = ({
  open,
  isCreating,
  onClose,
  onCreateScript
}) => {
  const [title, setTitle] = useState<string>('');

  const handleSubmit = async () => {
    if (title.trim()) {
      await onCreateScript(title);
      setTitle(''); // Reset the title after creation
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setTitle(''); // Reset the title when closing
      onClose();
    }
  };
 
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Create New Script</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Enter a title for your new script.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label="Script Title"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isCreating}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isCreating && title.trim()) {
              handleSubmit();
            }
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          disabled={isCreating}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isCreating || !title.trim()}
          startIcon={isCreating ? <CircularProgress size={20} /> : null}
        >
          {isCreating ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateScriptDialog;
