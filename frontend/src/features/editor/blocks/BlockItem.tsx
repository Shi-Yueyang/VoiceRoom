import Box from "@mui/material/Box";
import SceneHeadingBlock from "./HeadingBlock";
import DialogueBlock from "./DialogueBlock";
import DescriptionBlock from "./DescriptionBlock";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { BlockParamTypes, BlockParamUpdates, DescriptionBlockParam, DialogueBlockParam, HeadingBlockParam } from "@chatroom/shared";

interface CommonBlockProps {
  id: string;
  blockParams: BlockParamTypes;
  isActive: boolean;
  isLocked?: boolean;
  isLockedByCurrentUser?: boolean;
  isDisabled?: boolean;
  lockedByUsername?: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (blockId: string, updates: BlockParamUpdates) => void;
}

interface BlockItemProps {
  type: string;
  id: string;
  commonProps: CommonBlockProps;
}
// Define the BlockItem component

const BlockItem = ({ id, type, commonProps }: BlockItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // Create the block element based on its type
  let blockElement;
  switch (type) {
    case "sceneHeading":
      blockElement = <SceneHeadingBlock {...commonProps} blockParams={commonProps.blockParams as HeadingBlockParam} />;
      break;
    case "description":
      blockElement = <DescriptionBlock {...commonProps} blockParams={commonProps.blockParams as DescriptionBlockParam} />;
      break;
    case "dialogue":
      blockElement = <DialogueBlock {...commonProps} blockParams={commonProps.blockParams as DialogueBlockParam} />;
      break;
    default:
      blockElement = (
        <Box sx={{ color: "red", marginBottom: 1 }}>
          Unknown Block Type: {type}
        </Box>
      );
  }

  // Create the style for the draggable item
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        position: "relative",
        marginBottom: 2,
        display: "flex",
        alignItems: "stretch",
        // Visual feedback for locked state
        opacity: commonProps.isDisabled ? 0.6 : 1,
        pointerEvents: commonProps.isDisabled ? "none" : "auto",
        borderLeft: commonProps.isLocked && !commonProps.isLockedByCurrentUser ? 
          "4px solid" : undefined,
        borderLeftColor: commonProps.isLocked && !commonProps.isLockedByCurrentUser ? 
          "warning.main" : undefined,
        backgroundColor: commonProps.isLocked && !commonProps.isLockedByCurrentUser ? 
          "warning.light" : undefined,
        borderRadius: commonProps.isLocked && !commonProps.isLockedByCurrentUser ? 
          1 : undefined,
      }}
    >
      {/* Lock indicator */}
      {commonProps.isLocked && !commonProps.isLockedByCurrentUser && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "warning.main",
            color: "warning.contrastText",
            borderRadius: 1,
            px: 1,
            py: 0.5,
            fontSize: "0.75rem",
            zIndex: 10,
          }}
        >
          🔒 {commonProps.lockedByUsername}
        </Box>
      )}

      {/* Drag handle */}
      <Box
        {...(commonProps.isDisabled ? {} : attributes)}
        {...(commonProps.isDisabled ? {} : listeners)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "32px",
          cursor: commonProps.isDisabled ? "not-allowed" : "grab",
          color: commonProps.isActive ? "primary.main" : "text.disabled",
          opacity: isDragging || commonProps.isActive ? 1 : 0.3,
          transition: "opacity 0.2s",
          "&:hover": {
            opacity: commonProps.isDisabled ? 0.3 : 1,
          },
          "&:active": {
            cursor: commonProps.isDisabled ? "not-allowed" : "grabbing",
          },
        }}
      >
        <DragIndicatorIcon fontSize="small" />
      </Box>

      {/* The actual block component */}
      <Box sx={{ flexGrow: 1 }}>{blockElement}</Box>
    </Box>
  );
};

export default BlockItem;
