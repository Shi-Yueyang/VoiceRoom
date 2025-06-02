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
      }}
    >
      {/* Drag handle */}
      <Box
        {...attributes}
        {...listeners}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "32px",
          cursor: "grab",
          color: commonProps.isActive ? "primary.main" : "text.disabled",
          opacity: isDragging || commonProps.isActive ? 1 : 0.3,
          transition: "opacity 0.2s",
          "&:hover": {
            opacity: 1,
          },
          "&:active": {
            cursor: "grabbing",
          },
          // Hide drag handle for non-interactive/view-only mode if needed
          // display: isInteractive ? "flex" : "none"
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
