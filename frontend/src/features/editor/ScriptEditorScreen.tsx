import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
} from "@mui/material";

// Import ScriptContainer component

import { arrayMove } from "@dnd-kit/sortable";
import { useScriptSocket } from "../../hooks/useSocketIo";

import {
  ScriptBlock,
  ServerBlockAddedEvent,
  ServerBlockUpdatedEvent,
  ServerBlockDeletedEvent,
  ServerBlocksMovedEvent,
  ServerUserJoinedEvent,
  ServerUserLeftEvent,
  ServerActiveUsersEvent,
} from "@chatroom/shared";

import { BlockParamUpdates, ServerBlockLockedEvent, ServerBlockLockErrorEvent, ServerBlockUnlockedEvent } from "@chatroom/shared/dist/SocketEvents";
import { AddBlockButton, ActiveUsers, ScriptContainer } from ".";
import { useAuth } from "../../contexts/AuthContext";
import { generateTempId } from "../../utils";

interface ScriptEditorScreenProps {
  scriptId: string;
  onNavigateBack: () => void; // Added for back navigation
  hideAppBar?: boolean; // Whether to hide the built-in AppBar
  searchTerm?: string; // Search term for filtering blocks
  onNavigateToUserManagement?: () => void; // Navigate to user management screen
}

interface Script {
  _id: string;
  title: string;
  creator: string;
  editors: string[];
  blocks: ScriptBlock[];
  lastModified: string;
  createdAt: string;
}

