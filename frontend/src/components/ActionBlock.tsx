import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, TextareaAutosize } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface ActionBlockProps {
  id: string;
  text: string;
  isActive: boolean;
  onSelect: (id: string) => void;
  onEditText: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}

const ActionBlock: React.FC<ActionBlockProps> = ({
  id,
  text,
  isActive,
  onSelect,
  onEditText,
  onDelete,
}) => {
  // State for editing mode and text content
  const [isEditing, setIsEditing] = useState<boolean>(isActive);
  const [currentText, setCurrentText] = useState<string>(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update editing state when isActive prop changes
  useEffect(() => {
    if (isActive) {
      setIsEditing(true);
      setCurrentText(text);
      
      // Focus the textarea with a slight delay to ensure it's rendered
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);
    } else {
      setIsEditing(false);
    }
  }, [isActive, text]);

  // Handle click on the block
  const handleClick = () => {
    if (!isEditing) {
      onSelect(id);
    }
  };

  // Handle text changes
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentText(e.target.value);
  };

  // Handle finish editing
  const handleBlur = () => {
    onEditText(id, currentText);
    setIsEditing(false);
  };

  // Handle delete with propagation stopped
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
        minHeight: '48px',
        display: 'flex',
        alignItems: 'flex-start',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: isActive ? '#e3f2fd' : '#f0f0f0',
        },
        // Mobile-friendly adjustments
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
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            lineHeight: '1.5',
          }}
        />
      ) : (
        <Typography
          sx={{
            width: '100%',
            fontFamily: 'Courier New, monospace',
            fontSize: '16px',
            lineHeight: '1.5',
            // For mobile readability
            '@media (max-width: 600px)': {
              fontSize: '16px',
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
          aria-label="delete action"
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

export default ActionBlock;