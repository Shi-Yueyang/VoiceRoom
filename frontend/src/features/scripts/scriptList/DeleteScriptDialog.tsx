import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ScriptSummary } from '../../../types';

interface DeleteScriptDialogProps {
  open: boolean;
  isDeleting: boolean;
  script: ScriptSummary | null;
  onClose: () => void;
  onConfirmDelete: () => Promise<void>;
}

const DeleteScriptDialog: React.FC<DeleteScriptDialogProps> = ({
  open,
  isDeleting,
  script,
  onClose,
  onConfirmDelete
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => !isDeleting && onClose()}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">
        Confirm Delete
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Are you sure you want to delete "{script?.title}"? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirmDelete}
          color="error"
          variant="contained"
          disabled={isDeleting}
          startIcon={isDeleting ? <CircularProgress size={20} /> : <DeleteIcon />}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteScriptDialog;
