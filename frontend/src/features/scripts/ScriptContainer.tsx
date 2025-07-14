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

import { BlockItem } from "../editor";
import { BlockParamUpdates, ScriptBlock } from "@chatroom/shared";
import { ObjectId } from "bson";



interface ScriptContainerProps {
  scriptBlocks: ScriptBlock[];
  activeBlockId: ObjectId | null;
  lockedBlocks?: Map<string, { userId: string; username: string }>;
  currentUserId?: string;
  onSelectBlock: (id: ObjectId) => void;
  onDeleteBlock: (id: ObjectId) => void;
  onUpdateBlock: (blockId: ObjectId, updates: BlockParamUpdates) => void; 
  onRearrangeBlocks: (oldIndex: number, newIndex: number) => void; 
}

const ScriptContainer = ({
  scriptBlocks,
  activeBlockId,
  lockedBlocks = new Map(),
  currentUserId,
  onSelectBlock,
  onDeleteBlock,
  onUpdateBlock, 
  onRearrangeBlocks,
}: ScriptContainerProps) => {
  // Debug: Log the blocks to see what we're working with
  console.log('ScriptContainer received blocks:', scriptBlocks);


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

            
            const isActive = activeBlockId?.toString() === block._id.toString();
            const lockedBy = lockedBlocks.get(block._id.toString());
            const isLocked = !!lockedBy;
            const isLockedByCurrentUser = lockedBy?.userId === currentUserId;
            const isDisabled = isLocked && !isLockedByCurrentUser;

            const commonProps = {
              id: block._id.toString(),
              blockParams: block.blockParams,
              isActive: isActive,
              isLocked: isLocked,
              isLockedByCurrentUser: isLockedByCurrentUser,
              isDisabled: isDisabled,
              lockedByUsername: lockedBy?.username,
              onSelect: (id: string) => onSelectBlock(new ObjectId(id)),
              onDelete: (id: string) => onDeleteBlock(new ObjectId(id)),
              onUpdate: (blockId: string, updates: BlockParamUpdates) => onUpdateBlock(new ObjectId(blockId), updates)
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
