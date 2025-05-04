import React from "react";
import Box from "@mui/material/Box";
import SceneHeadingBlock from "./SceneHeadingBlock";
import DialogueBlock from "./DialogueBlock";
import ActionBlock from "./ActionBlock";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent 
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable 
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

export interface ScriptBlock {
  id: string;
  type:
    | "sceneHeading"
    | "action"
    | "character"
    | "dialogue"
    | "parenthetical"
    | "transition"; // Add all your block types
  text: string;
}

interface ScriptContainerProps {
  scriptBlocks: ScriptBlock[];
  activeBlockId: string | null;
  onSelectBlock: (id: string) => void;
  onEditBlockText: (id: string, newText: string) => void;
  onDeleteBlock: (id: string) => void;
  onAddBlock: (type: ScriptBlock["type"], afterId: string | null) => void;
  onRearrangeBlocks: (oldIndex: number, newIndex: number) => void; // Uncommented for drag-and-drop
}

// Sortable wrapper for a block
const SortableItem = ({ 
  block, 
  commonProps 
}: { 
  block: ScriptBlock; 
  commonProps: any; 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  // Create the block element based on its type
  let blockElement;
  switch (block.type) {
    case "sceneHeading":
      blockElement = <SceneHeadingBlock {...commonProps} />;
      break;
    case "action":
      blockElement = <ActionBlock {...commonProps} />;
      break;
    case "dialogue":
      blockElement = <DialogueBlock {...commonProps} characterId="diag-1" />;
      break;
    default:
      blockElement = (
        <Box sx={{ color: "red", marginBottom: 1 }}>
          Unknown Block Type: {block.type}
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
        alignItems: "stretch"
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
      <Box sx={{ flexGrow: 1 }}>
        {blockElement}
      </Box>
    </Box>
  );
};

const ScriptContainer: React.FC<ScriptContainerProps> = ({
  scriptBlocks,
  activeBlockId,
  onSelectBlock,
  onEditBlockText,
  onDeleteBlock,
  onAddBlock,
  onRearrangeBlocks,
}) => {
  // Set up drag sensors for mouse, touch, and keyboard
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // Start dragging after moving 8px to distinguish from normal clicks/taps
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // If we have valid over and the items are different
    if (over && active.id !== over.id) {
      // Find the indexes for the items
      const oldIndex = scriptBlocks.findIndex(item => item.id === active.id);
      const newIndex = scriptBlocks.findIndex(item => item.id === over.id);
      
      // Call the prop function to handle the reordering
      onRearrangeBlocks(oldIndex, newIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{ padding: 2 }}>
        <SortableContext
          items={scriptBlocks.map(block => block.id)}
          strategy={verticalListSortingStrategy}
        >
          {scriptBlocks.map(block => {
            const isActive = activeBlockId === block.id;
            const commonProps = {
              id: block.id,
              text: block.text,
              isActive: isActive,
              onSelect: onSelectBlock,
              onEditText: onEditBlockText,
              onDelete: onDeleteBlock,
            };

            return (
              <SortableItem 
                key={block.id}
                block={block}
                commonProps={commonProps}
              />
            );
          })}
        </SortableContext>
      </Box>
    </DndContext>
  );
};

export default ScriptContainer;