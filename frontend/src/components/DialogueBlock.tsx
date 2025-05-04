import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, TextareaAutosize } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface DialogueBlockProps {
  id: string;
  text: string;
  isActive: boolean;
  onSelect: (id: string) => void;
  onEditText: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
  characterId: string; // Not displayed directly, but may be needed for context
}

const DialogueBlock: React.FC<DialogueBlockProps> = ({
  id,
  text,
  isActive,
  onSelect,
  onEditText,
  onDelete,
  characterId
}) => {
  // Component state
  const [isEditing, setIsEditing] = useState<boolean>(isActive);
  const [currentText, setCurrentText] = useState<string>(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Effect to handle changes in isActive prop
  useEffect(() => {
    if (isActive) {
      setIsEditing(true);
      setCurrentText(text);
      
      // Focus the textarea after a brief delay to ensure it's rendered
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);
    } else {
      setIsEditing(false);
    }
  }, [isActive, text]);

  // Handler for clicking on the block
  const handleClick = () => {
    if (!isEditing) {
      onSelect(id);
    }
  };

  // Handler for text changes in the textarea
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentText(e.target.value);
  };

  // Handler for when editing is complete (blur event)
  const handleBlur = () => {
    onEditText(id, currentText);
    setIsEditing(false);
  };

  // Handler for delete button
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
        // More padding for mobile
        '@media (max-width: 600px)': {
          padding: '16px',
          minHeight: '56px',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          // Important: Apply the indentation for dialogue blocks
          paddingLeft: { xs: '32px', sm: '40px', md: '60px' },
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
              // Additional styling for mobile
              lineHeight: '1.5',
              textAlign: 'left',
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
      </Box>

      {isActive && (
        <IconButton
          onClick={handleDelete}
          size="small"
          color="error"
          aria-label="delete dialogue"
          sx={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            // Increase touch target area for mobile
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

export default DialogueBlock;