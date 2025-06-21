import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { BlockParamUpdates, HeadingBlockParam } from "@chatroom/shared";

interface HeadingBlockProps {
  id: string;
  blockParams: HeadingBlockParam;

  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (blockId: string, updates: BlockParamUpdates) => void;
}

const SceneHeadingBlock = ({
  id,
  blockParams: headingBlockParams,
  isActive,
  onSelect,
  onDelete,
  onUpdate,
}: HeadingBlockProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(isActive);


  useEffect(() => {
    if (isActive) {
      setIsEditing(true);


    } else {
      setIsEditing(false);
    }
  }, [isActive, headingBlockParams]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
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
            value={headingBlockParams.intExt}
            onChange={(_e, newIntExt) => {
              onUpdate(id, { ...headingBlockParams, intExt: newIntExt });
            }}
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
            <ToggleButton value="内景" aria-label="interior">
              内景
            </ToggleButton>
            <ToggleButton value="外景" aria-label="exterior">
              外景
            </ToggleButton>
            <ToggleButton value="内景/外景" aria-label="interior/exterior">
              内景/外景
            </ToggleButton>
          </ToggleButtonGroup>

          <Box sx={{ position: "relative" }}>
            <TextField
              label="地点"
              value={headingBlockParams.location}
              onChange={(e) => {
                onUpdate(id, {
                  ...headingBlockParams,
                  location: e.target.value,
                });
              }}
              fullWidth
              size="small"
              sx={{
                ".MuiInputBase-input": {
                  // Target the actual input element
                  fontFamily: "Courier New, monospace",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                },
              }}
            />
          </Box>

          <Box sx={{ position: "relative" }}>
            <TextField
              label="时间"
              value={headingBlockParams.time}
              onChange={(e) => {
                onUpdate(id, { ...headingBlockParams, time: e.target.value });
              }}
              fullWidth
              size="small"
              sx={{
                ".MuiInputBase-input": {
                  // Target the actual input element
                  fontFamily: "Courier New, monospace",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                },
              }}
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
          {headingBlockParams.intExt} - {headingBlockParams.location} - {headingBlockParams.time}
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
