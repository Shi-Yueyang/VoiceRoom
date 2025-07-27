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

import { BlockItem } from ".";
import { BlockParamUpdates, ScriptBlock } from "@chatroom/shared";



interface ScriptContainerProps {
  scriptBlocks: ScriptBlock[];
  activeBlockId: string | null;
  lockedBlocks?: Map<string, { userId: string; username: string }>;
  currentUserId?: string;
  onSelectBlock: (id: string) => void;
  onDeleteBlock: (id: string) => void;
  onUpdateBlock: (blockId: string, updates: BlockParamUpdates) => void; 
  onRearrangeBlocks: (oldIndex: number, newIndex: number) => void; 
}

const ScriptContainer = ({
  scriptBlocks,
  activeBlockId,
  currentUserId,
  onSelectBlock,
  onDeleteBlock,
  onUpdateBlock, 
  onRearrangeBlocks,
}: ScriptContainerProps) => {
  // Debug: Log the blocks to see what we're working with

  
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
      const oldIndex = scriptBlocks.findIndex((item) => item._id.toString() === active.id);
      const newIndex = scriptBlocks.findIndex((item) => item._id.toString() === over.id);

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
          items={scriptBlocks.filter(block => block._id != null).map((block) => block._id.toString())}
          strategy={verticalListSortingStrategy}
        >
          {scriptBlocks.filter(block => block._id != null).map((block) => {
            
            const isActive = activeBlockId === block._id.toString();
            const lockedBy = block.lockedBy;
            const isLocked = !!block.lockedBy;
            const isLockedByCurrentUser = lockedBy && lockedBy.toString() === currentUserId;
            const isDisabled = isLocked && !isLockedByCurrentUser;

            const commonProps = {
              id: block._id.toString(),
              blockParams: block.blockParams,
              isActive: isActive,
              isLocked: isLocked,
              isLockedByCurrentUser: isLockedByCurrentUser,
              isDisabled: isDisabled,
              onSelect: (id: string) => onSelectBlock(id),
              onDelete: (id: string) => onDeleteBlock(id),
              onUpdate: (blockId: string, updates: BlockParamUpdates) => onUpdateBlock(blockId, updates)
            };

            return (
              <BlockItem
                key={block._id.toString()}
                id={block._id.toString()}
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
