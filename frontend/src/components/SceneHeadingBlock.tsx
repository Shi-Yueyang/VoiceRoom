import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, TextareaAutosize } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface SceneHeadingBlockProps {
  id: string;
  text: string;
  isActive: boolean;
  onSelect: (id: string) => void;
  onEditText: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}

const SceneHeadingBlock: React.FC<SceneHeadingBlockProps> = ({
  id,
  text,
  isActive,
  onSelect,
  onEditText,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(isActive);
  const [currentText, setCurrentText] = useState<string>(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update internal state when isActive prop changes
  useEffect(() => {
    if (isActive) {
      setIsEditing(true);
      setCurrentText(text);
      
      // Focus the textarea when it becomes active
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);
    } else {
      setIsEditing(false);
    }
  }, [isActive, text]);

  // Handle click on the box (to select/activate)
  const handleClick = () => {
    if (!isEditing) {
      onSelect(id);
    }
  };

  // Handle text changes in the textarea
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentText(e.target.value);
  };

  // Handle blur event (finish editing)
  const handleBlur = () => {
    onEditText(id, currentText);
    setIsEditing(false);
  };

  // Handle delete button click
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the box click handler from firing
    onDelete(id);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: 'relative',
        padding: '12px',
        marginBottom: '8px',
        backgroundColor: isActive ? '#e3f2fd' : '#f5f5f5',
        border: isActive ? '2px solid #1976d2' : '1px solid #e0e0e0',
        borderRadius: '4px',
        cursor: 'pointer',
        minHeight: '48px', // Ensures good tap target size
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: isActive ? '#e3f2fd' : '#f0f0f0',
        },
        // For mobile touch targets
        '@media (max-width: 600px)': {
          padding: '16px',
          minHeight: '56px',
        },
      }}
    >
      {isEditing ? (
        <TextareaAutosize
          ref={textareaRef}
          value={currentText}
          onChange={handleTextChange}
          onBlur={handleBlur}
          autoFocus
          minRows={1}
          style={{
            width: '100%',
            padding: '0',
            fontFamily: 'Courier New, monospace',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            textTransform: 'uppercase',
          }}
        />
      ) : (
        <Typography
          sx={{
            width: '100%',
            fontFamily: 'Courier New, monospace',
            fontSize: '16px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            // For mobile readability
            '@media (max-width: 600px)': {
              fontSize: '18px', // Larger font for mobile
            },
          }}
        >
          {text}
        </Typography>
      )}

      {isActive && (
        <IconButton
          onClick={handleDelete}
          size="small"
          color="error"
          aria-label="delete scene heading"
          sx={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            // Increase touch target for mobile
            '@media (max-width: 600px)': {
              padding: '8px',
            },
          }}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default SceneHeadingBlock;