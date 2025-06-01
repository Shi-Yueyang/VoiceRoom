import Box from "@mui/material/Box";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import BlockItem from "./blocks/BlockItem";
import { HeadingBlockParam, DescriptionBlockParam, DialogueBlockParam } from "@chatroom/shared";

export interface ScriptBlock {
  _id: string;
  type:
    | "sceneHeading"
    | "description"
    | "dialogue"

  blockParams?: HeadingBlockParam | DescriptionBlockParam | DialogueBlockParam; 
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

const ScriptContainer = ({
  scriptBlocks,
  activeBlockId,
  onSelectBlock,
  onEditBlockText,
  onDeleteBlock,
  onRearrangeBlocks,
}: ScriptContainerProps) => {
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
      const oldIndex = scriptBlocks.findIndex((item) => item._id === active.id);
      const newIndex = scriptBlocks.findIndex((item) => item._id === over.id);

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
          items={scriptBlocks.map((block) => block._id)}
          strategy={verticalListSortingStrategy}
        >
          {scriptBlocks.map((block) => {
            const isActive = activeBlockId === block._id;
            const commonProps = {
              id: block._id,
              blockParams: block.blockParams,
              isActive: isActive,
              onSelect: onSelectBlock,
              onEditText: onEditBlockText,
              onDelete: onDeleteBlock,
            };

            return (
              <BlockItem
                key={block._id}
                id={block._id}
                type={block.type}
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
