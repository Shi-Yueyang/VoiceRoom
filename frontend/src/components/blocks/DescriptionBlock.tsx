import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, TextareaAutosize } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { BlockParamUpdates, DescriptionBlockParam } from "@chatroom/shared";

interface DescriptionBlockProps {
  id: string;
  blockParams: DescriptionBlockParam;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (blockId: string, updates: BlockParamUpdates) => void;
  
}

const DescriptionBlock = ({
  id,
  blockParams: descriptionBlockParam,
  isActive,
  onSelect,
  onDelete,
  onUpdate
}: DescriptionBlockProps) => {
  // State for editing mode and text content
  const [isEditing, setIsEditing] = useState<boolean>(isActive);


  // Update editing state when isActive prop changes
  useEffect(() => {
    if (isActive) {
      setIsEditing(true);


    } else {
      setIsEditing(false);
    }
  }, [isActive, descriptionBlockParam]);

  // Handle click on the block
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); 
    if (!isEditing) {
      onSelect(id);
    }
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
        // Mobile-friendly adjustments
        "@media (max-width: 600px)": {
          padding: "16px",
          minHeight: "56px",
        },
      }}
    >
      {isEditing ? (
        <TextareaAutosize
          value={descriptionBlockParam.text}
          onChange={(e)=>{
            onUpdate(id, { text: e.target.value });
          }}
          autoFocus
          minRows={1}
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
      ) : (
        <Typography
          sx={{
            width: "100%",
            fontFamily: "Courier New, monospace",
            fontSize: "16px",
            lineHeight: "1.5",
            paddingRight: "15px",

            // For mobile readability
            "@media (max-width: 600px)": {
              fontSize: "16px",
            },
          }}
        >
          {descriptionBlockParam.text || "点击编辑描述..."}
        </Typography>
      )}

      {isActive && (
        <IconButton
          onClick={handleDelete}
          size="small"
          color="error"
          aria-label="delete action"
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

export default DescriptionBlock;
