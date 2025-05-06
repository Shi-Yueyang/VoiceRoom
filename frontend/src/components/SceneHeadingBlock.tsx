import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextareaAutosize,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SuggestionsList from "./SuggestionsList";

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
  const [currentType, setCurrentType] = useState<string>("INT.");
  const [showPlaceSuggestions, setShowPlaceSuggestions] = useState(false);

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


  // Handle delete button click
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
        minHeight: "48px", // Ensures good tap target size
        display: "flex",
        alignItems: "center",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: isActive ? "#e3f2fd" : "#f0f0f0",
        },
        // For mobile touch targets
        "@media (max-width: 600px)": {
          padding: "16px",
          minHeight: "56px",
        },
      }}
    >
      {isEditing ? (
        <Stack spacing={2} sx={{ width: "100%" }}>
          <ToggleButtonGroup
            value={currentType}
            onChange={(_e, newType) => {setCurrentType(newType);}}
            exclusive
            aria-label="scene location type"
            size="small"
            sx={{
              "& .MuiToggleButton-root": {
                fontFamily: "Courier New, monospace",
                textTransform: "uppercase",
                fontWeight: "bold",
              },
            }}
          >
            <ToggleButton value="INT." aria-label="interior">
              INT.
            </ToggleButton>
            <ToggleButton value="EXT." aria-label="exterior">
              EXT.
            </ToggleButton>
            <ToggleButton value="INT./EXT." aria-label="interior/exterior">
              INT./EXT.
            </ToggleButton>
          </ToggleButtonGroup>

          <Box sx={{ position: 'relative' }}>
          <TextField
              label="地点"
              value={'currentPlace'}
              onChange={()=>{}}
              onFocus={()=>{setShowPlaceSuggestions(true);}}
              onBlur={()=>{setShowPlaceSuggestions(false);}}
              fullWidth
              size="small"
              sx={{
                '.MuiInputBase-input': { // Target the actual input element
                  fontFamily: 'Courier New, monospace',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                },
              }}
            />
          <SuggestionsList 
            show={showPlaceSuggestions}
            suggestions={['filteredPlaceSuggestions']}
            onSelectSuggestion={()=> {}}
          />
          </Box>
        </Stack>
      ) : (
        <Typography
          sx={{
            width: "100%",
            fontFamily: "Courier New, monospace",
            fontSize: "16px",
            fontWeight: "bold",
            textTransform: "uppercase",
            // For mobile readability
            "@media (max-width: 600px)": {
              fontSize: "18px", // Larger font for mobile
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
            position: "absolute",
            top: "4px",
            right: "4px",
            // Increase touch target for mobile
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

export default SceneHeadingBlock;