const ScriptEditorScreen = ({
  scriptId,
  searchTerm = '',
  onNavigateToUserManagement,
}: ScriptEditorScreenProps) => {
  const [scriptBlocks, setScriptBlocks] = useState<ScriptBlock[]>([]);
  const [script, setScript] = useState<Script | null>(null);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const { user } = useAuth();

  // User presence event handlers
  const onUserJoined = useCallback((event: ServerUserJoinedEvent) => {
    console.log("User joined:", event.user.username);
  }, []);

  const onUserLeft = useCallback((event: ServerUserLeftEvent) => {
    console.log("User left:", event.userId);
  }, []);

  const onActiveUsersUpdate = useCallback((event: ServerActiveUsersEvent) => {
    console.log("Active users updated:", event.activeUsers);
  }, []);

  // Block locking event handlers
  const onBlockLocked = useCallback((event: ServerBlockLockedEvent) => {
    console.log("on Block locked:", event);
    setScriptBlocks(prevBlocks => prevBlocks.map(block =>{
      if(block._id.toString() === event.blockId.toString()){
        return {
          ...block,
          lockedBy: event.lockedBy.userId as any // Type assertion since we're using string but shared types expect ObjectId
        };
      }
      return block;

    }));

  }, []);

  const onBlockUnlocked = useCallback((event: ServerBlockUnlockedEvent) => {
    console.log("Block unlocked:", event);

    setScriptBlocks(prevBlocks => prevBlocks.map(block=>{
      if(block._id.toString() === event.blockId.toString()){
        return {
          ...block,
          lockedBy: undefined
        };
      }
      return block;
    }));

  }, []);

  const onBlockLockError = useCallback((event: ServerBlockLockErrorEvent) => {
    console.log("Block lock error:", event);
    // You could show a toast/snackbar here
    alert(`Cannot edit block: ${event.message}`);
  }, []);

  // Wrap socket event handlers in useCallback to prevent unnecessary reconnections
  const onServerBlockAdded = useCallback((event: ServerBlockAddedEvent) => {
    console.log("Block added via socket:", event);
    setScriptBlocks((prevBlocks) =>
      [...prevBlocks, event.block].sort((a, b) => a.position - b.position)
    );
  }, []);

  const onServerBlockUpdated = useCallback((event: ServerBlockUpdatedEvent) => {
    console.log("Block updated via socket:", event);
    setScriptBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block._id === event.blockId
          ? {
              ...block,
              blockParams: {
                ...block.blockParams,
                ...event.blockParamUpdates,
              },
            }
          : block
      )
    );
  }, []);

  const onServerBlockDeleted = useCallback((event: ServerBlockDeletedEvent) => {
    console.log("Block deleted via socket:", event);
    setScriptBlocks((prevBlocks) =>
      prevBlocks.filter((block) => block._id !== event.blockId)
    );
  }, []);

  const onServerBlockMoved = useCallback((event: ServerBlocksMovedEvent) => {
    console.log("Blocks moved via socket:", event);
    setScriptBlocks((prevBlocks) => {
      const updatedBlocks = [...prevBlocks];
      const movedBlockIndex = updatedBlocks.findIndex(
        (block) => block._id === event.blockId
      );

      if (movedBlockIndex !== -1) {
        // Adjust the position of the moved block
        updatedBlocks[movedBlockIndex] = {
          ...updatedBlocks[movedBlockIndex],
          position: event.newPosition,
        };

        // Sort the blocks by position after moving
        return updatedBlocks.sort((a, b) => a.position - b.position);
      }

      return updatedBlocks;
    });
  }, []);

  const {
    addBlockInSocket,
    updateBlockInSocket,
    deleteBlockInSocket,
    moveBlockInSocket,
    lockBlock,
    unlockBlock,
    activeUsers,
  } = useScriptSocket({
    scriptId,
    onServerBlockAdded,
    onServerBlockUpdated,
    onServerBlockDeleted,
    onServerBlockMoved,
    onUserJoined,
    onUserLeft,
    onActiveUsersUpdate,
    onBlockLocked,
    onBlockUnlocked,
    onBlockLockError,
  });

  // Fetch script data including title and blocks
  useEffect(() => {
    const fetchScriptData = async () => {
      if (!scriptId) return;
      try {
        const response = await axios.get(`/api/scripts/${scriptId}`);
        if (response.data) {
          // Store the full script data
          setScript(response.data);
          if (response.data.blocks) {
            // Sort blocks by position to ensure correct order
            const sortedBlocks = response.data.blocks.sort(
              (a: ScriptBlock, b: ScriptBlock) => a.position - b.position
            );
            setScriptBlocks(sortedBlocks);
          }
        }
      } catch (error) {
        console.error("Error fetching script data:", error);
      } 
    };

    fetchScriptData();
  }, [scriptId]);

  // --- Event Handlers ---
  const handleSelectBlock = (blockId: string) => {
    // Check if the block is already locked by another user
    const lockedBy = scriptBlocks.find(block=> block._id.toString() === blockId)?.lockedBy;

    if (lockedBy && lockedBy.toString() === user?.id) {
      alert(`This block is being edited by ${lockedBy}`);
      return;
    }

    // If block is not locked by current user, try to lock it
    if (!lockedBy || lockedBy.toString() === user?.id) {
      lockBlock(blockId);
    }

    setActiveBlockId(blockId);
  };

  const handleDeleteBlock = (blockId: string) => {
    setScriptBlocks((prevBlocks) =>
      prevBlocks.filter((block) => block._id.toString() !== blockId)
    );

    // If the deleted block was active, deactivate
    if (activeBlockId === blockId) {
      setActiveBlockId(null);
    }

    deleteBlockInSocket(blockId);
  };

  const handleAddBlock = (type: ScriptBlock["type"]) => {
    const blockParams =
      type === "sceneHeading"
        ? { intExt: "", location: "", time: "" }
        : type === "description"
        ? { text: "" }
        : type === "dialogue"
        ? { character: "", text: "" }
        : { text: "" };

    // Calculate position for the new block
    let newPosition = 4096; // Default position if no blocks exist

    if (scriptBlocks.length > 0) {
      if (activeBlockId) {
        // Find the position of the currently active block
        const activeBlockIndex = scriptBlocks.findIndex(
          (block) => block._id.toString() === activeBlockId.toString()
        );
        if (activeBlockIndex !== -1) {
          const activeBlock = scriptBlocks[activeBlockIndex];
          const nextBlock = scriptBlocks[activeBlockIndex + 1];

          if (nextBlock) {
            // Insert between active block and next block
            newPosition = (activeBlock.position + nextBlock.position) / 2;
          } else {
            // Insert after the last block
            newPosition = activeBlock.position + 4096;
          }
        } else {
          // If active block not found, add at the end
          const maxPosition = Math.max(
            ...scriptBlocks.map((block) => block.position)
          );
          newPosition = maxPosition + 4096;
        }
      } else {
        // No active block, add at the end
        const maxPosition = Math.max(
          ...scriptBlocks.map((block) => block.position)
        );
        newPosition = maxPosition + 4096;
      }
    }

    const newBlock: ScriptBlock = {
      _id: generateTempId() as any, // Generate temporary string ID
      type,
      position: newPosition,
      blockParams,
    };

    // Insert the new block and sort by position

    setActiveBlockId(newBlock._id.toString());

    addBlockInSocket(newBlock); // Assuming no preceding block for simplicity
  };

  const handleUpdateBlock = (
    blockId: string,
    blockParamUpdates: BlockParamUpdates
  ) => {
    // Check if the block is locked by another user
    const lockedBy = scriptBlocks.find(block=> block._id.toString() === blockId)?.lockedBy;
    if (lockedBy && lockedBy.toString() === user?.id) {
      alert(`This block is being edited by ${lockedBy}`);
      return;
    }

    setScriptBlocks(
      scriptBlocks.map((block) =>
        block._id.toString() === blockId.toString()
          ? {
              ...block,
              blockParams: { ...block.blockParams, ...blockParamUpdates },
            }
          : block
      )
    );

    updateBlockInSocket(blockId, blockParamUpdates);
  };

  const handleRearrangeBlocks = (oldIndex: number, newIndex: number) => {
    setScriptBlocks((prevBlocks) => {
      // First, move the block to the new position in the array
      const rearrangedBlocks = arrayMove(prevBlocks, oldIndex, newIndex);

      // Only adjust the position of the moved block
      const movedBlock = rearrangedBlocks[newIndex];
      let newPosition = movedBlock.position;

      // Calculate new position based on neighbors
      const prevBlock = newIndex > 0 ? rearrangedBlocks[newIndex - 1] : null;
      const nextBlock =
        newIndex < rearrangedBlocks.length - 1
          ? rearrangedBlocks[newIndex + 1]
          : null;

      if (prevBlock && nextBlock) {
        // Insert between two blocks
        newPosition = (prevBlock.position + nextBlock.position) / 2;
      } else if (prevBlock) {
        //
        newPosition = prevBlock.position + 4096;
      } else if (nextBlock) {
        // Insert before the first block
        newPosition = nextBlock.position - 4096;
      } else {
        // Only block in the list
        newPosition = 4096;
      }
      moveBlockInSocket(movedBlock._id.toString(), newPosition);
      // Update only the moved block's position
      rearrangedBlocks[newIndex] = {
        ...movedBlock,
        position: newPosition,
      };

      return rearrangedBlocks;
    });
  };
  // Filter blocks based on search term
  const filteredBlocks = scriptBlocks.filter(block => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    
    // Search in block content based on block type
    if (block.type === 'sceneHeading') {
      const params = block.blockParams as any;
      return (
        params.intExt?.toLowerCase().includes(searchLower) ||
        params.location?.toLowerCase().includes(searchLower) ||
        params.time?.toLowerCase().includes(searchLower)
      );
    } else if (block.type === 'description') {
      const params = block.blockParams as any;
      return params.text?.toLowerCase().includes(searchLower);
    } else if (block.type === 'dialogue') {
      const params = block.blockParams as any;
      return (
        params.characterName?.toLowerCase().includes(searchLower) ||
        params.text?.toLowerCase().includes(searchLower)
      );
    }
    return false;
  });

  console.log("filteredBlocks:",scriptBlocks,filteredBlocks);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height:  "100vh"
      }}
      onClick={() => {
        // Unlock active block when clicking outside
        if (activeBlockId) {
          unlockBlock(activeBlockId);
        }
        setActiveBlockId(null);
      }}
    >

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* Left Side - Script Editor */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            padding: 2,
            paddingBottom: "80px", // Space for FAB
          }}
        >

          {/* No search results message */}
          {searchTerm.trim() && filteredBlocks.length === 0 && scriptBlocks.length > 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No blocks found matching "{searchTerm}"
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your search terms
              </Typography>
            </Box>
          )}

          {/* Script Container */}
          <ScriptContainer
            scriptBlocks={filteredBlocks}
            activeBlockId={activeBlockId}
            currentUserId={user?.id}
            onSelectBlock={handleSelectBlock}
            onDeleteBlock={handleDeleteBlock}
            onUpdateBlock={handleUpdateBlock}
            onRearrangeBlocks={handleRearrangeBlocks}
          />

          {/* Add Block Button - Positioned in left area */}
          <AddBlockButton onAddBlock={handleAddBlock} />
        </Box>

        {/* Right Sidebar - Active Users */}
        <Box
          sx={{
            width: 280,
            borderLeft: 1,
            borderColor: "divider",
            backgroundColor: "background.paper",
            overflowY: "auto",
          }}
        >
          <Box sx={{ m: 2 }}>
            <ActiveUsers users={activeUsers} currentUserId={user?.id} />
          </Box>
          {onNavigateToUserManagement && script && user && script.creator === user.id && (
            <Box sx={{ margin: 2 }}>
              <Button
                variant="outlined"
                onClick={onNavigateToUserManagement}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  width: '100%',
                }}
              >
                Manage Users
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ScriptEditorScreen;
