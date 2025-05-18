import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export interface DialogueBlockParam {
  characterName: string;
  text: string;
}

interface DialogueBlockProps {
  id: string;
  blockParams?: DialogueBlockParam;
  isActive: boolean;
  onSelect: (id: string) => void;
  onEditText: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}

const DialogueBlock = ({
  id,
  blockParams,
  isActive,
  onSelect,
  onDelete,
}: DialogueBlockProps) => {
  // Component state
  const [isEditing, setIsEditing] = useState<boolean>(isActive);
  const [characterName, setCharacterName] = useState<string>(
    blockParams?.characterName || ""
  );
  const [characterText, setCharacterText] = useState<string>(
    blockParams?.text || ""
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive) {
      setIsEditing(true);

      // Focus the textarea after a brief delay to ensure it's rendered
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);
    } else {
      setIsEditing(false);
    }
  }, [isActive]);

  // Handler for clicking on the block
  const handleClick = () => {
    if (!isEditing) {
      onSelect(id);
    }
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
        position: "relative",
        padding: "12px",
        marginBottom: "8px",
        backgroundColor: isActive ? "#e3f2fd" : "#f5f5f5",
        border: isActive ? "2px solid #1976d2" : "1px solid #e0e0e0",
        borderRadius: "4px",
        cursor: "pointer",
        minHeight: "48px",
        display: "flex",
        alignItems: "flex-start",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: isActive ? "#e3f2fd" : "#f0f0f0",
        },
        // More padding for mobile
        "@media (max-width: 600px)": {
          padding: "16px",
          minHeight: "56px",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          // Important: Apply the indentation for dialogue blocks
          paddingLeft: { xs: "32px", sm: "40px", md: "60px" },
        }}
      >
        {isEditing ? (
          <Box sx={{ width: "90%", margin: "0 auto", textAlign: "center" }}>
            <TextField
              inputRef={nameInputRef}
              fullWidth
              variant="outlined"
              size="small"
              label="角色"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              margin="dense"
              InputProps={{
                style: {
                  fontFamily: "Courier New, monospace",
                  fontWeight: "bold",
                  textAlign: "center",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                },
              }}
              sx={{ mb: 1 }}
            />
            <TextareaAutosize
              ref={textareaRef}
              value={characterText}
              onChange={(e) => setCharacterText(e.target.value)}
              minRows={2}
              style={{
                width: "100%",
                fontFamily: "Courier New, monospace",
                fontSize: "16px",
                backgroundColor: "transparent",
                border: "1px solid #ccc",
                borderRadius: "4px",
                outline: "none",
                resize: "vertical",
                lineHeight: "1.5",
              }}
            />
          </Box>
        ) : (
          <>
            <Typography
              sx={{
                width: "60%",
                margin: "0 auto",
                textAlign: "center",
                fontFamily: "Courier New, monospace",
                fontWeight: "bold",
                fontSize: "14px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginTop: "12px",
                marginBottom: "4px",
              }}
            >
              {characterName}
            </Typography>
            <Typography
              sx={{
                width: "60%",
                margin: "0 auto",
                textAlign: "center",
                fontFamily: "Courier New, monospace",
                fontSize: "16px",
                lineHeight: "1.5",
                marginBottom: "12px",
                // For mobile readability
                "@media (max-width: 600px)": {
                  fontSize: "16px",
                  width: "90%",
                },
              }}
            >
              {characterText}
            </Typography>
          </>
        )}
      </Box>

      {isActive && (
        <IconButton
          onClick={handleDelete}
          size="small"
          color="error"
          aria-label="delete dialogue"
          sx={{
            position: "absolute",
            top: "4px",
            right: "4px",
            // Increase touch target area for mobile
            "@media (max-width: 600px)": {
              padding: "8px",
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
